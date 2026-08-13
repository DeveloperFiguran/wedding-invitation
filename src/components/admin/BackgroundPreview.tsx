'use client'

interface BackgroundPreviewProps {
  styleId: string
  primaryColor?: string
  accentColor?: string
  backgroundColor?: string
}

export function BackgroundPreview({
  styleId,
  primaryColor = '#B8935A',
  accentColor = '#D4A574',
  backgroundColor = '#FBF8F3',
}: BackgroundPreviewProps) {
  const renderPreview = () => {
    switch (styleId) {
      // ====== NATURE ======
      case 'botanical':
      case 'floral-garden':
      case 'tropical-leaves':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <path d="M10 80 Q30 50 20 20 Q45 45 60 15" stroke={primaryColor} strokeWidth="1" fill="none" opacity="0.6" />
            <ellipse cx="25" cy="30" rx="5" ry="12" fill={accentColor} opacity="0.4" transform="rotate(-30 25 30)" />
            <ellipse cx="45" cy="40" rx="5" ry="12" fill={accentColor} opacity="0.3" transform="rotate(-45 45 40)" />
            <ellipse cx="55" cy="25" rx="5" ry="12" fill={primaryColor} opacity="0.3" transform="rotate(-20 55 25)" />
            {styleId === 'floral-garden' && (
              <>
                <circle cx="80" cy="30" r="6" fill={accentColor} opacity="0.5" />
                <circle cx="80" cy="30" r="3" fill={primaryColor} opacity="0.6" />
                <circle cx="95" cy="55" r="5" fill={accentColor} opacity="0.4" />
                <circle cx="95" cy="55" r="2.5" fill={primaryColor} opacity="0.5" />
              </>
            )}
            {styleId === 'tropical-leaves' && (
              <>
                <path d="M70 70 Q90 50 85 25" stroke={primaryColor} strokeWidth="1.5" fill="none" opacity="0.5" />
                <path d="M85 60 Q100 45 95 30" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.4" />
              </>
            )}
          </svg>
        )

      case 'cloud-sky':
        return (
          <div className="w-full h-full" style={{
            background: `
              radial-gradient(ellipse at 30% 40%, ${accentColor}40 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, ${accentColor}30 0%, transparent 50%)
            `,
          }} />
        )

      case 'ocean-waves':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" preserveAspectRatio="none">
            <path d="M0 60 Q20 50 40 60 T80 60 T120 60 L120 90 L0 90 Z" fill={primaryColor} opacity="0.3" />
            <path d="M0 70 Q20 62 40 70 T80 70 T120 70 L120 90 L0 90 Z" fill={accentColor} opacity="0.25" />
          </svg>
        )

      case 'starry-night':
        return (
          <div className="w-full h-full" style={{
            background: `
              radial-gradient(circle at 20% 30%, ${primaryColor}60 1px, transparent 2px),
              radial-gradient(circle at 50% 20%, ${primaryColor}50 1.5px, transparent 2.5px),
              radial-gradient(circle at 80% 40%, ${primaryColor}60 1px, transparent 2px),
              radial-gradient(circle at 35% 70%, ${primaryColor}40 1px, transparent 2px),
              radial-gradient(circle at 65% 80%, ${primaryColor}50 1.5px, transparent 2.5px)
            `,
          }} />
        )

      // ====== GEOMETRIC ======
      case 'geometric':
        return (
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(30deg, ${primaryColor}30 12%, transparent 12.5%, transparent 87%, ${primaryColor}30 87.5%)`,
            backgroundSize: '30px 52px',
          }} />
        )

      case 'art-deco':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <path d="M20 70 L60 20 L100 70" stroke={primaryColor} strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M30 75 L60 35 L90 75" stroke={accentColor} strokeWidth="0.5" fill="none" opacity="0.5" />
            <circle cx="60" cy="20" r="3" fill={primaryColor} opacity="0.6" />
          </svg>
        )

      case 'hexagon-grid':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <path d="M30 20 L50 30 L50 50 L30 60 L10 50 L10 30 Z" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.5" />
            <path d="M70 35 L90 45 L90 65 L70 75 L50 65 L50 45 Z" stroke={accentColor} strokeWidth="0.8" fill="none" opacity="0.4" />
          </svg>
        )

      case 'triangle-mosaic':
        return (
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(60deg, ${primaryColor}25 25%, transparent 25.5%),
              linear-gradient(-60deg, ${accentColor}25 25%, transparent 25.5%)
            `,
            backgroundSize: '30px 52px',
          }} />
        )

      case 'circular-ripple':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <circle cx="60" cy="45" r="15" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.4" />
            <circle cx="60" cy="45" r="25" stroke={primaryColor} strokeWidth="0.6" fill="none" opacity="0.3" />
            <circle cx="60" cy="45" r="35" stroke={accentColor} strokeWidth="0.5" fill="none" opacity="0.25" />
          </svg>
        )

      // ====== TEXTURE ======
      case 'marble':
      case 'concrete-stone':
        return (
          <div className="w-full h-full" style={{
            background: `
              radial-gradient(ellipse at 30% 30%, ${primaryColor}25 0%, transparent 50%),
              radial-gradient(ellipse at 70% 70%, ${accentColor}25 0%, transparent 50%)
            `,
          }} />
        )

      case 'rustic-wood':
        return (
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 15px,
              ${primaryColor}15 15px,
              ${primaryColor}15 16px
            )`,
          }} />
        )

      case 'kraft-paper':
      case 'linen-weave':
        return (
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 3px,
              ${primaryColor}10 3px,
              ${primaryColor}10 4px
            )`,
          }} />
        )

      case 'silk-fabric':
        return (
          <div className="w-full h-full" style={{
            background: `linear-gradient(120deg, ${primaryColor}25 0%, transparent 30%, ${accentColor}25 60%, transparent 90%)`,
          }} />
        )

      // ====== ARTISTIC ======
      case 'watercolor':
      case 'oil-painting':
      case 'abstract-splash':
        return (
          <>
            <div className="absolute top-1 left-2 w-16 h-16 rounded-full blur-xl" style={{ backgroundColor: `${primaryColor}40` }} />
            <div className="absolute bottom-1 right-2 w-16 h-16 rounded-full blur-xl" style={{ backgroundColor: `${accentColor}35` }} />
          </>
        )

      case 'ink-brush':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <path d="M20 50 Q40 20 60 40 T100 50" stroke={primaryColor} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
          </svg>
        )

      case 'sketch-line':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <path d="M20 50 Q40 30 60 45 T100 40" stroke={primaryColor} strokeWidth="0.8" fill="none" strokeDasharray="3,2" opacity="0.5" />
            <circle cx="60" cy="45" r="15" stroke={primaryColor} strokeWidth="0.5" fill="none" strokeDasharray="2,2" opacity="0.4" />
          </svg>
        )

      // ====== MINIMAL ======
      case 'minimalist':
        return (
          <>
            <div className="absolute top-0 left-1/2 w-px h-6" style={{ backgroundColor: `${primaryColor}40` }} />
            <div className="absolute bottom-0 left-1/2 w-px h-6" style={{ backgroundColor: `${primaryColor}40` }} />
          </>
        )

      case 'dot-pattern':
        return (
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(${primaryColor}50 1px, transparent 1px)`,
            backgroundSize: '12px 12px',
          }} />
        )

      case 'line-grid':
        return (
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(${primaryColor}30 1px, transparent 1px),
              linear-gradient(90deg, ${primaryColor}30 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }} />
        )

      // ====== CULTURAL ======
      case 'ornate':
      case 'baroque':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <path d="M20 30 Q60 10 100 30" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.5" />
            <circle cx="60" cy="20" r="3" fill={primaryColor} opacity="0.5" />
            <circle cx="40" cy="25" r="1.5" fill={accentColor} opacity="0.5" />
            <circle cx="80" cy="25" r="1.5" fill={accentColor} opacity="0.5" />
            <path d="M20 60 Q60 80 100 60" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.5" />
          </svg>
        )

      case 'arabesque':
      case 'batik-indonesia':
        return (
          <svg className="w-full h-full" viewBox="0 0 120 90" fill="none">
            <path d="M30 45 L45 30 L60 45 L45 60 Z" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.5" />
            <path d="M60 45 L75 30 L90 45 L75 60 Z" stroke={primaryColor} strokeWidth="0.8" fill="none" opacity="0.4" />
            <circle cx="45" cy="45" r="4" stroke={accentColor} strokeWidth="0.5" fill="none" opacity="0.5" />
            <circle cx="75" cy="45" r="4" stroke={accentColor} strokeWidth="0.5" fill="none" opacity="0.4" />
          </svg>
        )

      // ====== ABSTRACT ======
      case 'gradient-mesh':
        return (
          <div className="w-full h-full" style={{
            background: `
              radial-gradient(at 0% 0%, ${primaryColor}35 0px, transparent 50%),
              radial-gradient(at 100% 100%, ${accentColor}30 0px, transparent 50%)
            `,
          }} />
        )

      case 'aurora-glow':
        return (
          <div className="w-full h-full" style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, ${primaryColor}40 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 80% 80%, ${accentColor}35 0%, transparent 60%)
            `,
          }} />
        )

      case 'bokeh-lights':
        return (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full blur-md"
                style={{
                  width: `${12 + (i % 3) * 8}px`,
                  height: `${12 + (i % 3) * 8}px`,
                  left: `${(i * 17) % 90}%`,
                  top: `${(i * 23) % 80}%`,
                  backgroundColor: i % 2 === 0 ? `${primaryColor}40` : `${accentColor}40`,
                }}
              />
            ))}
          </>
        )

      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl opacity-30">◻</span>
          </div>
        )
    }
  }

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-black/5"
      style={{ backgroundColor }}
    >
      {renderPreview()}
    </div>
  )
}
