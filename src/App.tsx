/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider, useAuth } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomePage from '@/app/page'
import EventsPage from '@/app/events/page'
import EventDetailPage from '@/app/events/[id]/page'
import OrganizerPage from '@/app/organizer/page'
import RegistrationsPage from '@/app/registrations/page'
import LoginPage from '@/app/login/page'

function AppContent({ pathname }: { pathname: string }) {
  const { currentUser } = useAuth()
  const normalized = pathname.replace(/\/$/, '') || '/'

  // When not logged in, directly show the unified login page
  if (!currentUser) {
    if (normalized === '/login/student') {
      return <LoginPage initialRole="student" />
    }
    if (
      normalized === '/login/organizer' ||
      normalized === '/login/organiser'
    ) {
      return <LoginPage initialRole="organizer" />
    }
    if (normalized === '/' || normalized === '/login') {
      return <LoginPage />
    }
    if (normalized === '/events') {
      return <EventsPage />
    }
    if (normalized.startsWith('/events/')) {
      const id = normalized.slice('/events/'.length)
      return <EventDetailPage params={{ id }} />
    }
    return <LoginPage />
  }

  // When logged in
  if (normalized === '/') {
    return <HomePage />
  }
  if (normalized === '/events') {
    return <EventsPage />
  }
  if (normalized.startsWith('/events/')) {
    const id = normalized.slice('/events/'.length)
    return <EventDetailPage params={{ id }} />
  }
  if (normalized === '/organizer') {
    return <OrganizerPage />
  }
  if (normalized === '/registrations') {
    return <RegistrationsPage />
  }
  if (normalized === '/login') {
    return <LoginPage />
  }
  if (normalized === '/login/student') {
    return <LoginPage initialRole="student" />
  }
  if (normalized === '/login/organizer' || normalized === '/login/organiser') {
    return <LoginPage initialRole="organizer" />
  }

  return <HomePage />
}

export default function App() {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/'
    }
    return '/'
  })

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <main style={{ minHeight: '70vh' }}>
          <AppContent pathname={pathname} />
        </main>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  )
}
