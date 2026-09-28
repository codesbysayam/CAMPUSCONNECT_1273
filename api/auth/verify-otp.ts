import type { VercelRequest, VercelResponse } from '@vercel/node'
import { users, normalizeEmail } from '../../data/auth'
import { createSessionCookie } from '../../lib/vercel-session'

export default function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  const email = normalizeEmail(
    String(req.body?.email ?? ''),
  )

  const otp = String(req.body?.otp ?? '').trim()

  if (otp !== '123456') {
    return res.status(400).json({
      success: false,
      error: 'Invalid verification code.',
    })
  }

  const user = users.find(
    (item) => normalizeEmail(item.email) === email,
  )

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User account not found.',
    })
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  }

  res.setHeader(
    'Set-Cookie',
    createSessionCookie(safeUser),
  )

  return res.status(200).json({
    success: true,
    authenticated: true,
    user: safeUser,
  })
}
