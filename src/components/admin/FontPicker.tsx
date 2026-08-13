'use client'

import { motion } from 'framer-motion'
import { Check, Type } from 'lucide-react'
import { useState } from 'react'
import { FONT_PRESETS, FONT_CATEGORIES } from '@/lib/fonts'
import { FontLoader } from '@/components/FontLoader'

interface FontPickerProps {
  currentPreset: string
  onSelect: (presetId: string) => void
}

export function FontPicker({ currentPreset, onSelect }: FontPickerProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [previewFont, setPreviewFont] = useState<string | null>(null)

  const filteredFonts = activeCategory === 'all'
    ? FONT_PRESETS
    : FONT_PRESETS.filter((f) => f.category === activeCategory)

  return (
    <div className="space-y-4">
      {/* ✅ Load font yang sedang di-preview */}
      {previewFont && <FontLoader presetId={previewFont} />}
      
      {/* ✅ Load font current untuk preview */}
      <FontLoader presetId={currentPreset} />

      <div className="flex items-center gap-2 text-[#6B5B5B]">
        <Type size={18} className="text-[#C9A96E]" />
        <p className="text-body-sm">
          Pilih kombinasi font ({FONT_PRESETS.length} pilihan)
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {FONT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-[#C9A96E] to-[#DCAE96] text-white shadow-md'
                : 'bg-white/60 text-[#6B5B5B] border border-[#C9A96E]/20 hover:bg-[#C9A96E]/5'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredFonts.map((font, index) => {
          const isCurrent = currentPreset === font.id

          return (
            <motion.button
              key={font.id}
              onClick={() => onSelect(font.id)}
              onMouseEnter={() => setPreviewFont(font.id)}
              onMouseLeave={() => setPreviewFont(null)}
              className={`relative rounded-2xl p-5 border-2 text-left transition-all duration-300 ${
                isCurrent
                  ? 'border-[#C9A96E] bg-[#C9A96E]/5 shadow-lg shadow-[#C9A96E]/20'
                  : 'border-[#C9A96E]/10 hover:border-[#C9A96E]/40 hover:shadow-md bg-white/50'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isCurrent && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C9A96E] rounded-full flex items-center justify-center shadow-md">
                  <Check size={14} className="text-white" />
                </div>
              )}

              <div className="mb-3 pb-3 border-b border-[#C9A96E]/10">
                <p
                  className="text-3xl mb-1"
                  style={{
                    fontFamily: `'${font.script}', ${font.scriptFallback}`,
                    color: '#C9A96E',
                  }}
                >
                  {font.preview}
                </p>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: `'${font.body}', ${font.bodyFallback}`,
                    color: '#6B5B5B',
                  }}
                >
                  The Wedding of Aurelia & Arjuna
                </p>
              </div>

              <h4 className="font-display text-sm font-semibold text-[#3D342B] mb-1">
                {font.name}
              </h4>
              <p className="text-caption text-[#6B5B5B]/60">
                {font.description}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
