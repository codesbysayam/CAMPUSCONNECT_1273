import { describe, it, expect } from 'vitest'
import {
  getCurrentISTDate,
  getISTDateKey,
  isTodayIST,
  formatISTDate,
} from '@/lib/date-utils'

describe('IST Date Utilities', () => {
  it('returns valid numeric year, month, and day for current IST date', () => {
    const ist = getCurrentISTDate()
    expect(ist.year).toBeGreaterThanOrEqual(2026)
    expect(ist.month).toBeGreaterThanOrEqual(1)
    expect(ist.month).toBeLessThanOrEqual(12)
    expect(ist.day).toBeGreaterThanOrEqual(1)
    expect(ist.day).toBeLessThanOrEqual(31)
  })

  it('formats dates consistently in YYYY-MM-DD for IST timezone', () => {
    const key = getISTDateKey(new Date('2026-09-28T10:00:00Z'))
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('correctly matches today key', () => {
    const todayKey = getISTDateKey()
    expect(isTodayIST(todayKey)).toBe(true)
    expect(isTodayIST('2020-01-01')).toBe(false)
  })

  it('formats IST date strings for display', () => {
    const formatted = formatISTDate('2026-10-04T18:00:00')
    expect(formatted).toContain('2026')
    expect(formatted).toContain('Oct')
  })
})
