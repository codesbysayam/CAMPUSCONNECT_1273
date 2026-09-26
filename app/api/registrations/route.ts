import { NextResponse } from 'next/server'
import {
  getRegistrationsForStudent,
  createRegistration,
} from '@/data/registrations'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId')

  if (!studentId) {
    return NextResponse.json(
      { error: 'studentId is required.' },
      { status: 400 },
    )
  }

  const registrations = getRegistrationsForStudent(studentId)
  return NextResponse.json({ registrations })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const studentId = String(body.studentId ?? '')
    const eventId = String(body.eventId ?? '')

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student login required.' },
        { status: 401 },
      )
    }

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required.' },
        { status: 400 },
      )
    }

    const registration = createRegistration(studentId, eventId)
    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    const code = error instanceof Error ? error.message : ''

    if (code === 'ALREADY_REGISTERED') {
      return NextResponse.json(
        { error: 'You are already registered for this event.' },
        { status: 409 },
      )
    }

    if (code === 'EVENT_FULL') {
      return NextResponse.json(
        { error: 'This event has reached full capacity.' },
        { status: 409 },
      )
    }

    if (code === 'EVENT_PAST') {
      return NextResponse.json(
        { error: 'Cannot register for a past event.' },
        { status: 400 },
      )
    }

    if (code === 'EVENT_CANCELLED') {
      return NextResponse.json(
        { error: 'This event has been cancelled.' },
        { status: 400 },
      )
    }

    if (code === 'EVENT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Event not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { error: code || 'Unable to register for event.' },
      { status: 400 },
    )
  }
}
