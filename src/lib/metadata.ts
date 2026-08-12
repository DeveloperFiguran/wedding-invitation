import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { sanitizeText, sanitizeUrl } from '@/lib/validation'

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

async function fetchSettings() {
  try {
    const { data, error } = await supabase
      .from('wedding_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) return null
    return data
  } catch {
    return null
  }
}

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return ''
  }
}

export async function buildInvitationMetadata(
  code?: string
): Promise<Metadata> {
  const settings = await fetchSettings()
  const baseUrl = getBaseUrl()

  if (!settings) {
    return {
      title: 'Undangan Pernikahan Digital',
      description: 'Anda diundang untuk merayakan pernikahan kami',
    }
  }

  const {
    bride_name,
    groom_name,
    bride_fullname,
    groom_fullname,
    wedding_date,
    hero_image_url,
    cover_background_url,
    wedding_hashtag,
    quote,
    primary_color,
    // Custom meta dari admin
    meta_title,
    meta_description,
    meta_image_url,
  } = settings

  // ====== TITLE ======
  // Prioritas: custom meta_title > auto-generate
  const autoTitle = `Undangan Pernikahan ${bride_name} & ${groom_name} 💍`
  const title = meta_title?.trim() || autoTitle

  // ====== DESCRIPTION ======
  // Prioritas: custom meta_description > quote > auto-generate
  const dateStr = formatDate(wedding_date)
  const autoDescription =`Kami mengundang Anda untuk merayakan pernikahan ${bride_fullname} & ${groom_fullname}${dateStr ? ` pada ${dateStr}` : ''
    }. Kehadiran Anda adalah kehormatan bagi kami.`
  const description = meta_description?.trim() || autoDescription

  // ====== IMAGE ======
  // Prioritas: custom meta_image_url > hero > cover
  const ogImage =
    sanitizeUrl(meta_image_url) ||
    sanitizeUrl(hero_image_url) ||
    sanitizeUrl(cover_background_url) ||
    undefined

  const url = code ? `${baseUrl}/u/${code}` : baseUrl

  // ====== SANITASI untuk keamanan ======
  const safeTitle = sanitizeText(title).slice(0, 60)
  const safeDescription = sanitizeText(description).slice(0, 160)

  const metadata: Metadata = {
    title: safeTitle,
    description: safeDescription,
    keywords: [
      'undangan pernikahan',
      'wedding invitation',
      bride_name,
      groom_name,
      wedding_hashtag?.replace('#', '') || 'wedding',
    ].filter(Boolean),
    authors: [{ name: `${bride_name} & ${groom_name}` }],
    creator: `${bride_name} & ${groom_name}`,
    alternates: {
      canonical: url,
    },
    icons: ogImage
      ? {
        icon: [{ url: ogImage, type: 'image/jpeg' }],
        apple: [{ url: ogImage, type: 'image/jpeg' }],
      }
      : undefined,
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url,
      siteName: `The Wedding of ${bride_name} & ${groom_name}`,
      images: ogImage
        ? [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `Pernikahan ${bride_name} & ${groom_name}`,
            type: 'image/jpeg',
          },
        ]
        : undefined,
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: safeTitle,
      description: safeDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    themeColor: primary_color || '#B8935A',
    robots: {
      index: true,
      follow: true,
    },
  }

  return metadata
}

export function buildAdminMetadata(pageTitle?: string): Metadata {
  const title = pageTitle
    ? `${pageTitle} | Admin Panel`
    : 'Admin Panel | Wedding Invitation'

  return {
    title,
    description: 'Panel administrasi undangan pernikahan digital',
    robots: { index: false, follow: false },
    themeColor: '#FBF8F3',
  }
}