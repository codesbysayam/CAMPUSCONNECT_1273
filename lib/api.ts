import {
  createEvent,
  updateEvent,
  cancelEvent,
  CampusEvent,
  getEventById,
} from '@/data/events'
import {
  getRegistrationsForStudent,
  createRegistration,
  cancelRegistration,
  getRegistrationById,
  hasActiveRegistration,
  Registration,
} from '@/data/registrations'
import { getUserById } from '@/data/auth'

export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const method = options?.method?.toUpperCase() || 'GET'
  let response: Response

  try {
    response = await fetch(url, {
      ...options,
      credentials: 'include', // Send and receive HttpOnly session cookies
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    })
  } catch (networkError: any) {
    throw new Error('Network error while connecting to the server.')
  }

  const text = await response.text()
  let data: any = null

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    if (response.status === 404) {
      throw new Error('API endpoint not found (404).')
    }
    throw new Error(`Server returned an invalid response (${response.status}).`)
  }

  if (!response.ok) {
    if (typeof data === 'object' && data !== null && 'error' in data) {
      throw new Error(String(data.error))
    }
    throw new Error(`Request failed with status ${response.status}.`)
  }

  return data as T
}
