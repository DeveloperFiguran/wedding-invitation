'use client'

import { motion } from 'framer-motion'
import { WeddingSettings } from '@/types/database'
import { Heart } from 'lucide-react'

interface ClosingProps {
  settings: WeddingSettings
}

export function Closing({ settings }: ClosingProps) {
  return (
    <section className="py-24 px-6 text-center" style={{ backgroundColor: settings.background_color }}>
      <motion.div
        className="max-w-lg mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Heart 
          className="mx-auto mb-6 animate-pulse-soft" 
          size={32} 
          fill={settings.accent_color}
          style={{ color: settings.accent_color }} 
        />
        
        {settings.closing_text && (
          <p className="font-elegant text-lg italic leading-relaxed mb-4" style={{ color: settings.text_color }}>
            {settings.closing_text}
          </p>
        )}

        <div>
          <p className="text-base" style={{ color: settings.text_color, opacity: 0.8 }}>
            Wassalamualaikum Wr. Wb.
          </p>
          <p className="text-base mt-1" style={{ color: settings.text_color, opacity: 0.8 }}>
            Kami yang berbahagia,
          </p>
          <p className="font-script text-4xl mt-6" style={{ color: settings.primary_color }}>
            {settings.bride_name} & {settings.groom_name}
          </p>
        </div>
      </motion.div>
    </section>
  )
}