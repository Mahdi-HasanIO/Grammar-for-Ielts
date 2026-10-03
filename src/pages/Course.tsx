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
import { Reveal } from '@/components/ui/Reveal'
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

      <div className="relative space-y-12">
        {STAGES.map((stage) => {
          const modules = stageModules(stage.id)
          const { done, total, percentage, status } = stageProgress(state, stage.id)

          return (
            <Reveal as="section" key={stage.id}>
              <div className="mb-5 rounded-2xl border border-ink-200/70 bg-white/60 p-4 backdrop-blur-sm sm:p-5 dark:border-ink-800/70 dark:bg-ink-900/40">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl font-display text-[13px] font-bold',
                      status === 'completed' &&
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                      status === 'in-progress' &&
                        'bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-glow',
                      status === 'locked' && 'bg-ink-200/70 text-ink-500 dark:bg-ink-800 dark:text-ink-500',
                    )}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 size={18} />
                    ) : status === 'in-progress' ? (
                      <Loader size={17} className="animate-spin-slow" />
                    ) : (
                      <Lock size={15} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="label-xs">Stage {stage.id}</p>
                    <h2 className="text-[18px] font-bold tracking-tight text-ink-900 dark:text-ink-50">
                      {stage.name}
                    </h2>
                  </div>
                  <Badge tone={status === 'completed' ? 'success' : status === 'in-progress' ? 'brand' : 'muted'}>
                    {done}/{total} complete
                  </Badge>
                </div>
                <p className="bn-text mt-3 max-w-2xl text-[13.5px] text-ink-600 dark:text-ink-400">
                  {stage.description}
                </p>
                <ProgressBar
                  value={percentage}
                  size="sm"
                  tone={status === 'completed' ? 'success' : 'brand'}
                  className="mt-3 max-w-sm"
                />
              </div>

              <div className="grid gap-3 sm:pl-4 sm:border-l-2 sm:border-dashed sm:border-ink-200 sm:ml-5 dark:sm:border-ink-800">
                {modules.map((module, i) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    status={getModuleStatus(state, module.id)}
                    bestScore={getModuleProgress(state, module.id).bestScore}
                    style={{ '--i': i } as React.CSSProperties}
                  />
                ))}
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
