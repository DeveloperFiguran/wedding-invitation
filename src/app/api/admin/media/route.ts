import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifySessionToken } from '@/lib/auth'

const BUCKET = 'wedding-files'
const MAX_SIZE_MB = 10 // Naikkan untuk MP3 (biasanya 3-8MB)

// File types yang diizinkan
const ALLOWED_IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif']
const ALLOWED_AUDIO_EXTS = ['mp3']
const ALLOWED_EXTS = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_AUDIO_EXTS]

// Magic bytes signatures
const MAGIC_BYTES: Record<string, number[][]> = {
  // Images
  jpg: [[0xFF, 0xD8, 0xFF]],
  jpeg: [[0xFF, 0xD8, 0xFF]],
  png: [[0x89, 0x50, 0x4E, 0x47]],
  gif: [[0x47, 0x49, 0x46, 0x38]],
  webp: [[0x52, 0x49, 0x46, 0x46]], // RIFF header

  // Audio - MP3
  mp3: [
    [0x49, 0x44, 0x33], // ID3 tag ("ID3")
    [0xFF, 0xFB],        // MPEG Audio Layer 3
    [0xFF, 0xF3],        // MPEG Audio Layer 3 (variant)
    [0xFF, 0xF2],        // MPEG Audio Layer 3 (variant)
  ],
}

// MIME types untuk response
const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  mp3: 'audio/mpeg',
}

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const result = verifySessionToken(token)
  return result.valid
}

async function validateFile(file: File): Promise<string | null> {
  // 1. Cek ukuran
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `Ukuran maksimal ${MAX_SIZE_MB}MB`
  }

  // 2. Cek ekstensi
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!ALLOWED_EXTS.includes(ext)) {
    return `Ekstensi tidak diizinkan. Gunakan: ${ALLOWED_EXTS.join(', ')}`
  }

  // 3. Path traversal check
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return 'Nama file tidak valid'
  }

  // 4. Magic bytes check
  try {
    const buffer = await file.slice(0, 12).arrayBuffer()
    const bytes = new Uint8Array(buffer)

    const signatures = MAGIC_BYTES[ext] || []
    const isValid = signatures.some(sig =>
      sig.every((byte, i) => bytes[i] === byte)
    )

    if (!isValid) {
      return 'Konten file tidak sesuai dengan ekstensinya'
    }
  } catch {
    return 'Gagal membaca file'
  }

  return null
}

function getFileType(ext: string): 'image' | 'audio' {
  return ALLOWED_AUDIO_EXTS.includes(ext) ? 'audio' : 'image'
}

// ====== POST: Upload ======
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'File tidak ada' }, { status: 400 })
    }

    const validationError = await validateFile(file)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileType = getFileType(ext)
    const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(safeFileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: MIME_TYPES[ext] || 'application/octet-stream',
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(safeFileName)

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      filename: safeFileName,
      fileType,
    })
  } catch (err: any) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ====== DELETE: Hapus file ======
export async function DELETE(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filename } = await request.json()
    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 })
    }

    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([filename])
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}