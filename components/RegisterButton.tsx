'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { getEventById, isPastEvent, isFullEvent } from '@/data/events'
import { hasActiveRegistration } from '@/data/registrations'
import { apiRequest } from '@/lib/api'

interface RegisterButtonProps {
  eventId: string
  onRegistered?: () => void
}

export default function RegisterButton({
  eventId,
  onRegistered,
}: RegisterButtonProps) {
  const { currentUser } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const event = getEventById(eventId)
  if (!event) return null

  if (!currentUser) {
    return (
      <div style={{ marginTop: 4 }}>
        <Link
          href="/login/student"
          className="btn btn-primary"
          style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}
        >
          Sign In as Student to Register →
        </Link>
      </div>
    )
  }

  const isStudent = currentUser.role === 'student'
  const past = isPastEvent(event)
  const full = isFullEvent(event)
  const alreadyRegistered = hasActiveRegistration(currentUser.id, eventId)
  const canRegister =
    isStudent && !past && !full && !event.cancelled && !alreadyRegistered

  let buttonText = 'Register'
  if (alreadyRegistered) {
    buttonText = 'Registered ✓'
  } else if (event.cancelled) {
    buttonText = 'Event cancelled'
  } else if (past) {
    buttonText = 'Registration closed'
  } else if (full) {
    buttonText = 'Event full'
  } else if (!isStudent) {
    buttonText = 'Switch to student account to register'
  }

  async function handleRegister() {
    if (!currentUser || !canRegister || submitting) return

    setError(null)
    setSubmitting(true)

    try {
      await apiRequest<{ success: boolean; registration: unknown }>(
        '/api/registrations',
        {
          method: 'POST',
          body: JSON.stringify({
            eventId,
          }),
        },
      )

      setSuccess(true)
      if (onRegistered) {
        onRegistered()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}
    >
      <button
        className="btn btn-primary"
        disabled={!canRegister || submitting}
        onClick={handleRegister}
        style={{
          width: '100%',
          ...(alreadyRegistered
            ? {
                background: 'var(--green-bg)',
                color: 'var(--green)',
                borderColor: 'var(--green)',
              }
            : {}),
        }}
      >
        {submitting ? 'Registering…' : buttonText}
      </button>

      {error && (
        <p role="alert" style={{ fontSize: 13, color: 'var(--rust)' }}>
          {error}
        </p>
      )}

      {success && (
        <p role="status" style={{ fontSize: 13, color: 'var(--green)' }}>
          Registration confirmed!
        </p>
      )}
    </div>
  )
}
