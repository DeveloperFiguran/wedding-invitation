'use client'

import { BACKGROUND_STYLES, BackgroundStyle } from '@/lib/backgrounds'
import { Check } from 'lucide-react'
import { toast } from 'sonner'

interface BackgroundStylePickerProps {
  currentStyle: string
  onSelect: (styleId: string) => void
}

export function BackgroundStylePicker({ currentStyle, onSelect }: BackgroundStylePickerProps) {
  const handleSelect = (style: BackgroundStyle) => {
    onSelect(style.id)
    toast.success(`Background "${style.name}" dipilih!`)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {BACKGROUND_STYLES.map((style) => {
        const active = currentStyle === style.id
        return (
          <button
            key={style.id}
            onClick={() => handleSelect(style)}
            className={`group text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-lg bg-white overflow-hidden relative ${
              active
                ? 'border-[#C9A96E] shadow-md'
                : 'border-[#C9A96E]/10 hover:border-[#C9A96E]/50'
            }`}
          >
            {active && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#C9A96E] flex items-center justify-center z-10">
                <Check size={14} className="text-white" />
              </div>
            )}

            {/* Mini preview */}
            <div className="h-24 relative overflow-hidden bg-gradient-to-br from-[#FBF8F3] to-[#F7E7CE]">
              <StylePreview preview={style.preview} />
            </div>

            <div className="p-3">
              <h4 className="font-display text-sm text-[#6B5B5B] mb-1">{style.name}</h4>
              <p className="text-caption text-[#6B5B5B]/60 leading-snug line-clamp-2">{style.description}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* Preview mini untuk setiap style */
function StylePreview({ preview }: { preview: string }) {
  switch (preview) {
    case 'botanical':
      return (
        <svg className="absolute bottom-0 right-0 w-20 h-20 opacity-40" viewBox="0 0 80 80" fill="none">
          <path d="M10 70 Q30 60 45 40 Q55 25 70 15" stroke="#B8935A" strokeWidth="1.5" />
          <ellipse cx="30" cy="55" rx="8" ry="3" transform="rotate(-30 30 55)" fill="#B8935A" />
          <ellipse cx="45" cy="40" rx="7" ry="3" transform="rotate(-35 45 40)" fill="#B8935A" />
          <circle cx="65" cy="18" r="5" fill="#D4A574" />
        </svg>
      )
    case 'damask':
      return (
        <>
          <div className="absolute inset-3 border-2 border-[#B8935A]/40 rounded" />
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <pattern id="prev-damask" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M12 4 C15 7 16 10 12 13 C8 10 9 7 12 4 Z" fill="#B8935A" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#prev-damask)" />
          </svg>
        </>
      )
    case 'celestial':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2b221c] to-[#1d1713]">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${(i * 31) % 100}%`, top: `${(i * 47) % 100}%`, opacity: 0.6 }}
            />
          ))}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-[#D4A574]/60" />
        </div>
      )
    case 'artdeco':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 60" fill="none">
          <path d="M0 0 L100 60" stroke="#B8935A" strokeWidth="0.8" />
          <path d="M0 0 L80 60" stroke="#B8935A" strokeWidth="0.6" />
          <path d="M0 0 L100 45" stroke="#B8935A" strokeWidth="0.6" />
          <circle cx="12" cy="12" r="3" fill="#D4A574" />
          <rect x="60" y="20" width="20" height="20" transform="rotate(45 70 30)" stroke="#B8935A" strokeWidth="0.8" />
        </svg>
      )
    case 'glow':
      return (
        <>
          <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-[#B8935A]/20 blur-xl" />
          <div className="absolute bottom-2 right-2 w-20 h-20 rounded-full bg-[#D4A574]/25 blur-xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-[#B8935A]/20" />
        </>
      )
    case 'floral':
      return (
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-50" viewBox="0 0 80 80" fill="none">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse key={angle} cx="40" cy="25" rx="8" ry="15" fill="#D4A574" transform={`rotate(${angle} 40 40)`} />
          ))}
          <circle cx="40" cy="40" r="6" fill="#B8935A" />
        </svg>
      )
    default:
      return null
  }
}