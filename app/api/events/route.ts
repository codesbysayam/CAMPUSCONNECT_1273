import { NextResponse } from 'next/server'
import { createEvent, events } from '@/data/events'
import { getAuthenticatedSession } from '@/lib/session'

export async function GET() {
  return NextResponse.json({ success: true, events })
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

    if (session.userRole !== 'organizer') {
      return NextResponse.json(
        { success: false, error: 'Organizer access required.' },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { name, description, date, venue, category, capacity } = body

    if (!String(name ?? '').trim()) {
      return NextResponse.json(
        { success: false, error: 'Event name is required.' },
        { status: 400 },
      )
    }

    if (!String(description ?? '').trim()) {
      return NextResponse.json(
        { success: false, error: 'Description is required.' },
        { status: 400 },
      )
    }

    if (!String(venue ?? '').trim()) {
      return NextResponse.json(
        { success: false, error: 'Venue is required.' },
        { status: 400 },
      )
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category is required.' },
        { status: 400 },
      )
    }

    const eventDate = new Date(date)
    if (!date || Number.isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'A valid event date is required.' },
        { status: 400 },
      )
    }

    if (eventDate.getTime() <= Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Event date must be in the future.' },
        { status: 400 },
      )
    }

    const parsedCapacity = Number(capacity)
    if (!Number.isInteger(parsedCapacity) || parsedCapacity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Capacity must be a positive whole number.' },
        { status: 400 },
      )
    }

    // Server-enforced organizerId from session
    const event = createEvent(
      {
        name: String(name).trim(),
        description: String(description).trim(),
        date: eventDate.toISOString(),
        venue: String(venue).trim(),
        category,
        capacity: parsedCapacity,
      },
      session.userId,
    )

    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to create event.'

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    )
  }
}
