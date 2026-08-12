export interface WeddingSettings {
  id: string
  bride_name: string
  groom_name: string
  bride_fullname: string
  groom_fullname: string
  bride_parents?: string
  groom_parents?: string
  bride_photo_url?: string
  groom_photo_url?: string
  hero_image_url?: string
  cover_background_url?: string
  wedding_date: string
  akad_date?: string
  akad_time?: string
  akad_location?: string
  akad_maps?: string
  reception_date?: string
  reception_time?: string
  reception_location?: string
  reception_maps?: string
  dresscode?: string
  quote?: string
  opening_text?: string
  closing_text?: string
  bank_name?: string
  bank_account_number?: string
  bank_account_name?: string
  qris_url?: string
  instagram_username?: string
  wedding_hashtag?: string
  music_url?: string
  live_stream_url?: string
  primary_color: string
  accent_color: string
  text_color: string
  background_color: string
  background_style: string
  font_preset: string
  meta_title?: string
  meta_description?: string
  meta_image_url?: string
  enable_gallery: boolean
  enable_documentary: boolean
  enable_love_story: boolean
  enable_wishes_wall: boolean
  enable_music: boolean
  updated_at: string
}

export interface Guest {
  id: string
  name: string
  code: string
  rsvp_status: 'hadir' | 'tidak_hadir' | null
  rsvp_count: number
  wish?: string
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  caption?: string
  sort_order: number
}

export interface DocumentaryImage {
  id: string
  image_url: string
  title?: string
  caption?: string
  sort_order: number
}

export interface LoveStory {
  id: string
  title: string
  description?: string
  date?: string
  image_url?: string
  sort_order: number
}