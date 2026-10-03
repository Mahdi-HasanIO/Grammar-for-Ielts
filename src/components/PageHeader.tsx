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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="label-xs mb-1">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-[28px] dark:text-ink-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[14px] leading-6 text-ink-600 dark:text-ink-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
