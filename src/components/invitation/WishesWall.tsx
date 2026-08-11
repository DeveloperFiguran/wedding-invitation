'use client'

import { motion, useInView } from 'framer-motion'
import { Guest } from '@/types/database'
import { MessageCircleHeart } from 'lucide-react'
import { useRef } from 'react'

interface WishesWallProps {
  wishes: Guest[]
  primaryColor: string
  textColor: string
  backgroundColor: string
}

export function WishesWall({ wishes, primaryColor, textColor, backgroundColor }: WishesWallProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const validWishes = wishes.filter((w) => w.wish && w.wish.trim().length > 0)
  if (validWishes.length === 0) return null

  const row1 = validWishes.slice(0, Math.ceil(validWishes.length / 2))
  const row2 = validWishes.slice(Math.ceil(validWishes.length / 2))

  const WishCard = ({ wish }: { wish: Guest }) => (
    <div
      className="flex-shrink-0 w-64 md:w-72 p-5 rounded-2xl bg-white shadow-sm border mr-4"
      style={{ borderColor: `${primaryColor}20` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}AA)` }}
        >
          {wish.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h4 className="font-elegant font-semibold text-sm truncate" style={{ color: textColor }}>
            {wish.name}
          </h4>
          {wish.rsvp_status && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: wish.rsvp_status === 'hadir' ? `${primaryColor}15` : '#fee',
                color: wish.rsvp_status === 'hadir' ? primaryColor : '#c00',
              }}
            >
              {wish.rsvp_status === 'hadir' ? '✓ Hadir' : '✗ Tidak Hadir'}
            </span>
          )}
        </div>
      </div>
      <p className="font-elegant text-sm italic leading-relaxed line-clamp-3" style={{ color: textColor, opacity: 0.85 }}>
        "{wish.wish}"
      </p>
    </div>
  )

  return (
    <section
      ref={ref}
      className="py-20 overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="px-5 max-w-2xl mx-auto mb-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: primaryColor }}>
            Love Notes
          </p>
          <h2 className="font-display text-3xl md:text-4xl mb-4" style={{ color: textColor }}>
            Ucapan & Doa
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: primaryColor }} />
            <MessageCircleHeart size={18} style={{ color: primaryColor }} />
            <div className="w-12 h-px" style={{ backgroundColor: primaryColor }} />
          </div>
          <p className="mt-4 text-sm" style={{ color: textColor, opacity: 0.6 }}>
            {validWishes.length} ucapan penuh cinta dari para tamu
          </p>
        </motion.div>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${backgroundColor}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${backgroundColor}, transparent)` }} />
        
        <div className="flex marquee-scroll">
          {[...row1, ...row1].map((wish, index) => (
            <WishCard key={`row1-${wish.id}-${index}`} wish={wish} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (reverse direction) */}
      {row2.length > 0 && (
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${backgroundColor}, transparent)` }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${backgroundColor}, transparent)` }} />
          
          <div className="flex marquee-scroll-reverse">
            {[...row2, ...row2].map((wish, index) => (
              <WishCard key={`row2-${wish.id}-${index}`} wish={wish} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}