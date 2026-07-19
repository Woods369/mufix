import { put } from '@vercel/blob'
import { requireAuth } from '../utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const form = await readMultipartFormData(event)
  if (!form?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = form.find(f => f.name === 'file')
  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file' })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN

  // Local dev fallback — Blob token not set, return base64 data URL
  if (!token) {
    const base64 = file.data.toString('base64')
    const mime = file.type || 'image/jpeg'
    return { url: `data:${mime};base64,${base64}` }
  }

  const blob = await put(
    `orders/${Date.now()}-${file.filename}`,
    file.data,
    {
      access: 'public',
      token,
      contentType: file.type || 'application/octet-stream',
    },
  )

  return { url: blob.url }
})
