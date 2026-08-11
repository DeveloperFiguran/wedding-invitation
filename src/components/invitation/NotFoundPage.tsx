'use client'

import { motion } from 'framer-motion'
import { Lock, Heart } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ivory to-champagne/20 px-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-20 h-20 rounded-full bg-soft-gold/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="text-soft-gold" size={32} />
        </div>

        <h1 className="font-display text-2xl text-warm-gray mb-3">
          Undangan Tidak Ditemukan
        </h1>
        
        <p className="text-sm text-warm-gray/70 leading-relaxed">
          Mohon maaf, undangan ini bersifat pribadi. Pastikan Anda mengakses 
          undangan dengan link yang benar.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <div className="w-12 h-px bg-soft-gold"></div>
          <Heart className="mx-3 text-dusty-rose" size={14} />
          <div className="w-12 h-px bg-soft-gold"></div>
        </div>
      </motion.div>
    </div>
  )
}