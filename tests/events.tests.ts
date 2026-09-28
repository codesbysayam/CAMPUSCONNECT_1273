import { describe, it, expect } from 'vitest'
import { events, isPastEvent } from '@/data/events'

describe('isPastEvent', () => {
  it('marks an event with a date before TODAY as past', () => {
    // evt-04 is dated 2026-09-05; TODAY (seeded) is 2026-09-16
    const pastEvent = events.find((e) => e.id === 'evt-04')!
    expect(isPastEvent(pastEvent)).toBe(true)
  })
})
