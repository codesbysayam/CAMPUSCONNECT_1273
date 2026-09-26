import { describe, it, expect, beforeEach } from 'vitest'
import {
  events,
  isPastEvent,
  filterEventsByCategory,
  searchEventsByName,
  getUpcomingEvents,
  sortEventsByDate,
  sortEventsByPopularity,
  validateEventInput,
  createEvent,
  updateEvent,
  cancelEvent,
  resetEvents,
} from '@/data/events'

describe('isPastEvent', () => {
  it('marks an event with a date before TODAY as past', () => {
    // evt-10 is dated 2026-09-01; TODAY (seeded) is 2026-09-16
    const pastEvent = events.find((e) => e.id === 'evt-10')!
    expect(isPastEvent(pastEvent)).toBe(true)
  })
})

describe('event listing', () => {
  beforeEach(() => {
    resetEvents()
  })

  it('searches case-insensitively', () => {
    const result = searchEventsByName(events, 'HACK')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('evt-01')
  })

  it('supports partial search', () => {
    const result = searchEventsByName(events, 'camp')
    expect(result.some((event) => event.id === 'evt-01')).toBe(true)
  })

  it('filters by category', () => {
    const result = filterEventsByCategory(events, 'Tech')
    expect(result.every((event) => event.category === 'Tech')).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('supports All category', () => {
    expect(filterEventsByCategory(events, 'All')).toEqual(events)
  })

  it('hides past and cancelled events', () => {
    const result = getUpcomingEvents(events)
    expect(result.every((event) => !event.cancelled)).toBe(true)
    expect(result.every((event) => !isPastEvent(event))).toBe(true)
  })

  it('sorts events by date chronologically', () => {
    const sorted = sortEventsByDate(events)
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(new Date(sorted[i].date).getTime()).toBeLessThanOrEqual(
        new Date(sorted[i + 1].date).getTime(),
      )
    }
  })

  it('sorts events by popularity', () => {
    const sorted = sortEventsByPopularity(events)
    expect(sorted.length).toBe(events.length)
  })
})

describe('organizer event management', () => {
  beforeEach(() => {
    resetEvents()
  })

  it('validates event input', () => {
    const errors = validateEventInput({
      name: '',
      description: '',
      date: 'invalid',
      venue: '',
      category: 'Tech',
      capacity: -5,
    })

    expect(errors).toContain('Event name is required.')
    expect(errors).toContain('Venue is required.')
    expect(errors).toContain('Description is required.')
    expect(errors).toContain('Event date must be in the future.')
    expect(errors).toContain('Capacity must be a positive whole number.')
  })

  it('creates an event successfully', () => {
    const futureDate = new Date(Date.now() + 86400000 * 10).toISOString()
    const newEvent = createEvent(
      {
        name: 'Autonomous Driving Workshop',
        description: 'Deep dive into robotics algorithms.',
        date: futureDate,
        venue: 'Robotics Lab 3',
        category: 'Tech',
        capacity: 50,
      },
      'org-1',
    )

    expect(newEvent.id).toBeDefined()
    expect(newEvent.seatsAvailable).toBe(50)
    expect(events.some((e) => e.id === newEvent.id)).toBe(true)
  })

  it('updates an event and preserves registered seats correctly', () => {
    const event = events.find((e) => e.id === 'evt-01')!
    const registeredCount = event.capacity - event.seatsAvailable

    const futureDate = new Date(Date.now() + 86400000 * 15).toISOString()
    const updated = updateEvent('evt-01', 'org-1', {
      name: 'Hack the Campus 2026 — Expanded',
      description: event.description,
      date: futureDate,
      venue: event.venue,
      category: event.category,
      capacity: 150,
    })

    expect(updated.name).toBe('Hack the Campus 2026 — Expanded')
    expect(updated.capacity).toBe(150)
    expect(updated.seatsAvailable).toBe(150 - registeredCount)
  })

  it('rejects unauthorized update by different organizer', () => {
    const futureDate = new Date(Date.now() + 86400000 * 10).toISOString()
    expect(() =>
      updateEvent('evt-01', 'org-2', {
        name: 'Hacked',
        description: 'desc',
        date: futureDate,
        venue: 'venue',
        category: 'Tech',
        capacity: 100,
      }),
    ).toThrow('FORBIDDEN')
  })

  it('soft cancels an event', () => {
    const cancelled = cancelEvent('evt-01', 'org-1')
    expect(cancelled.cancelled).toBe(true)
  })
})
