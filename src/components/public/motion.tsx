import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

/*
 * Lightweight motion helpers for the public pages. Everything animates only
 * transform and opacity, and backs off for reduced-motion users and
 * low-power devices (see `data-motion="reduced"` in PublicLayout).
 */

function motionReduced(): boolean {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.motion === 'reduced'
  )
}

/** Flags weak devices and data-saver connections so decorative motion can switch off. */
export function detectLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  return (
    (nav.hardwareConcurrency ?? 8) <= 2 ||
    (nav.deviceMemory ?? 8) <= 2 ||
    nav.connection?.saveData === true
  )
}

/**
 * Moves its children slightly as the page scrolls. Desktop pointers only;
 * on touch, small screens and reduced motion it renders static.
 */
export function Parallax({
  speed = 0.08,
  className,
  children,
}: {
  /** Fraction of scroll distance to move. Positive moves up, negative down. */
  speed?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || motionReduced()) return
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        node.style.transform = `translate3d(0, ${(-window.scrollY * speed).toFixed(1)}px, 0)`
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
    }
  }, [speed])

  return (
    <div ref={ref} className={cn('will-change-transform', className)} aria-hidden>
      {children}
    </div>
  )
}

/**
 * Counts up to `value` once it scrolls into view. The final value is laid out
 * invisibly underneath so the width never changes (no layout shift).
 */
export function CountUp({
  value,
  suffix = '',
  duration = 1400,
  className,
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  // Starts at the final value so prerendered HTML and no-JS readers see real numbers.
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (motionReduced() || typeof IntersectionObserver === 'undefined') return
    // Already on screen at load: keep the real number rather than flashing to zero.
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) return
    setShown(0)
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setShown(Math.round(value * eased))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={cn('relative inline-grid tabular-nums', className)}>
      <span className="invisible col-start-1 row-start-1" aria-hidden>
        {value}
        {suffix}
      </span>
      <span className="col-start-1 row-start-1" aria-hidden>
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  )
}

/** Soft blurred colour blob for hero and section backgrounds. Drifts slowly on capable devices. */
export function Blob({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={cn('blob', className)} style={style} aria-hidden />
}
