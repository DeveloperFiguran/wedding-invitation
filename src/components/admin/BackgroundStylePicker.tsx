'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { useState } from 'react'

export interface BackgroundStylePreset {
  id: string
  name: string
  description: string
  icon: string
  category: 'nature' | 'geometric' | 'texture' | 'artistic' | 'minimal' | 'cultural' | 'abstract'
}

export const BACKGROUND_STYLES: BackgroundStylePreset[] = [
  // ====== NATURE (6) ======
  { id: 'botanical', name: 'Botanical', description: 'Daun & floral natural', icon: '🌿', category: 'nature' },
  { id: 'floral-garden', name: 'Floral Garden', description: 'Bunga taman mekar', icon: '🌸', category: 'nature' },
  { id: 'tropical-leaves', name: 'Tropical Leaves', description: 'Daun tropis lebat', icon: '🍃', category: 'nature' },
  { id: 'cloud-sky', name: 'Cloud Sky', description: 'Awan langit lembut', icon: '☁️', category: 'nature' },
  { id: 'ocean-waves', name: 'Ocean Waves', description: 'Ombak laut tenang', icon: '🌊', category: 'nature' },
  { id: 'starry-night', name: 'Starry Night', description: 'Bintang malam romantis', icon: '✨', category: 'nature' },

  // ====== GEOMETRIC (5) ======
  { id: 'geometric', name: 'Geometric', description: 'Pola geometris modern', icon: '◇', category: 'geometric' },
  { id: 'art-deco', name: 'Art Deco', description: 'Art deco klasik 1920an', icon: '⬖', category: 'geometric' },
  { id: 'hexagon-grid', name: 'Hexagon Grid', description: 'Grid heksagon futuristik', icon: '⬡', category: 'geometric' },
  { id: 'triangle-mosaic', name: 'Triangle Mosaic', description: 'Mosaik segitiga dinamis', icon: '△', category: 'geometric' },
  { id: 'circular-ripple', name: 'Circular Ripple', description: 'Lingkaran riak konsisten', icon: '◉', category: 'geometric' },

  // ====== TEXTURE (6) ======
  { id: 'marble', name: 'Marble', description: 'Tekstur marmer elegan', icon: '⬜', category: 'texture' },
  { id: 'rustic-wood', name: 'Rustic Wood', description: 'Kayu rustic alami', icon: '🪵', category: 'texture' },
  { id: 'kraft-paper', name: 'Kraft Paper', description: 'Kertas kraft vintage', icon: '📜', category: 'texture' },
  { id: 'silk-fabric', name: 'Silk Fabric', description: 'Sutra halus berkilau', icon: '🎀', category: 'texture' },
  { id: 'linen-weave', name: 'Linen Weave', description: 'Anyaman linen natural', icon: '🧵', category: 'texture' },
  { id: 'concrete-stone', name: 'Concrete Stone', description: 'Beton industrial modern', icon: '🪨', category: 'texture' },

  // ====== ARTISTIC (5) ======
  { id: 'watercolor', name: 'Watercolor', description: 'Cat air lembut', icon: '🎨', category: 'artistic' },
  { id: 'ink-brush', name: 'Ink Brush', description: 'Kuas tinta ekspresif', icon: '🖌️', category: 'artistic' },
  { id: 'oil-painting', name: 'Oil Painting', description: 'Lukisan minyak klasik', icon: '🖼️', category: 'artistic' },
  { id: 'sketch-line', name: 'Sketch Line', description: 'Sketsa garis tangan', icon: '✏️', category: 'artistic' },
  { id: 'abstract-splash', name: 'Abstract Splash', description: 'Splash abstrak warna', icon: '💫', category: 'artistic' },

  // ====== MINIMAL (3) ======
  { id: 'minimalist', name: 'Minimalist', description: 'Bersih & sederhana', icon: '◻', category: 'minimal' },
  { id: 'dot-pattern', name: 'Dot Pattern', description: 'Titik-titik halus', icon: '⠿', category: 'minimal' },
  { id: 'line-grid', name: 'Line Grid', description: 'Grid garis tipis', icon: '▦', category: 'minimal' },

  // ====== CULTURAL (4) ======
  { id: 'ornate', name: 'Ornate', description: 'Ornamen klasik mewah', icon: '❦', category: 'cultural' },
  { id: 'baroque', name: 'Baroque', description: 'Baroque megah Eropa', icon: '🏛️', category: 'cultural' },
  { id: 'arabesque', name: 'Arabesque', description: 'Arabesque timur tengah', icon: '🕌', category: 'cultural' },
  { id: 'batik-indonesia', name: 'Batik Indonesia', description: 'Batik tradisional Indonesia', icon: '🇮🇩', category: 'cultural' },

  // ====== ABSTRACT (3) ======
  { id: 'gradient-mesh', name: 'Gradient Mesh', description: 'Gradien modern lembut', icon: '🌈', category: 'abstract' },
  { id: 'aurora-glow', name: 'Aurora Glow', description: 'Aurora bercahaya magis', icon: '🌌', category: 'abstract' },
  { id: 'bokeh-lights', name: 'Bokeh Lights', description: 'Bokeh cahaya romantis', icon: '💡', category: 'abstract' },
]

export const BACKGROUND_CATEGORIES = [
  { id: 'all', name: 'Semua' },
  { id: 'nature', name: 'Nature' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'texture', name: 'Texture' },
  { id: 'artistic', name: 'Artistic' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'abstract', name: 'Abstract' },
]

interface BackgroundStylePickerProps {
  currentStyle: string
  onSelect: (styleId: string) => void
}

export function BackgroundStylePicker({ currentStyle, onSelect }: BackgroundStylePickerProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredStyles = activeCategory === 'all'
    ? BACKGROUND_STYLES
    : BACKGROUND_STYLES.filter((s) => s.category === activeCategory)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[#6B5B5B]">
        <Sparkles size={18} className="text-[#C9A96E]" />
        <p className="text-body-sm">
          Pilih gaya background ({BACKGROUND_STYLES.length} pilihan)
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {BACKGROUND_CATEGORIES.map((cat) => (
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredStyles.map((style, index) => {
          const isCurrent = currentStyle === style.id

          return (
            <motion.button
              key={style.id}
              onClick={() => onSelect(style.id)}
              className={`relative rounded-2xl p-4 border-2 text-left transition-all duration-300 ${
                isCurrent
                  ? 'border-[#C9A96E] bg-[#C9A96E]/5 shadow-lg shadow-[#C9A96E]/20'
                  : 'border-[#C9A96E]/10 hover:border-[#C9A96E]/40 hover:shadow-md bg-white/50'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isCurrent && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C9A96E] rounded-full flex items-center justify-center shadow-md">
                  <Check size={14} className="text-white" />
                </div>
              )}

              <div className="text-3xl mb-2">{style.icon}</div>

              <h4 className="font-display text-sm font-semibold text-[#3D342B] mb-1">
                {style.name}
              </h4>
              <p className="text-caption text-[#6B5B5B]/60">
                {style.description}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
