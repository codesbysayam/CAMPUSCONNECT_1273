'use client'

import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      }
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="btn btn-secondary theme-toggle"
      style={{
        padding: '5px 10px',
        fontSize: 15,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 36,
        height: 34,
        cursor: 'pointer',
      }}
    >
      {theme === 'light' ? '☾' : '☀'}
    </button>
  )
}

export default ThemeToggle
