import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifySessionToken } from '@/lib/auth'

const MAX_SIZE_MB = 5
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif']
const BUCKET = 'wedding-images'

// Magic bytes signatures
const MAGIC_BYTES: Record<string, number[][]> = {
  jpg: [[0xFF, 0xD8, 0xFF]],
  jpeg: [[0xFF, 0xD8, 0xFF]],
  png: [[0x89, 0x50, 0x4E, 0x47]],
  gif: [[0x47, 0x49, 0x46, 0x38]],
  webp: [[0x52, 0x49, 0x46, 0x46]],
}

// Verifikasi admin via header
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const result = verifySessionToken(token)
  return result.valid
}

// Validasi file di server
async function validateFile(file: File): Promise<string | null> {
  if (!file.type.startsWith('image/')) return 'Harus berupa gambar'
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Maksimal ${MAX_SIZE_MB}MB`

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!ALLOWED_EXTS.includes(ext)) return `Ekstensi tidak diizinkan`

  // Path traversal check
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return 'Nama file tidak valid'
  }

  // Magic bytes check
  try {
    const buffer = await file.slice(0, 12).arrayBuffer()
    const bytes = new Uint8Array(buffer)
    const isValid = ALLOWED_EXTS.some(e =>
      (MAGIC_BYTES[e] || []).some(sig => sig.every((b, i) => bytes[i] === b))
    )
    if (!isValid) return 'Konten file tidak sesuai ekstensi'
  } catch {
    return 'Gagal baca file'
  }

  return null
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

    // Service role client (bypass RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(safeFileName, file, { cacheControl: '3600', upsert: false })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(safeFileName)

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      filename: safeFileName
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

    // Validasi nama file (anti path traversal)
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