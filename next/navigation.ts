import { useEffect, useState } from 'react'

export function usePathname(): string {
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

  return pathname
}

export function useRouter() {
  return {
    push: (href: string) => {
      window.history.pushState({}, '', href)
      window.dispatchEvent(new Event('popstate'))
      window.scrollTo(0, 0)
    },
    replace: (href: string) => {
      window.history.replaceState({}, '', href)
      window.dispatchEvent(new Event('popstate'))
    },
    back: () => window.history.back(),
  }
}
