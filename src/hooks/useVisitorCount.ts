import { useEffect, useState } from 'react'
import { getVisitorCount } from '@/utils/visitorCount'

type State = { status: 'loading' } | { status: 'ready'; count: number } | { status: 'error' }

export function useVisitorCount(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let alive = true
    getVisitorCount().then((count) => {
      if (alive) setState(count === null ? { status: 'error' } : { status: 'ready', count })
    })
    return () => {
      alive = false
    }
  }, [])

  return state
}

/** Animates a number from 0 up to `target` once it is known. */
export function useCountUp(target: number | null, durationMs = 1400): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (target === null) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || target < 2) {
      setValue(target)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // easeOutCubic so the count slows as it lands
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, durationMs])

  return value
}
