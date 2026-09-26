'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { events, CampusEvent, isPastEvent } from '@/data/events'
import EmptyState from '@/components/EmptyState'
import StatusBadge from '@/components/StatusBadge'
import EventForm from '@/components/EventForm'
import { apiRequest } from '@/lib/api'

function sortOrganizerEvents(eventsList: CampusEvent[]) {
  return [...eventsList].sort((a, b) => {
    const aClosed = Boolean(a.cancelled) || isPastEvent(a)
    const bClosed = Boolean(b.cancelled) || isPastEvent(b)

    if (aClosed && !bClosed) return 1
    if (!aClosed && bClosed) return -1

    return 0
  })
}

export default function OrganizerPage() {
  const { currentUser } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null)
  const [, setTick] = useState(0)

  if (currentUser.role !== 'organizer') {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="This page is for organizers"
          description="Switch to an organizer account from the top-right menu or sign in through the organizer portal to manage events."
          action={
            <Link
              href="/login/organizer"
              className="btn btn-primary"
              style={{ marginTop: 12 }}
            >
              Sign In as Organiser →
            </Link>
          }
        />
      </section>
    )
  }

  const myEvents = sortOrganizerEvents(
    events.filter((e) => e.organizerId === currentUser.id),
  )

  const handleCancelEvent = async (event: CampusEvent) => {
    if (event.cancelled) return
    const confirmed = window.confirm(`Cancel "${event.name}"?`)
    if (!confirmed) return

    try {
      await apiRequest<{ success: boolean; event: unknown }>(
        `/api/events/${event.id}`,
        {
          method: 'DELETE',
          body: JSON.stringify({ organizerId: currentUser.id }),
        },
      )
      setTick((t) => t + 1)
    } catch (err: any) {
      alert(err.message || 'Unable to cancel event.')
    }
  }

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div
        style={{
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <span className="eyebrow-tag">organizer console</span>
          <h1 style={{ fontSize: 30, marginTop: 10 }}>Manage your events</h1>
          <p style={{ marginTop: 8 }}>
            Create and manage events for your club or department.
          </p>
        </div>

        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingEvent(null)
              setShowForm(true)
            }}
          >
            + New event
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginBottom: 32 }}>
          <EventForm
            organizerId={currentUser.id}
            eventId={editingEvent?.id}
            initialValues={
              editingEvent
                ? {
                    name: editingEvent.name,
                    description: editingEvent.description,
                    date: editingEvent.date,
                    venue: editingEvent.venue,
                    category: editingEvent.category,
                    capacity: editingEvent.capacity,
                  }
                : undefined
            }
            onSaved={() => {
              setShowForm(false)
              setEditingEvent(null)
              setTick((t) => t + 1)
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingEvent(null)
            }}
          />
        </div>
      )}

      {myEvents.length === 0 ? (
        <EmptyState
          title="No events posted yet"
          description="Once you create an event, it'll show up here."
        />
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myEvents.map((event) => {
            const status = event.cancelled
              ? 'cancelled'
              : event.seatsAvailable <= 0
                ? 'full'
                : 'open'

            return (
              <li
                key={event.id}
                className="card-surface"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                    · {event.venue} · {event.seatsAvailable}/{event.capacity}{' '}
                    seats
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <StatusBadge status={status} />

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingEvent(event)
                      setShowForm(true)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-secondary"
                    disabled={event.cancelled}
                    onClick={() => handleCancelEvent(event)}
                  >
                    {event.cancelled ? 'Cancelled' : 'Cancel'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
