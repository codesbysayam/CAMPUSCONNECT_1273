import { describe, it, expect, beforeEach } from 'vitest'
import {
  registrations,
  getRegistrationsForStudent,
  getActiveRegistrationsForStudent,
  hasActiveRegistration,
  createRegistration,
  cancelRegistration,
  resetRegistrations,
} from '@/data/registrations'
import { getEventById, resetEvents } from '@/data/events'

describe('getRegistrationsForStudent', () => {
  beforeEach(() => {
    resetEvents()
    resetRegistrations()
  })

  it('returns only the seeded registrations belonging to that student', () => {
    const mine = getRegistrationsForStudent('stu-1')
    expect(mine.length).toBe(3)
    expect(mine.every((reg) => reg.studentId === 'stu-1')).toBe(true)
  })

  it('returns active registrations for a student', () => {
    const active = getActiveRegistrationsForStudent('stu-1')
    expect(active.length).toBe(3)
    expect(active.every((reg) => reg.status === 'confirmed')).toBe(true)
  })

  it('checks active registration correctly', () => {
    expect(hasActiveRegistration('stu-1', 'evt-01')).toBe(true)
    expect(hasActiveRegistration('stu-1', 'evt-06')).toBe(false)
  })
})

describe('registration flow', () => {
  beforeEach(() => {
    resetEvents()
    resetRegistrations()
  })

  it('creates a registration and decrements seatsAvailable', () => {
    const event = getEventById('evt-06')!
    const beforeSeats = event.seatsAvailable

    const registration = createRegistration('stu-1', 'evt-06')

    expect(registration.status).toBe('confirmed')
    expect(registration.eventId).toBe('evt-06')
    expect(registration.studentId).toBe('stu-1')
    expect(event.seatsAvailable).toBe(beforeSeats - 1)
  })

  it('rejects duplicate registration', () => {
    expect(() => createRegistration('stu-1', 'evt-01')).toThrow(
      'ALREADY_REGISTERED',
    )
  })

  it('rejects registration for full events', () => {
    // evt-02 is full (seatsAvailable = 0)
    expect(() => createRegistration('stu-1', 'evt-02')).toThrow('EVENT_FULL')
  })

  it('rejects registration for past events', () => {
    // evt-04 is dated 2026-09-05 (before TODAY)
    expect(() => createRegistration('stu-1', 'evt-04')).toThrow('EVENT_PAST')
  })

  it('cancelling frees a seat and updates status', () => {
    const event = getEventById('evt-06')!
    const registration = createRegistration('stu-1', 'evt-06')
    const beforeSeats = event.seatsAvailable

    const cancelled = cancelRegistration(registration.id, 'stu-1')

    expect(cancelled.status).toBe('cancelled')
    expect(event.seatsAvailable).toBe(beforeSeats + 1)
  })

  it('prevents another student from cancelling someone else registration', () => {
    expect(() => cancelRegistration('reg-01', 'stu-2')).toThrow('FORBIDDEN')
  })

  it('allows registering again after cancellation', () => {
    const event = getEventById('evt-06')!
    const registration = createRegistration('stu-1', 'evt-06')
    cancelRegistration(registration.id, 'stu-1')

    // Now re-register
    const newReg = createRegistration('stu-1', 'evt-06')
    expect(newReg.status).toBe('confirmed')
  })
})
