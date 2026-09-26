import { getEventById, isPastEvent, isFullEvent } from './events'

export type RegistrationStatus = 'confirmed' | 'cancelled'

export interface Registration {
  id: string
  eventId: string
  studentId: string
  status: RegistrationStatus
  registeredAt: string // ISO date string
}

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-01',
    eventId: 'evt-01',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-09-10T10:15:00',
  },
  {
    id: 'reg-02',
    eventId: 'evt-04',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-08-20T09:00:00',
  },
  {
    id: 'reg-03',
    eventId: 'evt-09',
    studentId: 'stu-1',
    status: 'confirmed',
    registeredAt: '2026-09-12T18:40:00',
  },
]

export const registrations: Registration[] = INITIAL_REGISTRATIONS.map((r) => ({ ...r }))

export function resetRegistrations(): void {
  registrations.length = 0
  INITIAL_REGISTRATIONS.forEach((r) => registrations.push({ ...r }))
}

/** Simple lookup used by the registrations views. */
export function getRegistrationsForStudent(studentId: string): Registration[] {
  return registrations.filter((reg) => reg.studentId === studentId)
}

/** Returns only confirmed, non-cancelled registrations for a student. */
export function getActiveRegistrationsForStudent(
  studentId: string,
): Registration[] {
  return registrations.filter(
    (registration) =>
      registration.studentId === studentId &&
      registration.status === 'confirmed',
  )
}

/** Checks whether a student currently holds an active registration for an event. */
export function hasActiveRegistration(
  studentId: string,
  eventId: string,
): boolean {
  return registrations.some(
    (registration) =>
      registration.studentId === studentId &&
      registration.eventId === eventId &&
      registration.status === 'confirmed',
  )
}

/**
 * Registers a student for an event, enforcing login, event state, capacity, and duplicate checks.
 */
export function createRegistration(
  studentId: string,
  eventId: string,
): Registration {
  if (!studentId || !studentId.trim()) {
    throw new Error('UNAUTHORIZED')
  }

  const event = getEventById(eventId)
  if (!event) {
    throw new Error('EVENT_NOT_FOUND')
  }

  if (event.cancelled) {
    throw new Error('EVENT_CANCELLED')
  }

  if (isPastEvent(event)) {
    throw new Error('EVENT_PAST')
  }

  if (hasActiveRegistration(studentId, eventId)) {
    throw new Error('ALREADY_REGISTERED')
  }

  if (isFullEvent(event) || event.seatsAvailable <= 0) {
    throw new Error('EVENT_FULL')
  }

  // Decrement seat count
  event.seatsAvailable -= 1

  const newReg: Registration = {
    id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventId,
    studentId,
    status: 'confirmed',
    registeredAt: new Date().toISOString(),
  }

  registrations.push(newReg)
  return newReg
}

/**
 * Cancels an existing registration and frees a seat on the event up to maximum capacity.
 */
export function cancelRegistration(
  registrationId: string,
  studentId: string,
): Registration {
  const registration = registrations.find((r) => r.id === registrationId)
  if (!registration) {
    throw new Error('REGISTRATION_NOT_FOUND')
  }

  if (registration.studentId !== studentId) {
    throw new Error('FORBIDDEN')
  }

  if (registration.status === 'cancelled') {
    return registration
  }

  registration.status = 'cancelled'

  const event = getEventById(registration.eventId)
  if (event) {
    event.seatsAvailable = Math.min(
      event.capacity,
      event.seatsAvailable + 1,
    )
  }

  return registration
}
