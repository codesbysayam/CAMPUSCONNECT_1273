'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { users, AppUser } from '@/data/auth'
import { apiRequest } from '@/lib/api'

interface AuthContextValue {
  currentUser: AppUser | null
  isAuthenticated: boolean
  loading: boolean
  sendLoginOtp: (
    email: string,
    pass: string,
    expectedRole?: string,
  ) => Promise<{ success: boolean; requiresOtp: boolean; message: string }>
  verifyOtpAndLogin: (
    email: string,
    otp: string,
  ) => Promise<{ success: boolean; user?: AppUser }>
  logout: () => Promise<void>
  allUsers: AppUser[]
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshAuth = async () => {
    try {
      const data = await apiRequest<{
        authenticated: boolean
        user?: AppUser
      }>('/api/auth/me')

      if (data.authenticated && data.user) {
        setCurrentUser(data.user)
      } else {
        setCurrentUser(null)
      }
    } catch {
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAuth()
  }, [])

  const sendLoginOtp = async (
    email: string,
    password: string,
    expectedRole?: string,
  ) => {
    const res = await apiRequest<{
      success: boolean
      requiresOtp: boolean
      message: string
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, expectedRole }),
    })
    return res
  }

  const verifyOtpAndLogin = async (email: string, otp: string) => {
    const res = await apiRequest<{
      success: boolean
      authenticated: boolean
      user: AppUser
    }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })

    if (res.authenticated && res.user) {
      setCurrentUser(res.user)
      return { success: true, user: res.user }
    }
    return { success: false }
  }

  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    } finally {
      setCurrentUser(null)
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        sendLoginOtp,
        verifyOtpAndLogin,
        logout,
        allUsers: users,
        refreshAuth,
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
