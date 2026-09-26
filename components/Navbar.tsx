'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import ThemeToggle from './ThemeToggle'
import { GraduationCap, Briefcase, LogIn, ChevronDown } from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/registrations', label: 'My Registrations' },
  { href: '/organizer', label: 'Organizer' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { currentUser, setCurrentUserId, allUsers } = useAuth()
  const [loginMenuOpen, setLoginMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLoginMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        borderBottom: '1.5px solid var(--line)',
        background: 'var(--paper)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div
        className="shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          height: 68,
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--amber)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 18,
              color: 'var(--ink)',
            }}
          >
            Campus Connect
          </span>
        </Link>

        <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center' }}>
          <ul style={{ display: 'flex', gap: 4 }}>
            {LINKS.filter(
              (link) =>
                link.href !== '/organizer' || currentUser.role === 'organizer',
            ).map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius)',
                      fontSize: 14.5,
                      fontWeight: 500,
                      textDecoration: 'none',
                      color: active ? 'var(--ink)' : 'var(--ink-soft)',
                      background: active ? 'var(--slate-bg)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />

          {/* Login Portals Menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setLoginMenuOpen((o) => !o)}
              className="btn btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: 13.5,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
              aria-expanded={loginMenuOpen}
              aria-label="Login options"
            >
              <LogIn size={15} />
              <span>Login</span>
              <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </button>

            {loginMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: 240,
                  background: 'var(--card)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  padding: 8,
                  zIndex: 30,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Choose Login Portal
                </div>

                <Link
                  href="/login/student"
                  onClick={() => setLoginMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    background: pathname === '/login/student' ? 'var(--muted)' : 'transparent',
                  }}
                  className="login-menu-item"
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'rgba(22, 163, 74, 0.12)',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GraduationCap size={16} />
                  </span>
                  <div>
                    <div>Student Login</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 400 }}>
                      Book & manage seats
                    </div>
                  </div>
                </Link>

                <Link
                  href="/login/organizer"
                  onClick={() => setLoginMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: 'var(--foreground)',
                    background: pathname === '/login/organizer' ? 'var(--muted)' : 'transparent',
                  }}
                  className="login-menu-item"
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'rgba(221, 148, 37, 0.15)',
                      color: 'var(--amber)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Briefcase size={16} />
                  </span>
                  <div>
                    <div>Organiser Login</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 400 }}>
                      Publish & manage events
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Current User Role / Switcher */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--ink-soft)',
            }}
          >
            <span
              className="eyebrow-tag"
              style={{
                whiteSpace: 'nowrap',
                background:
                  currentUser.role === 'organizer'
                    ? 'rgba(221, 148, 37, 0.15)'
                    : 'rgba(22, 163, 74, 0.12)',
                color:
                  currentUser.role === 'organizer'
                    ? 'var(--amber)'
                    : '#16a34a',
                borderColor: 'transparent',
              }}
            >
              {currentUser.role}
            </span>
            <select
              aria-label="Switch current user"
              value={currentUser.id}
              onChange={(e) => setCurrentUserId(e.target.value)}
              style={{
                border: '1.5px solid var(--line)',
                borderRadius: 'var(--radius)',
                padding: '6px 8px',
                fontSize: 13.5,
                background: 'var(--paper-raised)',
                color: 'var(--ink)',
                maxWidth: 140,
              }}
            >
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  )
}
