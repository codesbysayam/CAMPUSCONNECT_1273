'use client'

import Link from 'next/link'
import {
  CalendarDays,
  MapPin,
  Users,
  Code2,
  Palette,
  Trophy,
  Wrench,
  BriefcaseBusiness,
  Music2,
  GraduationCap,
} from 'lucide-react'
import { CampusEvent, isPastEvent, isFullEvent } from '@/data/events'
import { getEventImage } from '@/lib/event-images'

type EventCardProps = {
  event: CampusEvent
}

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  tech: Code2,
  technology: Code2,
  cultural: Palette,
  sports: Trophy,
  workshop: Wrench,
  career: BriefcaseBusiness,
  music: Music2,
}

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function EventCard({ event }: EventCardProps) {
  const past = isPastEvent(event)
  const full = isFullEvent(event)
  const status = event.cancelled
    ? 'cancelled'
    : past
      ? 'past'
      : full
        ? 'full'
        : 'open'

  const image = getEventImage(event.category)
  const categoryKey = (event.category || '').trim().toLowerCase()
  const CategoryIcon = CATEGORY_ICONS[categoryKey] || GraduationCap

  const statusLabel =
    status === 'cancelled'
      ? 'Cancelled'
      : status === 'past'
        ? 'Past'
        : status === 'full'
          ? 'Full'
          : 'Open'

  return (
    <article className="event-card">
      {/* 1. Event Image / Visual */}
      <Link
        href={`/events/${event.id}`}
        className="event-card__media event-card-image"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={image}
          alt=""
          className="event-card__image event-card-image-content"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/events/default.svg'
          }}
        />
      </Link>

      {/* 2. Card Content Body */}
      <div className="event-card__body">
        {/* Category + Status */}
        <div className="event-card__top">
          <span className="event-card__category">
            <CategoryIcon size={14} />
            <span>{event.category}</span>
          </span>

          <span className={`event-status event-status--${status}`}>
            {statusLabel}
          </span>
        </div>

        {/* 3. Event Name */}
        <h3 className="event-card__title">
          <Link href={`/events/${event.id}`} className="event-card__title-link">
            {event.name}
          </Link>
        </h3>

        {/* 4 & 5. Date and Venue Metadata */}
        <div className="event-card__meta-group">
          <div className="event-card__meta">
            <CalendarDays size={16} />
            <span>{formatEventDate(event.date)}</span>
          </div>

          <div className="event-card__meta">
            <MapPin size={16} />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* 6 & 7. Available Seats and Action Button */}
        <div className="event-card__footer">
          <div className="event-card__seats">
            <Users size={16} />
            <span>
              {event.seatsAvailable}/{event.capacity} seats
            </span>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="btn btn-secondary event-card__btn"
          >
            View event →
          </Link>
        </div>
      </div>
    </article>
  )
}
