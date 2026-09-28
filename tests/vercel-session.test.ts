import { describe, it, expect } from 'vitest'
import {
  createSignedSession,
  verifySignedSession,
  createSessionCookie,
  clearSessionCookie,
  SessionUser,
} from '@/lib/vercel-session'

describe('Vercel Stateless Session', () => {
  const sampleUser: SessionUser = {
    id: 'stu-1',
    name: 'Aditi Rao',
    email: 'aditi.rao@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
  }

  it('creates and verifies a signed session token', () => {
    const token = createSignedSession(sampleUser)
    expect(token).toBeTruthy()
    expect(token.includes('.')).toBe(true)

    const payload = verifySignedSession(token)
    expect(payload).not.toBeNull()
    expect(payload?.id).toBe(sampleUser.id)
    expect(payload?.email).toBe(sampleUser.email)
    expect(payload?.role).toBe(sampleUser.role)
  })

  it('rejects tampered session tokens', () => {
    const token = createSignedSession(sampleUser)
    const [encoded] = token.split('.')
    const tampered = `${encoded}.invalid-signature`

    const payload = verifySignedSession(tampered)
    expect(payload).toBeNull()
  })

  it('creates an HttpOnly session cookie string', () => {
    const cookie = createSessionCookie(sampleUser)
    expect(cookie).toContain('campus_session=')
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Path=/')
    expect(cookie).toContain('SameSite=Lax')
  })

  it('creates a clear session cookie string with Max-Age=0', () => {
    const cookie = clearSessionCookie()
    expect(cookie).toContain('campus_session=')
    expect(cookie).toContain('Max-Age=0')
  })
})
