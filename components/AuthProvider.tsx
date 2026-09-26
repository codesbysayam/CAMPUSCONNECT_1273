'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { users, AppUser } from '@/data/auth'

interface AuthContextValue {
  currentUser: AppUser
  setCurrentUserId: (id: string) => void
  login: (id: string) => void
  logout: () => void
  allUsers: AppUser[]
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserIdState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campus-connect-user-id')
      if (saved && users.some((u) => u.id === saved)) {
        return saved
      }
    }
    return users[0].id
  })

  const currentUser = users.find((u) => u.id === currentUserId) ?? users[0]

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id)
    if (typeof window !== 'undefined') {
      localStorage.setItem('campus-connect-user-id', id)
    }
  }

  const login = (id: string) => {
    setCurrentUserId(id)
  }

  const logout = () => {
    setCurrentUserId(users[0].id)
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUserId, login, logout, allUsers: users }}
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
