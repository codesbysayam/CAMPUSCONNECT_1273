'use client'

import Link from 'next/link'
import { GraduationCap, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="shell" style={{ padding: '56px 0 80px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
        <span className="eyebrow-tag">campus authentication</span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', margin: '12px 0 16px' }}>
          Select Your Login Portal
        </h1>
        <p style={{ margin: '0 auto 40px', fontSize: 16.5, maxWidth: 600 }}>
          Campus Connect provides dedicated sign-in portals for students and event organisers.
          Choose your role below to access your dashboard.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            textAlign: 'left',
          }}
        >
          {/* Student Portal Card */}
          <div
            className="card-surface"
            style={{
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(22, 163, 74, 0.12)',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <GraduationCap size={26} />
              </div>
              <h2 style={{ fontSize: 22, marginBottom: 10 }}>Student Portal</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, marginBottom: 20 }}>
                Browse campus events, reserve seats, get event tickets, and view your active registrations.
              </p>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--muted)',
                  fontSize: 12.5,
                  color: 'var(--muted-foreground)',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>
                  Credentials:
                </div>
                <div>Email: <code>aditi.rao@campus.edu</code></div>
                <div>Pass: <code>student123</code></div>
              </div>
            </div>

            <Link
              href="/login/student"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Sign In as Student</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Organiser Portal Card */}
          <div
            className="card-surface"
            style={{
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
          >
            <div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(221, 148, 37, 0.15)',
                  color: 'var(--amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Briefcase size={26} />
              </div>
              <h2 style={{ fontSize: 22, marginBottom: 10 }}>Organiser Portal</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, marginBottom: 20 }}>
                Create club events, configure venue and capacity limits, cancel sessions, and view attendee lists.
              </p>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--muted)',
                  fontSize: 12.5,
                  color: 'var(--muted-foreground)',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>
                  Credentials:
                </div>
                <div>Email: <code>rohan.verma@campus.edu</code></div>
                <div>Pass: <code>organizer123</code></div>
              </div>
            </div>

            <Link
              href="/login/organizer"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Sign In as Organiser</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
