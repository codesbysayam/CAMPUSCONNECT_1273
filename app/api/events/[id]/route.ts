import { NextResponse } from 'next/server'
import { getEventById, updateEvent, cancelEvent } from '@/data/events'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams.id

    const body = await request.json()
    const {
      organizerId,
      name,
      description,
      date,
      venue,
      category,
      capacity,
    } = body

    if (!organizerId) {
      return NextResponse.json(
        { success: false, error: 'Organizer ID is required.' },
        { status: 400 },
      )
    }

    const event = getEventById(id)
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found.' },
        { status: 404 },
      )
    }

    if (event.organizerId !== organizerId) {
      return NextResponse.json(
        { success: false, error: 'You are not allowed to edit this event.' },
        { status: 403 },
      )
    }

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

    const parsedDate = new Date(date)
    if (!date || Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'A valid event date is required.' },
        { status: 400 },
      )
    }

    if (parsedDate.getTime() <= Date.now()) {
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

    const activeRegistrations = event.capacity - event.seatsAvailable
    if (parsedCapacity < activeRegistrations) {
      return NextResponse.json(
        {
          success: false,
          error: `Capacity cannot be lower than ${activeRegistrations} active registrations.`,
        },
        { status: 400 },
      )
    }

    const updatedEvent = updateEvent(
      id,
      organizerId,
      {
        name: String(name).trim(),
        description: String(description).trim(),
        date: parsedDate.toISOString(),
        venue: String(venue).trim(),
        category,
        capacity: parsedCapacity,
      },
    )

    return NextResponse.json({
      success: true,
      event: updatedEvent,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to update event.'

    if (message.includes('not allowed')) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 403 },
      )
    }
    if (message.includes('not found')) {
      return NextResponse.json(
        { success: false, error: message },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams.id

    const body = await request.json()
    const organizerId = String(body.organizerId ?? '')

    if (!organizerId) {
      return NextResponse.json(
        { success: false, error: 'Organizer ID is required.' },
        { status: 400 },
      )
    }

    const event = getEventById(id)
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found.' },
        { status: 404 },
      )
    }

    if (event.organizerId !== organizerId) {
      return NextResponse.json(
        { success: false, error: 'You are not allowed to cancel this event.' },
        { status: 403 },
      )
    }

    const cancelledEvent = cancelEvent(id, organizerId)
    return NextResponse.json({
      success: true,
      event: cancelledEvent,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to cancel event.'

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 },
    )
  }
}
