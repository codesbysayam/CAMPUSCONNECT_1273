'use client'

import { useMemo, useState } from 'react'
import {
  events,
  EventCategory,
  getFilteredEvents,
  isPastEvent,
  sortEventsByDate,
  sortEventsByPopularity,
} from '@/data/events'
import EventCard from '@/components/EventCard'
import EmptyState from '@/components/EmptyState'

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Career',
  'Music',
]

type SortOption = 'default' | 'date' | 'popularity'

export default function EventsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EventCategory | 'All'>('All')
  const [sortOption, setSortOption] = useState<SortOption>('default')

  const filteredEvents = useMemo(() => {
    // Hide past and cancelled events from student listing
    const upcoming = events.filter(
      (event) => !event.cancelled && !isPastEvent(event),
    )

    const filtered = getFilteredEvents(upcoming, query, category)

    if (sortOption === 'date') {
      return sortEventsByDate(filtered)
    }
    if (sortOption === 'popularity') {
      return sortEventsByPopularity(filtered)
    }

    return filtered
  }, [query, category, sortOption])

  return (
    <section className="shell" style={{ padding: '40px 0 64px' }}>
      <div style={{ marginBottom: 28 }}>
        <span className="eyebrow-tag">the board</span>
        <h1 style={{ fontSize: 30, marginTop: 10 }}>All events</h1>
        <p style={{ marginTop: 8 }}>
          Everything posted by clubs and departments this semester.
        </p>
      </div>

      <div
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}
      >
        <input
          type="search"
          placeholder="Search events by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: '1 1 240px',
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            margin: 0,
            width: 'auto',
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as EventCategory | 'All')}
          style={{
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            margin: 0,
            width: 'auto',
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All categories' : c}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          aria-label="Sort events"
          style={{
            padding: '10px 14px',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            fontSize: 14.5,
            background: 'var(--paper-raised)',
            margin: 0,
            width: 'auto',
          }}
        >
          <option value="default">Default order</option>
          <option value="date">Sort by Date</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          <EmptyState
            title="No events found"
            description={
              query || category !== 'All'
                ? 'Try changing your search or category filter.'
                : 'There are no upcoming events right now.'
            }
          />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}
