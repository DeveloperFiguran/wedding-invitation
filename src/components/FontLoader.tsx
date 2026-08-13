'use client'

import { useEffect } from 'react'
import { getFontPresetById } from '@/lib/fonts'

interface FontLoaderProps {
  presetId: string
}

/**
 * Component untuk load Google Fonts secara dinamis.
 * Hanya load font yang aktif, tidak semua.
 */
export function FontLoader({ presetId }: FontLoaderProps) {
  useEffect(() => {
    if (!presetId) return

    const preset = getFontPresetById(presetId)
    if (!preset) return

    // Build font URL untuk preset ini saja
    const fontFamilies = [
      `${preset.script.replace(/ /g, '+')}:wght@400`,
      `${preset.display.replace(/ /g, '+')}:wght@400;500;600;700`,
      `${preset.elegant.replace(/ /g, '+')}:ital,wght@0,400;0,500;1,400`,
      `${preset.body.replace(/ /g, '+')}:wght@300;400;500;600`,
    ]

    const fontUrl = `https://fonts.googleapis.com/css2?${fontFamilies
      .map((f) => `family=${f}`)
      .join('&')}&display=swap`

    // Cek apakah sudah di-load
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`)
    if (existingLink) return

    // Buat link element
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontUrl
    link.setAttribute('data-font-preset', presetId)

    document.head.appendChild(link)

    // Cleanup saat unmount atau preset berubah
    return () => {
      const links = document.querySelectorAll(`link[data-font-preset="${presetId}"]`)
      links.forEach((l) => {
        // Hanya hapus jika tidak ada component lain yang pakai
        if (links.length === 1) {
          l.remove()
        }
      })
    }
  }, [presetId])

  return null // Component ini tidak render apa-apa
}
