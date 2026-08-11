'use client'

import { motion } from 'framer-motion'
import { WeddingSettings, Guest } from '@/types/database'
import { MailOpen, Sparkles } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { ElegantBackground } from './ElegantBackground'
import { hasValue } from '@/lib/utils'
import { SafeImage } from '@/components/ui/SafeImage'
import { isValidImageUrl } from '@/lib/validation'  // atau dari validation

interface CoverPageProps {
  settings: WeddingSettings
  guest: Guest
  onOpen: () => void
}

export function CoverPage({ settings, guest, onOpen }: CoverPageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  const handleOpen = () => {
    setIsOpening(true)
    setTimeout(() => onOpen(), 100)
  }

  const hasCoverImage = isValidImageUrl(settings.cover_background_url)

  // ====== MODE WARNA ADAPTIF ======
  // Gelap (teks putih) hanya jika ada foto, terang (teks tema) jika tidak
  const isDark = hasCoverImage
  const textColor = isDark ? '#FFFFFF' : settings.text_color
  const subtextColor = isDark ? 'rgba(255,255,255,0.85)' : `${settings.text_color}D9`
  const faintColor = isDark ? 'rgba(255,255,255,0.6)' : `${settings.text_color}99`

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden mobile-full"
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ====== BACKGROUND ====== */}
      <div className="absolute inset-0">
        {hasCoverImage ? (
          <>
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.2 }}
              animate={{ scale: isOpening ? 1.3 : 1.1 }}
              transition={{ duration: 8, ease: 'linear' }}
            >
              <SafeImage
                src={settings.cover_background_url!}
                alt="Wedding Cover"
                fill
                priority
                className={`object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
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

      {/* Grain overlay - hanya untuk mode gelap (foto) */}
      {isDark && (
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="coverNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#coverNoise)" />
          </svg>
        </div>
      )}

      {/* Top ornament - warna adaptif */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <svg width="160" height="40" viewBox="0 0 160 40" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : settings.primary_color }}>
          <path d="M10 20 Q80 -5 150 20" stroke="currentColor" fill="none" strokeWidth="0.8" />
          <circle cx="80" cy="10" r="2.5" fill="currentColor" />
          <path d="M65 15 Q80 5 95 15" stroke="currentColor" fill="none" strokeWidth="0.5" />
        </svg>
      </motion.div>

      {/* ====== MAIN CONTENT ====== */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between px-6 py-14 text-center">
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
              <div className="w-14 h-px" style={{ background: `linear-gradient(90deg, transparent, ${isDark ? 'rgba(255,255,255,0.6)' : settings.primary_color})` }} />
              <Sparkles
                className="mx-3 animate-pulse-soft"
                size={18}
                style={{ color: isDark ? 'rgba(255,255,255,0.9)' : settings.accent_color }}
              />
              <div className="w-14 h-px" style={{ background: `linear-gradient(270deg, transparent, ${isDark ? 'rgba(255,255,255,0.6)' : settings.primary_color})` }} />
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
            <p className="text-body-md font-light tracking-[0.2em] uppercase" style={{ color: subtextColor }}>
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

        {/* Bottom - Guest card & button */}
        <div className="w-full max-w-sm space-y-5 pb-2">
          {/* ====== GUEST CARD - Adaptif ====== */}
          <motion.div
            className={`rounded-3xl p-6 shadow-2xl relative overflow-hidden ${
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
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: `${settings.accent_color}60` }} />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r" style={{ borderColor: `${settings.accent_color}60` }} />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l" style={{ borderColor: `${settings.accent_color}60` }} />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: `${settings.accent_color}60` }} />

            {/* Content */}
            <p className="text-label-sm uppercase mb-3 tracking-[0.25em]" style={{ color: faintColor }}>
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <h3
              className="font-elegant text-2xl md:text-3xl font-semibold leading-tight"
              style={{ color: isDark ? '#FFFFFF' : settings.text_color }}
            >
              {guest.name}
            </h3>
            <p className="text-caption mt-3 italic" style={{ color: faintColor }}>
              Mohon maaf apabila ada kesalahan penulisan nama & gelar
            </p>
          </motion.div>

          {/* ====== OPEN BUTTON ====== */}
          <motion.button
            onClick={handleOpen}
            className="w-full py-4 rounded-full font-semibold text-body-md tracking-wide flex items-center justify-center gap-2 transition-all relative overflow-hidden group"
            style={{
              backgroundColor: settings.primary_color,
              color: '#fff',
              boxShadow: `0 8px 24px ${settings.primary_color}60`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <MailOpen size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Buka Undangan</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}