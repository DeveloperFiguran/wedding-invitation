'use client'

import { THEME_PRESETS, ThemePreset } from '@/lib/themes'
import { Check } from 'lucide-react'
import { toast } from 'sonner'

interface ThemePickerProps {
  currentColors: {
    primary_color: string
    accent_color: string
    text_color: string
    background_color: string
  }
  onApply: (preset: ThemePreset) => void
}

export function ThemePicker({ currentColors, onApply }: ThemePickerProps) {
  const isActivePreset = (preset: ThemePreset) => {
    return (
      preset.primary_color.toLowerCase() === currentColors.primary_color.toLowerCase() &&
      preset.accent_color.toLowerCase() === currentColors.accent_color.toLowerCase() &&
      preset.text_color.toLowerCase() === currentColors.text_color.toLowerCase() &&
      preset.background_color.toLowerCase() === currentColors.background_color.toLowerCase()
    )
  }

  const handleApply = (preset: ThemePreset) => {
    onApply(preset)
    toast.success(`Tema "${preset.name}" diterapkan!`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {THEME_PRESETS.map((preset) => {
        const active = isActivePreset(preset)
        return (
          <button
            key={preset.id}
            onClick={() => handleApply(preset)}
            className={`group text-left p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg bg-white relative ${
              active
                ? 'border-[#C9A96E] shadow-md'
                : 'border-[#C9A96E]/10 hover:border-[#C9A96E]/50'
            }`}
          >
            {active && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#C9A96E] flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}

            <div className="flex gap-1.5 mb-3 h-12 rounded-xl overflow-hidden">
              <div className="flex-1" style={{ backgroundColor: preset.primary_color }} />
              <div className="flex-1" style={{ backgroundColor: preset.accent_color }} />
              <div className="flex-1" style={{ backgroundColor: preset.background_color }} />
            </div>

            <h4 className="font-display text-sm text-[#6B5B5B] mb-1">{preset.name}</h4>
            <p className="text-caption text-[#6B5B5B]/60 leading-snug">{preset.description}</p>
          </button>
        )
      })}
    </div>
  )
}