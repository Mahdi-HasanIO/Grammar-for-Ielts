import { useEffect, useId, useState } from 'react'
import { cn } from '@/utils/cn'

export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  label,
  sublabel,
  className,
  inverted = false,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
  sublabel?: string
  className?: string
  /** For placement on a coloured gradient background. */
  inverted?: boolean
}) {
  const pct = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  // useId output contains characters that are not valid inside url(#...).
  const gradientId = `ring-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  // Draw the arc from empty on mount.
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(pct))
    return () => cancelAnimationFrame(frame)
  }, [pct])
  const offset = circumference - (shown / 100) * circumference

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={inverted ? '#ffffff' : '#6366f1'} />
            <stop offset="100%" stopColor={inverted ? '#e9d5ff' : '#a855f7'} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={inverted ? 'stroke-white/20' : 'stroke-ink-200/80 dark:stroke-ink-800'}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={`url(#${gradientId})`}
          className="transition-[stroke-dashoffset] duration-[1200ms] ease-spring"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            'font-display text-xl font-bold tabular-nums',
            inverted ? 'text-white' : 'text-ink-900 dark:text-ink-50',
          )}
        >
          {label ?? `${pct}%`}
        </span>
        {sublabel ? (
          <span
            className={cn(
              'text-[11px] font-medium',
              inverted ? 'text-white/70' : 'text-ink-500 dark:text-ink-400',
            )}
          >
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  )
}
