import { NextResponse } from 'next/server'
import { getUserById } from '@/data/auth'
import { updateEvent, cancelEvent } from '@/data/events'

function getOrganizer(body: any) {
  const organizerId = String(body.organizerId ?? '')
  const user = getUserById(organizerId)

  if (!user || user.role !== 'organizer') {
    throw new Error('FORBIDDEN')
  }

  return organizerId
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json()
    const organizerId = getOrganizer(body)

    const event = updateEvent(params.id, organizerId, {
      name: String(body.name ?? ''),
      description: String(body.description ?? ''),
      date: String(body.date ?? ''),
      venue: String(body.venue ?? ''),
      category: body.category,
      capacity: Number(body.capacity),
    })

    return NextResponse.json({ event })
  } catch (error) {
    const code = error instanceof Error ? error.message : ''

    if (code === 'FORBIDDEN') {
      return NextResponse.json(
        { error: 'You cannot modify this event.' },
        { status: 403 },
      )
    }

    if (code === 'EVENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { error: code || 'Unable to update event.' },
      { status: 400 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json()
    const organizerId = getOrganizer(body)

    const event = cancelEvent(params.id, organizerId)

    return NextResponse.json({ event })
  } catch (error) {
    const code = error instanceof Error ? error.message : ''

    if (code === 'FORBIDDEN') {
      return NextResponse.json(
        { error: 'You cannot cancel this event.' },
        { status: 403 },
      )
    }

    if (code === 'EVENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { error: code || 'Unable to cancel event.' },
      { status: 400 },
    )
  }
}
