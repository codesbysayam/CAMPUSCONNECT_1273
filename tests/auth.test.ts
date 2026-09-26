import { describe, it, expect } from 'vitest'
import {
  users,
  getUserById,
  getUserByEmail,
  validateCredentials,
} from '@/data/auth'

describe('User Authentication & Credentials', () => {
  it('has seeded students and organizers with valid credentials', () => {
    const students = users.filter((u) => u.role === 'student')
    const organizers = users.filter((u) => u.role === 'organizer')

    expect(students.length).toBeGreaterThanOrEqual(1)
    expect(organizers.length).toBeGreaterThanOrEqual(1)

    students.forEach((s) => {
      expect(s.email).toBeTruthy()
      expect(s.password).toBeTruthy()
      expect(s.role).toBe('student')
    })

    organizers.forEach((o) => {
      expect(o.email).toBeTruthy()
      expect(o.password).toBeTruthy()
      expect(o.role).toBe('organizer')
    })
  })

  it('authenticates valid student credentials', () => {
    const res = validateCredentials('aditi.rao@campus.edu', 'student123', 'student')
    expect(res.success).toBe(true)
    expect(res.user?.id).toBe('stu-1')
    expect(res.user?.name).toBe('Aditi Rao')
    expect(res.user?.role).toBe('student')
  })

  it('authenticates valid organizer credentials', () => {
    const res = validateCredentials('rohan.verma@campus.edu', 'organizer123', 'organizer')
    expect(res.success).toBe(true)
    expect(res.user?.id).toBe('org-1')
    expect(res.user?.name).toBe('Rohan Verma')
    expect(res.user?.role).toBe('organizer')
  })

  it('rejects wrong password', () => {
    const res = validateCredentials('aditi.rao@campus.edu', 'wrongpass', 'student')
    expect(res.success).toBe(false)
    expect(res.error).toContain('Invalid password')
  })

  it('rejects non-existent email', () => {
    const res = validateCredentials('unknown@campus.edu', 'student123', 'student')
    expect(res.success).toBe(false)
    expect(res.error).toContain('No account found')
  })

  it('rejects when student tries to log in via organizer portal', () => {
    const res = validateCredentials('aditi.rao@campus.edu', 'student123', 'organizer')
    expect(res.success).toBe(false)
    expect(res.error).toContain('This account is registered as a student')
  })

  it('rejects when organizer tries to log in via student portal', () => {
    const res = validateCredentials('rohan.verma@campus.edu', 'organizer123', 'student')
    expect(res.success).toBe(false)
    expect(res.error).toContain('This account is registered as a organizer')
  })

  it('finds user by email case-insensitively', () => {
    const user = getUserByEmail('ADITI.RAO@CAMPUS.EDU')
    expect(user).toBeDefined()
    expect(user?.id).toBe('stu-1')
  })

  it('finds user by ID', () => {
    const user = getUserById('org-1')
    expect(user).toBeDefined()
    expect(user?.name).toBe('Rohan Verma')
  })
})
