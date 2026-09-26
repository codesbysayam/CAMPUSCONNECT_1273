/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomePage from '@/app/page'
import EventsPage from '@/app/events/page'
import EventDetailPage from '@/app/events/[id]/page'
import OrganizerPage from '@/app/organizer/page'
import RegistrationsPage from '@/app/registrations/page'

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

  const renderPage = () => {
    const normalized = pathname.replace(/\/$/, '') || '/'

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

    return <HomePage />
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <main style={{ minHeight: '70vh' }}>{renderPage()}</main>
        <Footer />
      </AuthProvider>
    </ThemeProvider>
  )
}
