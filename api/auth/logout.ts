import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clearSessionCookie } from '../../lib/vercel-session'

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

  res.setHeader(
    'Set-Cookie',
    clearSessionCookie(),
  )

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  })
}
