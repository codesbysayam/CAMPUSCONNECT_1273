import { NextResponse } from 'next/server'
import { cancelRegistration } from '@/data/registrations'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams.id

    const body = await request.json()
    const studentId = String(body.studentId ?? '')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student login required.' },
        { status: 401 },
      )
    }

    const registration = cancelRegistration(id, studentId)
    return NextResponse.json({
      success: true,
      registration,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to cancel registration.'

    const status = message.includes('cannot cancel')
      ? 403
      : message.includes('not found')
        ? 404
        : 400

    return NextResponse.json(
      { success: false, error: message },
      { status },
    )
  }
}
