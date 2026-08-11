'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Heart, Calendar, Images, Gift, MessageCircleHeart } from 'lucide-react'

interface SectionNavProps {
  primaryColor: string
  enableGallery: boolean
}

export function SectionNav({ primaryColor, enableGallery }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState('home')

  const sections = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'couple', label: 'Couple', icon: Heart },
    { id: 'events', label: 'Acara', icon: Calendar },
    ...(enableGallery ? [{ id: 'gallery', label: 'Gallery', icon: Images }] : []),
    { id: 'gift', label: 'Hadiah', icon: Gift },
    { id: 'rsvp', label: 'RSVP', icon: MessageCircleHeart },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3
      
      sections.forEach((section) => {
        const el = document.getElementById(section.id)
        if (el) {
          const { offsetTop, offsetHeight } = el
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section.id)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 md:hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', damping: 20 }}
    >
      <div className="glass-effect rounded-full shadow-2xl px-2 py-2 flex items-center gap-1 border border-white/30">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="relative flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                  layoutId="navActive"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? 'text-white' : ''
                }`}
                style={!isActive ? { color: primaryColor } : {}}
              />
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}