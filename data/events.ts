import { registrations } from './registrations'

export type EventCategory =
  | 'Tech'
  | 'Cultural'
  | 'Sports'
  | 'Workshop'
  | 'Career'
  | 'Music'

export interface CampusEvent {
  id: string
  name: string
  description: string
  date: string // ISO 8601 date string, e.g. "2026-10-02T17:00:00"
  venue: string
  category: EventCategory
  capacity: number
  seatsAvailable: number
  organizerId: string
  cancelled: boolean
}

// "Today" for the seed data. Events before this are considered past.
export const TODAY = new Date('2026-09-16T09:00:00')

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt-01',
    name: 'Hack the Campus 2026',
    description:
      'A 24-hour overnight hackathon open to all branches. Teams of up to 4 build anything that makes campus life better. Food, mentors, and a closing demo night included.',
    date: '2026-10-04T18:00:00',
    venue: 'Innovation Lab, Block C',
    category: 'Tech',
    capacity: 120,
    seatsAvailable: 37,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-02',
    name: 'Acoustic Nights: Open Mic',
    description:
      'Sign up to sing, play, or read poetry. No audition needed — just bring your nerves and your talent. Snacks provided by the Cultural Committee.',
    date: '2026-09-25T19:30:00',
    venue: 'Amphitheatre Lawn',
    category: 'Music',
    capacity: 80,
    seatsAvailable: 0,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-03',
    name: 'Resume & LinkedIn Clinic',
    description:
      'Drop-in session with alumni volunteers who will review your resume and LinkedIn profile in 15-minute slots. Walk-ins welcome, but seats are limited.',
    date: '2026-09-22T14:00:00',
    venue: 'Placement Cell, Admin Block',
    category: 'Career',
    capacity: 40,
    seatsAvailable: 12,
    organizerId: 'org-3',
    cancelled: false,
  },
  {
    id: 'evt-04',
    name: 'Inter-Hostel Football Cup — Final',
    description:
      "The championship match of this year's Inter-Hostel Football Cup. Come cheer your hostel on.",
    date: '2026-09-05T16:00:00',
    venue: 'Main Sports Ground',
    category: 'Sports',
    capacity: 300,
    seatsAvailable: 45,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-05',
    name: 'Intro to Figma Workshop',
    description:
      'A hands-on beginner workshop covering frames, components, and prototyping in Figma. Bring your own laptop.',
    date: '2026-10-10T15:00:00',
    venue: 'Design Studio, Block B',
    category: 'Workshop',
    capacity: 30,
    seatsAvailable: 6,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-06',
    name: 'Diwali Mela',
    description:
      'Stalls, rangoli competitions, and a fireworks-free light show to celebrate Diwali on campus. Open to students, faculty, and families.',
    date: '2026-11-01T17:00:00',
    venue: 'Central Quad',
    category: 'Cultural',
    capacity: 500,
    seatsAvailable: 500,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-07',
    name: 'Basketball 3x3 Street League',
    description:
      'A fast-paced 3x3 basketball league bringing together college teams for short-format competitive games, teamwork, and campus sportsmanship.',
    date: '2026-09-30T17:30:00',
    venue: 'Outdoor Basketball Courts',
    category: 'Sports',
    capacity: 64,
    seatsAvailable: 44,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-08',
    name: 'Full Stack Development Bootcamp',
    description:
      'A hands-on development bootcamp covering modern frontend development, APIs, databases, deployment, and practical project building.',
    date: '2026-10-03T10:00:00',
    venue: 'Innovation Lab, Block B',
    category: 'Tech',
    capacity: 80,
    seatsAvailable: 52,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-09',
    name: 'Campus Photography Walk',
    description:
      'A relaxed photography walk around campus where students can capture architecture, student life, nature, and everyday campus moments.',
    date: '2026-10-05T16:00:00',
    venue: 'Main Campus Gate',
    category: 'Cultural',
    capacity: 40,
    seatsAvailable: 24,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-10',
    name: 'Inter-Department Badminton Championship',
    description:
      'An inter-department badminton championship featuring singles and doubles matches across the university.',
    date: '2026-10-08T09:00:00',
    venue: 'Indoor Sports Complex',
    category: 'Sports',
    capacity: 48,
    seatsAvailable: 17,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-11',
    name: 'Classical Fusion Night',
    description:
      'The Music Society blends Carnatic and Hindustani classical forms with modern instruments in a one-night showcase.',
    date: '2026-10-25T19:00:00',
    venue: 'Amphitheatre Lawn',
    category: 'Music',
    capacity: 150,
    seatsAvailable: 150,
    organizerId: 'org-2',
    cancelled: false,
  },
  {
    id: 'evt-12',
    name: 'Data Structures Doubt-Clearing Marathon',
    description:
      'Pre-exam doubt-clearing session covering trees, heaps, and hashing, run by teaching assistants from the CS department.',
    date: '2026-08-28T11:00:00',
    venue: 'Lecture Hall 4',
    category: 'Tech',
    capacity: 90,
    seatsAvailable: 9,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-13',
    name: "Freshers' Orientation Games",
    description:
      'Icebreaker games and campus scavenger hunt for the incoming batch, hosted by the Student Council.',
    date: '2026-09-08T09:30:00',
    venue: 'Central Quad',
    category: 'Cultural',
    capacity: 250,
    seatsAvailable: 0,
    organizerId: 'org-4',
    cancelled: false,
  },
  {
    id: 'evt-14',
    name: 'Cloud & DevOps Study Group Kickoff',
    description:
      'First meetup of a semester-long study group covering AWS fundamentals and CI/CD pipelines. No prior cloud experience needed.',
    date: '2026-09-29T18:00:00',
    venue: 'Computer Science Lab 1',
    category: 'Workshop',
    capacity: 45,
    seatsAvailable: 45,
    organizerId: 'org-1',
    cancelled: false,
  },
  {
    id: 'evt-15',
    name: 'Badminton Doubles Tournament',
    description:
      'Open doubles tournament, singles-elimination bracket. Racquets available to borrow at the sports office.',
    date: '2026-10-12T08:00:00',
    venue: 'Indoor Sports Complex',
    category: 'Sports',
    capacity: 32,
    seatsAvailable: 14,
    organizerId: 'org-4',
    cancelled: false,
  },
]

