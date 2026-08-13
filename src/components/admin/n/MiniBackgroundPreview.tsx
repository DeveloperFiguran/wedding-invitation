'use client'

import { ElegantBackground } from '@/components/invitation/ElegantBackground'

interface MiniBackgroundPreviewProps {
  styleId: string
  primaryColor?: string
  accentColor?: string
  backgroundColor?: string
}

export function MiniBackgroundPreview({
  styleId,
  primaryColor = '#B8935A',
  accentColor = '#D4A574',
  backgroundColor = '#FBF8F3',
}: MiniBackgroundPreviewProps) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-black/5">
      <ElegantBackground
        primaryColor={primaryColor}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        variant="section"
        style={styleId}
      />
      {/* Overlay untuk visibility */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-2xl font-script"
          style={{
            fontFamily: "'Great Vibes', cursive",
            color: primaryColor,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          A & B
        </span>
      </div>
    </div>
  )
}
