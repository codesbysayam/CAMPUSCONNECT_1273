'use client'

import { useMemo, useState } from 'react'
import {
  events,
  EventCategory,
  getFilteredEvents,
  isPastEvent,
  sortEvents,
  SortOption,
} from '@/data/events'
import EventCard from '@/components/EventCard'
import EmptyState from '@/components/EmptyState'
import CalendarView from '@/components/CalendarView'

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Career',
  'Music',
]

type ViewMode = 'list' | 'calendar'

export default function EventsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<EventCategory | 'All'>('All')
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const filteredEvents = useMemo(() => {
    // Hide past and cancelled events from student listing
    const upcoming = events.filter(
      (event) => !event.cancelled && !isPastEvent(event),
    )

    // Filter by query and category first
    const filtered = getFilteredEvents(upcoming, query, category)

    // Sort deterministically (default order preserves original seed array order)
    return sortEvents(filtered, sortOption)
  }, [query, category, sortOption])

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
          <span className="eyebrow-tag">the board</span>
          <h1 style={{ fontSize: 30, marginTop: 10 }}>All events</h1>
          <p style={{ marginTop: 8 }}>
            Everything posted by clubs and departments this semester.
          </p>
        </div>

        {/* View Mode Toggle: List vs Calendar */}
        <div
          style={{
            display: 'inline-flex',
            border: '1.5px solid var(--line)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            background: 'var(--paper-raised)',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'list' ? 'var(--ink)' : 'transparent',
              color: viewMode === 'list' ? 'var(--paper)' : 'var(--ink-soft)',
              transition: 'background 0.12s ease',
            }}
          >
            List View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            style={{
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: 600,
              border: 'none',
              borderLeft: '1.5px solid var(--line)',
              cursor: 'pointer',
              background:
                viewMode === 'calendar' ? 'var(--ink)' : 'transparent',
              color: viewMode === 'calendar' ? 'var(--paper)' : 'var(--ink-soft)',
              transition: 'background 0.12s ease',
            }}
          >
            Calendar View
          </button>
        </div>
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

        {viewMode === 'list' && (
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
        )}
      </div>

      {viewMode === 'calendar' ? (
        <CalendarView events={filteredEvents} />
      ) : filteredEvents.length === 0 ? (
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
