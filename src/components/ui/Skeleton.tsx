import { cn } from '@/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />
}

/** Placeholder shaped like a QuestionCard, used while questions load. */
export function QuestionSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="card card-pad animate-fade-up stagger"
      style={{ '--i': index } as React.CSSProperties}
      aria-hidden
    >
      <div className="flex gap-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-11/12" />
      <Skeleton className="mt-2 h-4 w-3/5" />
      <div className="mt-5 grid gap-2">
        {[0, 1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-11 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
