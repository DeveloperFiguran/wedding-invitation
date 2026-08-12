import { WeddingSettings } from '@/types/database'

/**
 * Default settings ketika database masih kosong.
 * Data ini dipakai sebagai fallback agar aplikasi tetap berfungsi.
 */
export const DEFAULT_SETTINGS: WeddingSettings = {
  id: 'default',

  // ====== Informasi Pengantin ======
  bride_name: 'Mempelai Wanita',
  groom_name: 'Mempelai Pria',
  bride_fullname: 'Nama Lengkap Mempelai Wanita',
  groom_fullname: 'Nama Lengkap Mempelai Pria',
  bride_parents: 'Orang Tua Mempelai Wanita',
  groom_parents: 'Orang Tua Mempelai Pria',
  bride_photo_url: '',
  groom_photo_url: '',
  hero_image_url: '',
  cover_background_url: '',

  // ====== Tanggal & Acara ======
  wedding_date: getDefaultWeddingDate(),
  akad_date: getDefaultWeddingDate(),
  akad_time: '08:00',
  akad_location: '',
  akad_maps: '',
  reception_date: getDefaultWeddingDate(),
  reception_time: '11:00',
  reception_location: '',
  reception_maps: '',
  dresscode: '',

  // ====== Konten Teks ======
  quote: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
  opening_text: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami',
  closing_text: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.',

  // ====== Amplop Digital ======
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
  qris_url: '',

  // ====== Social & Media ======
  instagram_username: '',
  wedding_hashtag: '#PernikahanKami',
  music_url: '',
  live_stream_url: '',

  // ====== Meta SEO ======
  meta_title: '',
  meta_description: '',
  meta_image_url: '',

  // ====== Warna & Theme ======
  primary_color: '#B8935A',
  accent_color: '#D4A574',
  text_color: '#3D342B',
  background_color: '#FBF8F3',
  background_style: 'botanical',
  font_preset: 'classic-elegance',

  // ====== Timezone (BARU) ======
  event_timezone: 'Asia/Jakarta',

  // ====== Fitur Toggle ======
  enable_gallery: true,
  enable_documentary: true,
  enable_love_story: true,
  enable_wishes_wall: true,
  enable_music: false, // Default false karena belum ada file musik

  // ====== Metadata ======
  updated_at: new Date().toISOString(),
}

/**
 * Generate tanggal default: 60 hari dari sekarang
 */
function getDefaultWeddingDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 60)
  date.setHours(10, 0, 0, 0)
  return date.toISOString()
}

/**
 * Merge settings dari DB dengan default.
 * Field yang null/undefined/kosong akan diisi default.
 */
export function mergeWithDefaults(dbSettings: Partial<WeddingSettings> | null): WeddingSettings {
  if (!dbSettings) {
    return { ...DEFAULT_SETTINGS }
  }

  const merged = { ...DEFAULT_SETTINGS }

  // Override dengan data DB yang valid
  Object.keys(DEFAULT_SETTINGS).forEach((key) => {
    const dbValue = dbSettings[key as keyof WeddingSettings]

    // Boolean fields - pakai nilai DB jika defined
    if (typeof dbValue === 'boolean') {
      ; (merged as any)[key] = dbValue
      return
    }

    // String fields - pakai nilai DB jika tidak kosong
    if (typeof dbValue === 'string' && dbValue.trim() !== '') {
      ; (merged as any)[key] = dbValue
      return
    }

    // Field lain - pakai nilai DB jika defined dan tidak kosong
    if (dbValue !== null && dbValue !== undefined && dbValue !== '') {
      ; (merged as any)[key] = dbValue
    }
  })

  return merged
}

/**
 * Cek apakah settings sudah di-setup (bukan default)
 */
export function isConfigured(settings: WeddingSettings | null): boolean {
  if (!settings) return false

  return (
    settings.bride_name !== DEFAULT_SETTINGS.bride_name &&
    settings.groom_name !== DEFAULT_SETTINGS.groom_name &&
    settings.bride_fullname !== DEFAULT_SETTINGS.bride_fullname
  )
}

/**
 * Buat default guest untuk preview/locked page
 */
export function createDefaultGuest() {
  return {
    id: 'default-guest',
    name: 'Tamu Undangan',
    code: 'ABCDE',
    rsvp_status: null,
    rsvp_count: 0,
    wish: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
