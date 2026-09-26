'use client'



import { createContext, useContext, useState, ReactNode } from 'react'
import { users, AppUser } from '@/data/auth'

interface AuthContextValue {
  currentUser: AppUser
  setCurrentUserId: (id: string) => void
  allUsers: AppUser[]
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState(users[0].id)
  const currentUser = users.find((u) => u.id === currentUserId) ?? users[0]

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUserId, allUsers: users }}
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
