import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  const email = String(
    req.query.email || 'student@campus.edu',
  )

  return res.status(200).json({
    success: true,
    messages: [
      {
        id: `demo-${Date.now()}`,
        to: email,
        subject: 'Campus Connect Verification Code',
        body: 'Your Campus Connect demo verification code is 123456.',
        otp: '123456',
        sentAt: Date.now(),
      },
    ],
  })
}
