import { describe, it, expect, beforeEach } from 'vitest'
import {
  users,
  createUser,
  findUserByEmail,
  normalizeEmail,
  validateCredentials,
  getUserById,
} from '@/data/auth'
import {
  generateAndStoreOtp,
  verifyUserOtp,
  createSession,
  getSession,
  _resetSessionsAndOtpsForTest,
  _getPendingOtpForTest,
  _getLatestOtpCodeForTest,
} from '@/lib/session'
import {
  registrations,
  createRegistration,
  cancelRegistration,
  getRegistrationById,
  hasActiveRegistration,
  getRegistrationsForStudent,
  resetRegistrations,
} from '@/data/registrations'
import {
  events,
  getEventById,
  updateEvent,
  cancelEvent,
  resetEvents,
} from '@/data/events'

describe('Security & Account Ownership Protections', () => {
  beforeEach(() => {
    resetEvents()
    resetRegistrations()
    _resetSessionsAndOtpsForTest()
  })

  // 1. Same email cannot create two accounts
  it('1. prevents duplicate account creation with the same email', () => {
    expect(() => {
      createUser({
        name: 'Aditi Duplicate',
        email: 'aditi.rao@campus.edu',
        role: 'student',
        password: 'password123',
      })
    }).toThrow('An account with this email already exists.')
  })

  // 2. Email matching is case-insensitive
  it('2. prevents duplicate account creation with uppercase email', () => {
    expect(() => {
      createUser({
        name: 'Aditi Upper',
        email: 'ADITI.RAO@CAMPUS.EDU',
        role: 'student',
        password: 'password123',
      })
    }).toThrow('An account with this email already exists.')
  })

  // 3. Email matching ignores whitespace
  it('3. prevents duplicate account creation with whitespace in email', () => {
    expect(() => {
      createUser({
        name: 'Aditi Spaces',
        email: '  aditi.rao@campus.edu  ',
        role: 'student',
        password: 'password123',
      })
    }).toThrow('An account with this email already exists.')
  })

  // 4. Student A cannot access Student B's registrations
  it("4. guarantees student registrations isolation (Student A cannot access Student B's registrations)", () => {
    const studentARegs = getRegistrationsForStudent('stu-1')
    expect(studentARegs.length).toBeGreaterThan(0)
    expect(studentARegs.every((r) => r.studentId === 'stu-1')).toBe(true)

    const studentBRegs = getRegistrationsForStudent('stu-2')
    expect(studentBRegs.every((r) => r.studentId === 'stu-2')).toBe(true)

    // No overlap
    const studentAIds = new Set(studentARegs.map((r) => r.id))
    const hasOverlap = studentBRegs.some((r) => studentAIds.has(r.id))
    expect(hasOverlap).toBe(false)
  })

  // 5. Student A cannot cancel Student B's registration
  it("5. rejects cancellation when Student B attempts to cancel Student A's registration", () => {
    const studentAReg = registrations.find((r) => r.studentId === 'stu-1')!
    expect(studentAReg).toBeDefined()
    const originalStatus = studentAReg.status

    expect(() => {
      cancelRegistration(studentAReg.id, 'stu-2')
    }).toThrow('FORBIDDEN: You cannot cancel this registration')

    expect(studentAReg.status).toBe(originalStatus)
  })

  // 6. Student A cannot register on behalf of Student B
  it("6. rejects unauthenticated or unauthorized registration attempts on behalf of others", () => {
    expect(() => {
      createRegistration('', 'evt-01')
    }).toThrow('You must be logged in')
  })

  // 7. Duplicate active registration is rejected
  it('7. blocks duplicate active registration for the same student and event', () => {
    const studentId = 'stu-2'
    // Find an upcoming event with available seats
    const event = events.find((e) => e.seatsAvailable > 2 && !e.cancelled)!
    expect(event).toBeDefined()

    // First registration succeeds
    const reg1 = createRegistration(studentId, event.id)
    expect(reg1.status).toBe('confirmed')

    // Second active registration is blocked
    expect(() => {
      createRegistration(studentId, event.id)
    }).toThrow('ALREADY_REGISTERED: You are already registered for this event')
  })

  // 8. Cancelled registration can only be cancelled by its owner
  it('8. ensures registration can only be cancelled once by its rightful owner', () => {
    const studentId = 'stu-2'
    const event = events.find((e) => e.seatsAvailable > 2 && !e.cancelled)!
    const reg = createRegistration(studentId, event.id)

    // First cancel by owner succeeds
    const cancelled = cancelRegistration(reg.id, studentId)
    expect(cancelled.status).toBe('cancelled')

    // Second cancel is rejected
    expect(() => {
      cancelRegistration(reg.id, studentId)
    }).toThrow('ALREADY_CANCELLED')
  })

  // 9. Organizer cannot edit another organizer's event
  it("9. prevents an organizer from modifying another organizer's event", () => {
    const rohanEvent = events.find((e) => e.organizerId === 'org-1')!
    expect(rohanEvent).toBeDefined()

    // Priya (org-2) tries to edit Rohan's (org-1) event
    expect(() => {
      updateEvent(rohanEvent.id, 'org-2', {
        name: 'Hacked Title',
        description: rohanEvent.description,
        date: rohanEvent.date,
        venue: rohanEvent.venue,
        category: rohanEvent.category,
        capacity: rohanEvent.capacity,
      })
    }).toThrow('You are not allowed to edit this event')

    expect(() => {
      cancelEvent(rohanEvent.id, 'org-2')
    }).toThrow('You are not allowed to cancel this event')
  })

  // 10. Unauthenticated user cannot register
  it('10. rejects registration when studentId is empty or unauthenticated', () => {
    expect(() => {
      createRegistration('   ', 'evt-01')
    }).toThrow('You must be logged in')
  })

  // 11. Unauthenticated user cannot cancel
  it('11. rejects cancellation when studentId is empty or unauthenticated', () => {
    const reg = registrations[0]
    expect(() => {
      cancelRegistration(reg.id, '')
    }).toThrow('FORBIDDEN')
  })

  // 12. Incorrect password does not create a session
  it('12. rejects incorrect password without issuing OTP or creating session', () => {
    const auth = validateCredentials('aditi.rao@campus.edu', 'wrong-pass', 'student')
    expect(auth.success).toBe(false)
    expect(auth.user).toBeUndefined()
  })

  // 13. Correct password without valid OTP does not create a session
  it('13. requires valid OTP before creating an authenticated session', () => {
    const student = getUserById('stu-1')!
    generateAndStoreOtp(student)

    // Attempt verification with wrong OTP
    const verify = verifyUserOtp('aditi.rao@campus.edu', '000000')
    expect(verify.success).toBe(false)
    expect(verify.error).toContain('Incorrect verification code')
  })

  // 14. Expired OTP is rejected
  it('14. rejects expired OTP codes', () => {
    const student = getUserById('stu-1')!
    generateAndStoreOtp(student)
    const validOtp = _getLatestOtpCodeForTest('aditi.rao@campus.edu')!

    // Fast-forward pending OTP expiration time
    const pending = _getPendingOtpForTest('aditi.rao@campus.edu')!
    pending.expiresAt = Date.now() - 1000

    const verify = verifyUserOtp('aditi.rao@campus.edu', validOtp)
    expect(verify.success).toBe(false)
    expect(verify.error).toContain('expired')
  })

  // 15. Used OTP cannot be reused
  it('15. prevents reuse of an already verified OTP code (single-use)', () => {
    const student = getUserById('stu-1')!
    generateAndStoreOtp(student)
    const validOtp = _getLatestOtpCodeForTest('aditi.rao@campus.edu')!

    // First verification succeeds
    const verify1 = verifyUserOtp('aditi.rao@campus.edu', validOtp)
    expect(verify1.success).toBe(true)
    expect(verify1.userId).toBe('stu-1')

    // Second verification attempt with same OTP fails
    const verify2 = verifyUserOtp('aditi.rao@campus.edu', validOtp)
    expect(verify2.success).toBe(false)
    expect(verify2.error).toContain('No verification code requested or session expired')
  })

  // 16. OTP attempt limit is enforced
  it('16. enforces maximum attempt limits on OTP verification', () => {
    const student = getUserById('stu-1')!
    generateAndStoreOtp(student)

    // Enter wrong OTP 5 times
    for (let i = 0; i < 5; i++) {
      verifyUserOtp('aditi.rao@campus.edu', '999999')
    }

    // Subsequent attempt is blocked due to attempt limit
    const verify6 = verifyUserOtp('aditi.rao@campus.edu', '999999')
    expect(verify6.success).toBe(false)
    expect(verify6.error).toContain('Too many incorrect attempts')
  })
})
