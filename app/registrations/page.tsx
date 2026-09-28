'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import {
  getActiveRegistrationsForStudent,
  Registration,
} from '@/data/registrations'
import { getEventById, isPastEvent } from '@/data/events'
import StatusBadge from '@/components/StatusBadge'
import EmptyState from '@/components/EmptyState'
import { apiRequest } from '@/lib/api'

export default function RegistrationsPage() {
  const { currentUser } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [, setTick] = useState(0)

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="Student login required"
          description="Sign in as a student to see your registered events, book seats, and view tickets."
          action={
            <Link
              href="/login/student"
              className="btn btn-primary"
              style={{ marginTop: 12 }}
            >
              Sign In as Student →
            </Link>
          }
        />
      </section>
    )
  }

  const activeRegistrations = getActiveRegistrationsForStudent(currentUser.id)

  const upcoming = activeRegistrations.filter((registration) => {
    const event = getEventById(registration.eventId)
    return event && !event.cancelled && !isPastEvent(event)
  })

  const past = activeRegistrations.filter((registration) => {
    const event = getEventById(registration.eventId)
    return event && isPastEvent(event)
  })

  const handleCancel = async (id: string) => {
    if (cancellingId) return
    setMessage(null)
    setCancellingId(id)

    try {
      await apiRequest<{ success: boolean; registration: unknown }>(
        `/api/registrations/${id}`,
        {
          method: 'DELETE',
        },
      )
      setMessage('Registration cancelled successfully.')
      setTick((t) => t + 1)
    } catch (err: any) {
      setMessage(err.message || 'An error occurred during cancellation.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">
          signed up as {currentUser.name}
        </span>

        <h1 style={{ fontSize: 30, marginTop: 10 }}>
          My registrations
        </h1>

        {message && (
          <p
            role="status"
            style={{
              marginTop: 10,
              fontSize: 14,
              color: message.includes('success') ? 'var(--green)' : 'var(--rust)',
            }}
          >
            {message}
          </p>
        )}
      </div>

      <RegistrationSection
        title="Upcoming"
        registrations={upcoming}
        onCancel={handleCancel}
        cancellingId={cancellingId}
      />

      <div style={{ marginTop: 36 }}>
        <RegistrationSection
          title="Past"
          registrations={past}
        />
      </div>
    </section>
  )
}

function RegistrationSection({
  title,
  registrations,
  onCancel,
  cancellingId,
}: {
  title: string
  registrations: Registration[]
  onCancel?: (id: string) => void
  cancellingId?: string | null
}) {
  if (registrations.length === 0) {
    return (
      <div>
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>
          {title}
        </h2>

        <EmptyState
          title={`No ${title.toLowerCase()} registrations`}
          description={
            title === 'Upcoming'
              ? 'Register for an event to see it here.'
              : 'Your past registrations will appear here.'
          }
        />
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>
        {title}
      </h2>

      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {registrations.map((registration) => {
          const event = getEventById(registration.eventId)

          if (!event || event.cancelled) {
            return null
          }

          return (
            <li
              key={registration.id}
              className="card-surface"
              style={{
                padding: '18px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <Link
                  href={`/events/${event.id}`}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 17,
                    textDecoration: 'none',
                  }}
                >
                  {event.name}
                </Link>

                <div
                  style={{
                    fontSize: 13.5,
                    color: 'var(--ink-soft)',
                    marginTop: 4,
                  }}
                >
                  {new Date(event.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  · {event.venue}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <StatusBadge
                  status={title === 'Past' ? 'past' : 'open'}
                />

                {onCancel && (
                  <button
                    className="btn btn-secondary"
                    disabled={cancellingId === registration.id}
                    onClick={() => onCancel(registration.id)}
                  >
                    {cancellingId === registration.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
