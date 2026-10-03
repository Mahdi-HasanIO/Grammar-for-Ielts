import { Award, BarChart3, Clock, Flame, Target, TrendingUp, Trophy } from 'lucide-react'
import { MODULES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import { formatMinutes, overviewStats } from '@/utils/stats'
import { BADGES, badgeById } from '@/utils/badges'
import { moduleById } from '@/utils/progression'
import { dayLabel, recentDays } from '@/utils/streak'
import { formatRelative } from '@/utils/date'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { StatTile } from '@/components/ui/StatTile'
import { Badge } from '@/components/ui/Badge'
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar'
import { StageTrack } from '@/components/dashboard/StageTrack'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/utils/cn'

function WeeklyBars() {
  const { state } = useProgress()
  const days = recentDays(14)
  const max = Math.max(10, ...days.map((d) => state.activity[d]?.minutes ?? 0))

  return (
    <div>
      <div className="flex h-32 items-end gap-1.5">
        {days.map((key) => {
          const minutes = state.activity[key]?.minutes ?? 0
          const height = Math.max(3, (minutes / max) * 100)
          return (
            <div key={key} className="group relative flex-1" title={`${dayLabel(key)}: ${minutes} min`}>
              <div
                className={cn(
                  'w-full rounded-t-md transition-all',
                  minutes >= 10 ? 'bg-brand-500' : minutes > 0 ? 'bg-brand-300' : 'bg-ink-200 dark:bg-ink-800',
                )}
                style={{ height: `${height}%` }}
              />
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] text-ink-500 dark:text-ink-400">Last 14 days of study time</p>
    </div>
  )
}

export function ProgressPage() {
  const { state } = useProgress()
  const streak = useStreak()
  const stats = overviewStats(state)
  const recentAttempts = [...state.attempts].reverse().slice(0, 12)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Progress"
        title="Detailed statistics"
        description="Everything is stored locally in your browser, so your history stays on this device."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Modules completed"
          value={`${stats.modulesCompleted}/${MODULES.length}`}
          icon={<Trophy size={15} />}
        />
        <StatTile label="Tests completed" value={stats.testsTaken} icon={<BarChart3 size={15} />} />
        <StatTile
          label="Average test score"
          value={`${stats.averageScore}%`}
          hint={`Pass rate ${stats.passRate}%`}
          icon={<TrendingUp size={15} />}
        />
        <StatTile label="Best test score" value={`${stats.bestScore}%`} icon={<Award size={15} />} />
        <StatTile
          label="Study time"
          value={formatMinutes(stats.studyMinutes)}
          icon={<Clock size={15} />}
        />
        <StatTile
          label="Current streak"
          value={`${streak.current}d`}
          hint={`${streak.activeDays} active days`}
          icon={<Flame size={15} />}
        />
        <StatTile label="Longest streak" value={`${streak.longest}d`} icon={<Flame size={15} />} />
        <StatTile
          label="Question accuracy"
          value={`${stats.questionAccuracy}%`}
          hint={`${stats.questionsAnswered} answered`}
          icon={<Target size={15} />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Daily activity" subtitle="Intensity by minutes studied" />
          <CardBody className="pt-1">
            <ActivityCalendar />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Recent study time" />
            <CardBody className="pt-1">
              <WeeklyBars />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Stage progress" />
            <CardBody className="pt-1">
              <StageTrack />
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Test history" subtitle={`${state.attempts.length} attempts recorded`} />
        <CardBody className="pt-1">
          {recentAttempts.length === 0 ? (
            <EmptyState
              icon={<BarChart3 size={22} />}
              title="No tests yet"
              description="Your test attempts, scores and pass results will be listed here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="text-ink-500 dark:text-ink-400">
                    <th className="pb-2 font-medium">Module</th>
                    <th className="pb-2 font-medium">Score</th>
                    <th className="pb-2 font-medium">Result</th>
                    <th className="pb-2 text-right font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((a, i) => (
                    <tr key={`${a.at}-${i}`} className="border-t border-ink-200 dark:border-ink-800">
                      <td className="py-2.5 pr-3 text-ink-800 dark:text-ink-200">
                        {a.moduleId}. {moduleById(a.moduleId)?.title}
                      </td>
                      <td className="py-2.5 pr-3 tabular-nums text-ink-700 dark:text-ink-300">
                        {a.score}/{a.total} ({a.percentage}%)
                      </td>
                      <td className="py-2.5 pr-3">
                        <Badge tone={a.passed ? 'success' : 'warning'}>
                          {a.passed ? 'Passed' : 'Below 80%'}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right text-ink-500 dark:text-ink-400">
                        {formatRelative(a.at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Badges"
          subtitle={`${state.badges.length} of ${BADGES.length} earned`}
          icon={<Award size={16} />}
        />
        <CardBody className="grid gap-2 pt-1 sm:grid-cols-2">
          {BADGES.map((badge) => {
            const earned = state.badges.includes(badge.id)
            const meta = badgeById(badge.id)
            return (
              <div
                key={badge.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3',
                  earned
                    ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/30'
                    : 'border-ink-200 bg-ink-50 opacity-60 dark:border-ink-800 dark:bg-ink-900/40',
                )}
              >
                <Award
                  size={16}
                  className={cn('mt-0.5 shrink-0', earned ? 'text-amber-500' : 'text-ink-400')}
                />
                <div>
                  <p className="text-[13px] font-medium text-ink-900 dark:text-ink-100">
                    {meta?.name}
                  </p>
                  <p className="text-[12px] text-ink-500 dark:text-ink-400">{meta?.description}</p>
                </div>
              </div>
            )
          })}
        </CardBody>
      </Card>
    </div>
  )
}
