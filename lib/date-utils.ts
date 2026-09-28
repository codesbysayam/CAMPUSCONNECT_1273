/**
 * Campus Connect Date Utilities
 * Handles timezone conversion and runtime date calculations for Asia/Kolkata (IST).
 */

export function getCurrentISTDate(): {
  year: number
  month: number
  day: number
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date())

  const result: Record<string, number> = {}

  for (const part of parts) {
    if (
      part.type === 'year' ||
      part.type === 'month' ||
      part.type === 'day'
    ) {
      result[part.type] = Number(part.value)
    }
  }

  return {
    year: result.year,
    month: result.month,
    day: result.day,
  }
}

export function getISTDateKey(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)

  const map: Record<string, string> = {}

  for (const part of parts) {
    if (
      part.type === 'year' ||
      part.type === 'month' ||
      part.type === 'day'
    ) {
      map[part.type] = part.value
    }
  }

  return `${map.year}-${map.month}-${map.day}`
}

export function isTodayIST(dateKey: string): boolean {
  return dateKey === getISTDateKey()
}

export function formatISTDate(
  dateInput: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date)
}
