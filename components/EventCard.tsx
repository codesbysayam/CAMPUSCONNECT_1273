'use client'

import Link from 'next/link'
import { CampusEvent, isPastEvent, isFullEvent } from '@/data/events'
import StatusBadge from './StatusBadge'
import { getEventImage } from '@/lib/event-images'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventCard({ event }: { event: CampusEvent }) {
  const past = isPastEvent(event)
  const full = isFullEvent(event)
  const status = event.cancelled
    ? 'cancelled'
    : past
      ? 'past'
      : full
        ? 'full'
        : 'open'

  const imageSrc = getEventImage(event.category)

  return (
    <Link href={`/events/${event.id}`} className="event-card">
      <div className="event-card-image">
        <img
          src={imageSrc}
          alt={event.name}
          className="event-card-image-content"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/events/default.svg'
          }}
        />
      </div>

      <div className="event-card__body">
        <div className="event-card__main">
          <span className="event-card__category">{event.category}</span>
          <h3 className="event-card__name">{event.name}</h3>
          <div className="event-card__meta">
            <span>{formatDate(event.date)}</span>
            <span>·</span>
            <span>{event.venue}</span>
          </div>
        </div>
        <div className="event-card__stub">
          <StatusBadge status={status} />
          <span className="event-card__seats">
            {event.seatsAvailable}/{event.capacity} seats
          </span>
        </div>
      </div>
    </Link>
  )
}
