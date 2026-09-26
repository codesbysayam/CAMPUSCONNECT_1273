'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { validateCredentials } from '@/data/auth'
import { GraduationCap, ArrowRight, ShieldCheck, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export default function StudentLoginPage() {
  const router = useRouter()
  const { login, currentUser } = useAuth()

  const [email, setEmail] = useState('aditi.rao@campus.edu')
  const [password, setPassword] = useState('student123')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    setTimeout(() => {
      const res = validateCredentials(email, password, 'student')
      if (res.success && res.user) {
        login(res.user.id)
        setSuccess(true)
        setTimeout(() => {
          router.push('/events')
        }, 600)
      } else {
        setError(res.error || 'Authentication failed. Please verify your credentials.')
        setLoading(false)
      }
    }, 250)
  }

  const fillQuickCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError(null)
  }

  return (
    <div className="shell" style={{ padding: '48px 0 72px' }}>
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(22, 163, 74, 0.12)',
              color: '#16a34a',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            <GraduationCap size={16} />
            Student Portal
          </div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Student Sign In</h1>
          <p style={{ margin: '0 auto', fontSize: 15, color: 'var(--muted-foreground)' }}>
            Sign in with your campus student credentials to book seats and view tickets.
          </p>
        </div>

        {/* Card */}
        <div
          className="card-surface"
          style={{
            padding: 32,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                background: 'rgba(220, 38, 38, 0.12)',
                color: '#dc2626',
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                background: 'rgba(22, 163, 74, 0.12)',
                color: '#16a34a',
                fontSize: 14,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={18} />
              <span>Welcome back! Redirecting to events...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label
                htmlFor="student-email"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  marginBottom: 6,
                }}
              >
                <Mail size={15} /> Campus Email Address
              </label>
              <input
                id="student-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aditi.rao@campus.edu"
                style={{ marginTop: 0 }}
              />
            </div>

            <div>
              <label
                htmlFor="student-password"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  marginBottom: 6,
                }}
              >
                <KeyRound size={15} /> Student Password
              </label>
              <input
                id="student-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your student password"
                style={{ marginTop: 0 }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: 15,
                marginTop: 6,
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In as Student'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div
            style={{
              marginTop: 26,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--muted-foreground)',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ShieldCheck size={14} /> Quick Student Credentials:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => fillQuickCredentials('aditi.rao@campus.edu', 'student123')}
                className="btn btn-secondary"
                style={{
                  fontSize: 12,
                  padding: '8px 10px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  lineHeight: 1.3,
                  textAlign: 'left',
                }}
              >
                <strong>Aditi Rao</strong>
                <span style={{ fontSize: 11, opacity: 0.75 }}>student123</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials('rahul.sharma@campus.edu', 'student123')}
                className="btn btn-secondary"
                style={{
                  fontSize: 12,
                  padding: '8px 10px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  lineHeight: 1.3,
                  textAlign: 'left',
                }}
              >
                <strong>Rahul Sharma</strong>
                <span style={{ fontSize: 11, opacity: 0.75 }}>student123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Switch portal footer */}
        <div
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: 14,
            color: 'var(--muted-foreground)',
          }}
        >
          Organising a campus event or club?{' '}
          <Link
            href="/login/organizer"
            style={{
              color: 'var(--foreground)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Go to Organiser Login →
          </Link>
        </div>
      </div>
    </div>
  )
}
