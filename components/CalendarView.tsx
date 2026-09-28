'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CampusEvent } from '@/data/events'
import {
  getCurrentISTDate,
  getISTDateKey,
  isTodayIST,
} from '@/lib/date-utils'
import { apiRequest } from '@/lib/api'
import { RefreshCw } from 'lucide-react'

interface CalendarViewProps {
  events: CampusEvent[]
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Tech: { bg: 'rgba(30, 64, 175, 0.1)', text: '#1e40af', border: 'rgba(30, 64, 175, 0.25)' },
  Cultural: { bg: 'rgba(157, 23, 77, 0.1)', text: '#9d174d', border: 'rgba(157, 23, 77, 0.25)' },
  Sports: { bg: 'rgba(6, 95, 70, 0.1)', text: '#065f46', border: 'rgba(6, 95, 70, 0.25)' },
  Workshop: { bg: 'rgba(146, 64, 14, 0.1)', text: '#92400e', border: 'rgba(146, 64, 14, 0.25)' },
  Career: { bg: 'rgba(107, 33, 168, 0.1)', text: '#6b21a8', border: 'rgba(107, 33, 168, 0.25)' },
  Music: { bg: 'rgba(154, 52, 18, 0.1)', text: '#9a3412', border: 'rgba(154, 52, 18, 0.25)' },
}

