'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownProps {
  weddingDate: string
  isDark?: boolean
}

export function Countdown({ weddingDate, isDark = true }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(weddingDate).getTime() - Date.now()
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }
    calculate()
    const timer = setInterval(calculate, 1000)
    return () => clearInterval(timer)
  }, [weddingDate])

  const units = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-2.5 md:gap-4 justify-center">
      {units.map((unit, index) => (
        <motion.div
          key={unit.label}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
        >
          {isDark && (
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
          )}
          
          <div
            className={`relative rounded-2xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] text-center shadow-xl border ${
              isDark 
                ? 'glass-effect border-white/20' 
                : 'bg-white border-gray-100'
            }`}
          >
            <motion.span
              key={unit.value}
              className={`block font-display text-3xl md:text-4xl font-bold tabular-nums ${
                isDark ? 'text-white' : 'text-[#3D342B]'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.span>
            <span
              className={`block text-caption uppercase tracking-[0.15em] mt-1 font-medium ${
                isDark ? 'text-white/80' : 'text-[#6B5B5B]/70'
              }`}
            >
              {unit.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}