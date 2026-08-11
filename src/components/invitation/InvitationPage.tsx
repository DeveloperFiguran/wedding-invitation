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
import { NotFoundPage } from './NotFoundPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FallingPetals } from './FallingPetals'
import { ScrollProgress } from './ScrollProgress'
import { SectionNav } from './SectionNav'
import { getFontVariables } from '@/lib/fonts'
import {
  sanitizeText, sanitizeUrl, sanitizeInstagramUsername, sanitizeHashtag
} from '@/lib/validation'
import Image from 'next/image'

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
     HELPER: Sanitasi settings dari DB
     ============================================ */
  function sanitizeSettings(data: any): WeddingSettings {
    return {
      ...data,
      // Text fields - escape HTML
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

      // URL fields - whitelist protocol
      akad_maps: sanitizeUrl(data.akad_maps),
      reception_maps: sanitizeUrl(data.reception_maps),
      cover_background_url: sanitizeUrl(data.cover_background_url),
      hero_image_url: sanitizeUrl(data.hero_image_url),
      bride_photo_url: sanitizeUrl(data.bride_photo_url),
      groom_photo_url: sanitizeUrl(data.groom_photo_url),
      qris_url: sanitizeUrl(data.qris_url),
      music_url: sanitizeUrl(data.music_url),
      live_stream_url: sanitizeUrl(data.live_stream_url),

      // Social - format specific
      instagram_username: sanitizeInstagramUsername(data.instagram_username || ''),
      wedding_hashtag: sanitizeHashtag(data.wedding_hashtag || ''),
    }
  }

  /* ============================================
     HELPER: Sanitasi guest data
     ============================================ */
  function sanitizeGuest(data: any): Guest {
    return {
      ...data,
      name: sanitizeText(data.name || ''),
      wish: sanitizeText(data.wish || ''),
    }
  }

  /* ============================================
     HELPER: Sanitasi gallery & documentary
     ============================================ */
  function sanitizeImageItem(data: any): any {
    return {
      ...data,
      caption: sanitizeText(data.caption || ''),
      title: sanitizeText(data.title || ''),
      image_url: sanitizeUrl(data.image_url),
    }
  }

  /* ============================================
     HELPER: Sanitasi love story
     ============================================ */
  function sanitizeStory(data: any): LoveStory {
    return {
      ...data,
      title: sanitizeText(data.title || ''),
      description: sanitizeText(data.description || ''),
      image_url: sanitizeUrl(data.image_url),
    }
  }

  async function fetchData() {
    try {
      // Fetch guest by code
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

      // ====== SANITASI SEMUA DATA ======
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

      // Fetch wishes (USER INPUT - paling kritis untuk XSS!)
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
      setError(true)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <LoadingSpinner text="Memuat undangan..." />
      </div>
    )
  }

  if (error || !settings || !guest) {
    return <NotFoundPage />
  }

  return (
    <div
      style={{
        backgroundColor: settings.background_color,
        ...getFontVariables(settings.font_preset),
      }}
    >
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
            {/* Progress bar */}
            <ScrollProgress color={settings.primary_color} />

            {/* Falling petals ambient effect */}
            <FallingPetals color={settings.accent_color} count={10} />

            {/* Hero dengan countdown */}
            <HeroSection settings={settings} />

            {/* Quote section */}
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
                  "{settings.quote}"
                </motion.blockquote>
              </section>
            )}

            {/* Couple */}
            <CoupleSection settings={settings} />

            {/* Love Story Timeline */}
            {settings.enable_love_story && loveStory.length > 0 && (
              <LoveStoryTimeline
                stories={loveStory}
                primaryColor={settings.primary_color}
                accentColor={settings.accent_color}
                textColor={settings.text_color}
                backgroundColor={settings.background_color}
              />
            )}

            {/* Event Details */}
            <EventDetails settings={settings} />

            {/* Gallery */}
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

            {/* Documentary */}
            {settings.enable_documentary && documentary.length > 0 && (
              <DocumentarySection
                images={documentary}
                primaryColor={settings.primary_color}
                textColor={settings.text_color}
                backgroundColor={settings.background_color}
              />
            )}

            {/* Wedding Gift */}
            <div id="gift">
              <WeddingGift settings={settings} />
            </div>

            {/* RSVP */}
            <div id="rsvp">
              <RSVPForm guest={guest} settings={settings} />
            </div>

            {/* Wishes Wall */}
            {settings.enable_wishes_wall && allWishes.length > 0 && (
              <WishesWall
                wishes={allWishes}
                primaryColor={settings.primary_color}
                textColor={settings.text_color}
                backgroundColor={settings.background_color}
              />
            )}

            {/* Closing */}
            <Closing settings={settings} />

            {/* Music Player */}
            {settings.enable_music && settings.music_url && (
              <MusicPlayer musicUrl={settings.music_url} primaryColor={settings.primary_color} />
            )}

            {/* Bottom Navigation */}
            <SectionNav primaryColor={settings.primary_color} enableGallery={settings.enable_gallery} />

            {/* Footer */}
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