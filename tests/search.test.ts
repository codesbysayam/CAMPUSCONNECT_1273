import { describe, it, expect } from 'vitest'
import { events, searchEventsByName } from '@/data/events'

// PARTICIPANT TASK (Task 1 — Event Listing):
// searchEventsByName is currently a stub in data/events.ts that returns
// the list unchanged, so this test is intentionally RED. Implement a
// case-insensitive, partial match on `event.name` to make it pass.
// Do not edit this test file.
describe('searchEventsByName', () => {
  it('finds an event by a case-insensitive partial name match', () => {
    const results = searchEventsByName(events, 'hack')
    expect(results.length).toBe(1)
    expect(results[0].id).toBe('evt-01')
  })
})
