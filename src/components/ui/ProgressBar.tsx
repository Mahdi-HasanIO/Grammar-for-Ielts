import { cn } from '@/utils/cn'

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
  const tones = {
    brand: 'bg-brand-600',
    success: 'bg-emerald-500',
    amber: 'bg-amber-500',
  }
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800',
        size === 'sm' ? 'h-1.5' : 'h-2',
        className,
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500 ease-out', tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
