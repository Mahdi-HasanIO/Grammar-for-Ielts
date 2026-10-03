import { useEffect } from 'react'
import { useProgress } from '@/hooks/useProgress'

/** Applies the theme preference to <html>, following the OS when set to system. */
export function useTheme() {
  const { preferences } = useProgress()
  const theme = preferences.theme

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches)
      root.classList.toggle('dark', dark)
    }

    apply()
    if (theme !== 'system') return
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  return theme
}
