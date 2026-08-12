'use client'

interface ElegantBackgroundProps {
  primaryColor: string
  accentColor: string
  backgroundColor: string
  variant?: 'cover' | 'section' | 'arch'
  style?: string
}

export function ElegantBackground({
  primaryColor,
  accentColor,
  backgroundColor,
  variant = 'section',
  style = 'botanical',
}: ElegantBackgroundProps) {
  const isCover = variant === 'cover'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - selalu terang mengikuti tema */}
      <BaseGradient
        primaryColor={primaryColor}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        isCover={isCover}
      />

      {/* Decoration sesuai style */}
      {style === 'botanical' && (
        <BotanicalStyle primaryColor={primaryColor} accentColor={accentColor} isCover={isCover} />
      )}
      {style === 'damask' && (
        <DamaskStyle primaryColor={primaryColor} accentColor={accentColor} isCover={isCover} />
      )}
      {style === 'celestial' && (
        <CelestialStyle primaryColor={primaryColor} accentColor={accentColor} isCover={isCover} />
      )}
      {style === 'artdeco' && (
        <ArtDecoStyle primaryColor={primaryColor} accentColor={accentColor} isCover={isCover} />
      )}
      {style === 'glow' && (
        <GlowStyle primaryColor={primaryColor} accentColor={accentColor} isCover={isCover} />
      )}
      {style === 'floral' && (
        <FloralStyle primaryColor={primaryColor} accentColor={accentColor} isCover={isCover} />
      )}

      {/* Arch overlay */}
      {variant === 'arch' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[320px] h-[440px] md:w-[400px] md:h-[520px] rounded-t-full border-2 relative"
            style={{ borderColor: `${primaryColor}40` }}
          >
            <div
              className="absolute inset-3 rounded-t-full border"
              style={{ borderColor: `${accentColor}35` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================
   BASE GRADIENT - Terang mengikuti tema
   ============================================ */
function BaseGradient({
  primaryColor,
  accentColor,
  backgroundColor,
  isCover,
}: {
  primaryColor: string
  accentColor: string
  backgroundColor: string
  isCover: boolean
}) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: isCover
          ? `
            radial-gradient(ellipse 90% 60% at 20% 0%, ${primaryColor}28 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 85% 100%, ${accentColor}26 0%, transparent 55%),
            radial-gradient(ellipse 100% 80% at 50% 50%, ${primaryColor}10 0%, transparent 70%),
            ${backgroundColor}
          `
          : `
            radial-gradient(ellipse 80% 50% at 15% 0%, ${primaryColor}14 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 90% 100%, ${accentColor}12 0%, transparent 55%),
            ${backgroundColor}
          `,
      }}
    />
  )
}

/* ============================================
   STYLE 1: BOTANICAL GARDEN
   ============================================ */
