export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  const [hours, minutes] = timeStr.split(':')
  return `${hours}:${minutes} WIB`
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

// ✨ HELPER BARU: Cek apakah string memiliki value
export function hasValue(str?: string | null): boolean {
  return Boolean(str && str.trim().length > 0)
}

/**
 * Parse datetime-local input (local time) ke ISO string (UTC)
 * @param localStr Format "YYYY-MM-DDTHH:MM" (local browser time)
 * @returns ISO string UTC
 */
export function localToISO(localStr: string): string {
  if (!localStr) return ''
  // new Date("YYYY-MM-DDTHH:MM") otomatis interpretasi sebagai local time
  const date = new Date(localStr)
  return date.toISOString()
}

/**
 * ISO string (UTC) ke datetime-local format (local time)
 * @param isoStr ISO string dari database
 * @returns Format "YYYY-MM-DDTHH:MM" untuk input value
 */
export function isoToLocal(isoStr: string): string {
  if (!isoStr) return ''

  const date = new Date(isoStr)

  // Cek valid
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Format tanggal untuk countdown (aman untuk berbagai format)
 */
export function parseDateForCountdown(dateStr: string): Date | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
}

/**
 * Format tanggal dengan timezone spesifik (untuk acara)
 */
export function formatDateWithTimezone(
  isoString: string,
  timezone: string = 'Asia/Jakarta',
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!isoString) return ''

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ''

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }

  return date.toLocaleDateString('id-ID', defaultOptions)
}

/**
 * Format jam dengan timezone spesifik
 */
export function formatTimeWithTimezone(
  isoString: string,
  timezone: string = 'Asia/Jakarta'
): string {
  if (!isoString) return ''

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ''

  return date.toLocaleTimeString('id-ID', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  })
}