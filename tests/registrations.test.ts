import { describe, it, expect } from 'vitest'
import { getRegistrationsForStudent } from '@/data/registrations'

describe('getRegistrationsForStudent', () => {
  it('returns only the seeded registrations belonging to that student', () => {
    const mine = getRegistrationsForStudent('stu-1')
    expect(mine.length).toBe(3)
    expect(mine.every((reg) => reg.studentId === 'stu-1')).toBe(true)
  })
})
