import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { sanitizeText, sanitizeUrl } from '@/lib/validation'
import { DEFAULT_SETTINGS, mergeWithDefaults } from '@/lib/default-settings'

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

    // Jika error atau data kosong, gunakan default
    if (error || !data) {
      console.warn('[metadata] Using default settings')
      return DEFAULT_SETTINGS
    }

    // Merge dengan default untuk field yang kosong
    return mergeWithDefaults(data)
  } catch (err: any) {
    console.error('[metadata] Exception:', err.message)
    return DEFAULT_SETTINGS
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

  const {
    bride_name,
    groom_name,
    bride_fullname,
    groom_fullname,
    wedding_date,
    hero_image_url,
    cover_background_url,
    wedding_hashtag,
    primary_color,
    meta_title,
    meta_description,
    meta_image_url,
  } = settings

  // Title dengan default fallback
  const autoTitle = `Undangan Pernikahan ${bride_name} & ${groom_name} 💍`
  const rawTitle = meta_title?.trim() || autoTitle
  const title = rawTitle.slice(0, 60)

  // Description dengan default fallback
  const dateStr = formatDate(wedding_date)
  const autoDescription = `Kami mengundang Anda untuk merayakan pernikahan ${bride_fullname} & ${groom_fullname}${dateStr ? ` pada ${dateStr}` : ''
    }. Kehadiran Anda adalah kehormatan bagi kami.`
  const rawDescription = meta_description?.trim() || autoDescription
  const description = rawDescription.slice(0, 160)

  // Image dengan fallback
  const ogImage =
    sanitizeUrl(meta_image_url) ||
    sanitizeUrl(hero_image_url) ||
    sanitizeUrl(cover_background_url) ||
    undefined

  const url = code ? `${baseUrl}/u/${code}` : baseUrl

  return {
    title,
    description,
    keywords: [
      'undangan pernikahan',
      'wedding invitation',
      bride_name,
      groom_name,
      wedding_hashtag?.replace('#', '') || 'wedding',
    ].filter(Boolean),
    authors: [{ name: `${bride_name} & ${groom_name}` }],
    creator: `${bride_name} & ${groom_name}`,
    alternates: { canonical: url },
    icons: ogImage
      ? {
        icon: [{ url: ogImage, type: 'image/jpeg' }],
        apple: [{ url: ogImage, type: 'image/jpeg' }],
      }
      : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: `The Wedding of ${bride_name} & ${groom_name}`,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title, type: 'image/jpeg' }]
        : undefined,
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    themeColor: primary_color || '#B8935A',
    robots: { index: true, follow: true },
  }
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