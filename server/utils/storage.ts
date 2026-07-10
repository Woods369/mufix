import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// --- JSON file storage (fallback for local dev / no Redis) ---
const DATA_DIR = join(process.cwd(), 'server', 'data')

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

// --- Redis storage (production on Vercel, or local dev with REDIS_URL set) ---
const KEY_PREFIX = 'mufix:'

function kvKey(filename: string): string {
  return KEY_PREFIX + filename.replace(/\.json$/, '')
}

let _redisClient: any = null
let _redisConnected = false

async function getRedis() {
  if (_redisConnected && _redisClient) return _redisClient
  if (!process.env.REDIS_URL) return null
  try {
    const { createClient } = await import('redis')
    _redisClient = createClient({ url: process.env.REDIS_URL })
    _redisClient.on('error', () => { _redisConnected = false })
    await _redisClient.connect()
    _redisConnected = true
    return _redisClient
  } catch {
    _redisConnected = false
    return null
  }
}

// --- Unified storage API ---

export async function readJSON<T>(filename: string): Promise<T> {
  const redis = await getRedis()
  if (redis) {
    try {
      const raw = await redis.get(kvKey(filename))
      if (raw) return JSON.parse(raw) as T
    } catch { /* fall through to file */ }
    return [] as unknown as T
  }
  return readJSONFile<T>(filename)
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const redis = await getRedis()
  if (redis) {
    await redis.set(kvKey(filename), JSON.stringify(data))
    return
  }
  return writeJSONFile(filename, data)
}
