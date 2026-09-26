import { NextResponse } from 'next/server'
import { getUserById } from '@/data/auth'
import { createEvent, events } from '@/data/events'

export async function GET() {
  return NextResponse.json({ events })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const organizerId = String(body.organizerId ?? '')

    const user = getUserById(organizerId)
    if (!user || user.role !== 'organizer') {
      return NextResponse.json(
        { error: 'Organizer access required.' },
        { status: 403 },
      )
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

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unable to create event.',
      },
      { status: 400 },
    )
  }
}
