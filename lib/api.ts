import {
  createEvent,
  updateEvent,
  cancelEvent,
  CampusEvent,
} from '@/data/events'
import {
  getRegistrationsForStudent,
  createRegistration,
  cancelRegistration,
  Registration,
} from '@/data/registrations'
import { getUserById } from '@/data/auth'

function handleClientFallback<T>(
  url: string,
  options?: RequestInit,
): T | null {
  try {
    const urlObj = new URL(url, 'http://localhost')
    const pathname = urlObj.pathname
    const method = options?.method?.toUpperCase() || 'GET'
    let body: any = {}

    if (options?.body && typeof options.body === 'string') {
      try {
        body = JSON.parse(options.body)
      } catch {
        // ignore
      }
    }

    if (pathname === '/api/events') {
      if (method === 'POST') {
        const organizerId = String(body.organizerId ?? '')
        const user = getUserById(organizerId)
        if (!user || user.role !== 'organizer') {
          throw new Error('Organizer access required.')
        }

        const event = createEvent(
          {
            name: String(body.name ?? ''),
            description: String(body.description ?? ''),
            date: String(body.date ?? ''),
            venue: String(body.venue ?? ''),
            category: body.category,
            capacity: Number(body.capacity),
          },
          organizerId,
        )
        return { success: true, event } as unknown as T
      }
    }

    if (pathname.startsWith('/api/events/')) {
      const id = pathname.slice('/api/events/'.length)
      const organizerId = String(body.organizerId ?? '')
      const user = getUserById(organizerId)
      if (!user || user.role !== 'organizer') {
        throw new Error('Organizer access required.')
      }

      if (method === 'PATCH') {
        const event = updateEvent(id, organizerId, {
          name: String(body.name ?? ''),
          description: String(body.description ?? ''),
          date: String(body.date ?? ''),
          venue: String(body.venue ?? ''),
          category: body.category,
          capacity: Number(body.capacity),
        })
        return { success: true, event } as unknown as T
      }

      if (method === 'DELETE') {
        const event = cancelEvent(id, organizerId)
        return { success: true, event } as unknown as T
      }
    }

    if (pathname === '/api/registrations') {
      if (method === 'GET') {
        const studentId = urlObj.searchParams.get('studentId')
        if (!studentId) {
          throw new Error('studentId is required.')
        }
        const regs = getRegistrationsForStudent(studentId)
        return { success: true, registrations: regs } as unknown as T
      }

      if (method === 'POST') {
        const studentId = String(body.studentId ?? '')
        const eventId = String(body.eventId ?? '')
        if (!studentId) {
          throw new Error('Student login required.')
        }
        if (!eventId) {
          throw new Error('eventId is required.')
        }
        const registration = createRegistration(studentId, eventId)
        return { success: true, registration } as unknown as T
      }
    }

    if (pathname.startsWith('/api/registrations/')) {
      const id = pathname.slice('/api/registrations/'.length)
      if (method === 'DELETE') {
        const studentId = String(body.studentId ?? '')
        if (!studentId) {
          throw new Error('Student login required.')
        }
        const registration = cancelRegistration(id, studentId)
        return { success: true, registration } as unknown as T
      }
    }

    return null
  } catch (err: any) {
    throw err
  }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const method = options?.method?.toUpperCase() || 'GET'
  let response: Response

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    })
  } catch (networkError: any) {
    const fallback = handleClientFallback<T>(url, options)
    if (fallback !== null) {
      return fallback
    }
    throw new Error('Network error while connecting to the server.')
  }

  const text = await response.text()
  let data: any = null

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    // Non-JSON response received (such as 404 HTML from static deployment)
    const fallback = handleClientFallback<T>(url, options)
    if (fallback !== null) {
      return fallback
    }

    if (response.status === 404) {
      throw new Error('API endpoint not found (404).')
    }
    throw new Error(`Server returned an invalid response (${response.status}).`)
  }

  if (!response.ok) {
    if (typeof data === 'object' && data !== null && 'error' in data) {
      throw new Error(String(data.error))
    }
    throw new Error(`Request failed (${response.status}).`)
  }

  return data as T
}
