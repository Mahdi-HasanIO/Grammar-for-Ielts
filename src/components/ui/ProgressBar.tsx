import { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'

const tones = {
  brand: 'bg-gradient-to-r from-brand-500 to-accent-500',
  success: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
  amber: 'bg-gradient-to-r from-amber-400 to-orange-400',
}

export function ProgressBar({
  value,
  className,
  tone = 'brand',
  size = 'md',
}: {
  value: number
  className?: string
  tone?: 'brand' | 'success' | 'amber'
  size?: 'sm' | 'md'
}) {
  const pct = Math.max(0, Math.min(100, value))
  // Start at 0 and grow on mount so the bar animates in rather than appearing full.
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(pct))
    return () => cancelAnimationFrame(frame)
  }, [pct])

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-full bg-ink-200/70 dark:bg-ink-800',
        size === 'sm' ? 'h-1.5' : 'h-2.5',
        className,
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-full transition-[width] duration-1000 ease-spring',
          tones[tone],
        )}
        style={{ width: `${shown}%` }}
      >
        {shown > 0 && shown < 100 ? (
          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        ) : null}
      </div>
    </div>
  )
}
