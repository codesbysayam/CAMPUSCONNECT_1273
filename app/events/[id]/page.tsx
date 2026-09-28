'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getEventById, isPastEvent, isFullEvent } from '@/data/events'
import { getEventImage } from '@/lib/event-images'
import StatusBadge from '@/components/StatusBadge'
import EmptyState from '@/components/EmptyState'
import RegisterButton from '@/components/RegisterButton'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [tick, setTick] = useState(0)
  const event = getEventById(params.id)

  if (!event) {
    return (
      <section className="shell" style={{ padding: '56px 0' }}>
        <EmptyState
          title="This event isn't on the board"
          description="It may have been removed, or the link might be wrong. Head back to the full listing to find what you're looking for."
          action={
            <Link href="/events" className="btn btn-primary">
              Back to events
            </Link>
          }
        />
      </section>
    )
  }

  const past = isPastEvent(event)
  const full = isFullEvent(event)
  const status = event.cancelled
    ? 'cancelled'
    : past
      ? 'past'
      : full
        ? 'full'
        : 'open'

  const image = getEventImage(event)

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <Link
        href="/events"
        style={{ fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}
      >
        ← All events
      </Link>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 32,
          marginTop: 20,
        }}
        className="hero-grid"
      >
        <div>
          <div
            style={{
              marginBottom: 20,
              borderRadius: 14,
              overflow: 'hidden',
              aspectRatio: '16 / 9',
              maxHeight: 360,
              width: '100%',
              background: '#edf1f5',
            }}
          >
            <img
              src={image}
              alt={`${event.name} event`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const img = e.currentTarget
                if (img.dataset.fallbackApplied === 'true') return
                img.dataset.fallbackApplied = 'true'
                img.src = '/events/default-event.jpg'
              }}
            />
          </div>

          <span className="eyebrow-tag">{event.category}</span>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', marginTop: 12, lineHeight: 1.2 }}>
            {event.name}
          </h1>
          <p style={{ marginTop: 16, fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
            {event.description}
          </p>
        </div>

        <aside
          className="card-surface"
          style={{
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            height: 'fit-content',
          }}
        >
          <StatusBadge status={status} />
          <Detail label="Date" value={formatDate(event.date)} />
          <Detail label="Time" value={formatTime(event.date)} />
          <Detail label="Venue" value={event.venue} />
          <Detail
            label="Seats"
            value={`${event.seatsAvailable} of ${event.capacity} available`}
          />

          <RegisterButton
            eventId={event.id}
            onRegistered={() => setTick((t) => t + 1)}
          />
        </aside>
      </div>
    </section>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{label}</div>
      <div style={{ fontSize: 14.5, fontWeight: 500 }}>{value}</div>
    </div>
  )
}
