'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

export type Theme = 'light' | 'dark'

export type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const defaultThemeContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('campus-connect-theme')
        if (saved === 'dark' || saved === 'light') {
          return saved
        }
      } catch {
        // ignore
      }
    }
    return 'light'
  })

  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount and apply classes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('campus-connect-theme')
      const activeTheme: Theme =
        saved === 'dark' || saved === 'light' ? saved : 'light'

      setThemeState(activeTheme)
      document.documentElement.classList.toggle('dark', activeTheme === 'dark')
      document.documentElement.setAttribute('data-theme', activeTheme)
    } catch {
      // ignore
    }
    setMounted(true)
  }, [])

  // Sync with DOM and localStorage whenever theme changes
  useEffect(() => {
    if (!mounted) return

    try {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('campus-connect-theme', theme)
    } catch {
      // ignore
    }
  }, [theme, mounted])

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme)
  }

  const toggleTheme = () => {
    setThemeState((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context || defaultThemeContext
}

export default ThemeProvider
