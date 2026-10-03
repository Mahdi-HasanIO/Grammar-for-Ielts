import { useEffect, useRef } from 'react'
import { useProgress } from '@/hooks/useProgress'

const TICK_MS = 60_000
const IDLE_LIMIT_MS = 3 * 60_000

/**
 * Accrues one study minute per active minute. Pauses when the tab is hidden
 * or the learner has not interacted for three minutes, so the timer reflects
 * real study time rather than an open tab.
 */
export function useStudyTimer(enabled = true) {
  const { addStudyMinutes } = useProgress()
  const lastActivity = useRef<number>(Date.now())

  useEffect(() => {
    if (!enabled) return

    const bump = () => {
      lastActivity.current = Date.now()
    }
    const events: (keyof WindowEventMap)[] = [
      'pointerdown',
      'keydown',
      'scroll',
      'focus',
    ]
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }))

    const interval = window.setInterval(() => {
      if (document.hidden) return
      if (Date.now() - lastActivity.current > IDLE_LIMIT_MS) return
      addStudyMinutes(1)
    }, TICK_MS)

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump))
      window.clearInterval(interval)
    }
  }, [enabled, addStudyMinutes])
}
