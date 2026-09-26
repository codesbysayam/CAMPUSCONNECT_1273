'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CampusEvent, TODAY } from '@/data/events'

interface CalendarViewProps {
  events: CampusEvent[]
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Tech: { bg: '#e8efff', text: '#1e40af' },
  Cultural: { bg: '#fdf2f8', text: '#9d174d' },
  Sports: { bg: '#ecfdf5', text: '#065f46' },
  Workshop: { bg: '#fef3c7', text: '#92400e' },
  Career: { bg: '#f3e8ff', text: '#6b21a8' },
  Music: { bg: '#ffedd5', text: '#9a3412' },
}

export default function CalendarView({ events }: CalendarViewProps) {
  // Start with the month corresponding to TODAY (September 2026)
  const [currentDate, setCurrentDate] = useState(() => new Date(TODAY.getTime()))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleCurrentMonth = () => {
    setCurrentDate(new Date(TODAY.getTime()))
  }

  // Group events by day in current month
  const eventsByDay: Record<number, CampusEvent[]> = {}
  events.forEach((event) => {
    const eventDate = new Date(event.date)
    if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
      const day = eventDate.getDate()
      if (!eventsByDay[day]) {
        eventsByDay[day] = []
      }
      eventsByDay[day].push(event)
    }
  })

  // Calendar cells: 42 cells total (6 weeks x 7 days)
  const calendarCells = []

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
      events: [] as CampusEvent[],
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = (eventsByDay[d] || []).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d),
      events: dayEvents,
    })
  }

  // Next month leading days
  const remainingCells = 42 - calendarCells.length
  for (let d = 1; d <= remainingCells; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month + 1, d),
      events: [] as CampusEvent[],
    })
  }

  const isToday = (date: Date) => {
    return (
      date.getDate() === TODAY.getDate() &&
      date.getMonth() === TODAY.getMonth() &&
      date.getFullYear() === TODAY.getFullYear()
    )
  }

  return (
    <div
      className="card-surface"
      style={{
        padding: '24px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Calendar Header with Month/Year and < / > buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrevMonth}
              style={{
                width: 36,
                height: 36,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              aria-label="Previous month"
              title="Previous month"
            >
              &lt;
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleNextMonth}
              style={{
                width: 36,
                height: 36,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              aria-label="Next month"
              title="Next month"
            >
              &gt;
            </button>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {monthNames[month]} {year}
          </h2>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCurrentMonth}
          style={{ padding: '6px 14px', fontSize: 13 }}
        >
          Today
        </button>
      </div>

      {/* Weekday Names Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1.5px solid var(--line)',
          paddingBottom: 8,
          marginBottom: 4,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--ink-soft)',
        }}
      >
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Monthly Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderTop: '1px solid var(--line)',
          borderLeft: '1px solid var(--line)',
          background: 'var(--line)',
          gap: '1px',
        }}
      >
        {calendarCells.map((cell, idx) => {
          const isCellToday = isToday(cell.date)
          return (
            <div
              key={idx}
              style={{
                background: cell.isCurrentMonth
                  ? isCellToday
                    ? 'var(--paper)'
                    : 'var(--paper-raised)'
                  : 'var(--paper)',
                minHeight: 110,
                padding: '8px 6px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                opacity: cell.isCurrentMonth ? 1 : 0.45,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  fontWeight: isCellToday ? 700 : 500,
                  color: isCellToday ? 'var(--amber-ink)' : 'inherit',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: isCellToday ? 22 : 'auto',
                    height: isCellToday ? 22 : 'auto',
                    lineHeight: isCellToday ? '22px' : 'normal',
                    textAlign: 'center',
                    borderRadius: isCellToday ? '50%' : 0,
                    background: isCellToday ? 'var(--amber)' : 'transparent',
                    color: isCellToday ? '#fff' : 'inherit',
                  }}
                >
                  {cell.day}
                </span>

                {isCellToday && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: 'var(--amber)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Today
                  </span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  marginTop: 2,
                  overflowY: 'auto',
                  maxHeight: 100,
                }}
              >
                {cell.events.map((ev) => {
                  const colors =
                    CATEGORY_COLORS[ev.category] || {
                      bg: 'var(--line)',
                      text: 'var(--ink)',
                    }
                  const time = new Date(ev.date).toLocaleTimeString('en-IN', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })

                  return (
                    <Link
                      key={ev.id}
                      href={`/events/${ev.id}`}
                      style={{
                        padding: '4px 6px',
                        borderRadius: 3,
                        fontSize: 11,
                        lineHeight: 1.25,
                        textDecoration: 'none',
                        background: colors.bg,
                        color: colors.text,
                        border: '1px solid rgba(0,0,0,0.06)',
                        display: 'block',
                      }}
                      title={`${ev.name} (${time}) · ${ev.venue}`}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {ev.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          opacity: 0.85,
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: 2,
                        }}
                      >
                        <span>{time}</span>
                        <span>{ev.seatsAvailable} seats</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
