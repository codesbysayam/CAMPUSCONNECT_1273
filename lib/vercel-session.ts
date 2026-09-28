import crypto from 'crypto'

const SESSION_SECRET =
  process.env.CAMPUS_SESSION_SECRET ||
  'campus-connect-demo-secret-change-me'

const MAX_AGE = 60 * 60 * 24 // 24 hours

export type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  department?: string
}

export type SessionPayload = SessionUser & {
  exp: number
}

function base64url(value: string | Buffer): string {
  const buf = typeof value === 'string' ? Buffer.from(value) : value
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function sign(value: string): string {
  return base64url(
    crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(value)
      .digest(),
  )
}

export function createSignedSession(user: SessionUser): string {
  const payload: SessionPayload = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  }

  const encoded = base64url(JSON.stringify(payload))
  const signature = sign(encoded)

  return `${encoded}.${signature}`
}

export function verifySignedSession(
  token: string | undefined,
): SessionPayload | null {
  if (!token) return null

  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = sign(encoded)
  if (signature.length !== expected.length) return null

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    )
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as SessionPayload

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function getSessionFromRequest(req: any): SessionPayload | null {
  const cookieHeader = String(
    req.headers?.cookie || req.headers?.get?.('cookie') || '',
  )

  const match = cookieHeader.match(/(?:^|;\s*)campus_session=([^;]+)/)
  if (!match) return null

  const token = decodeURIComponent(match[1])
  return verifySignedSession(token)
}

export function createSessionCookie(user: SessionUser): string {
  const token = createSignedSession(user)
  const isProd = process.env.NODE_ENV === 'production'
  const secure = isProd ? '; Secure' : ''

  return [
    `campus_session=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE}`,
    secure,
  ]
    .filter(Boolean)
    .join('; ')
}

export function clearSessionCookie(): string {
  return [
    'campus_session=',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ].join('; ')
}
