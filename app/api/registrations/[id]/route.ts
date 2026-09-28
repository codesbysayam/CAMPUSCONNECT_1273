import { NextResponse } from 'next/server'
import { cancelRegistration, getRegistrationById } from '@/data/registrations'
import { getAuthenticatedSession } from '@/lib/session'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(context.params)
    const id = resolvedParams.id

    // Server-side authentication check
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

    const registration = getRegistrationById(id)
    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 },
      )
    }

    // MANDATORY OWNERSHIP CHECK: NEVER trust client-provided studentId
    if (registration.studentId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are not allowed to cancel this registration.',
        },
        { status: 403 },
      )
    }

    const cancelled = cancelRegistration(id, session.userId)
    return NextResponse.json({
      success: true,
      registration: cancelled,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to cancel registration.'

    const status = message.includes('cannot cancel') || message.includes('FORBIDDEN')
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
