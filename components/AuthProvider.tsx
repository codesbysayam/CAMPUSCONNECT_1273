'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { users, AppUser, getUserById } from '@/data/auth'

interface AuthContextValue {
  currentUser: AppUser | null
  isAuthenticated: boolean
  setCurrentUserId: (id: string | null) => void
  login: (id: string) => void
  logout: () => void
  allUsers: AppUser[]
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('campus-connect-logged-in')
      const saved = localStorage.getItem('campus-connect-user-id')
      if (loggedIn === 'true' && saved && users.some((u) => u.id === saved)) {
        return saved
      }
    }
    return null
  })

  const currentUser = currentUserId ? (getUserById(currentUserId) ?? null) : null

  const setCurrentUserId = (id: string | null) => {
    setCurrentUserIdState(id)
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('campus-connect-logged-in', 'true')
        localStorage.setItem('campus-connect-user-id', id)
      } else {
        localStorage.removeItem('campus-connect-logged-in')
        localStorage.removeItem('campus-connect-user-id')
      }
    }
  }

  const login = (id: string) => {
    setCurrentUserId(id)
  }

  const logout = () => {
    setCurrentUserId(null)
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        setCurrentUserId,
        login,
        logout,
        allUsers: users,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
