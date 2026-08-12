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

// Truncate yang AMAN untuk emoji (tidak memotong surrogate pair)
function truncateSafely(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str

  // Gunakan Intl.Segmenter jika tersedia (modern browsers/Node)
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new Intl.Segmenter('id', { granularity: 'grapheme' })
      const segments = Array.from(segmenter.segment(str))
      let result = ''
      for (const seg of segments) {
        if ((result + seg.segment).length > maxLength) break
        result += seg.segment
      }
      return result
    } catch {
      // Fallback ke cara manual
    }
  }

  // Fallback: slice tapi jangan potong surrogate pair (emoji)
  let sliced = str.slice(0, maxLength)
  const lastCharCode = sliced.charCodeAt(sliced.length - 1)
  // Jika karakter terakhir adalah high surrogate (emoji), hapus
  if (lastCharCode >= 0xD800 && lastCharCode <= 0xDBFF) {
    sliced = sliced.slice(0, -1)
  }
  return sliced
}

async function fetchSettings() {
  try {
    const { data, error } = await supabase
      .from('wedding_settings')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('[metadata] Fetch settings error:', error.message)
      return null
    }

    if (!data) {
      console.warn('[metadata] Settings data is empty')
      return null
    }

    return data
  } catch (err: any) {
    console.error('[metadata] Exception:', err.message)
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

  // ====== FALLBACK jika settings tidak ada ======
  if (!settings) {
    console.warn('[metadata] Using fallback - settings not found')
    return {
      title: 'Undangan Pernikahan Digital 💍',
      description: 'Anda diundang untuk merayakan pernikahan kami',
      openGraph: {
        title: 'Undangan Pernikahan Digital 💍',
        description: 'Anda diundang untuk merayakan pernikahan kami',
        locale: 'id_ID',
        type: 'website',
      },
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
    primary_color,
    meta_title,
    meta_description,
    meta_image_url,
  } = settings

  // ====== TITLE ======
  const autoTitle = `Undangan Pernikahan ${bride_name} & ${groom_name} 💍`
  const rawTitle = meta_title?.trim() || autoTitle
  const title = truncateSafely(sanitizeText(rawTitle), 60)

  // ====== DESCRIPTION ======
  const dateStr = formatDate(wedding_date)
  const autoDescription = `Kami mengundang Anda untuk merayakan pernikahan ${bride_fullname} & ${groom_fullname}${dateStr ? ` pada ${dateStr}` : ''
    }. Kehadiran Anda adalah kehormatan bagi kami.`
  const rawDescription = meta_description?.trim() || autoDescription
  const description = truncateSafely(sanitizeText(rawDescription), 160)

  // ====== IMAGE ======
  const ogImage =
    sanitizeUrl(meta_image_url) ||
    sanitizeUrl(hero_image_url) ||
    sanitizeUrl(cover_background_url) ||
    undefined

  const url = code ? `${baseUrl}/u/${code}` : baseUrl

  // ====== BUILD METADATA ======
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