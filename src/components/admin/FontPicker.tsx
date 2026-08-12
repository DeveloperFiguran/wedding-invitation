'use client'

import { FONT_PRESETS, FontPreset } from '@/lib/fonts'
import { Check } from 'lucide-react'
import { toast } from 'sonner'

interface FontPickerProps {
  currentPreset: string
  onSelect: (presetId: string) => void
}

export function FontPicker({ currentPreset, onSelect }: FontPickerProps) {
  const handleSelect = (preset: FontPreset) => {
    onSelect(preset.id)
    toast.success(`Font "${preset.name}" dipilih!`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FONT_PRESETS.map((preset) => {
        const active = currentPreset === preset.id
        return (
          <button
            key={preset.id}
            onClick={() => handleSelect(preset)}
            className={`group text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg bg-white relative ${
              active
                ? 'border-[#C9A96E] shadow-md'
                : 'border-[#C9A96E]/10 hover:border-[#C9A96E]/50'
            }`}
          >
            {active && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#C9A96E] flex items-center justify-center z-10">
                <Check size={14} className="text-white" />
              </div>
            )}

            {/* Preview area */}
            <div className="mb-4 pb-4 border-b border-[#C9A96E]/10">
              <p
                className="text-3xl text-[#3D342B] mb-2 leading-tight"
                style={{ fontFamily: `'${preset.font_script}', cursive` }}
              >
                Wanita & Pria
              </p>
              <p
                className="text-xs text-[#6B5B5B] uppercase mb-1.5"
                style={{ fontFamily: `'${preset.font_display}', serif`, letterSpacing: '0.15em' }}
              >
                The Wedding Of
              </p>
              <p
                className="text-body-sm text-[#6B5B5B]/80 italic leading-snug"
                style={{ fontFamily: `'${preset.font_elegant}', serif` }}
              >
                "Dengan memohon rahmat dan ridho Allah SWT..."
              </p>
            </div>

            {/* Info */}
            <h4 className="font-display text-sm text-[#6B5B5B] mb-1">{preset.name}</h4>
            <p className="text-caption text-[#6B5B5B]/60 leading-snug mb-2">{preset.description}</p>

            {/* Font names */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A96E]/10 text-[#B8935A]">
                {preset.font_script}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A96E]/10 text-[#B8935A]">
                {preset.font_display}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A96E]/10 text-[#B8935A]">
                {preset.font_body}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}