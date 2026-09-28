import type { VercelRequest, VercelResponse } from '@vercel/node'
import { validateCredentials } from '../../data/auth'

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

  const email = String(req.body?.email ?? '')
    .trim()
    .toLowerCase()

  const password = String(req.body?.password ?? '')
  const expectedRole = req.body?.expectedRole

  const result = validateCredentials(
    email,
    password,
    expectedRole,
  )

  if (!result.success || !result.user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password.',
    })
  }

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  ).toISOString()

  return res.status(200).json({
    success: true,
    requiresOtp: true,
    email: result.user.email,
    expiresAt,
    message: 'Demo verification code generated. Use 123456.',
  })
}
