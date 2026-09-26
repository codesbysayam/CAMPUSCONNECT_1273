'use client'

import { FormEvent, useState } from 'react'
import { EventCategory } from '@/data/events'
import { apiRequest } from '@/lib/api'

const CATEGORIES: EventCategory[] = [
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Career',
  'Music',
]

interface EventFormProps {
  organizerId: string
  eventId?: string
  initialValues?: {
    name: string
    description: string
    date: string
    venue: string
    category: EventCategory
    capacity: number
  }
  onSaved: () => void
  onCancel: () => void
}

export default function EventForm({
  organizerId,
  eventId,
  initialValues,
  onSaved,
  onCancel,
}: EventFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  )
  const [date, setDate] = useState(
    initialValues?.date ? initialValues.date.slice(0, 16) : '',
  )
  const [venue, setVenue] = useState(initialValues?.venue ?? '')
  const [category, setCategory] = useState<EventCategory>(
    initialValues?.category ?? 'Tech',
  )
  const [capacity, setCapacity] = useState(
    initialValues?.capacity?.toString() ?? '',
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Event name is required.')
      return
    }

    if (!venue.trim()) {
      setError('Venue is required.')
      return
    }

    if (!description.trim()) {
      setError('Description is required.')
      return
    }

    if (!date) {
      setError('A valid event date is required.')
      return
    }

    const eventDate = new Date(date)
    if (Number.isNaN(eventDate.getTime())) {
      setError('A valid event date is required.')
      return
    }

    if (eventDate.getTime() <= Date.now()) {
      setError('Event date must be in the future.')
      return
    }

    const numericCapacity = Number(capacity)
    if (!Number.isInteger(numericCapacity) || numericCapacity <= 0) {
      setError('Capacity must be a positive whole number.')
      return
    }

    setSaving(true)

    try {
      await apiRequest<{ success: boolean; event: unknown }>(
        eventId ? `/api/events/${eventId}` : '/api/events',
        {
          method: eventId ? 'PATCH' : 'POST',
          body: JSON.stringify({
            organizerId,
            name: name.trim(),
            description: description.trim(),
            date: eventDate.toISOString(),
            venue: venue.trim(),
            category,
            capacity: numericCapacity,
          }),
        },
      )

      setError('')
      onSaved()
    } catch (err: any) {
      setError(err.message || 'Unable to save event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-surface"
      style={{
        padding: 24,
        display: 'grid',
        gap: 14,
      }}
    >
      <h2 style={{ fontSize: 22 }}>
        {eventId ? 'Edit event' : 'Create event'}
      </h2>

      {error && (
        <p role="alert" style={{ color: 'var(--rust)', fontSize: 14 }}>
          {error}
        </p>
      )}

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, fontWeight: 500 }}>
        Event name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, fontWeight: 500 }}>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, fontWeight: 500 }}>
        Date and time
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, fontWeight: 500 }}>
        Venue
        <input
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, fontWeight: 500 }}>
        Category
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as EventCategory)}
        >
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: 14, fontWeight: 500 }}>
        Capacity
        <input
          type="number"
          min="1"
          step="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
      </label>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save event'}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
