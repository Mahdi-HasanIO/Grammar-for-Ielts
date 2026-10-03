import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-300 px-6 py-12 text-center dark:border-ink-700">
      {icon ? <div className="mb-3 text-ink-400 dark:text-ink-500">{icon}</div> : null}
      <h3 className="text-sm font-semibold text-ink-800 dark:text-ink-100">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-[13px] text-ink-500 dark:text-ink-400">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
