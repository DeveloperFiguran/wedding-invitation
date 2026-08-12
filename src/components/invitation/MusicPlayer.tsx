'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, Music } from 'lucide-react'

interface MusicPlayerProps {
  musicUrl: string
  primaryColor: string
  accentColor?: string
}

export function MusicPlayer({ musicUrl, primaryColor, accentColor }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasInteractedRef = useRef(false)

  // ====== INISIALISASI AUDIO ======
  useEffect(() => {
    if (!musicUrl) return

    const audio = new Audio(musicUrl)
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio

    const handleCanPlay = () => {
      setIsLoaded(true)
    }

    const handleError = () => {
      console.error('Failed to load audio:', musicUrl)
    }

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)

    // Coba auto play saat load
    const tryAutoPlay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (err) {
        // Browser block autoplay - akan play saat user interaction
        setShowHint(true)
      }
    }

    // Delay sedikit agar audio siap
    const timer = setTimeout(() => {
      tryAutoPlay()
    }, 500)

    return () => {
      clearTimeout(timer)
      audio.pause()
      audio.src = ''
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audioRef.current = null
    }
  }, [musicUrl])

  // ====== LISTENER USER INTERACTION PERTAMA ======
  // Musik akan play saat user klik/tap di mana saja (termasuk tombol "Buka Undangan")
  useEffect(() => {
    if (!isLoaded || isPlaying || hasInteractedRef.current) return

    const handleFirstInteraction = () => {
      if (hasInteractedRef.current) return
      hasInteractedRef.current = true

      if (audioRef.current && !isPlaying) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
            setShowHint(false)
          })
          .catch((err) => {
            console.error('Play failed on interaction:', err)
          })
      }

      // Cleanup listeners
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction)
    window.addEventListener('touchstart', handleFirstInteraction)
    window.addEventListener('keydown', handleFirstInteraction)

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [isLoaded, isPlaying])

  // ====== TOGGLE PLAY/PAUSE ======
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Play failed:', err))
    }
  }

  // Jangan render jika belum siap
  if (!musicUrl || !isLoaded) return null

  return (
    <>
      {/* ====== HINT AUTOPLAY BLOCKED ====== */}
      <AnimatePresence>
        {showHint && !isPlaying && (
          <motion.div
            className="fixed bottom-24 right-6 z-[60] pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-[#C9A96E]/20">
              <p className="text-xs text-[#6B5B5B] flex items-center gap-2 whitespace-nowrap">
                <Music size={14} style={{ color: primaryColor }} />
                Klik untuk putar musik
              </p>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== MUSIC PLAYER BUTTON ====== */}
      <motion.button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-[60] group"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', damping: 15 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Pause musik' : 'Play musik'}
      >
        {/* Pulse ring saat playing */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: primaryColor }}
              animate={{
                scale: [1, 1.8],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: accentColor || primaryColor }}
              animate={{
                scale: [1, 1.8],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Main button */}
        <div
          className="relative w-14 h-14 rounded-full shadow-xl overflow-hidden border-2 border-white/30"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor || primaryColor})`,
          }}
        >
          {/* Spinning disc effect saat playing */}
          <motion.div
            className="absolute inset-0"
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              duration: 8,
              repeat: isPlaying ? Infinity : 0,
              ease: 'linear',
            }}
          >
            <div className="absolute inset-1.5 rounded-full border border-white/20" />
            <div className="absolute inset-3 rounded-full border border-white/15" />
            <div className="absolute inset-4.5 rounded-full border border-white/10" />
          </motion.div>

          {/* Center icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pause size={20} className="text-white" fill="currentColor" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating music notes saat playing */}
        <AnimatePresence>
          {isPlaying && (
            <>
              <motion.div
                className="absolute -top-2 -right-1 pointer-events-none"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -20],
                  x: [0, 5],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                <Music size={14} style={{ color: primaryColor }} />
              </motion.div>
              <motion.div
                className="absolute -top-1 -left-2 pointer-events-none"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -15],
                  x: [0, -5],
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
              >
                <Music size={12} style={{ color: accentColor || primaryColor }} />
              </motion.div>
              <motion.div
                className="absolute -top-3 left-3 pointer-events-none"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -18],
                  x: [0, 2],
                }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 1.5 }}
              >
                <Music size={10} style={{ color: primaryColor }} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}