export const events: CampusEvent[] = INITIAL_EVENTS.map((e) => ({ ...e }))

export function resetEvents(): void {
  events.length = 0
  INITIAL_EVENTS.forEach((e) => events.push({ ...e }))
}

/** True when the event's date has already passed relative to TODAY. */
export function isPastEvent(event: CampusEvent): boolean {
  return new Date(event.date).getTime() < TODAY.getTime()
}

/** True when there are no seats left. */
export function isFullEvent(event: CampusEvent): boolean {
  return event.seatsAvailable <= 0
}

/** Look up a single event by id, or undefined if it doesn't exist. */
export function getEventById(id: string): CampusEvent | undefined {
  return events.find((event) => event.id === id)
}

/**
 * Searches events by name using a case-insensitive, partial match.
 */
export function searchEventsByName(
  eventList: CampusEvent[],
  query: string,
): CampusEvent[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return eventList
  }

  return eventList.filter((event) =>
    event.name.toLowerCase().includes(normalizedQuery),
  )
}

/**
 * Filters events by exact category match, or returns all events when category is 'All'.
 */
export function filterEventsByCategory(
  eventList: CampusEvent[],
  category: EventCategory | 'All',
): CampusEvent[] {
  if (category === 'All') {
    return eventList
  }

  return eventList.filter((event) => event.category === category)
}

/**
 * Returns upcoming events that are not cancelled and not in the past relative to TODAY.
 */
export function getUpcomingEvents(
  eventList: CampusEvent[] = events,
): CampusEvent[] {
  return eventList.filter(
    (event) => !event.cancelled && !isPastEvent(event),
  )
}

/**
 * Composes search and category filter.
 */
export function getFilteredEvents(
  eventList: CampusEvent[],
  query: string,
  category: EventCategory | 'All',
): CampusEvent[] {
  const searched = searchEventsByName(eventList, query)
  return filterEventsByCategory(searched, category)
}

