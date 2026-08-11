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