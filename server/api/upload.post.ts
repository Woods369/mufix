import { put } from '@vercel/blob'
import { requireAuth } from '../utils/session'
import { assertRateLimit } from '../utils/rateLimit'

const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'])

function sniffMime(buf: Buffer): string | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png'
  if (buf.length >= 6 && buf.slice(0, 6).toString('ascii') === 'GIF87a') return 'image/gif'
  if (buf.length >= 6 && buf.slice(0, 6).toString('ascii') === 'GIF89a') return 'image/gif'
  if (buf.length >= 12 && buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp'
  }
  return null
}

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  assertRateLimit(event, 'upload', 20, 60_000)

  const form = await readMultipartFormData(event)
  if (!form?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = form.find(f => f.name === 'file')
  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file' })
  }

  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 400, statusMessage: 'File too large (max 5MB)' })
  }

  const sniffed = sniffMime(Buffer.from(file.data))
  const declared = (file.type || '').toLowerCase()
  const mime = sniffed || (ALLOWED.has(declared) ? declared : null)
  if (!mime || !ALLOWED.has(mime)) {
    throw createError({ statusCode: 400, statusMessage: 'Only JPEG, PNG, WebP, or GIF images are allowed' })
  }

  const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
  const token = process.env.BLOB_READ_WRITE_TOKEN

  if (!token) {
    // Local only - cap base64 payload size already via MAX_BYTES
    const base64 = Buffer.from(file.data).toString('base64')
    return { url: `data:${mime};base64,${base64}` }
  }

  const blob = await put(
    `orders/${Date.now()}-${safeName}`,
    Buffer.from(file.data),
    {
      access: 'public',
      token,
      contentType: mime,
    },
  )

  return { url: blob.url }
})
