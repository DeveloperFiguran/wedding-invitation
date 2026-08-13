'use client'

import { useEffect } from 'react'
import { getFontPresetById } from '@/lib/fonts'

interface MultiFontLoaderProps {
  presetIds: string[]
}

/**
 * Load beberapa font presets sekaligus.
 * Dipakai untuk preview grid di admin.
 */
export function MultiFontLoader({ presetIds }: MultiFontLoaderProps) {
  useEffect(() => {
    if (!presetIds || presetIds.length === 0) return

    // Kumpulkan semua font families yang dibutuhkan
    const allFamilies = new Set<string>()

    presetIds.forEach((presetId) => {
      const preset = getFontPresetById(presetId)
      if (!preset) return

      allFamilies.add(`${preset.script.replace(/ /g, '+')}:wght@400`)
      allFamilies.add(`${preset.display.replace(/ /g, '+')}:wght@400;500;600;700`)
      allFamilies.add(`${preset.elegant.replace(/ /g, '+')}:ital,wght@0,400;0,500;1,400`)
      allFamilies.add(`${preset.body.replace(/ /g, '+')}:wght@300;400;500;600`)
    })

    if (allFamilies.size === 0) return

    const fontUrl = `https://fonts.googleapis.com/css2?${Array.from(allFamilies)
      .map((f) => `family=${f}`)
      .join('&')}&display=swap`

    // Cek apakah sudah di-load
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`)
    if (existingLink) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontUrl
    link.setAttribute('data-multi-font', presetIds.join(','))

    document.head.appendChild(link)

    return () => {
      // Tidak hapus saat unmount agar tetap cache
    }
  }, [presetIds.join(',')])

  return null
}
