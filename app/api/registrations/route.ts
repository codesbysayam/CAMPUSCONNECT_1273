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
      { success: false, error: 'studentId is required.' },
      { status: 400 },
    )
  }

  const studentRegs = getRegistrationsForStudent(studentId)
  return NextResponse.json({ success: true, registrations: studentRegs })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const studentId = String(body.studentId ?? '')
    const eventId = String(body.eventId ?? '')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student login required.' },
        { status: 401 },
      )
    }

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'eventId is required.' },
        { status: 400 },
      )
    }

    const registration = createRegistration(studentId, eventId)
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
