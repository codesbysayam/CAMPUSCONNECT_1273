'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { UserRole } from '@/data/auth'
import { apiRequest } from '@/lib/api'
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
  Lock,
  Inbox,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react'

export default function LoginPage({
  initialRole = 'student',
}: {
  initialRole?: UserRole
}) {
  const router = useRouter()
  const { sendLoginOtp, verifyOtpAndLogin } = useAuth()

  const [activeRole, setActiveRole] = useState<UserRole>(initialRole)
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [email, setEmail] = useState(
    initialRole === 'student' ? 'aditi.rao@campus.edu' : 'rohan.verma@campus.edu',
  )
  const [password, setPassword] = useState(
    initialRole === 'student' ? 'student123' : 'organizer123',
  )
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Dev-mode simulated email mailbox
  const [showMailbox, setShowMailbox] = useState(false)
  const [mailboxMessages, setMailboxMessages] = useState<
    Array<{ id: string; to: string; subject: string; body: string; otp: string; sentAt: number }>
  >([])

  const fetchMailbox = async () => {
    try {
      const res = await apiRequest<{
        success: boolean
        messages: Array<{ id: string; to: string; subject: string; body: string; otp: string; sentAt: number }>
      }>(`/api/auth/dev-mailbox?email=${encodeURIComponent(email)}`)
      if (res.success) {
        setMailboxMessages(res.messages || [])
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (step === 'otp') {
      fetchMailbox()
    }
  }, [step, email])

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role)
    setStep('credentials')
    setError(null)
    setInfo(null)
    setSuccess(false)
    setOtp('')
    if (role === 'student') {
      setEmail('aditi.rao@campus.edu')
      setPassword('student123')
    } else {
      setEmail('rohan.verma@campus.edu')
      setPassword('organizer123')
    }
  }

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    try {
      const res = await sendLoginOtp(email, password, activeRole)
      if (res.requiresOtp) {
        setStep('otp')
        setInfo(res.message || 'Verification code sent to your registered email.')
        fetchMailbox()
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Submit OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    try {
      const res = await verifyOtpAndLogin(email, otp.trim())
      if (res.success && res.user) {
        setSuccess(true)
        setTimeout(() => {
          if (activeRole === 'organizer') {
            router.push('/organizer')
          } else {
            router.push('/events')
          }
        }, 500)
      } else {
        setError('Invalid verification code.')
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      const res = await sendLoginOtp(email, password, activeRole)
      setInfo('A new verification code was sent to your registered email.')
      fetchMailbox()
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  const fillQuickCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setStep('credentials')
    setError(null)
    setInfo(null)
  }

  return (
    <div className="shell" style={{ padding: '48px 0 80px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="eyebrow-tag" style={{ marginBottom: 12 }}>
            <Sparkles size={13} />
            Secure Two-Factor Authentication
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
            {step === 'credentials'
              ? 'Enter your credentials to receive an email verification code.'
              : 'Enter the 6-digit verification code sent to your registered email.'}
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
          {/* Step 1: Role Selection Tabs */}
          {step === 'credentials' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                background: 'var(--muted)',
                padding: 6,
                borderRadius: 'var(--radius)',
                marginBottom: 20,
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
                    activeRole === 'student'
                      ? 'var(--foreground)'
                      : 'var(--muted-foreground)',
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
                    activeRole === 'organizer'
                      ? 'var(--foreground)'
                      : 'var(--muted-foreground)',
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
          )}

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

          {info && !error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#0284c7',
                fontSize: 14,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              <Mail size={18} />
              <span>{info}</span>
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
                Authenticated as {activeRole}! Opening{' '}
                {activeRole === 'organizer' ? 'Organiser Dashboard' : 'Events'}...
              </span>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 1 FORM: Email + Password */}
          {/* ========================================================= */}
          {step === 'credentials' && (
            <form
              onSubmit={handleCredentialsSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
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
                  {activeRole === 'student'
                    ? 'Registered Student Email'
                    : 'Organiser Account Email'}
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
                  placeholder="Enter your password"
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
                  'Verifying credentials...'
                ) : (
                  <>
                    <span>Next: Send Email OTP</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* STEP 2 FORM: 6-Digit Email OTP */}
          {/* ========================================================= */}
          {step === 'otp' && (
            <form
              onSubmit={handleOtpSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--muted)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <div style={{ color: 'var(--foreground)', fontWeight: 600 }}>
                  Recipient Email:
                </div>
                <div style={{ color: 'var(--muted-foreground)' }}>{email}</div>
              </div>

              <div>
                <label
                  htmlFor="otp-code"
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
                  <Lock size={15} /> Enter 6-Digit Verification Code
                </label>
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  style={{
                    marginTop: 0,
                    fontSize: 24,
                    letterSpacing: '0.25em',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || success || otp.length < 6}
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
                  'Verifying OTP...'
                ) : (
                  <>
                    <span>Verify Code & Complete Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 4,
                  fontSize: 13,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials')
                    setOtp('')
                    setError(null)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted-foreground)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: 0,
                  }}
                >
                  <ArrowLeft size={14} /> Back to credentials
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--foreground)',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: 0,
                  }}
                >
                  <RefreshCw size={13} /> Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* SIMULATED CAMPUS WEBMAIL (DEV & TESTING HELPER) */}
          {/* ========================================================= */}
          {step === 'otp' && (
            <div
              style={{
                marginTop: 20,
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                border: '1.5px dashed var(--border)',
                background: 'var(--paper)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--foreground)',
                  }}
                >
                  <Inbox size={15} />
                  <span>Campus Mailbox Simulator (Dev / Test)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    fetchMailbox()
                    setShowMailbox((s) => !s)
                  }}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: 'var(--card)',
                    cursor: 'pointer',
                  }}
                >
                  {showMailbox ? 'Hide Inbox' : 'Open Inbox'}
                </button>
              </div>

              {showMailbox && (
                <div style={{ marginTop: 10, fontSize: 12 }}>
                  {mailboxMessages.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                      No messages received yet. Click "Resend OTP" to generate a code.
                    </p>
                  ) : (
                    mailboxMessages.slice(0, 3).map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 4,
                          background: 'var(--card)',
                          marginBottom: 6,
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                          {msg.subject}
                        </div>
                        <div style={{ color: 'var(--muted-foreground)', marginTop: 2 }}>
                          {msg.body}
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtp(msg.otp)}
                          style={{
                            marginTop: 6,
                            fontSize: 11,
                            padding: '2px 8px',
                            background: 'var(--muted)',
                            border: '1px solid var(--border)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          Auto-fill Code ({msg.otp})
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Credentials */}
          {step === 'credentials' && (
            <div
              style={{
                marginTop: 22,
                paddingTop: 16,
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
                    onClick={() =>
                      fillQuickCredentials('aditi.rao@campus.edu', 'student123')
                    }
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
                    onClick={() =>
                      fillQuickCredentials('rahul.sharma@campus.edu', 'student123')
                    }
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
                    onClick={() =>
                      fillQuickCredentials('rohan.verma@campus.edu', 'organizer123')
                    }
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
                    onClick={() =>
                      fillQuickCredentials('priya.sen@campus.edu', 'organizer123')
                    }
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
          )}
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
