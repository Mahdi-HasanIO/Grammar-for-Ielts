import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Card({
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return <div className={cn('card', interactive && 'card-interactive', className)} {...props} />
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon ? <span className="icon-chip mt-0.5 h-9 w-9">{icon}</span> : null}
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold tracking-tight text-ink-900 dark:text-ink-50">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-[13px] text-ink-500 dark:text-ink-400">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-5 sm:px-6 sm:py-6', className)} {...props} />
}
