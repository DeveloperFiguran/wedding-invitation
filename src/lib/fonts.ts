export interface FontPreset {
  id: string
  name: string
  description: string
  font_script: string   // Nama pengantin
  font_display: string  // Judul section
  font_elegant: string  // Quote & teks formal
  font_body: string     // Body & UI
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'classic-elegance',
    name: 'Classic Elegance',
    description: 'Klasik, mewah, dan timeless. Pilihan paling aman dan elegan.',
    font_script: 'Great Vibes',
    font_display: 'Marcellus',
    font_elegant: 'Cormorant Garamond',
    font_body: 'Jost',
  },
  {
    id: 'romantic-bloom',
    name: 'Romantic Bloom',
    description: 'Romantis dan lembut. Cocok untuk garden & feminine wedding.',
    font_script: 'Allura',
    font_display: 'Playfair Display',
    font_elegant: 'Lora',
    font_body: 'Montserrat',
  },
  {
    id: 'royal-luxe',
    name: 'Royal Luxe',
    description: 'Megah dan bold. Cocok untuk ballroom & luxury wedding.',
    font_script: 'Pinyon Script',
    font_display: 'Cinzel',
    font_elegant: 'Cormorant Garamond',
    font_body: 'Inter',
  },
  {
    id: 'vintage-charm',
    name: 'Vintage Charm',
    description: 'Vintage dan artistik. Penuh karakter dan berkisah.',
    font_script: 'Alex Brush',
    font_display: 'Italiana',
    font_elegant: 'EB Garamond',
    font_body: 'Karla',
  },
  {
    id: 'modern-grace',
    name: 'Modern Grace',
    description: 'Kontemporer dan ringan. Bersih, minimalis, modern.',
    font_script: 'Tangerine',
    font_display: 'Tenor Sans',
    font_elegant: 'Lora',
    font_body: 'Nunito Sans',
  },
]

export function getFontPresetById(id: string): FontPreset | undefined {
  return FONT_PRESETS.find((f) => f.id === id)
}

// Helper: hasilkan CSS variables untuk diterapkan di wrapper
export function getFontVariables(presetId?: string): React.CSSProperties {
  const preset = getFontPresetById(presetId || 'classic-elegance') || FONT_PRESETS[0]
  const q = (f: string) => `'${f}'`
  return {
    '--font-script': q(preset.font_script),
    '--font-display': q(preset.font_display),
    '--font-elegant': q(preset.font_elegant),
    '--font-body': q(preset.font_body),
  } as React.CSSProperties
}