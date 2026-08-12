'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { WeddingSettings, Guest, GalleryImage, DocumentaryImage, LoveStory } from '@/types/database'
import { CoverPage } from './CoverPage'
import { HeroSection } from './HeroSection'
import { CoupleSection } from './CoupleSection'
import { EventDetails } from './EventDetails'
import { GallerySection } from './GallerySection'
import { DocumentarySection } from './DocumentarySection'
import { WeddingGift } from './WeddingGift'
import { RSVPForm } from './RSVPForm'
import { WishesWall } from './WishesWall'
import { LoveStoryTimeline } from './LoveStoryTimeline'
import { Closing } from './Closing'
import { MusicPlayer } from './MusicPlayer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FallingPetals } from './FallingPetals'
import { ScrollProgress } from './ScrollProgress'
import { SectionNav } from './SectionNav'
import { getFontVariables } from '@/lib/fonts'
import {
  sanitizeText, sanitizeUrl, sanitizeInstagramUsername, sanitizeHashtag
} from '@/lib/validation'

export function InvitationPage({ code }: { code: string }) {
  const [settings, setSettings] = useState<WeddingSettings | null>(null)
  const [guest, setGuest] = useState<Guest | null>(null)
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [documentary, setDocumentary] = useState<DocumentaryImage[]>([])
  const [loveStory, setLoveStory] = useState<LoveStory[]>([])
  const [allWishes, setAllWishes] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchData()
  }, [code])

  /* ============================================
     SANITASI DATA
     ============================================ */
  function sanitizeSettings(data: any): WeddingSettings {
    return {
      ...data,
      // Text fields
      quote: sanitizeText(data.quote || ''),
      opening_text: sanitizeText(data.opening_text || ''),
      closing_text: sanitizeText(data.closing_text || ''),
      dresscode: sanitizeText(data.dresscode || ''),
      akad_location: sanitizeText(data.akad_location || ''),
      reception_location: sanitizeText(data.reception_location || ''),
      bride_parents: sanitizeText(data.bride_parents || ''),
      groom_parents: sanitizeText(data.groom_parents || ''),
      bride_fullname: sanitizeText(data.bride_fullname || ''),
      groom_fullname: sanitizeText(data.groom_fullname || ''),
      bride_name: sanitizeText(data.bride_name || ''),
      groom_name: sanitizeText(data.groom_name || ''),
      bank_name: sanitizeText(data.bank_name || ''),
      bank_account_name: sanitizeText(data.bank_account_name || ''),
      bank_account_number: sanitizeText(data.bank_account_number || ''),
      meta_title: sanitizeText(data.meta_title || ''),
      meta_description: sanitizeText(data.meta_description || ''),

      // URL fields
      akad_maps: sanitizeUrl(data.akad_maps),
      reception_maps: sanitizeUrl(data.reception_maps),
      cover_background_url: sanitizeUrl(data.cover_background_url),
      hero_image_url: sanitizeUrl(data.hero_image_url),
      bride_photo_url: sanitizeUrl(data.bride_photo_url),
      groom_photo_url: sanitizeUrl(data.groom_photo_url),
      qris_url: sanitizeUrl(data.qris_url),
      music_url: sanitizeUrl(data.music_url),
      live_stream_url: sanitizeUrl(data.live_stream_url),
      meta_image_url: sanitizeUrl(data.meta_image_url),

      // Social
      instagram_username: sanitizeInstagramUsername(data.instagram_username || ''),
      wedding_hashtag: sanitizeHashtag(data.wedding_hashtag || ''),
    }
  }

  function sanitizeGuest(data: any): Guest {
    return {
      ...data,
      name: sanitizeText(data.name || ''),
      wish: sanitizeText(data.wish || ''),
    }
  }

  function sanitizeImageItem(data: any): any {
    return {
      ...data,
      caption: sanitizeText(data.caption || ''),
      title: sanitizeText(data.title || ''),
      image_url: sanitizeUrl(data.image_url),
    }
  }

  function sanitizeStory(data: any): LoveStory {
    return {
      ...data,
      title: sanitizeText(data.title || ''),
      description: sanitizeText(data.description || ''),
      image_url: sanitizeUrl(data.image_url),
    }
  }

  /* ============================================
     FETCH DATA
     ============================================ */
  async function fetchData() {
    try {
      // Fetch guest
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('code', code.toUpperCase())
        .single()

      if (guestError || !guestData) {
        setError(true)
        setLoading(false)
        return
      }

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('wedding_settings')
        .select('*')
        .limit(1)
        .single()

      if (settingsError || !settingsData) {
        setError(true)
        setLoading(false)
        return
      }

      // Sanitasi data utama
      const safeSettings = sanitizeSettings(settingsData)
      const safeGuest = sanitizeGuest(guestData)

      // Fetch gallery (conditional)
      let galleryData: GalleryImage[] = []
      if (safeSettings.enable_gallery) {
        const { data } = await supabase.from('gallery').select('*').order('sort_order')
        galleryData = (data || []).map(sanitizeImageItem)
      }

      // Fetch documentary (conditional)
      let documentaryData: DocumentaryImage[] = []
      if (safeSettings.enable_documentary) {
        const { data } = await supabase.from('documentary').select('*').order('sort_order')
        documentaryData = (data || []).map(sanitizeImageItem)
      }

      // Fetch love story (conditional)
      let storyData: LoveStory[] = []
      if (safeSettings.enable_love_story) {
        const { data } = await supabase.from('love_story').select('*').order('sort_order')
        storyData = (data || []).map(sanitizeStory)
      }

      // Fetch wishes (conditional)
      let wishesData: Guest[] = []
      if (safeSettings.enable_wishes_wall) {
        const { data } = await supabase
          .from('guests')
          .select('*')
          .not('wish', 'is', null)
          .order('created_at', { ascending: false })
          .limit(50)
        wishesData = (data || []).map(sanitizeGuest)
      }

      setSettings(safeSettings)
      setGuest(safeGuest)
      setGallery(galleryData)
      setDocumentary(documentaryData)
      setLoveStory(storyData)
      setAllWishes(wishesData)
      setLoading(false)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(true)
      setLoading(false)
    }
  }

  /* ============================================
     LOADING STATE
     ============================================ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8F3]">
        <LoadingSpinner text="Memuat undangan..." />
      </div>
    )
  }

  /* ============================================
     ERROR FALLBACK (untuk edge case: network error, settings kosong)
     Catatan: kode invalid sudah di-handle di server dengan notFound()
     ============================================ */
  if (error || !settings || !guest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FBF8F3] via-[#F7E7CE]/40 to-[#DCAE96]/30 px-4">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#C9A96E]/10 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#C9A96E] to-[#DCAE96] rounded-full flex items-center justify-center shadow-lg shadow-[#C9A96E]/30">
            <span className="text-white text-3xl">💌</span>
          </div>
          <h1 className="font-display text-2xl text-[#3D342B] mb-3">
            Undangan Tidak Tersedia
          </h1>
          <p className="text-body-md text-[#6B5B5B]/70 mb-6 leading-relaxed">
            Terjadi kesalahan saat memuat undangan. Silakan coba beberapa saat lagi.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C9A96E] to-[#DCAE96] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-[#C9A96E]/30 transition-all duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  /* ============================================
     RENDER UNDANGAN
     ============================================ */
  return (
    <div
      style={{
        backgroundColor: settings.background_color,
        ...getFontVariables(settings.font_preset),
      }}
    >

      {/* ============================================
          MUSIC PLAYER - LEVEL GLOBAL
          Tidak unmount saat transisi CoverPage → konten
          Musik tetap play tanpa restart
      ============================================ */}
      {settings.enable_music && settings.music_url && (
        <MusicPlayer
          musicUrl={settings.music_url}
          primaryColor={settings.primary_color}
          accentColor={settings.accent_color}
        />
      )}
      
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <CoverPage
            key="cover"
            settings={settings}
            guest={guest}
            onOpen={() => setIsOpen(true)}
          />
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <ScrollProgress color={settings.primary_color} />
            <FallingPetals color={settings.accent_color} count={10} />

            <HeroSection settings={settings} />

            {settings.quote && (
              <section className="py-16 px-6 text-center" style={{ backgroundColor: settings.background_color }}>
                <motion.blockquote
                  className="max-w-xl mx-auto font-elegant text-body-lg italic leading-relaxed font-medium"
                  style={{ color: settings.text_color, opacity: 0.85 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="font-script text-4xl block mb-4" style={{ color: settings.primary_color }}>
                    ✦
                  </span>
                  &quot;{settings.quote}&quot;
                </motion.blockquote>
              </section>
            )}

            <CoupleSection settings={settings} />

            {settings.enable_love_story && loveStory.length > 0 && (
              <LoveStoryTimeline
                stories={loveStory}
                primaryColor={settings.primary_color}
                accentColor={settings.accent_color}
                textColor={settings.text_color}
                backgroundColor={settings.background_color}
              />
            )}

            <EventDetails settings={settings} />

            {settings.enable_gallery && gallery.length > 0 && (
              <div id="gallery">
                <GallerySection
                  images={gallery}
                  primaryColor={settings.primary_color}
                  textColor={settings.text_color}
                  backgroundColor={settings.background_color}
                />
              </div>
            )}

            {settings.enable_documentary && documentary.length > 0 && (
              <DocumentarySection
                images={documentary}
                primaryColor={settings.primary_color}
                textColor={settings.text_color}
                backgroundColor={settings.background_color}
              />
            )}

            <div id="gift">
              <WeddingGift settings={settings} />
            </div>

            <div id="rsvp">
              <RSVPForm guest={guest} settings={settings} />
            </div>

            {settings.enable_wishes_wall && allWishes.length > 0 && (
              <WishesWall
                wishes={allWishes}
                primaryColor={settings.primary_color}
                textColor={settings.text_color}
                backgroundColor={settings.background_color}
              />
            )}

            <Closing settings={settings} />

            <SectionNav primaryColor={settings.primary_color} enableGallery={settings.enable_gallery} />

            <footer
              className="py-12 pb-28 md:pb-12 text-center"
              style={{ backgroundColor: settings.background_color }}
            >
              <p className="text-caption" style={{ color: settings.text_color, opacity: 0.5 }}>
                Made with ♥ for {settings.bride_name} & {settings.groom_name}
              </p>
              {settings.wedding_hashtag && (
                <p className="font-script text-2xl mt-2" style={{ color: settings.primary_color }}>
                  {settings.wedding_hashtag}
                </p>
              )}
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}