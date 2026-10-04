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

export function IeltsRelevance({ module, title = 'Why this matters for IELTS' }: { module: ModuleMeta; title?: string }) {
  return (
    <div className="card card-pad relative overflow-hidden">
      <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-500 to-accent-500" />
      <div className="flex flex-wrap items-center gap-3">
        <span className="icon-chip h-10 w-10 bg-brand-50 text-brand-600 ring-brand-200/70 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-800/60">
          <Target size={18} />
        </span>
        <h3 className="text-[16px] font-bold tracking-tight">{title}</h3>
        <div className="flex w-full flex-wrap gap-1.5 sm:ml-auto sm:w-auto">
          <Badge tone={IMPORTANCE_TONE[module.ielts.importance]}>
            Importance: {module.ielts.importance}
          </Badge>
          <Badge tone={PRIORITY_TONE[module.ielts.priority]}>{module.ielts.priority}</Badge>
        </div>
      </div>
      <p className="bn-text mt-4 text-[14.5px] text-ink-700 dark:text-ink-300">{module.ielts.note}</p>
    </div>
  )
}
