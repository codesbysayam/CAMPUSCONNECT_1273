import crypto from 'crypto'
import { AppUser, UserRole, getUserById, normalizeEmail } from '../data/auth'

export interface Session {
  id: string
  userId: string
  userRole: UserRole
  email: string
  name: string
  createdAt: number
  expiresAt: number
}

export interface PendingOtp {
  userId: string
  email: string
  otpHash: string
  expiresAt: number
  attempts: number
  used: boolean
  createdAt: number
}

export interface DeliveredEmail {
  id: string
  to: string
  subject: string
  body: string
  otp: string
  sentAt: number
}

// In-memory stores
const sessions = new Map<string, Session>()
const pendingOtps = new Map<string, PendingOtp>()
const simulatedMailbox: DeliveredEmail[] = []

const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes
const MAX_OTP_ATTEMPTS = 5
const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex')
}

export function generateAndStoreOtp(user: AppUser): {
  success: boolean
  expiresAt: number
  message: string
} {
  const normalized = normalizeEmail(user.email)

  // Generate 6-digit cryptographically secure OTP
  const otp = crypto.randomInt(100000, 1000000).toString()
  const otpHash = hashOtp(otp)
  const now = Date.now()
  const expiresAt = now + OTP_TTL_MS

  pendingOtps.set(normalized, {
    userId: user.id,
    email: normalized,
    otpHash,
    expiresAt,
    attempts: 0,
    used: false,
    createdAt: now,
  })

  // Simulate dispatch to user's registered inbox (in production, use nodemailer / SMTP)
  const emailRecord: DeliveredEmail = {
    id: `mail-${now}-${Math.random().toString(36).slice(2, 7)}`,
    to: normalized,
    subject: 'Campus Connect — Verification Code',
    body: `Your Campus Connect verification code is ${otp}. It will expire in 5 minutes. If you did not request this, please contact campus IT immediately.`,
    otp,
    sentAt: now,
  }
  simulatedMailbox.unshift(emailRecord)
  if (simulatedMailbox.length > 50) {
    simulatedMailbox.pop()
  }

  return {
    success: true,
    expiresAt,
    message: 'Verification code sent to your registered email.',
  }
}

export function verifyUserOtp(
  email: string,
  enteredOtp: string,
): {
  success: boolean
  userId?: string
  error?: string
} {
  const normalized = normalizeEmail(email)
  const pending = pendingOtps.get(normalized)

  if (!pending) {
    return {
      success: false,
      error: 'No verification code requested or session expired. Please log in again.',
    }
  }

  if (pending.used) {
    return {
      success: false,
      error: 'This verification code has already been used. Please request a new one.',
    }
  }

  if (Date.now() > pending.expiresAt) {
    pendingOtps.delete(normalized)
    return {
      success: false,
      error: 'Verification code has expired. Please request a new code.',
    }
  }

  if (pending.attempts >= MAX_OTP_ATTEMPTS) {
    pendingOtps.delete(normalized)
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, this verification code was invalidated.',
    }
  }

  pending.attempts += 1
  const enteredHash = hashOtp(enteredOtp)

  if (pending.otpHash !== enteredHash) {
    const remaining = MAX_OTP_ATTEMPTS - pending.attempts
    return {
      success: false,
      error:
        remaining > 0
          ? `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Too many incorrect attempts. Please request a new code.',
    }
  }

  // Success: mark as used
  pending.used = true
  pendingOtps.delete(normalized)

  return {
    success: true,
    userId: pending.userId,
  }
}

export function createSession(user: AppUser): {
  token: string
  session: Session
} {
  const token = crypto.randomBytes(32).toString('hex')
  const now = Date.now()

  const session: Session = {
    id: token,
    userId: user.id,
    userRole: user.role,
    email: user.email,
    name: user.name,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  }

  sessions.set(token, session)
  return { token, session }
}

export function getSession(token: string): Session | null {
  if (!token) return null
  const session = sessions.get(token)
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    sessions.delete(token)
    return null
  }

  return session
}

export function destroySession(token: string): void {
  if (token) {
    sessions.delete(token)
  }
}

export function parseSessionCookie(cookieHeader?: string): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/(?:^|;\s*)campus_session=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function getAuthenticatedSession(
  req: { headers?: { cookie?: string; authorization?: string } },
): Session | null {
  // Check authorization header first: Bearer <token>
  const authHeader = req.headers?.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    const session = getSession(token)
    if (session) return session
  }

  // Check HttpOnly cookie
  const cookieToken = parseSessionCookie(req.headers?.cookie)
  if (cookieToken) {
    return getSession(cookieToken)
  }

  return null
}

// Development helper: inspect mailbox for simulated emails without returning OTP in login response
export function getSimulatedMailbox(forEmail?: string): DeliveredEmail[] {
  if (!forEmail) return simulatedMailbox
  const normalized = normalizeEmail(forEmail)
  return simulatedMailbox.filter((m) => m.to === normalized)
}

// Test helpers
export function _resetSessionsAndOtpsForTest(): void {
  sessions.clear()
  pendingOtps.clear()
  simulatedMailbox.length = 0
}

export function _getPendingOtpForTest(email: string): PendingOtp | undefined {
  return pendingOtps.get(normalizeEmail(email))
}

export function _getLatestOtpCodeForTest(email: string): string | undefined {
  const normalized = normalizeEmail(email)
  const item = simulatedMailbox.find((m) => m.to === normalized)
  return item?.otp
}
