import type { CampusEvent } from '@/data/events'

const EVENT_IMAGES: Record<string, string> = {
  'evt-01': '/events/hack-campus-2026.jpg',
  'evt-02': '/events/acoustic-open-mic.jpg',
  'evt-03': '/events/resume-linkedin-clinic.jpg',
  'evt-04': '/events/football-final.jpg',
  'evt-05': '/events/figma-workshop.jpg',
  'evt-06': '/events/diwali-mela.jpg',
  'evt-07': '/events/basketball-3x3.jpg',
  'evt-08': '/events/full-stack-bootcamp.jpg',
  'evt-09': '/events/campus-photography-walk.jpg',
  'evt-10': '/events/badminton-championship.jpg',
  'evt-11': '/events/classical-fusion-night.jpg',
  'evt-12': '/events/ds-marathon.jpg',
  'evt-13': '/events/freshers-orientation.jpg',
  'evt-14': '/events/cloud-devops-kickoff.jpg',
  'evt-15': '/events/badminton-doubles.jpg',
}

const EVENT_NAME_MATCHERS: Array<{ match: RegExp; image: string }> = [
  { match: /basketball/i, image: '/events/basketball-3x3.jpg' },
  { match: /badminton doubles/i, image: '/events/badminton-doubles.jpg' },
  { match: /badminton/i, image: '/events/badminton-championship.jpg' },
  { match: /football|soccer/i, image: '/events/football-final.jpg' },
  { match: /classical fusion|carnatic|hindustani/i, image: '/events/classical-fusion-night.jpg' },
  { match: /acoustic|open mic/i, image: '/events/acoustic-open-mic.jpg' },
  { match: /diwali|mela/i, image: '/events/diwali-mela.jpg' },
  { match: /photography|photo walk/i, image: '/events/campus-photography-walk.jpg' },
  { match: /figma|ui|ux|design studio/i, image: '/events/figma-workshop.jpg' },
  { match: /cloud|devops|aws|docker|kubernetes/i, image: '/events/cloud-devops-kickoff.jpg' },
  { match: /doubt|data structure|trees|heaps|algorithm/i, image: '/events/ds-marathon.jpg' },
  { match: /freshers|orientation|scavenger hunt/i, image: '/events/freshers-orientation.jpg' },
  { match: /full stack|bootcamp/i, image: '/events/full-stack-bootcamp.jpg' },
  { match: /hack the campus|hackathon/i, image: '/events/hack-campus-2026.jpg' },
  { match: /resume|linkedin|placement/i, image: '/events/resume-linkedin-clinic.jpg' },
]

export function getEventImage(event: CampusEvent): string {
  if (!event) return '/events/default-event.jpg'

  // 1. Primary: Specific Event ID resolution
  if (event.id && EVENT_IMAGES[event.id]) {
    return EVENT_IMAGES[event.id]
  }

  // 2. Secondary: Specific Event name matcher
  if (event.name) {
    for (const rule of EVENT_NAME_MATCHERS) {
      if (rule.match.test(event.name)) {
        return rule.image
      }
    }
  }

  // 3. Fallback
  return '/events/default-event.jpg'
}
