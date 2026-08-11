'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Pause, Play } from 'lucide-react'

interface MusicPlayerProps {
  musicUrl: string
  primaryColor: string
}

export function MusicPlayer({ musicUrl, primaryColor }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {})
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      
      <motion.button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white safe-area-bottom"
        style={{ backgroundColor: primaryColor }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        {isPlaying && (
          <span 
            className="absolute inset-0 rounded-full border-2 animate-ping" 
            style={{ borderColor: primaryColor, opacity: 0.3 }}
          ></span>
        )}
      </motion.button>
    </>
  )
}