function BotanicalStyle({
  primaryColor,
  accentColor,
  isCover,
}: {
  primaryColor: string
  accentColor: string
  isCover: boolean
}) {
  const branchColor = `${primaryColor}${isCover ? '45' : '30'}`
  const flowerColor = `${accentColor}${isCover ? '60' : '45'}`

  return (
    <>
      <BotanicalBranch position="top-left" color={branchColor} accent={flowerColor} />
      <BotanicalBranch position="bottom-right" color={branchColor} accent={flowerColor} />

      <div
        className="absolute top-1/4 -left-24 w-72 h-72 rounded-full border animate-float-slow"
        style={{ borderColor: `${primaryColor}20` }}
      />
      <div
        className="absolute bottom-1/4 -right-20 w-56 h-56 rounded-full border animate-float-slow"
        style={{ borderColor: `${accentColor}25`, animationDelay: '2s' }}
      />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${primaryColor}${isCover ? '20' : '12'} 0%, transparent 70%)` }}
      />
    </>
  )
}

function BotanicalBranch({
  position,
  color,
  accent,
}: {
  position: 'top-left' | 'bottom-right'
  color: string
  accent: string
}) {
  const isTopLeft = position === 'top-left'
  return (
    <svg
      className={`absolute w-48 h-48 md:w-72 md:h-72 ${isTopLeft ? 'top-0 left-0' : 'bottom-0 right-0 rotate-180'}`}
      viewBox="0 0 200 200"
      fill="none"
      preserveAspectRatio="xMinYMin meet"
    >
      <path d="M-10 60 Q40 70 70 40 Q90 22 110 18" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M0 110 Q50 100 90 70 Q120 50 150 48" stroke={color} strokeWidth="1.2" fill="none" />
      <g fill={color}>
        <ellipse cx="40" cy="62" rx="14" ry="5" transform="rotate(-25 40 62)" />
        <ellipse cx="58" cy="48" rx="13" ry="5" transform="rotate(-35 58 48)" />
        <ellipse cx="76" cy="34" rx="12" ry="4.5" transform="rotate(-42 76 34)" />
        <ellipse cx="30" cy="75" rx="12" ry="4.5" transform="rotate(-15 30 75)" />
      </g>
      <g fill={color} opacity="0.8">
        <ellipse cx="60" cy="98" rx="14" ry="5" transform="rotate(-18 60 98)" />
        <ellipse cx="85" cy="82" rx="13" ry="5" transform="rotate(-28 85 82)" />
        <ellipse cx="110" cy="64" rx="12" ry="4.5" transform="rotate(-35 110 64)" />
        <ellipse cx="130" cy="54" rx="11" ry="4" transform="rotate(-40 130 54)" />
      </g>
      <g transform="translate(105, 22)">
        <circle cx="0" cy="-9" r="7" fill={accent} />
        <circle cx="8.5" cy="-2.8" r="7" fill={accent} />
        <circle cx="5.3" cy="7.3" r="7" fill={accent} />
        <circle cx="-5.3" cy="7.3" r="7" fill={accent} />
        <circle cx="-8.5" cy="-2.8" r="7" fill={accent} />
        <circle cx="0" cy="0" r="4.5" fill={color} />
      </g>
      <g transform="translate(148, 50) scale(0.6)">
        <circle cx="0" cy="-9" r="7" fill={accent} opacity="0.8" />
        <circle cx="8.5" cy="-2.8" r="7" fill={accent} opacity="0.8" />
        <circle cx="5.3" cy="7.3" r="7" fill={accent} opacity="0.8" />
        <circle cx="-5.3" cy="7.3" r="7" fill={accent} opacity="0.8" />
        <circle cx="-8.5" cy="-2.8" r="7" fill={accent} opacity="0.8" />
        <circle cx="0" cy="0" r="4.5" fill={color} />
      </g>
      <circle cx="95" cy="30" r="2.5" fill={accent} />
      <circle cx="125" cy="60" r="2" fill={accent} />
      <circle cx="70" cy="88" r="2" fill={accent} opacity="0.7" />
      <circle cx="140" cy="70" r="1.8" fill={accent} opacity="0.6" />
    </svg>
  )
}

/* ============================================
   STYLE 2: ROYAL DAMASK
   ============================================ */
function DamaskStyle({
  primaryColor,
  accentColor,
  isCover,
}: {
  primaryColor: string
  accentColor: string
  isCover: boolean
}) {
  const patternColor = `${primaryColor}${isCover ? '20' : '14'}`
  const frameColor = `${primaryColor}${isCover ? '45' : '35'}`

  return (
    <>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: isCover ? 0.5 : 0.4 }}>
        <defs>
          <pattern id="damask-full" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 15 C50 25 55 35 40 45 C25 35 30 25 40 15 Z" fill={patternColor} />
            <path d="M40 65 C50 55 55 45 40 35 C25 45 30 55 40 65 Z" fill={patternColor} />
            <circle cx="15" cy="40" r="2" fill={patternColor} />
            <circle cx="65" cy="40" r="2" fill={patternColor} />
            <circle cx="40" cy="40" r="3" fill={patternColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#damask-full)" />
      </svg>

      <div className="absolute inset-4 md:inset-8 border-2 rounded-lg" style={{ borderColor: frameColor }} />
      <div className="absolute inset-6 md:inset-10 border rounded-lg" style={{ borderColor: `${accentColor}30` }} />

      <CornerFlourish position="top-left" color={frameColor} />
      <CornerFlourish position="top-right" color={frameColor} />
      <CornerFlourish position="bottom-left" color={frameColor} />
      <CornerFlourish position="bottom-right" color={frameColor} />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)` }}
      />
    </>
  )
}

