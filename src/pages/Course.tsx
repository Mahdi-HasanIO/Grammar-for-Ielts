import { CheckCircle2, Loader, Lock } from 'lucide-react'
import { STAGES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'
import {
  getModuleProgress,
  getModuleStatus,
  stageModules,
  stageProgress,
} from '@/utils/progression'
import { ModuleCard } from '@/components/ModuleCard'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/utils/cn'

export function Course() {
  const { state } = useProgress()

  return (
    <div>
      <PageHeader
        eyebrow="Course"
        title="The grammar roadmap"
        description="Twenty-four modules in a fixed order. Each one unlocks when you pass the test before it, so complexity is only introduced once the foundations are secure."
      />

      <div className="space-y-10">
        {STAGES.map((stage) => {
          const modules = stageModules(stage.id)
          const { done, total, percentage, status } = stageProgress(state, stage.id)

          return (
            <section key={stage.id}>
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold',
                      status === 'completed' &&
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                      status === 'in-progress' && 'bg-brand-600 text-white',
                      status === 'locked' && 'bg-ink-200 text-ink-500 dark:bg-ink-800 dark:text-ink-500',
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 size={14} />
                    ) : status === 'in-progress' ? (
                      <Loader size={13} />
                    ) : (
                      <Lock size={12} />
                    )}
                  </span>
                  <h2 className="text-[17px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                    Stage {stage.id} - {stage.name}
                  </h2>
                  <Badge tone={status === 'completed' ? 'success' : 'muted'}>
                    {done}/{total} complete
                  </Badge>
                </div>
                <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-ink-600 dark:text-ink-400">
                  {stage.description}
                </p>
                <ProgressBar
                  value={percentage}
                  size="sm"
                  tone={status === 'completed' ? 'success' : 'brand'}
                  className="mt-3 max-w-xs"
                />
              </div>

              <div className="grid gap-3">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    status={getModuleStatus(state, module.id)}
                    bestScore={getModuleProgress(state, module.id).bestScore}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
