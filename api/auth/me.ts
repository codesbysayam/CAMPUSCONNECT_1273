import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSessionFromRequest } from '../../lib/vercel-session'

export default function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      authenticated: false,
      error: 'Method not allowed',
    })
  }

  const session = getSessionFromRequest(req)

  if (!session) {
    return res.status(200).json({
      authenticated: false,
    })
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      department: session.department,
    },
  })
}
