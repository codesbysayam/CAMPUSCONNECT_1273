'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import ThemeToggle from './ThemeToggle'
import {
  GraduationCap,
  Briefcase,
  LogIn,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/registrations', label: 'My Registrations' },
  { href: '/organizer', label: 'Organizer' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { currentUser, logout } = useAuth()
  const [loginMenuOpen, setLoginMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  // Close menus on route change
  useEffect(() => {
    setLoginMenuOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLoginMenuOpen(false)
      }
      if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleLinks = LINKS.filter(
    (link) => link.href !== '/organizer' || currentUser?.role === 'organizer',
  )

  return (
    <header
      style={{
        borderBottom: '1.5px solid var(--line)',
        background: 'var(--paper)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 64,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            flexShrink: 0,
            padding: '6px 0',
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
              fontSize: 'clamp(16px, 3.5vw, 18px)',
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
            }}
          >
            Campus Connect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary"
          className="desktop-nav"
          style={{ display: 'none' }}
        >
          <ul style={{ display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
            {visibleLinks.map((link) => {
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
                      fontSize: 14,
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

        {/* Controls: ThemeToggle + Auth Action + Mobile Menu Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />

          {!currentUser ? (
            /* Unauthenticated Login dropdown */
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setLoginMenuOpen((o) => !o)}
                className="btn btn-primary"
                style={{
                  padding: '7px 14px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 40,
                }}
                aria-expanded={loginMenuOpen}
                aria-label="Login options"
              >
                <LogIn size={15} />
                <span>Sign In</span>
                <ChevronDown size={14} style={{ opacity: 0.8 }} />
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
                    zIndex: 50,
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
                    Select Portal
                  </div>

                  <Link
                    href="/login/student"
                    onClick={() => setLoginMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px',
                      borderRadius: 6,
                      textDecoration: 'none',
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      minHeight: 44,
                    }}
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
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--muted-foreground)',
                          fontWeight: 400,
                        }}
                      >
                        Book seats & tickets
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
                      padding: '10px',
                      borderRadius: 6,
                      textDecoration: 'none',
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      minHeight: 44,
                    }}
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
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--muted-foreground)',
                          fontWeight: 400,
                        }}
                      >
                        Publish & manage events
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Authenticated User Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                className="desktop-user-badge"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--foreground)',
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
                    padding: '2px 8px',
                    fontSize: 11,
                  }}
                >
                  {currentUser.role}
                </span>
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="btn btn-secondary"
                style={{
                  padding: '6px 10px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  gap: 4,
                  minHeight: 38,
                }}
                title="Sign out of Campus Connect"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-nav-toggle btn btn-secondary"
            onClick={() => setMobileMenuOpen((o) => !o)}
            style={{
              padding: 0,
              width: 40,
              height: 40,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileRef}
          style={{
            borderTop: '1px solid var(--line)',
            background: 'var(--paper)',
            padding: '12px 16px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
          className="mobile-nav-menu"
        >
          {currentUser && (
            <div
              style={{
                padding: '6px 10px',
                fontSize: 12,
                color: 'var(--muted-foreground)',
                borderBottom: '1px solid var(--line)',
                marginBottom: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Signed in as <strong>{currentUser.name}</strong></span>
              <span style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--amber)' }}>
                {currentUser.role}
              </span>
            </div>
          )}

          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {visibleLinks.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius)',
                      fontSize: 15,
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: active ? 'var(--ink)' : 'var(--ink-soft)',
                      background: active ? 'var(--slate-bg)' : 'transparent',
                      minHeight: 44,
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </header>
  )
}
