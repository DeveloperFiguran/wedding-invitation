'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { WeddingSettings } from '@/types/database'
import { Lock, Sparkles, Music } from 'lucide-react'
import Image from 'next/image'
import { ElegantBackground } from './ElegantBackground'
import { hasValue } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { getFontVariables } from '@/lib/fonts'
import { DEFAULT_SETTINGS, mergeWithDefaults } from '@/lib/default-settings'
import { MusicPlayer } from './MusicPlayer'

export function LockedCoverPage() {
  const [settings, setSettings] = useState<WeddingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isUsingDefault, setIsUsingDefault] = useState(false)

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

      if (error || !data) {
        // Database kosong - gunakan default settings
        console.warn('Settings tidak ditemukan, menggunakan default')
        setSettings(DEFAULT_SETTINGS)
        setIsUsingDefault(true)
      } else {
        // Merge dengan default untuk field yang kosong
        setSettings(mergeWithDefaults(data))
        setIsUsingDefault(false)
      }
    } catch (err) {
      console.error('Gagal memuat settings:', err)
      // Fallback ke default jika terjadi error
      setSettings(DEFAULT_SETTINGS)
      setIsUsingDefault(true)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen mobile-full flex items-center justify-center bg-[#FBF8F3]">
        <LoadingSpinner text="Memuat..." />
      </div>
    )
  }

  // Settings tidak mungkin null karena ada fallback default
  if (!settings) {
    return null
  }

  // ====== MODE WARNA ADAPTIF ======
  const hasCoverImage = hasValue(settings.cover_background_url)
  const isDark = hasCoverImage
  const textColor = isDark ? '#FFFFFF' : settings.text_color
  const subtextColor = isDark ? 'rgba(255,255,255,0.85)' : `${settings.text_color}D9`
  const faintColor = isDark ? 'rgba(255,255,255,0.6)' : `${settings.text_color}99`

  return (
    <div
      className="relative min-h-screen mobile-full overflow-hidden"
      style={getFontVariables(settings.font_preset)}
    >
      {/* ====== MUSIC PLAYER (Global) ====== */}
      {settings.enable_music && settings.music_url && (
        <MusicPlayer
          musicUrl={settings.music_url}
          primaryColor={settings.primary_color}
          accentColor={settings.accent_color}
        />
      )}

      {/* ====== BACKGROUND ====== */}
      <div className="absolute inset-0">
        {hasCoverImage ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={settings.cover_background_url!}
                alt="Wedding Cover"
                fill
                priority
                className={`object-cover transition-opacity duration-1000 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
          </>
        ) : (
          <ElegantBackground
            primaryColor={settings.primary_color}
            accentColor={settings.accent_color}
            backgroundColor={settings.background_color}
            variant="cover"
            style={settings.background_style || 'botanical'}
          />
        )}
      </div>

      {/* Grain overlay - hanya mode gelap */}
      {isDark && (
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="lockedNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#lockedNoise)" />
          </svg>
        </div>
      )}

      {/* Top ornament */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <svg
          width="160"
          height="40"
          viewBox="0 0 160 40"
          style={{ color: isDark ? 'rgba(255,255,255,0.7)' : settings.primary_color }}
        >
          <path d="M10 20 Q80 -5 150 20" stroke="currentColor" fill="none" strokeWidth="0.8" />
          <circle cx="80" cy="10" r="2.5" fill="currentColor" />
          <path d="M65 15 Q80 5 95 15" stroke="currentColor" fill="none" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* ====== CONTENT ====== */}
      <div className="relative z-10 min-h-screen mobile-full flex flex-col items-center justify-between px-6 py-14 text-center">
        {/* Top label */}
        <div className="pt-6">
          <motion.p
            className="text-label-md uppercase font-medium"
            style={{ color: subtextColor }}
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ delay: 0.8, duration: 1.2 }}
          >
            The Wedding of
          </motion.p>
        </div>

        {/* Center - Names */}
        <div className="flex-1 flex flex-col items-center justify-center w-full py-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <h1
              className="font-script text-name-xl mb-2"
              style={{
                color: textColor,
                textShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {settings.bride_name}
            </h1>

            <motion.div
              className="flex items-center justify-center my-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <div
                className="w-14 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${
                    isDark ? 'rgba(255,255,255,0.6)' : settings.primary_color
                  })`,
                }}
              />
              <Sparkles
                className="mx-3 animate-pulse-soft"
                size={18}
                style={{ color: isDark ? 'rgba(255,255,255,0.9)' : settings.accent_color }}
              />
              <div
                className="w-14 h-px"
                style={{
                  background: `linear-gradient(270deg, transparent, ${
                    isDark ? 'rgba(255,255,255,0.6)' : settings.primary_color
                  })`,
                }}
              />
            </motion.div>

            <h1
              className="font-script text-name-xl"
              style={{
                color: textColor,
                textShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {settings.groom_name}
            </h1>
          </motion.div>

          {/* Date */}
          <motion.div
            className="mt-8 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <p
              className="text-body-md font-light tracking-[0.2em] uppercase"
              style={{ color: subtextColor }}
            >
              {new Date(settings.wedding_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {hasValue(settings.wedding_hashtag) && (
              <p className="text-body-sm font-elegant italic" style={{ color: faintColor }}>
                {settings.wedding_hashtag}
              </p>
            )}
          </motion.div>
        </div>

        {/* ====== Bottom - Notice Card ====== */}
        <div className="w-full max-w-sm pb-2">
          <motion.div
            className={`rounded-3xl p-6 relative overflow-hidden ${
              isDark ? 'glass-effect-highlight' : 'bg-white/75 backdrop-blur-md'
            }`}
            style={{
              boxShadow: isDark
                ? `0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${settings.accent_color}30 inset`
                : `0 8px 32px ${settings.primary_color}15, 0 0 0 1px ${settings.primary_color}20`,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.9 }}
          >
            {/* Border gradient atas */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${settings.accent_color}, transparent)`,
              }}
            />

            {/* Corner accents */}
            <div
              className="absolute top-3 left-3 w-4 h-4 border-t border-l"
              style={{ borderColor: `${settings.accent_color}60` }}
            />
            <div
              className="absolute top-3 right-3 w-4 h-4 border-t border-r"
              style={{ borderColor: `${settings.accent_color}60` }}
            />
            <div
              className="absolute bottom-3 left-3 w-4 h-4 border-b border-l"
              style={{ borderColor: `${settings.accent_color}60` }}
            />
            <div
              className="absolute bottom-3 right-3 w-4 h-4 border-b border-r"
              style={{ borderColor: `${settings.accent_color}60` }}
            />

            {/* Content - Pesan privat */}
            <div className="flex justify-center mb-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${settings.primary_color}20` }}
              >
                {isUsingDefault ? (
                  <Music size={22} style={{ color: settings.primary_color }} />
                ) : (
                  <Lock size={22} style={{ color: settings.primary_color }} />
                )}
              </div>
            </div>
            <h3
              className="font-elegant text-xl md:text-2xl font-semibold leading-tight mb-2"
              style={{ color: isDark ? '#FFFFFF' : settings.text_color }}
            >
              {isUsingDefault ? 'Selamat Datang' : 'Undangan Digital'}
            </h3>
            {/* <p className="text-body-sm leading-relaxed" style={{ color: faintColor }}>
              {isUsingDefault
                ? 'Undangan ini belum dikonfigurasi. Silakan masuk ke admin panel untuk mengatur data pernikahan.'
                : 'Undangan ini bersifat privat. Silakan buka melalui link resmi yang telah dikirimkan kepada Anda.'}
            </p> */}
            <p className="text-body-sm leading-relaxed" style={{ color: faintColor }}>
              {'Undangan ini bersifat privat. Silakan buka melalui link resmi yang telah dikirimkan kepada Anda.'}
            </p>

            {/* Tombol ke admin (hanya muncul jika pakai default) */}
            {/* {isUsingDefault && (
              <motion.a
                href="/admin"
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: settings.primary_color,
                  color: '#FFFFFF',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                <Lock size={14} />
                Setup Undangan
              </motion.a>
            )} */}
          </motion.div>
        </div>
      </div>
    </div>
  )
}