'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SafeImage } from '@/components/ui/SafeImage'
import { isValidImageUrl } from '@/lib/validation'
import {
  Upload, Copy, Check, Trash2, ExternalLink,
  FolderOpen, Loader2, RefreshCw, Images as ImagesIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'

const BUCKET = 'wedding-images'
const MAX_FILE_SIZE_MB = 5
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif']

// Magic bytes signatures untuk validasi konten file
const MAGIC_BYTES: Record<string, number[][]> = {
  jpg: [[0xFF, 0xD8, 0xFF]],
  jpeg: [[0xFF, 0xD8, 0xFF]],
  png: [[0x89, 0x50, 0x4E, 0x47]],
  gif: [[0x47, 0x49, 0x46, 0x38]],
  webp: [[0x52, 0x49, 0x46, 0x46]],
}

interface MediaFile {
  name: string
  id: string
  created_at: string
  url: string
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; file: MediaFile | null }>({
    open: false,
    file: null,
  })
  const [deleting, setDeleting] = useState(false)
  const [adminPassword, setAdminPassword] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const pwd = localStorage.getItem('admin_password')
    if (pwd) setAdminPassword(pwd)
    fetchMedia()
  }, [])

  /* ============================================
     VALIDASI KEAMANAN FILE (client-side fast fail)
     ============================================ */
  async function validateFileSecurity(file: File): Promise<string | null> {
    // 1. Cek tipe MIME
    if (!file.type.startsWith('image/')) {
      return 'File harus berupa gambar'
    }

    // 2. Cek ukuran
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Ukuran maksimal ${MAX_FILE_SIZE_MB}MB`
    }

    // 3. Cek ekstensi
    const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_EXTS.includes(fileExt)) {
      return `Ekstensi tidak diizinkan. Gunakan: ${ALLOWED_EXTS.join(', ')}`
    }

    // 4. Cek magic bytes (anti file rename berbahaya)
    try {
      const buffer = await file.slice(0, 12).arrayBuffer()
      const bytes = new Uint8Array(buffer)

      const isValidSignature = ALLOWED_EXTS.some((ext) => {
        const signatures = MAGIC_BYTES[ext] || []
        return signatures.some((sig) => sig.every((byte, i) => bytes[i] === byte))
      })

      if (!isValidSignature) {
        return 'Konten file tidak sesuai dengan ekstensinya (kemungkinan file berbahaya)'
      }
    } catch (err) {
      return 'Gagal membaca file'
    }

    // 5. Cek nama file (anti path traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return 'Nama file mengandung karakter tidak valid'
    }

    return null
  }

  /* ============================================
     Ambil semua gambar dari bucket (public read)
     ============================================ */
  async function fetchMedia() {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list('', {
          limit: 200,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error) throw error

      const filesWithUrl: MediaFile[] = (data || [])
        .filter((file) => file.name && !file.name.startsWith('.'))
        .map((file) => {
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(file.name)
          return {
            name: file.name,
            id: file.id || file.name,
            created_at: file.created_at || '',
            url: urlData.publicUrl,
          }
        })
        .filter((file) => isValidImageUrl(file.url))

      setMedia(filesWithUrl)
    } catch (err: any) {
      toast.error(`Gagal memuat media: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  /* ============================================
     Upload via API Route (server-side, service role)
     ============================================ */
  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (fileArray.length === 0) {
      toast.error('Tidak ada gambar yang valid')
      return
    }

    // Cek sesi admin
    if (!adminPassword) {
      toast.error('Sesi admin tidak valid. Silakan login ulang.')
      window.location.href = '/admin/login'
      return
    }

    setUploading(true)
    let successCount = 0
    let failCount = 0
    const errors: string[] = []

    for (const file of fileArray) {
      // Validasi keamanan di client (fast fail)
      const securityError = await validateFileSecurity(file)
      if (securityError) {
        errors.push(`${file.name}: ${securityError}`)
        failCount++
        continue
      }

      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: {
            'x-admin-auth': adminPassword,
          },
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Upload gagal')
        }

        successCount++
      } catch (err: any) {
        console.error(`Upload error for ${file.name}:`, err)
        errors.push(`${file.name}: ${err.message}`)
        failCount++
      }
    }

    setUploading(false)

    if (successCount > 0) {
      toast.success(`${successCount} gambar berhasil diupload! 🎉`)
      fetchMedia()
    }
    if (failCount > 0) {
      const errorMsg = errors.slice(0, 3).join('; ')
      toast.error(`${failCount} gambar gagal: ${errorMsg}${errors.length > 3 ? '...' : ''}`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
    }
    e.target.value = ''
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  /* ============================================
     Copy URL
     ============================================ */
  const handleCopyUrl = async (url: string) => {
    await copyToClipboard(url)
    setCopiedUrl(url)
    toast.success('URL berhasil disalin! Tinggal paste di input gambar.')
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  /* ============================================
     Delete via API Route
     ============================================ */
  const handleDelete = async () => {
    if (!deleteDialog.file) return
    if (!adminPassword) {
      toast.error('Sesi admin tidak valid')
      return
    }

    setDeleting(true)
    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminPassword,
        },
        body: JSON.stringify({ filename: deleteDialog.file.name }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus')

      toast.success('Gambar berhasil dihapus')
      setDeleteDialog({ open: false, file: null })
      fetchMedia()
    } catch (err: any) {
      toast.error(`Gagal menghapus: ${err.message}`)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* ====== UPLOAD AREA ====== */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-3xl p-8 md:p-10 text-center cursor-pointer
          transition-all duration-300 bg-white/70 backdrop-blur-sm
          ${
            dragActive
              ? 'border-[#C9A96E] bg-[#C9A96E]/10 scale-[1.01]'
              : 'border-[#C9A96E]/30 hover:border-[#C9A96E] hover:bg-[#C9A96E]/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={36} className="text-[#C9A96E] animate-spin" />
            <p className="text-body-md font-medium text-[#6B5B5B]">Mengupload & memvalidasi gambar...</p>
            <p className="text-caption text-[#6B5B5B]/50">File dikirim ke server untuk validasi keamanan</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#DCAE96] flex items-center justify-center shadow-lg shadow-[#C9A96E]/30">
              <Upload size={28} className="text-white" />
            </div>
            <p className="text-body-lg font-semibold text-[#3D342B]">
              Klik atau drag & drop gambar di sini
            </p>
            <p className="text-body-sm text-[#6B5B5B]/60">
              Format: JPG, PNG, WEBP, GIF · Maks {MAX_FILE_SIZE_MB}MB per gambar
            </p>
            <div className="mt-2 flex items-center gap-2 text-caption text-[#C9A96E]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Upload aman via server dengan validasi magic bytes</span>
            </div>
          </div>
        )}
      </div>

      {/* ====== TOOLBAR ====== */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FolderOpen size={18} className="text-[#C9A96E]" />
          <h3 className="font-display text-lg text-[#3D342B]">Semua Gambar</h3>
          <span className="text-caption bg-[#C9A96E]/10 text-[#B8935A] px-2.5 py-0.5 rounded-full font-semibold">
            {media.length}
          </span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={15} />}
          onClick={fetchMedia}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* ====== GRID GAMBAR ====== */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-[#C9A96E]/10 animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-3xl border border-[#C9A96E]/10">
          <ImagesIcon size={48} className="mx-auto text-[#C9A96E]/30 mb-4" />
          <p className="text-body-md text-[#6B5B5B]/60 mb-1">Belum ada gambar</p>
          <p className="text-body-sm text-[#6B5B5B]/40">Upload gambar pertama Anda di area atas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {media.map((file, index) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#C9A96E]/10"
              >
                {/* Preview */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => window.open(file.url, '_blank', 'noopener,noreferrer')}
                >
                  <SafeImage
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow">
                      <ExternalLink size={13} className="text-[#6B5B5B]" />
                    </span>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-3">
                  <p className="text-caption text-[#6B5B5B]/50 mb-2 truncate" title={file.name}>
                    {formatDate(file.created_at)}
                  </p>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleCopyUrl(file.url)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        copiedUrl === file.url
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-[#C9A96E] to-[#DCAE96] text-white hover:shadow-md'
                      }`}
                    >
                      {copiedUrl === file.url ? (
                        <>
                          <Check size={13} />
                          Disalin!
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy URL
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setDeleteDialog({ open: true, file })}
                      className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="Hapus gambar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ====== INFO CARA PAKAI ====== */}
      <div className="p-5 bg-gradient-to-r from-[#C9A96E]/10 to-[#DCAE96]/10 rounded-2xl border border-[#C9A96E]/20">
        <h4 className="font-display text-sm text-[#3D342B] mb-2">💡 Cara Menggunakan</h4>
        <ol className="text-body-sm text-[#6B5B5B]/80 space-y-1 list-decimal list-inside">
          <li>Upload gambar ke area di atas (tervalidasi otomatis di server)</li>
          <li>Klik tombol <strong>Copy URL</strong> pada gambar yang diinginkan</li>
          <li>Paste URL tersebut ke input gambar di Pengaturan, Gallery, Documentary, atau Love Story</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-[#C9A96E]/20 text-caption text-[#6B5B5B]/60">
          🔒 <strong>Keamanan:</strong> File divalidasi magic bytes, ekstensi, ukuran, dan path traversal di server sebelum disimpan.
        </div>
      </div>

      {/* ====== DELETE CONFIRMATION ====== */}
      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, file: null })}
        onConfirm={handleDelete}
        title="Hapus Gambar?"
        description="Gambar akan dihapus permanen dari penyimpanan. URL yang sudah dipakai tidak akan menampilkan gambar lagi."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
        icon={<Trash2 size={24} />}
        loading={deleting}
      />
    </div>
  )
}