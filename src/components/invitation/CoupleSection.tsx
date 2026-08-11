'use client'

import { motion, useInView } from 'framer-motion'
import { WeddingSettings } from '@/types/database'
import { Heart, Instagram } from 'lucide-react'
import { useRef } from 'react'
import { SafeImage } from '@/components/ui/SafeImage'
import { SafeLink } from '@/components/ui/SafeLink'
import { ElegantBackground } from './ElegantBackground'
import { isValidImageUrl, sanitizeInstagramUsername } from '@/lib/validation'

interface CoupleSectionProps {
  settings: WeddingSettings
}

export function CoupleSection({ settings }: CoupleSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const hasBridePhoto = isValidImageUrl(settings.bride_photo_url)
  const hasGroomPhoto = isValidImageUrl(settings.groom_photo_url)
  const safeInstagram = sanitizeInstagramUsername(settings.instagram_username || '')

  return (
    <section
      id="couple"
      ref={ref}
      className="relative py-24 px-6 overflow-hidden"
      style={{ backgroundColor: settings.background_color }}
    >
      {/* Background decoration */}
      <ElegantBackground
        primaryColor={settings.primary_color}
        accentColor={settings.accent_color}
        backgroundColor={settings.background_color}
        variant="section"
        style={settings.background_style || 'botanical'}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-label-md uppercase mb-4 font-medium"
            style={{ color: settings.primary_color }}
          >
            Bismillahirrahmanirrahim
          </p>

        {/* Opening text */}
        {settings.opening_text && (
          <motion.p
            className="text-center font-elegant text-body-lg italic mb-16 leading-relaxed font-medium"
            style={{ color: settings.text_color, opacity: 0.9 }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 1 }}
          >
            {settings.opening_text}
          </motion.p>
        )}
          
          {/* <h2 className="font-display text-heading-xl mb-5" style={{ color: settings.text_color }}>
            Mempelai
          </h2> */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }} />
            <Heart size={18} fill={settings.accent_color} style={{ color: settings.accent_color }} />
            <div className="w-12 h-px" style={{ backgroundColor: settings.primary_color }} />
          </div>
        </motion.div>



        <div className="space-y-16">
          {/* ====== BRIDE ====== */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative mx-auto mb-8 w-56 h-72 md:w-64 md:h-80">
              {/* Arch border luar */}
              <div
                className="absolute -inset-3 rounded-t-full border-2 opacity-50"
                style={{ borderColor: settings.primary_color }}
              />
              {/* Arch border dalam */}
              <div
                className="absolute -inset-1.5 rounded-t-full border opacity-30"
                style={{ borderColor: settings.accent_color }}
              />

              {hasBridePhoto ? (
                <div className="relative w-full h-full rounded-t-full overflow-hidden shadow-xl">
                  <SafeImage
                    src={settings.bride_photo_url}
                    alt={settings.bride_fullname}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full rounded-t-full flex items-center justify-center font-script text-8xl shadow-xl"
                  style={{
                    background: `linear-gradient(160deg, ${settings.primary_color}20, ${settings.accent_color}30)`,
                    color: settings.primary_color,
                  }}
                >
                  {settings.bride_name.charAt(0)}
                </div>
              )}
            </div>

            <h3 className="font-script text-name-lg mb-4" style={{ color: settings.text_color }}>
              {settings.bride_fullname}
            </h3>
            <p className="text-body-md font-elegant italic mb-1" style={{ color: settings.text_color, opacity: 0.7 }}>
              Putri dari
            </p>
            {settings.bride_parents && (
              <p className="text-body-md font-elegant font-semibold" style={{ color: settings.text_color }}>
                {settings.bride_parents}
              </p>
            )}
            {safeInstagram && (
              <SafeLink
                href={`https://instagram.com/${safeInstagram}`}
                className="mt-4 text-body-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: settings.primary_color }}
              >
                <Instagram size={16} />
                @{safeInstagram}
              </SafeLink>
            )}
          </motion.div>

          {/* ====== DIVIDER ====== */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="w-20 h-px" style={{ backgroundColor: settings.primary_color, opacity: 0.5 }} />
            <Heart
              size={30}
              fill={settings.accent_color}
              style={{ color: settings.accent_color }}
              className="mx-4 animate-pulse-soft"
            />
            <div className="w-20 h-px" style={{ backgroundColor: settings.primary_color, opacity: 0.5 }} />
          </motion.div>

          {/* ====== GROOM ====== */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative mx-auto mb-8 w-56 h-72 md:w-64 md:h-80">
              <div
                className="absolute -inset-3 rounded-t-full border-2 opacity-50"
                style={{ borderColor: settings.primary_color }}
              />
              <div
                className="absolute -inset-1.5 rounded-t-full border opacity-30"
                style={{ borderColor: settings.accent_color }}
              />

              {hasGroomPhoto ? (
                <div className="relative w-full h-full rounded-t-full overflow-hidden shadow-xl">
                  <SafeImage
                    src={settings.groom_photo_url}
                    alt={settings.groom_fullname}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full rounded-t-full flex items-center justify-center font-script text-8xl shadow-xl"
                  style={{
                    background: `linear-gradient(160deg, ${settings.accent_color}25, ${settings.primary_color}30)`,
                    color: settings.primary_color,
                  }}
                >
                  {settings.groom_name.charAt(0)}
                </div>
              )}
            </div>

            <h3 className="font-script text-name-lg mb-4" style={{ color: settings.text_color }}>
              {settings.groom_fullname}
            </h3>
            <p className="text-body-md font-elegant italic mb-1" style={{ color: settings.text_color, opacity: 0.7 }}>
              Putra dari
            </p>
            {settings.groom_parents && (
              <p className="text-body-md font-elegant font-semibold" style={{ color: settings.text_color }}>
                {settings.groom_parents}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
