import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-[32px] dark:text-ink-50">
          {title}
        </h1>
        {description ? (
          <p className="bn-text mt-2 max-w-2xl text-[14.5px] text-ink-600 dark:text-ink-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
