import { NextResponse } from 'next/server'
import {
  getRegistrationsForStudent,
  createRegistration,
  hasActiveRegistration,
} from '@/data/registrations'
import { getAuthenticatedSession } from '@/lib/session'

export async function GET(request: Request) {
  const session = getAuthenticatedSession({
    headers: {
      cookie: request.headers.get('cookie') || undefined,
      authorization: request.headers.get('authorization') || undefined,
    },
  })

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Login required' },
      { status: 401 },
    )
  }

  // Server determines studentId exclusively from authenticated session
  const studentRegs = getRegistrationsForStudent(session.userId)
  return NextResponse.json({ success: true, registrations: studentRegs })
}

export async function POST(request: Request) {
  try {
    const session = getAuthenticatedSession({
      headers: {
        cookie: request.headers.get('cookie') || undefined,
        authorization: request.headers.get('authorization') || undefined,
      },
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Login required' },
        { status: 401 },
      )
    }

    if (session.userRole !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Only students can register for events.' },
        { status: 403 },
      )
    }

    const body = await request.json()
    const eventId = String(body.eventId ?? '')

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'eventId is required.' },
        { status: 400 },
      )
    }

    // Duplicate active registration protection
    if (hasActiveRegistration(session.userId, eventId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are already registered for this event.',
        },
        { status: 409 },
      )
    }

    // NEVER trust studentId from client: source of truth is session.userId
    const registration = createRegistration(session.userId, eventId)
    return NextResponse.json({ success: true, registration }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to register for event.'

    const status = message.includes('already registered')
      ? 409
      : message.includes('full')
        ? 409
        : message.includes('logged in')
          ? 401
          : message.includes('not found')
            ? 404
            : 400

    return NextResponse.json(
      { success: false, error: message },
      { status },
    )
  }
}
