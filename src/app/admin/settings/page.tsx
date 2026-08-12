'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WeddingSettings } from '@/types/database'
import { Toggle } from '@/components/ui/Toggle'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { SafeImage } from '@/components/ui/SafeImage'
import { ThemePicker } from '@/components/admin/ThemePicker'
import { FontPicker } from '@/components/admin/FontPicker'
import { BackgroundStylePicker } from '@/components/admin/BackgroundStylePicker'
import { ThemePreset } from '@/lib/themes'
import {
  Save, Heart, Calendar, MessageSquare, Gift,
  Palette, Images, Music, ToggleRight, Users,
  MapPin, Clock, Instagram, Hash, Link as LinkIcon,
  Type, Sparkles, AlertCircle, Share2
} from 'lucide-react'
import { toast } from 'sonner'
import {
  isRequired, validateUrl, validateHexColor, validateNumeric,
  validateInstagram, validateHashtag, validateDate,
  isValidImageUrl, ValidationErrors, hasErrors
} from '@/lib/validation'

/* ============================================
   HELPER: Preview gambar untuk URL input
   ============================================ */
function ImagePreview({ url }: { url?: string }) {
  if (!url) return null

  if (!isValidImageUrl(url)) {
    return (
      <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-red-200 bg-red-50/50 flex items-center justify-center">
        <div className="text-center p-3">
          <AlertCircle size={24} className="mx-auto text-red-400 mb-1" />
          <p className="text-xs text-red-500">URL gambar tidak valid</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-[#C9A96E]/20 bg-gray-50">
      <SafeImage src={url} alt="Preview" fill className="object-cover" />
    </div>
  )
}

/* ============================================
   MAIN COMPONENT
   ============================================ */
export default function AdminSettings() {
  const [settings, setSettings] = useState<WeddingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('wedding_settings')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error
      setSettings(data)
    } catch (err) {
      toast.error('Gagal memuat pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof WeddingSettings, value: any) => {
    setSettings((prev) => prev ? { ...prev, [field]: value } : null)
    // Clear error saat user mengubah field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const applyThemePreset = (preset: ThemePreset) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            primary_color: preset.primary_color,
            accent_color: preset.accent_color,
            text_color: preset.text_color,
            background_color: preset.background_color,
          }
        : null
    )
  }

  /* ============================================
     VALIDASI
     ============================================ */
  const validateSettings = (): boolean => {
    if (!settings) return false
    const newErrors: ValidationErrors = {}

    // Nama pengantin - wajib
    const brideNameErr = isRequired(settings.bride_name, 'Nama panggilan wanita')
    if (brideNameErr) newErrors.bride_name = brideNameErr

    const groomNameErr = isRequired(settings.groom_name, 'Nama panggilan pria')
    if (groomNameErr) newErrors.groom_name = groomNameErr

    const brideFullErr = isRequired(settings.bride_fullname, 'Nama lengkap wanita')
    if (brideFullErr) newErrors.bride_fullname = brideFullErr

    const groomFullErr = isRequired(settings.groom_fullname, 'Nama lengkap pria')
    if (groomFullErr) newErrors.groom_fullname = groomFullErr

    // Tanggal pernikahan - wajib & valid
    const weddingDateReq = isRequired(settings.wedding_date, 'Tanggal pernikahan')
    if (weddingDateReq) {
      newErrors.wedding_date = 'Tanggal pernikahan wajib diisi'
    } else {
      const dateErr = validateDate(settings.wedding_date, 'Tanggal pernikahan')
      if (dateErr) newErrors.wedding_date = dateErr
    }

    // Tanggal akad & resepsi - valid jika diisi
    if (settings.akad_date) {
      const akadErr = validateDate(settings.akad_date, 'Tanggal akad')
      if (akadErr) newErrors.akad_date = akadErr
    }
    if (settings.reception_date) {
      const recErr = validateDate(settings.reception_date, 'Tanggal resepsi')
      if (recErr) newErrors.reception_date = recErr
    }

    // URL fields - valid jika diisi
    const urlFields: Array<[string, string | undefined, string]> = [
      ['akad_maps', settings.akad_maps, 'URL Maps Akad'],
      ['reception_maps', settings.reception_maps, 'URL Maps Resepsi'],
      ['cover_background_url', settings.cover_background_url, 'URL Cover'],
      ['hero_image_url', settings.hero_image_url, 'URL Hero'],
      ['bride_photo_url', settings.bride_photo_url, 'URL Foto Wanita'],
      ['groom_photo_url', settings.groom_photo_url, 'URL Foto Pria'],
      ['qris_url', settings.qris_url, 'URL QRIS'],
      ['music_url', settings.music_url, 'URL Musik'],
      ['live_stream_url', settings.live_stream_url, 'URL Live Stream'],
    ]
    urlFields.forEach(([key, value, label]) => {
      if (value) {
        const err = validateUrl(value, label)
        if (err) newErrors[key] = err
      }
    })

    // Warna - valid hex
    const colorFields: Array<[string, string, string]> = [
      ['primary_color', settings.primary_color, 'Primary color'],
      ['accent_color', settings.accent_color, 'Accent color'],
      ['text_color', settings.text_color, 'Text color'],
      ['background_color', settings.background_color, 'Background color'],
    ]
    colorFields.forEach(([key, value, label]) => {
      const err = validateHexColor(value, label)
      if (err) newErrors[key] = err
    })

    // Nomor rekening - angka
    if (settings.bank_account_number) {
      const numErr = validateNumeric(settings.bank_account_number, 'Nomor rekening')
      if (numErr) newErrors.bank_account_number = numErr
    }

    // Instagram & hashtag
    if (settings.instagram_username) {
      const igErr = validateInstagram(settings.instagram_username)
      if (igErr) newErrors.instagram_username = igErr
    }
    if (settings.wedding_hashtag) {
      const tagErr = validateHashtag(settings.wedding_hashtag)
      if (tagErr) newErrors.wedding_hashtag = tagErr
    }

    // Meta Title - maksimal 60 karakter (rekomendasi SEO)
    if (settings.meta_title && settings.meta_title.length > 60) {
      newErrors.meta_title = 'Meta title maksimal 60 karakter agar tidak terpotong di Google'
    }

    // Meta Description - maksimal 160 karakter
    if (settings.meta_description && settings.meta_description.length > 160) {
      newErrors.meta_description = 'Meta description maksimal 160 karakter agar tidak terpotong'
    }

    // Meta Image URL - valid jika diisi
    if (settings.meta_image_url) {
      const metaImgErr = validateUrl(settings.meta_image_url, 'Meta Image URL')
      if (metaImgErr) newErrors.meta_image_url = metaImgErr
    }

    setErrors(newErrors)
    return !hasErrors(newErrors)
  }

  const handleSave = async () => {
    if (!settings) return

    if (!validateSettings()) {
      toast.error('Mohon periksa kembali form. Ada isian yang tidak valid.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('wedding_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', settings.id)
      if (error) throw error
      toast.success('Pengaturan berhasil disimpan! 🎉')
      setErrors({})
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner text="Memuat pengaturan..." />

  if (!settings) {
    return (
      <div className="text-center py-16">
        <AlertCircle size={48} className="mx-auto text-red-300 mb-4" />
        <p className="text-[#6B5B5B]/60">Gagal memuat pengaturan</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display text-[#6B5B5B]">Pengaturan</h1>
          <p className="text-sm text-[#6B5B5B]/60 mt-1">Kelola seluruh konten undangan Anda</p>
        </div>
        <Button onClick={handleSave} loading={saving} icon={<Save size={18} />} size="lg">
          Simpan Perubahan
        </Button>
      </div>

      {/* ====== INFO BOX ====== */}
      {hasErrors(errors) && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            Ada {Object.keys(errors).length} isian yang perlu diperbaiki. Silakan periksa field yang ditandai merah di bawah.
          </div>
        </div>
      )}

      {/* ============================================
          THEME: Preset Tema
      ============================================ */}
      <Card
        title="Preset Tema"
        subtitle="Pilih tema warna siap pakai dengan satu klik"
        icon={<Palette size={20} />}
      >
        <ThemePicker
          currentColors={{
            primary_color: settings.primary_color,
            accent_color: settings.accent_color,
            text_color: settings.text_color,
            background_color: settings.background_color,
          }}
          onApply={applyThemePreset}
        />
      </Card>

      {/* ============================================
          THEME: Kustomisasi Warna
      ============================================ */}
      <Card
        title="Kustomisasi Warna"
        subtitle="Atau atur warna secara manual"
        icon={<Palette size={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <ColorPicker
              label="Primary Color"
              value={settings.primary_color || '#B8935A'}
              onChange={(v) => updateField('primary_color', v)}
            />
            {errors.primary_color && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.primary_color}
              </p>
            )}
          </div>
          <div>
            <ColorPicker
              label="Accent Color"
              value={settings.accent_color || '#D4A574'}
              onChange={(v) => updateField('accent_color', v)}
            />
            {errors.accent_color && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.accent_color}
              </p>
            )}
          </div>
          <div>
            <ColorPicker
              label="Text Color"
              value={settings.text_color || '#3D342B'}
              onChange={(v) => updateField('text_color', v)}
            />
            {errors.text_color && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.text_color}
              </p>
            )}
          </div>
          <div>
            <ColorPicker
              label="Background Color"
              value={settings.background_color || '#FBF8F3'}
              onChange={(v) => updateField('background_color', v)}
            />
            {errors.background_color && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={13} /> {errors.background_color}
              </p>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 p-6 rounded-2xl border-2 border-dashed border-[#C9A96E]/20">
          <p className="text-xs text-[#6B5B5B]/60 mb-3 uppercase tracking-wider font-semibold">Preview</p>
          <div
            className="p-8 rounded-2xl text-center shadow-inner"
            style={{
              backgroundColor: settings.background_color,
              color: settings.text_color,
              border: `2px solid ${settings.primary_color}40`,
            }}
          >
            <p className="font-script text-4xl mb-2" style={{ color: settings.primary_color }}>
              {settings.bride_name} & {settings.groom_name}
            </p>
            <p className="text-sm font-elegant">The Wedding of</p>
            <div
              className="inline-block mt-3 px-4 py-1.5 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: settings.accent_color }}
            >
              Save The Date
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================
          THEME: Style Font
      ============================================ */}
      <Card
        title="Style Font"
        subtitle="Pilih kombinasi font untuk seluruh undangan"
        icon={<Type size={20} />}
      >
        <FontPicker
          currentPreset={settings.font_preset || 'classic-elegance'}
          onSelect={(presetId) => updateField('font_preset', presetId)}
        />
      </Card>

      {/* ============================================
          THEME: Style Background
      ============================================ */}
      <Card
        title="Style Background"
        subtitle="Pilih gaya background untuk area tanpa foto"
        icon={<Sparkles size={20} />}
      >
        <BackgroundStylePicker
          currentStyle={settings.background_style || 'botanical'}
          onSelect={(styleId) => updateField('background_style', styleId)}
        />
      </Card>

      {/* ============================================
          SEO & MEDIA SOSIAL
      ============================================ */}
      <Card
        title="SEO & Media Sosial"
        subtitle="Atur tampilan saat link dibagikan di WhatsApp, Instagram, dll"
        icon={<Share2 size={20} />}
      >
        <div className="space-y-5">
          {/* Info box */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <strong>Tips:</strong> Kosongkan field untuk menggunakan nilai otomatis.
              Title otomatis dari nama pengantin, description dari quote, image dari hero/cover.
            </div>
          </div>

          {/* Meta Title */}
          <div>
            <Input
              label="Meta Title (Judul SEO)"
              value={settings.meta_title || ''}
              onChange={(e) => updateField('meta_title', e.target.value)}
              placeholder={`Undangan Pernikahan ${settings.bride_name} & ${settings.groom_name}`}
              hint={`Kosongkan untuk otomatis. Maksimal 60 karakter. Saat ini: ${
                (settings.meta_title || '').length
              }/60`}
              error={errors.meta_title}
            />
          </div>

          {/* Meta Description */}
          <div>
            <Textarea
              label="Meta Description (Deskripsi SEO)"
              value={settings.meta_description || ''}
              onChange={(e) => updateField('meta_description', e.target.value)}
              placeholder="Kami mengundang Anda untuk merayakan pernikahan kami..."
              rows={3}
              hint={`Kosongkan untuk otomatis dari quote. Maksimal 160 karakter. Saat ini: ${
                (settings.meta_description || '').length
              }/160`}
              error={errors.meta_description}
            />
          </div>

          {/* Meta Image */}
          <div>
            <Input
              label="Meta Image URL (OG Image & Icon)"
              value={settings.meta_image_url || ''}
              onChange={(e) => updateField('meta_image_url', e.target.value)}
              placeholder="https://..."
              icon={<LinkIcon size={16} />}
              hint="Kosongkan untuk pakai Hero/Cover image. Copy URL dari halaman Media. Rekomendasi: 1200x630px."
              error={errors.meta_image_url}
            />
            <ImagePreview url={settings.meta_image_url} />
          </div>

          {/* ====== LIVE PREVIEW ====== */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-[#6B5B5B]/80 mb-3 uppercase tracking-wider">
              Preview di WhatsApp / Media Sosial
            </p>
            <div className="bg-[#ECE5DD] rounded-2xl p-4 max-w-sm">
              {/* Simulasi preview WhatsApp */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                {/* Image preview */}
                <div className="relative aspect-[1200/630] bg-gray-200">
                  {(settings.meta_image_url || settings.hero_image_url || settings.cover_background_url) ? (
                    <SafeImage
                      src={
                        settings.meta_image_url ||
                        settings.hero_image_url ||
                        settings.cover_background_url ||
                        ''
                      }
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Images size={32} />
                    </div>
                  )}
                </div>
                {/* Text preview */}
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {settings.meta_title ||
                      `Undangan Pernikahan ${settings.bride_name} & ${settings.groom_name} 💍`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {settings.meta_description ||
                      `Kami mengundang Anda untuk merayakan pernikahan ${settings.bride_fullname} & ${settings.groom_fullname}.`}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 uppercase">
                    {typeof window !== 'undefined'
                      ? new URL(window.location.origin).hostname
                      : 'undangan.namaanda.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================
          Informasi Pengantin
      ============================================ */}
      <Card
        title="Informasi Pengantin"
        subtitle="Data mempelai dan orang tua"
        icon={<Heart size={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Nama Panggilan Wanita"
            value={settings.bride_name}
            onChange={(e) => updateField('bride_name', e.target.value)}
            placeholder="Wanita"
            icon={<Heart size={16} />}
            required
            error={errors.bride_name}
          />
          <Input
            label="Nama Panggilan Pria"
            value={settings.groom_name}
            onChange={(e) => updateField('groom_name', e.target.value)}
            placeholder="Pria"
            icon={<Heart size={16} />}
            required
            error={errors.groom_name}
          />
          <Input
            label="Nama Lengkap Wanita"
            value={settings.bride_fullname}
            onChange={(e) => updateField('bride_fullname', e.target.value)}
            placeholder="Wanita"
            required
            error={errors.bride_fullname}
          />
          <Input
            label="Nama Lengkap Pria"
            value={settings.groom_fullname}
            onChange={(e) => updateField('groom_fullname', e.target.value)}
            placeholder="Pria"
            required
            error={errors.groom_fullname}
          />
          <Input
            label="Orang Tua Wanita"
            value={settings.bride_parents || ''}
            onChange={(e) => updateField('bride_parents', e.target.value)}
            placeholder="Bapak Wanita & Ibu Wanita"
            icon={<Users size={16} />}
          />
          <Input
            label="Orang Tua Pria"
            value={settings.groom_parents || ''}
            onChange={(e) => updateField('groom_parents', e.target.value)}
            placeholder="Bapak Priai & Ibu Pria"
            icon={<Users size={16} />}
          />
        </div>
      </Card>

      {/* ============================================
          Detail Acara
      ============================================ */}
      <Card
        title="Detail Acara"
        subtitle="Jadwal dan lokasi acara"
        icon={<Calendar size={20} />}
      >
        <div className="space-y-6">
          {/* Tanggal utama */}
          <div className="p-4 bg-gradient-to-r from-[#C9A96E]/5 to-[#DCAE96]/5 rounded-2xl border border-[#C9A96E]/10">
            <p className="text-xs font-semibold text-[#6B5B5B]/70 uppercase tracking-wider mb-3">
              Tanggal Utama (untuk countdown)
            </p>
            <Input
              type="datetime-local"
              value={settings.wedding_date ? settings.wedding_date.slice(0, 16) : ''}
              onChange={(e) => updateField('wedding_date', new Date(e.target.value).toISOString())}
              icon={<Clock size={16} />}
              required
              error={errors.wedding_date}
            />
          </div>

          {/* Akad */}
          <div>
            <h4 className="text-sm font-semibold text-[#6B5B5B] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C9A96E] text-white text-xs flex items-center justify-center">1</span>
              Akad Nikah
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tanggal"
                type="date"
                value={settings.akad_date ? settings.akad_date.slice(0, 10) : ''}
                onChange={(e) => updateField('akad_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
                error={errors.akad_date}
              />
              <Input
                label="Waktu"
                type="time"
                value={settings.akad_time || ''}
                onChange={(e) => updateField('akad_time', e.target.value)}
              />
              <div className="md:col-span-2">
                <Input
                  label="Lokasi"
                  value={settings.akad_location || ''}
                  onChange={(e) => updateField('akad_location', e.target.value)}
                  placeholder="Masjid Agung Al-Azhar, Jakarta"
                  icon={<MapPin size={16} />}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Google Maps URL"
                  value={settings.akad_maps || ''}
                  onChange={(e) => updateField('akad_maps', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  icon={<LinkIcon size={16} />}
                  error={errors.akad_maps}
                />
              </div>
            </div>
          </div>

          {/* Resepsi */}
          <div>
            <h4 className="text-sm font-semibold text-[#6B5B5B] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#DCAE96] text-white text-xs flex items-center justify-center">2</span>
              Resepsi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tanggal"
                type="date"
                value={settings.reception_date ? settings.reception_date.slice(0, 10) : ''}
                onChange={(e) => updateField('reception_date', e.target.value ? new Date(e.target.value).toISOString() : null)}
                error={errors.reception_date}
              />
              <Input
                label="Waktu"
                type="time"
                value={settings.reception_time || ''}
                onChange={(e) => updateField('reception_time', e.target.value)}
              />
              <div className="md:col-span-2">
                <Input
                  label="Lokasi"
                  value={settings.reception_location || ''}
                  onChange={(e) => updateField('reception_location', e.target.value)}
                  placeholder="Ballroom Hotel Mulia, Jakarta"
                  icon={<MapPin size={16} />}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Google Maps URL"
                  value={settings.reception_maps || ''}
                  onChange={(e) => updateField('reception_maps', e.target.value)}
                  placeholder="https://maps.google.com/..."
                  icon={<LinkIcon size={16} />}
                  error={errors.reception_maps}
                />
              </div>
            </div>
          </div>

          {/* Dresscode */}
          <Input
            label="Dresscode (Opsional)"
            value={settings.dresscode || ''}
            onChange={(e) => updateField('dresscode', e.target.value)}
            placeholder="Warna pastel, sentuhan batik"
          />
        </div>
      </Card>

      {/* ============================================
          Konten Teks
      ============================================ */}
      <Card
        title="Konten Teks"
        subtitle="Quote dan teks yang ditampilkan"
        icon={<MessageSquare size={20} />}
      >
        <div className="space-y-5">
          <Textarea
            label="Quote / Ayat"
            value={settings.quote || ''}
            onChange={(e) => updateField('quote', e.target.value)}
            placeholder="Dan di antara tanda-tanda kekuasaan-Nya..."
            rows={3}
          />
          <Textarea
            label="Teks Pembuka"
            value={settings.opening_text || ''}
            onChange={(e) => updateField('opening_text', e.target.value)}
            placeholder="Dengan memohon rahmat dan ridho Allah SWT..."
            rows={3}
          />
          <Textarea
            label="Teks Penutup"
            value={settings.closing_text || ''}
            onChange={(e) => updateField('closing_text', e.target.value)}
            placeholder="Merupakan suatu kebahagiaan..."
            rows={3}
          />
        </div>
      </Card>

      {/* ============================================
          Amplop Digital
      ============================================ */}
      <Card
        title="Amplop Digital"
        subtitle="Informasi rekening dan QRIS"
        icon={<Gift size={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="Nama Bank"
            value={settings.bank_name || ''}
            onChange={(e) => updateField('bank_name', e.target.value)}
            placeholder="BCA"
          />
          <Input
            label="Nomor Rekening"
            value={settings.bank_account_number || ''}
            onChange={(e) => updateField('bank_account_number', e.target.value)}
            placeholder="1234567890"
            error={errors.bank_account_number}
            hint="Hanya angka"
          />
          <Input
            label="Atas Nama"
            value={settings.bank_account_name || ''}
            onChange={(e) => updateField('bank_account_name', e.target.value)}
            placeholder="Nama Pemilik"
          />
        </div>
        <div className="mt-5">
          <Input
            label="URL QRIS (Opsional)"
            value={settings.qris_url || ''}
            onChange={(e) => updateField('qris_url', e.target.value)}
            placeholder="https://..."
            icon={<LinkIcon size={16} />}
            error={errors.qris_url}
            hint="Copy URL dari halaman Media"
          />
          <ImagePreview url={settings.qris_url} />
        </div>
      </Card>

      {/* ============================================
          Foto & Media
      ============================================ */}
      <Card
        title="Foto & Media"
        subtitle="Upload foto dan media sosial"
        icon={<Images size={20} />}
      >
        {/* Info box */}
        <div className="mb-5 p-4 bg-gradient-to-r from-[#C9A96E]/10 to-[#DCAE96]/10 rounded-2xl border border-[#C9A96E]/20 flex items-start gap-3">
          <AlertCircle size={18} className="text-[#C9A96E] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#6B5B5B]/80">
            <strong>Tips:</strong> Upload gambar di halaman{' '}
            <a href="/admin/media" className="text-[#C9A96E] font-semibold hover:underline">Media</a>, lalu copy URL-nya dan paste di form di bawah ini.
          </div>
        </div>

        <div className="space-y-5">
          {/* Cover */}
          <div>
            <Input
              label="Cover Background URL"
              value={settings.cover_background_url || ''}
              onChange={(e) => updateField('cover_background_url', e.target.value)}
              placeholder="https://..."
              hint="Foto full-screen di halaman pembuka. Kosongkan untuk background artistik otomatis."
              icon={<LinkIcon size={16} />}
              error={errors.cover_background_url}
            />
            <ImagePreview url={settings.cover_background_url} />
          </div>

          {/* Hero */}
          <div>
            <Input
              label="Hero Image URL"
              value={settings.hero_image_url || ''}
              onChange={(e) => updateField('hero_image_url', e.target.value)}
              placeholder="https://..."
              hint="Foto utama section pertama. Kosongkan untuk background artistik otomatis."
              icon={<LinkIcon size={16} />}
              error={errors.hero_image_url}
            />
            <ImagePreview url={settings.hero_image_url} />
          </div>

          {/* Foto pengantin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Input
                label="Foto Mempelai Wanita"
                value={settings.bride_photo_url || ''}
                onChange={(e) => updateField('bride_photo_url', e.target.value)}
                placeholder="https://..."
                icon={<LinkIcon size={16} />}
                error={errors.bride_photo_url}
              />
              <ImagePreview url={settings.bride_photo_url} />
            </div>
            <div>
              <Input
                label="Foto Mempelai Pria"
                value={settings.groom_photo_url || ''}
                onChange={(e) => updateField('groom_photo_url', e.target.value)}
                placeholder="https://..."
                icon={<LinkIcon size={16} />}
                error={errors.groom_photo_url}
              />
              <ImagePreview url={settings.groom_photo_url} />
            </div>
          </div>

          {/* Musik */}
          <Input
            label="URL Musik Background (MP3)"
            value={settings.music_url || ''}
            onChange={(e) => updateField('music_url', e.target.value)}
            placeholder="https://.../music.mp3"
            icon={<Music size={16} />}
            error={errors.music_url}
          />

          {/* Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Instagram Username"
              value={settings.instagram_username || ''}
              onChange={(e) => updateField('instagram_username', e.target.value)}
              placeholder="username (tanpa @)"
              icon={<Instagram size={16} />}
              error={errors.instagram_username}
            />
            <Input
              label="Wedding Hashtag"
              value={settings.wedding_hashtag || ''}
              onChange={(e) => updateField('wedding_hashtag', e.target.value)}
              placeholder="#WanitaAndPria"
              icon={<Hash size={16} />}
              error={errors.wedding_hashtag}
            />
          </div>

          {/* Live stream */}
          <Input
            label="Live Stream URL (Opsional)"
            value={settings.live_stream_url || ''}
            onChange={(e) => updateField('live_stream_url', e.target.value)}
            placeholder="https://youtube.com/... atau https://zoom.us/..."
            icon={<LinkIcon size={16} />}
            error={errors.live_stream_url}
          />
        </div>
      </Card>

      {/* ============================================
          Fitur Toggle
      ============================================ */}
      <Card
        title="Fitur Tambahan"
        subtitle="Aktifkan/nonaktifkan fitur"
        icon={<ToggleRight size={20} />}
      >
        <div className="divide-y divide-[#C9A96E]/10">
          <Toggle
            label="Gallery"
            description="Tampilkan section gallery foto"
            enabled={settings.enable_gallery}
            onChange={(v) => updateField('enable_gallery', v)}
          />
          <Toggle
            label="Documentary"
            description="Tampilkan section dokumenter"
            enabled={settings.enable_documentary}
            onChange={(v) => updateField('enable_documentary', v)}
          />
          <Toggle
            label="Love Story Timeline"
            description="Cerita perjalanan cinta"
            enabled={settings.enable_love_story}
            onChange={(v) => updateField('enable_love_story', v)}
          />
          <Toggle
            label="Wishes Wall"
            description="Tampilkan semua ucapan tamu"
            enabled={settings.enable_wishes_wall}
            onChange={(v) => updateField('enable_wishes_wall', v)}
          />
          <Toggle
            label="Music Player"
            description="Musik background otomatis"
            enabled={settings.enable_music}
            onChange={(v) => updateField('enable_music', v)}
          />
        </div>
      </Card>

      {/* ====== STICKY SAVE BUTTON ====== */}
      <div className="sticky bottom-6 flex justify-end pt-4">
        <Button
          onClick={handleSave}
          loading={saving}
          icon={<Save size={18} />}
          size="lg"
          className="shadow-2xl"
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  )
}