function CornerFlourish({
  position,
  color,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  color: string
}) {
  const positions = {
    'top-left': 'top-8 left-8 md:top-14 md:left-14',
    'top-right': 'top-8 right-8 md:top-14 md:right-14 rotate-90',
    'bottom-right': 'bottom-8 right-8 md:bottom-14 md:right-14 rotate-180',
    'bottom-left': 'bottom-8 left-8 md:bottom-14 md:left-14 -rotate-90',
  }

  return (
    <svg className={`absolute w-16 h-16 md:w-20 md:h-20 ${positions[position]}`} viewBox="0 0 80 80" fill="none">
      <path d="M10 10 Q30 10 35 30 Q40 50 60 55" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M10 10 Q10 30 30 35" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="10" cy="10" r="3" fill={color} />
      <circle cx="35" cy="30" r="2" fill={color} />
      <circle cx="60" cy="55" r="2.5" fill={color} />
    </svg>
  )
}

/* ============================================
   STYLE 3: CELESTIAL (bintang emas di bg terang)
   ============================================ */
function CelestialStyle({
  primaryColor,
  accentColor,
  isCover,
}: {
  primaryColor: string
  accentColor: string
  isCover: boolean
}) {
  const starColor = `${primaryColor}${isCover ? '70' : '55'}`

  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: ((i * 37) % 100),
    y: ((i * 53) % 100),
    size: (i % 3) + 1.5,
    opacity: 0.3 + ((i % 5) * 0.12),
  }))

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse-soft"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: starColor,
            opacity: star.opacity,
            animationDelay: `${star.id * 0.2}s`,
          }}
        />
      ))}

      <div
        className="absolute top-16 right-12 w-32 h-32 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${accentColor}35 0%, transparent 70%)` }}
      />
      <div
        className="absolute top-20 right-16 w-20 h-20 rounded-full border"
        style={{ borderColor: `${accentColor}40` }}
      />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 70%)` }}
      />
    </>
  )
}

/* ============================================
   STYLE 4: ART DECO
   ============================================ */
function ArtDecoStyle({
  primaryColor,
  accentColor,
  isCover,
}: {
  primaryColor: string
  accentColor: string
  isCover: boolean
}) {
  const lineColor = `${primaryColor}${isCover ? '40' : '28'}`
  const accentLine = `${accentColor}${isCover ? '55' : '40'}`

  return (
    <>
      <DecoFan position="top-left" color={lineColor} accent={accentLine} />
      <DecoFan position="bottom-right" color={lineColor} accent={accentLine} />

      <div className="absolute top-0 bottom-0 left-8 w-px hidden md:block" style={{ backgroundColor: lineColor }} />
      <div className="absolute top-0 bottom-0 right-8 w-px hidden md:block" style={{ backgroundColor: lineColor }} />

      <svg className="absolute top-1/4 left-1/2 -translate-x-1/2 w-40 h-40" style={{ opacity: 0.6 }} viewBox="0 0 100 100" fill="none">
        <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" stroke={accentLine} strokeWidth="1" />
        <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" stroke={lineColor} strokeWidth="1" />
        <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" stroke={lineColor} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="3" fill={accentLine} />
      </svg>

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 70%)` }}
      />
    </>
  )
}