/**
 * Optional stretch: sort events chronologically by date.
 */
export function sortEventsByDate(
  eventList: CampusEvent[],
): CampusEvent[] {
  return [...eventList].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  )
}

/**
 * Optional stretch: count active (confirmed) registrations for an event.
 */
export function getRegistrationCount(eventId: string): number {
  return registrations.filter(
    (registration) =>
      registration.eventId === eventId &&
      registration.status === 'confirmed',
  ).length
}

/**
 * Optional stretch: sort events descending by registration popularity.
 */
export function sortEventsByPopularity(
  eventList: CampusEvent[],
): CampusEvent[] {
  return [...eventList].sort(
    (a, b) =>
      getRegistrationCount(b.id) -
      getRegistrationCount(a.id),
  )
}

export interface CreateEventInput {
  name: string
  description: string
  date: string
  venue: string
  category: EventCategory
  capacity: number
}

export function validateEventInput(
  input: CreateEventInput,
): string[] {
  const errors: string[] = []

  if (!input.name || !input.name.trim()) {
    errors.push('Event name is required.')
  }

  if (!input.venue || !input.venue.trim()) {
    errors.push('Venue is required.')
  }

  if (!input.description || !input.description.trim()) {
    errors.push('Description is required.')
  }

  if (!input.date) {
    errors.push('Event date is required.')
  } else {
    const parsedDate = new Date(input.date)
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() <= Date.now()) {
      errors.push('Event date must be in the future.')
    }
  }

  if (
    !Number.isInteger(input.capacity) ||
    input.capacity <= 0
  ) {
    errors.push('Capacity must be a positive whole number.')
  }

  return errors
}

export function createEvent(
  input: CreateEventInput,
  organizerId: string,
): CampusEvent {
  const errors = validateEventInput(input)

  if (errors.length > 0) {
    throw new Error(errors.join('|'))
  }

  const event: CampusEvent = {
    id: `evt-${Date.now()}`,
    name: input.name.trim(),
    description: input.description.trim(),
    date: input.date,
    venue: input.venue.trim(),
    category: input.category,
    capacity: input.capacity,
    seatsAvailable: input.capacity,
    organizerId,
    cancelled: false,
  }

  events.push(event)

  return event
}

export type SortOption = 'default' | 'date' | 'popularity'

export function sortEvents(
  eventList: CampusEvent[],
  option: SortOption,
): CampusEvent[] {
  if (option === 'default') {
    return [...eventList]
  }
  if (option === 'date') {
    return [...eventList].sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
  }
  if (option === 'popularity') {
    return [...eventList].sort(
      (a, b) =>
        getRegistrationCount(b.id) -
        getRegistrationCount(a.id),
    )
  }
  return [...eventList]
}

export function updateEvent(
  eventId: string,
  organizerId: string,
  input: CreateEventInput,
): CampusEvent {
  const event = getEventById(eventId)

  if (!event) {
    throw new Error('Event not found.')
  }

  if (event.organizerId !== organizerId) {
    throw new Error('You are not allowed to edit this event.')
  }

  const errors = validateEventInput(input)

  if (errors.length > 0) {
    throw new Error(errors.join('|'))
  }

  const registeredCount = event.capacity - event.seatsAvailable

  if (input.capacity < registeredCount) {
    throw new Error(
      `Capacity cannot be lower than ${registeredCount} active registrations.`,
    )
  }

  event.name = input.name.trim()
  event.description = input.description.trim()
  event.date = input.date
  event.venue = input.venue.trim()
  event.category = input.category

  event.capacity = input.capacity
  event.seatsAvailable = input.capacity - registeredCount

  return event
}

export function cancelEvent(
  eventId: string,
  organizerId: string,
): CampusEvent {
  const event = getEventById(eventId)

  if (!event) {
    throw new Error('Event not found.')
  }

  if (event.organizerId !== organizerId) {
    throw new Error('You are not allowed to cancel this event.')
  }

  event.cancelled = true

  return event
}
