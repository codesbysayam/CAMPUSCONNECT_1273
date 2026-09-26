'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { validateCredentials } from '@/data/auth'
import { Briefcase, ArrowRight, ShieldCheck, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export default function OrganizerLoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState('rohan.verma@campus.edu')
  const [password, setPassword] = useState('organizer123')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    setTimeout(() => {
      const res = validateCredentials(email, password, 'organizer')
      if (res.success && res.user) {
        login(res.user.id)
        setSuccess(true)
        setTimeout(() => {
          router.push('/organizer')
        }, 600)
      } else {
        setError(res.error || 'Authentication failed. Please verify your organiser credentials.')
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
              background: 'rgba(221, 148, 37, 0.15)',
              color: 'var(--amber)',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            <Briefcase size={16} />
            Organiser Portal
          </div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Organiser Sign In</h1>
          <p style={{ margin: '0 auto', fontSize: 15, color: 'var(--muted-foreground)' }}>
            Sign in to manage club registrations, publish campus events, and manage seat capacities.
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
              <span>Authentication verified! Loading Organiser Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label
                htmlFor="organizer-email"
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
                <Mail size={15} /> Organiser Account Email
              </label>
              <input
                id="organizer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rohan.verma@campus.edu"
                style={{ marginTop: 0 }}
              />
            </div>

            <div>
              <label
                htmlFor="organizer-password"
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
                <KeyRound size={15} /> Organiser Password
              </label>
              <input
                id="organizer-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your organiser password"
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
              {loading ? 'Authenticating...' : 'Sign In as Organiser'}
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
              <ShieldCheck size={14} /> Quick Organiser Credentials:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => fillQuickCredentials('rohan.verma@campus.edu', 'organizer123')}
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
                <strong>Rohan Verma</strong>
                <span style={{ fontSize: 11, opacity: 0.75 }}>organizer123</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials('priya.sen@campus.edu', 'organizer123')}
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
                <strong>Priya Sen</strong>
                <span style={{ fontSize: 11, opacity: 0.75 }}>organizer123</span>
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
          Looking to register for campus events?{' '}
          <Link
            href="/login/student"
            style={{
              color: 'var(--foreground)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Go to Student Login →
          </Link>
        </div>
      </div>
    </div>
  )
}
