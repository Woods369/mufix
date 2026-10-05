import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const DATA_DIR = join(process.cwd(), 'server', 'data')
const KEY_PREFIX = 'mufix:'

function kvKey(filename: string): string {
  return KEY_PREFIX + filename.replace(/\.json$/, '')
}

async function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

async function readJSONFile<T>(filename: string): Promise<T> {
  await ensureDir()
  const path = join(DATA_DIR, filename)
  try {
    const raw = await readFile(path, 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return [] as unknown as T
  }
}

async function writeJSONFile<T>(filename: string, data: T): Promise<void> {
  await ensureDir()
  const path = join(DATA_DIR, filename)
  await writeFile(path, JSON.stringify(data, null, 2), 'utf-8')
}

type KvClient = {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string) => Promise<unknown>
  del: (key: string) => Promise<unknown>
}

let _kv: KvClient | null = null
let _kvMode: 'none' | 'upstash' | 'redis' = 'none'

async function getKv(): Promise<KvClient | null> {
  if (_kv) return _kv

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (upstashUrl && upstashToken) {
    try {
      const { Redis } = await import('@upstash/redis')
      const client = new Redis({ url: upstashUrl, token: upstashToken })
      _kv = {
        get: async (key) => {
          const val = await client.get<string>(key)
          if (val == null) return null
          return typeof val === 'string' ? val : JSON.stringify(val)
        },
        set: async (key, value) => client.set(key, value),
        del: async (key) => client.del(key),
      }
      _kvMode = 'upstash'
      return _kv
    } catch {
      _kv = null
    }
  }

  if (process.env.REDIS_URL) {
    try {
      const { createClient } = await import('redis')
      const client = createClient({ url: process.env.REDIS_URL })
      client.on('error', () => {
        /* avoid unhandled error crash */
      })
      if (!client.isOpen) await client.connect()
      _kv = {
        get: async (key) => (await client.get(key)) as string | null,
        set: async (key, value) => client.set(key, value),
        del: async (key) => client.del(key),
      }
      _kvMode = 'redis'
      return _kv
    } catch {
      _kv = null
      _kvMode = 'none'
    }
  }

  return null
}

export function storageBackend(): string {
  return _kvMode === 'none' ? 'file' : _kvMode
}

export async function readJSON<T>(filename: string): Promise<T> {
  const kv = await getKv()
  if (kv) {
    try {
      const raw = await kv.get(kvKey(filename))
      if (raw) return JSON.parse(raw) as T
    } catch {
      /* fall through */
    }
    if (filename.endsWith('.json') && !filename.startsWith('challenge:')) {
      return [] as unknown as T
    }
    return null as unknown as T
  }
  return readJSONFile<T>(filename)
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const kv = await getKv()
  if (kv) {
    await kv.set(kvKey(filename), JSON.stringify(data))
    return
  }
  return writeJSONFile(filename, data)
}

export async function deleteJSON(filename: string): Promise<void> {
  const kv = await getKv()
  if (kv) {
    await kv.del(kvKey(filename))
    return
  }
  try {
    await unlink(join(DATA_DIR, filename))
  } catch {
    // ignore missing file
  }
}
