'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { validateCredentials, UserRole } from '@/data/auth'
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

export default function LoginPage({
  initialRole = 'student',
}: {
  initialRole?: UserRole
}) {
  const router = useRouter()
  const { login } = useAuth()

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole)
  const [email, setEmail] = useState(
    initialRole === 'student' ? 'aditi.rao@campus.edu' : 'rohan.verma@campus.edu',
  )
  const [password, setPassword] = useState(
    initialRole === 'student' ? 'student123' : 'organizer123',
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role)
    setError(null)
    setSuccess(false)
    if (role === 'student') {
      setEmail('aditi.rao@campus.edu')
      setPassword('student123')
    } else {
      setEmail('rohan.verma@campus.edu')
      setPassword('organizer123')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    setTimeout(() => {
      const res = validateCredentials(email, password, activeRole)
      if (res.success && res.user) {
        login(res.user.id)
        setSuccess(true)
        setTimeout(() => {
          if (activeRole === 'organizer') {
            router.push('/organizer')
          } else {
            router.push('/events')
          }
        }, 500)
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.')
        setLoading(false)
      }
    }, 200)
  }

  const fillQuickCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError(null)
  }

  return (
    <div className="shell" style={{ padding: '48px 0 80px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="eyebrow-tag" style={{ marginBottom: 12 }}>
            <Sparkles size={13} />
            Campus Connect Login
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', marginTop: 8 }}>
            Sign In to Campus Connect
          </h1>
          <p
            style={{
              margin: '8px auto 0',
              fontSize: 15,
              color: 'var(--muted-foreground)',
              maxWidth: 420,
            }}
          >
            Select whether you are logging in as a student or an event organiser to continue.
          </p>
        </div>

        {/* Card Box */}
        <div
          className="card-surface"
          style={{
            padding: '28px 32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Role Selection Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              background: 'var(--muted)',
              padding: 6,
              borderRadius: 'var(--radius)',
              marginBottom: 24,
            }}
          >
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                transition: 'all 0.15s ease',
                background:
                  activeRole === 'student' ? 'var(--card)' : 'transparent',
                color:
                  activeRole === 'student' ? 'var(--foreground)' : 'var(--muted-foreground)',
                boxShadow:
                  activeRole === 'student'
                    ? '0 2px 8px rgba(0,0,0,0.08)'
                    : 'none',
              }}
            >
              <GraduationCap
                size={18}
                style={{
                  color: activeRole === 'student' ? '#16a34a' : 'inherit',
                }}
              />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('organizer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                transition: 'all 0.15s ease',
                background:
                  activeRole === 'organizer' ? 'var(--card)' : 'transparent',
                color:
                  activeRole === 'organizer' ? 'var(--foreground)' : 'var(--muted-foreground)',
                boxShadow:
                  activeRole === 'organizer'
                    ? '0 2px 8px rgba(0,0,0,0.08)'
                    : 'none',
              }}
            >
              <Briefcase
                size={18}
                style={{
                  color: activeRole === 'organizer' ? 'var(--amber)' : 'inherit',
                }}
              />
              <span>Organiser Login</span>
            </button>
          </div>

          {/* Role Header Description */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius)',
              background:
                activeRole === 'student'
                  ? 'rgba(22, 163, 74, 0.08)'
                  : 'rgba(221, 148, 37, 0.1)',
              border:
                activeRole === 'student'
                  ? '1px solid rgba(22, 163, 74, 0.2)'
                  : '1px solid rgba(221, 148, 37, 0.25)',
              marginBottom: 20,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--foreground)',
            }}
          >
            {activeRole === 'student' ? (
              <>
                <GraduationCap size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span>
                  <strong>Student Portal:</strong> Book seats, get tickets, and view registrations.
                </span>
              </>
            ) : (
              <>
                <Briefcase size={16} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                <span>
                  <strong>Organiser Portal:</strong> Publish club sessions, manage attendees, and track seats.
                </span>
              </>
            )}
          </div>

          {/* Feedback alerts */}
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
              <span>
                Authenticated as {activeRole}! Opening {activeRole === 'organizer' ? 'Organiser Dashboard' : 'Events'}...
              </span>
            </div>
          )}

          {/* Active Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label
                htmlFor="login-email"
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
                <Mail size={15} />{' '}
                {activeRole === 'student' ? 'Campus Student Email' : 'Organiser Email'}
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  activeRole === 'student'
                    ? 'e.g. aditi.rao@campus.edu'
                    : 'e.g. rohan.verma@campus.edu'
                }
                style={{ marginTop: 0 }}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
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
                <KeyRound size={15} /> Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
                justifyContent: 'center',
              }}
            >
              {loading ? (
                'Verifying...'
              ) : (
                <>
                  <span>
                    Sign In as {activeRole === 'student' ? 'Student' : 'Organiser'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontSize: 11.5,
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
              <ShieldCheck size={14} /> 1-Click {activeRole === 'student' ? 'Student' : 'Organiser'} Credentials:
            </div>

            {activeRole === 'student' ? (
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
            ) : (
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
            )}
          </div>
        </div>

        {/* Guest Browse Option */}
        <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13.5 }}>
          <Link
            href="/events"
            style={{
              color: 'var(--muted-foreground)',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Or browse campus events as guest →
          </Link>
        </div>
      </div>
    </div>
  )
}
