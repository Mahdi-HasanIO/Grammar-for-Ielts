import { cn } from '@/utils/cn'

export function ProgressRing({
  value,
  size = 96,
  stroke = 8,
  label,
  sublabel,
  className,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
  sublabel?: string
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-ink-200 dark:stroke-ink-800"
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
          className="stroke-brand-600 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold tabular-nums text-ink-900 dark:text-ink-50">
          {label ?? `${pct}%`}
        </span>
        {sublabel ? (
          <span className="text-[11px] text-ink-500 dark:text-ink-400">{sublabel}</span>
        ) : null}
      </div>
    </div>
  )
}
