import { NextResponse } from 'next/server'
import { cancelRegistration } from '@/data/registrations'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json()
    const studentId = String(body.studentId ?? '')

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student login required.' },
        { status: 401 },
      )
    }

    const registration = cancelRegistration(params.id, studentId)
    return NextResponse.json({ registration })
  } catch (error) {
    const code = error instanceof Error ? error.message : ''

    if (code === 'FORBIDDEN') {
      return NextResponse.json(
        { error: 'You cannot cancel another student’s registration.' },
        { status: 403 },
      )
    }

    if (code === 'REGISTRATION_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Registration not found.' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { error: code || 'Unable to cancel registration.' },
      { status: 400 },
    )
  }
}
