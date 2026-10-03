import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

/**
 * Fades and lifts its content into place the first time it scrolls into view.
 * Elements already on screen at mount reveal immediately; motion is disabled
 * under prefers-reduced-motion by the .reveal rule in index.css.
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  className,
  style,
  children,
  id,
}: {
  as?: ElementType
  /** Milliseconds to wait after entering the viewport. */
  delay?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
  id?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn('reveal', visible && 'is-visible', className)}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
