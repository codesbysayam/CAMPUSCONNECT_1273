import { getEventById, isPastEvent, isFullEvent, events, TODAY } from './events'

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
    throw new Error('You must be logged in')
  }

  const event = getEventById(eventId)
  if (!event) {
    throw new Error('Event not found')
  }

  if (event.cancelled) {
    throw new Error('EVENT_CANCELLED: This event has been cancelled')
  }

  if (isPastEvent(event) || new Date(event.date).getTime() < TODAY.getTime()) {
    throw new Error('EVENT_PAST: Registration is closed for this event')
  }

  if (hasActiveRegistration(studentId, eventId)) {
    throw new Error('ALREADY_REGISTERED: You are already registered for this event')
  }

  if (isFullEvent(event) || event.seatsAvailable <= 0) {
    throw new Error('EVENT_FULL: This event is full')
  }

  const newReg: Registration = {
    id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventId,
    studentId,
    status: 'confirmed',
    registeredAt: new Date().toISOString(),
  }

  registrations.push(newReg)

  // Update seats accurately from active registrations
  const activeCount = registrations.filter(
    (r) => r.eventId === event.id && r.status === 'confirmed',
  ).length
  event.seatsAvailable = Math.max(0, event.capacity - activeCount)

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
    throw new Error('Registration not found')
  }

  if (registration.studentId !== studentId) {
    throw new Error('FORBIDDEN: You cannot cancel this registration')
  }

  if (registration.status === 'cancelled') {
    throw new Error('ALREADY_CANCELLED: Registration is already cancelled')
  }

  registration.status = 'cancelled'

  const event = getEventById(registration.eventId)
  if (event) {
    const activeCount = registrations.filter(
      (r) => r.eventId === event.id && r.status === 'confirmed',
    ).length
    event.seatsAvailable = Math.max(0, event.capacity - activeCount)
  }

  return registration
}
