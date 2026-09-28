import { describe, it, expect } from 'vitest'
import { getEventImage } from '@/lib/event-images'
import { events } from '@/data/events'

describe('Event Images Mapping', () => {
  it('assigns an appropriate, distinct, non-football image to every seeded event', () => {
    for (const evt of events) {
      const img = getEventImage(evt)
      expect(img).toBeTruthy()
      expect(img).not.toBe('/events/default.svg')

      // Basketball must NEVER have a football image
      if (evt.name.toLowerCase().includes('basketball') || evt.id === 'evt-07') {
        expect(img).toBe('/events/basketball-3x3.jpg')
      }

      // Badminton must NEVER have a football or basketball image
      if (evt.name.toLowerCase().includes('badminton')) {
        expect(img).toMatch(/badminton/)
      }

      // Classical Music must NEVER have books or tech images
      if (evt.name.toLowerCase().includes('classical fusion') || evt.id === 'evt-11') {
        expect(img).toBe('/events/classical-fusion-night.jpg')
      }

      // Diwali Mela must have diwali-mela.jpg
      if (evt.name.toLowerCase().includes('diwali') || evt.id === 'evt-06') {
        expect(img).toBe('/events/diwali-mela.jpg')
      }

      // Cloud DevOps must have cloud-devops-kickoff.jpg
      if (evt.name.toLowerCase().includes('cloud') || evt.id === 'evt-14') {
        expect(img).toBe('/events/cloud-devops-kickoff.jpg')
      }
    }
  })

  it('maps all 15 events to dedicated photographic files', () => {
    expect(getEventImage({ id: 'evt-01', name: 'Hack the Campus 2026' } as any)).toBe('/events/hack-campus-2026.jpg')
    expect(getEventImage({ id: 'evt-02', name: 'Acoustic Nights: Open Mic' } as any)).toBe('/events/acoustic-open-mic.jpg')
    expect(getEventImage({ id: 'evt-03', name: 'Resume & LinkedIn Clinic' } as any)).toBe('/events/resume-linkedin-clinic.jpg')
    expect(getEventImage({ id: 'evt-04', name: 'Inter-Hostel Football Cup — Final' } as any)).toBe('/events/football-final.jpg')
    expect(getEventImage({ id: 'evt-05', name: 'Intro to Figma Workshop' } as any)).toBe('/events/figma-workshop.jpg')
    expect(getEventImage({ id: 'evt-06', name: 'Diwali Mela' } as any)).toBe('/events/diwali-mela.jpg')
    expect(getEventImage({ id: 'evt-07', name: 'Basketball 3x3 Street League' } as any)).toBe('/events/basketball-3x3.jpg')
    expect(getEventImage({ id: 'evt-08', name: 'Full Stack Development Bootcamp' } as any)).toBe('/events/full-stack-bootcamp.jpg')
    expect(getEventImage({ id: 'evt-09', name: 'Campus Photography Walk' } as any)).toBe('/events/campus-photography-walk.jpg')
    expect(getEventImage({ id: 'evt-10', name: 'Inter-Department Badminton Championship' } as any)).toBe('/events/badminton-championship.jpg')
    expect(getEventImage({ id: 'evt-11', name: 'Classical Fusion Night' } as any)).toBe('/events/classical-fusion-night.jpg')
    expect(getEventImage({ id: 'evt-12', name: 'Data Structures Doubt-Clearing Marathon' } as any)).toBe('/events/ds-marathon.jpg')
    expect(getEventImage({ id: 'evt-13', name: "Freshers' Orientation Games" } as any)).toBe('/events/freshers-orientation.jpg')
    expect(getEventImage({ id: 'evt-14', name: 'Cloud & DevOps Study Group Kickoff' } as any)).toBe('/events/cloud-devops-kickoff.jpg')
    expect(getEventImage({ id: 'evt-15', name: 'Badminton Doubles Tournament' } as any)).toBe('/events/badminton-doubles.jpg')
  })
})
