import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'muted' | 'ai'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200/80 dark:bg-ink-800 dark:text-ink-200 dark:ring-ink-700/60',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200/70 dark:bg-brand-950/70 dark:text-brand-200 dark:ring-brand-800/60',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/60',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800/60',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200/70 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800/60',
  muted: 'bg-transparent text-ink-500 ring-ink-200 dark:text-ink-400 dark:ring-ink-700',
  ai: 'bg-gradient-to-r from-brand-50 to-cyan-50 text-brand-700 ring-brand-200/80 dark:from-brand-950/80 dark:to-cyan-950/60 dark:text-brand-200 dark:ring-brand-800/60',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
