import { Target } from 'lucide-react'
import type { ModuleMeta } from '@/types'
import { Badge } from '@/components/ui/Badge'

const IMPORTANCE_TONE = {
  'Very High': 'danger',
  High: 'warning',
  Medium: 'neutral',
  Situational: 'muted',
} as const

const PRIORITY_TONE = {
  'Essential for Band 8': 'success',
  'High-value enhancement': 'brand',
  Optional: 'muted',
} as const

export function IeltsRelevance({ module }: { module: ModuleMeta }) {
  return (
    <div className="card card-pad">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          <Target size={15} />
        </span>
        <h3 className="text-[15px] font-semibold tracking-tight">IELTS relevance</h3>
        <div className="ml-auto flex flex-wrap gap-1.5">
          <Badge tone={IMPORTANCE_TONE[module.ielts.importance]}>
            Importance: {module.ielts.importance}
          </Badge>
          <Badge tone={PRIORITY_TONE[module.ielts.priority]}>{module.ielts.priority}</Badge>
        </div>
      </div>
      <blockquote className="mt-3 border-l-2 border-ink-300 pl-3 text-[14px] leading-6 text-ink-700 dark:border-ink-700 dark:text-ink-300">
        {module.ielts.note}
      </blockquote>
    </div>
  )
}