export default function CalendarView({ events }: CalendarViewProps) {
  // Runtime IST current date initialization
  const [currentDate, setCurrentDate] = useState(() => {
    const today = getCurrentISTDate()
    return new Date(today.year, today.month - 1, 1)
  })

  const [todayKey, setTodayKey] = useState(() => getISTDateKey())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => new Date())
  const [eventsList, setEventsList] = useState<CampusEvent[]>(events)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const [nowTicker, setNowTicker] = useState(() => Date.now())

  useEffect(() => {
    if (events && events.length) {
      setEventsList(events)
    }
  }, [events])

  // Ticker for relative time update
  useEffect(() => {
    const t = setInterval(() => setNowTicker(Date.now()), 10_000)
    return () => clearInterval(t)
  }, [])

  // Realtime Refresh Function
  const refreshCalendarData = async () => {
    setIsRefreshing(true)
    setRefreshError(null)
    try {
      const latestToday = getISTDateKey()
      setTodayKey(latestToday)

      const res = await apiRequest<{ success: boolean; events: CampusEvent[] }>(
        '/api/events',
      )
      if (res && res.events) {
        setEventsList(res.events)
      }
      setLastUpdated(new Date())
    } catch (err) {
      setRefreshError("Calendar couldn't refresh. Showing the last available data.")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = window.setInterval(() => {
      refreshCalendarData()
    }, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  // Auto-refresh when user returns to tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshCalendarData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

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
    const today = getCurrentISTDate()
    setCurrentDate(new Date(today.year, today.month - 1, 1))
    setTodayKey(getISTDateKey())
  }

  const formatRelativeUpdated = (date: Date | null) => {
    if (!date) return ''
    const diffSec = Math.floor((nowTicker - date.getTime()) / 1000)
    if (diffSec < 10) return 'Updated just now'
    if (diffSec < 60) return `Updated ${diffSec} sec ago`
    const diffMin = Math.floor(diffSec / 60)
    return `Updated ${diffMin} min ago`
  }

  // Group events by IST date key
  const eventsByDateKey: Record<string, CampusEvent[]> = {}
  eventsList.forEach((event) => {
    const key = getISTDateKey(event.date)
    if (!eventsByDateKey[key]) {
      eventsByDateKey[key] = []
    }
    eventsByDateKey[key].push(event)
  })

  // Calendar cells: 42 cells total (6 weeks x 7 days)
  const calendarCells = []

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const cellDate = new Date(year, month - 1, daysInPrevMonth - i)
    const key = getISTDateKey(cellDate)
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: cellDate,
      dateKey: key,
      events: eventsByDateKey[key] || [],
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d)
    const key = getISTDateKey(cellDate)
    const dayEvents = (eventsByDateKey[key] || []).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      date: cellDate,
      dateKey: key,
      events: dayEvents,
    })
  }

  // Next month leading days
  const remainingCells = 42 - calendarCells.length
  for (let d = 1; d <= remainingCells; d++) {
    const cellDate = new Date(year, month + 1, d)
    const key = getISTDateKey(cellDate)
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      date: cellDate,
      dateKey: key,
      events: eventsByDateKey[key] || [],
    })
  }

  return (
    <div
      className="card-surface"
      style={{
        padding: '24px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Calendar Header with Navigation, Month/Year, Today & Refresh buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              aria-label="Previous month"
              title="Previous month"
            >
              ‹
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
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              aria-label="Next month"
              title="Next month"
            >
              ›
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCurrentMonth}
              style={{ padding: '6px 14px', fontSize: 13, fontWeight: 600 }}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={refreshCalendarData}
              disabled={isRefreshing}
              style={{
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
              title="Refresh events and current calendar date"
            >
              <RefreshCw
                size={13}
                style={{
                  transition: 'transform 0.5s ease',
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isRefreshing ? 'Refreshing...' : '↻ Refresh'}</span>
            </button>
          </div>
          <span
            style={{
              fontSize: 11,
              color: 'var(--muted-foreground)',
              fontWeight: 500,
            }}
          >
            {formatRelativeUpdated(lastUpdated)}
          </span>
        </div>
      </div>

      {refreshError && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: 'rgba(234, 88, 12, 0.1)',
            color: 'var(--amber)',
            fontSize: 12,
            marginBottom: 12,
          }}
        >
          {refreshError}
        </div>
      )}

      {/* Weekday Names Header */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: 700 }}>
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
              const isCellToday = isTodayIST(cell.dateKey)
              return (
                <div
                  key={idx}
                  style={{
                    background: cell.isCurrentMonth
                      ? isCellToday
                        ? 'var(--paper-raised)'
                        : 'var(--paper)'
                      : 'var(--paper)',
                    minHeight: 115,
                    padding: '8px 7px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    opacity: cell.isCurrentMonth ? 1 : 0.45,
                    boxShadow: isCellToday ? 'inset 0 0 0 1.5px var(--amber)' : 'none',
                    borderRadius: isCellToday ? 4 : 0,
                  }}
                >
                  {/* Date Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 12,
                      fontWeight: isCellToday ? 700 : 500,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: isCellToday ? 24 : 'auto',
                        height: isCellToday ? 24 : 'auto',
                        borderRadius: isCellToday ? '50%' : 0,
                        background: isCellToday ? 'var(--amber)' : 'transparent',
                        color: isCellToday ? '#fff' : 'inherit',
                        fontSize: 12.5,
                      }}
                    >
                      {cell.day}
                    </span>

                    {isCellToday && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: 'var(--amber)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Day Events */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      marginTop: 2,
                      overflowY: 'auto',
                      maxHeight: 110,
                    }}
                  >
                    {cell.events.map((ev) => {
                      const colors =
                        CATEGORY_COLORS[ev.category] || {
                          bg: 'var(--line)',
                          text: 'var(--ink)',
                          border: 'transparent',
                        }
                      const time = new Date(ev.date).toLocaleTimeString('en-IN', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })

                      const isFull = ev.seatsAvailable <= 0

                      return (
                        <Link
                          key={ev.id}
                          href={`/events/${ev.id}`}
                          style={{
                            padding: '4px 6px',
                            borderRadius: 4,
                            fontSize: 11,
                            lineHeight: 1.25,
                            textDecoration: 'none',
                            background: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            display: 'block',
                            transition: 'transform 0.15s ease',
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
                              opacity: 0.9,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: 2,
                            }}
                          >
                            <span>{time}</span>
                            <span
                              style={{
                                fontWeight: isFull ? 700 : 500,
                                color: isFull ? '#dc2626' : 'inherit',
                              }}
                            >
                              {ev.cancelled ? 'Cancelled' : isFull ? 'Full' : `${ev.seatsAvailable} seats`}
                            </span>
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
      </div>
    </div>
  )
}