function DecoFan({
  position,
  color,
  accent,
}: {
  position: 'top-left' | 'bottom-right'
  color: string
  accent: string
}) {
  const isTopLeft = position === 'top-left'
  return (
    <svg
      className={`absolute w-40 h-40 md:w-56 md:h-56 ${isTopLeft ? 'top-0 left-0' : 'bottom-0 right-0 rotate-180'}`}
      viewBox="0 0 160 160"
      fill="none"
    >
      <path d="M0 0 L160 160" stroke={color} strokeWidth="1" />
      <path d="M0 0 L130 160" stroke={color} strokeWidth="0.8" />
      <path d="M0 0 L100 160" stroke={color} strokeWidth="0.8" />
      <path d="M0 0 L70 160" stroke={color} strokeWidth="0.8" />
      <path d="M0 0 L160 130" stroke={color} strokeWidth="0.8" />
      <path d="M0 0 L160 100" stroke={color} strokeWidth="0.8" />
      <path d="M0 0 L160 70" stroke={color} strokeWidth="0.8" />
      <path d="M0 0 Q80 20 110 110" stroke={accent} strokeWidth="1" fill="none" />
      <path d="M0 0 Q50 30 70 70" stroke={accent} strokeWidth="0.8" fill="none" />
      <circle cx="20" cy="20" r="4" fill={accent} />
      <circle cx="20" cy="20" r="8" stroke={accent} strokeWidth="1" fill="none" />
    </svg>
  )
}

/* ============================================
   STYLE 5: MINIMALIST GLOW
   ============================================ */
function GlowStyle({
  primaryColor,
  accentColor,
  isCover,
}: {
  primaryColor: string
  accentColor: string
  isCover: boolean
}) {
  return (
    <>
      <div
        className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl animate-float-slow"
        style={{ background: `${primaryColor}${isCover ? '30' : '20'}` }}
      />
      <div
        className="absolute bottom-32 right-8 w-72 h-72 rounded-full blur-3xl animate-float-slow"
        style={{ background: `${accentColor}${isCover ? '28' : '18'}`, animationDelay: '3s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
        style={{ background: `${primaryColor}12` }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border animate-float-slow"
        style={{ borderColor: `${primaryColor}15` }}
      />
    </>
  )
}

/* ============================================
   STYLE 6: FLORAL ROMANCE
   ============================================ */
function FloralStyle({
  primaryColor,
  accentColor,
  isCover,
}: {
  primaryColor: string
  accentColor: string
  isCover: boolean
}) {
  const petalColor = `${primaryColor}${isCover ? '30' : '22'}`
  const centerColor = `${accentColor}${isCover ? '50' : '40'}`

  return (
    <>
      <LargeFlower position="top-left" petal={petalColor} center={centerColor} size={200} />
      <LargeFlower position="bottom-right" petal={petalColor} center={centerColor} size={180} />
      <LargeFlower position="top-right" petal={petalColor} center={centerColor} size={120} />
      <LargeFlower position="bottom-left" petal={petalColor} center={centerColor} size={100} />

      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)` }}
      />
    </>
  )
}

function LargeFlower({
  position,
  petal,
  center,
  size,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  petal: string
  center: string
  size: number
}) {
  const positions = {
    'top-left': 'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
    'top-right': 'top-0 right-0 translate-x-1/4 -translate-y-1/4',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
    'bottom-right': 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
  }

  return (
    <svg
      className={`absolute ${positions[position]}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx="50"
          cy="28"
          rx="11"
          ry="20"
          fill={petal}
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      {[22, 67, 112, 157, 202, 247, 292, 337].map((angle) => (
        <ellipse
          key={angle}
          cx="50"
          cy="35"
          rx="7"
          ry="13"
          fill={petal}
          opacity="0.7"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="9" fill={center} />
      <circle cx="50" cy="50" r="5" fill={petal} />
    </svg>
  )
}