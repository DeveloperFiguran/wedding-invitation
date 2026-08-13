'use client'

import { motion } from 'framer-motion'
import { WeddingSettings } from '@/types/database'
import { Countdown } from './Countdown'
import { AddToCalendar } from './AddToCalendar'
import { ElegantBackground } from './ElegantBackground'
import { ChevronDown } from 'lucide-react'
import { hasValue } from '@/lib/utils'  // ✅ Import helper
import Image from 'next/image'
import { SafeImage } from '@/components/ui/SafeImage'
import { isValidImageUrl } from '@/lib/validation'

interface HeroSectionProps {
  settings: WeddingSettings
}

export function HeroSection({ settings }: HeroSectionProps) {
  const scrollToNext = () => {
    document.getElementById('couple')?.scrollIntoView({ behavior: 'smooth' })
  }

  // ✅ FIX: Gunakan helper, hasil pasti boolean
  // const hasHeroImage = hasValue(settings.hero_image_url)
  const hasHeroImage = isValidImageUrl(settings.hero_image_url)
  const textColor = hasHeroImage ? '#ffffff' : settings.text_color

  return (
    <section
      id="home"
      className="relative mobile-full flex items-center justify-center overflow-hidden"
    >
      {hasHeroImage ? (
        <div className="absolute inset-0">
          <SafeImage
            src={settings.hero_image_url!}
            alt="Hero"
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, ${settings.background_color} 100%)`,
            }}
          />
        </div>
      ) : (
        <ElegantBackground
          primaryColor={settings.primary_color}
          accentColor={settings.accent_color}
          backgroundColor={settings.background_color}
          variant="section"
          style={settings.background_style || 'botanical'}
        />
      )}

      <div className="relative z-10 text-center px-6 py-20 w-full" style={{ color: textColor }}>
        <motion.p
          className="text-label-md uppercase mb-6 font-medium"
          style={{ color: hasHeroImage ? 'rgba(255,255,255,0.9)' : settings.primary_color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Kami Mengundang Anda
        </motion.p>

        <motion.h1
          className="font-script text-name-lg mb-4 drop-shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {settings.bride_name} & {settings.groom_name}
        </motion.h1>

        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="w-12 h-px" style={{ backgroundColor: hasHeroImage ? 'rgba(255,255,255,0.5)' : `${settings.primary_color}60` }} />
          <span className="text-body-lg font-elegant tracking-wide font-medium">
            {new Date(settings.wedding_date).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <div className="w-12 h-px" style={{ backgroundColor: hasHeroImage ? 'rgba(255,255,255,0.5)' : `${settings.primary_color}60` }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          {/* ✅ Sekarang isDark menerima boolean murni */}
          <Countdown weddingDate={settings.wedding_date} isDark={hasHeroImage} />
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <AddToCalendar
            title={`Pernikahan ${settings.bride_name} & ${settings.groom_name}`}
            startDate={settings.wedding_date}
            location={settings.reception_location || settings.akad_location}
            primaryColor={settings.primary_color}
          />
        </motion.div>
      </div>

      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        style={{ color: hasHeroImage ? 'rgba(255,255,255,0.7)' : settings.primary_color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-caption uppercase tracking-[0.3em] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.button>
    </section>
  )
}
