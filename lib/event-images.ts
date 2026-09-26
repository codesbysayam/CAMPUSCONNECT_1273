const categoryImages: Record<string, string> = {
  tech: '/events/technology.svg',
  technology: '/events/technology.svg',
  sports: '/events/sports.svg',
  cultural: '/events/cultural.svg',
  workshop: '/events/workshop.svg',
  career: '/events/career.svg',
  music: '/events/music.svg',
}

export function getEventImage(category?: string): string {
  const key = (category || '').trim().toLowerCase()
  return categoryImages[key] || '/events/default.svg'
}
