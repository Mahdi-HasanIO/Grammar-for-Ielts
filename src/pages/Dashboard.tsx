import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BarChart3,
  Clock,
  Flame,
  GraduationCap,
  Target,
  Trophy,
} from 'lucide-react'
import { MODULES, STAGES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import { completedCount, getCurrentModule, overallPercentage, stageById } from '@/utils/progression'
import { formatMinutes, overviewStats } from '@/utils/stats'
import { badgeById } from '@/utils/badges'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { StatTile } from '@/components/ui/StatTile'
import { StageTrack } from '@/components/dashboard/StageTrack'
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar'
import { PageHeader } from '@/components/PageHeader'

function WelcomeHero() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-ink-200 bg-gradient-to-br from-brand-50 to-white px-5 py-6 dark:border-ink-800 dark:from-brand-950/60 dark:to-ink-900 sm:px-6">
        <Badge tone="brand" className="mb-3">
          <GraduationCap size={12} /> Start your grammar journey
        </Badge>
        <h2 className="text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          Accuracy first, then complexity, then control
        </h2>
        <p className="mt-2 max-w-xl text-[14px] leading-6 text-ink-600 dark:text-ink-300">
          Twenty-four modules across five stages, ordered so that you secure the structures that
          cost the most marks before you reach the advanced ones.
        </p>
      </div>
      <CardBody className="grid gap-4 sm:grid-cols-3">
        {[
          { value: '24', label: 'Modules' },
          { value: '5', label: 'Stages' },
          { value: 'Band 8+', label: 'IELTS / professional English' },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              {item.value}
            </p>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">{item.label}</p>
          </div>
        ))}
        <div className="sm:col-span-3">
          <Link to="/module/1">
            <Button size="lg" className="w-full sm:w-auto">
              Begin Module 1 <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export function Dashboard() {
  const { state } = useProgress()
  const streak = useStreak()
  const stats = overviewStats(state)
  const done = completedCount(state)
  const pct = overallPercentage(state)
  const current = getCurrentModule(state)
  const currentStage = stageById(current.stage)
  const isNew = done === 0 && state.attempts.length === 0

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={isNew ? 'Welcome to Grammar Path' : 'Your progress'}
        description={
          isNew
            ? 'A sequential grammar course for IELTS Writing Band 8+ and professional English.'
            : 'Keep the streak going and work through the course in order.'
        }
      />

      {isNew ? <WelcomeHero /> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Overall progress */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Overall progress"
            subtitle={`${done} of ${MODULES.length} modules complete`}
            icon={<Trophy size={16} />}
          />
          <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <ProgressRing value={pct} sublabel="complete" />
            <div className="min-w-0 flex-1">
              <ProgressBar value={pct} />
              <p className="mt-3 text-[13px] text-ink-600 dark:text-ink-400">
                Next up in{' '}
                <span className="font-medium text-ink-900 dark:text-ink-100">
                  Stage {currentStage.id} - {currentStage.name}
                </span>
              </p>
              <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50 p-4 dark:border-ink-800 dark:bg-ink-900/60">
                <p className="label-xs">Current module</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                  Module {current.id} - {current.title}
                </p>
                <p className="mt-1 text-[13px] text-ink-600 dark:text-ink-400">{current.summary}</p>
                <Link to={`/module/${current.id}`} className="mt-3 inline-block">
                  <Button size="sm">
                    Continue learning <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Daily goal and streak */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Today's goal"
              subtitle={`${streak.minutesToday} / ${streak.goal} min`}
              icon={<Target size={16} />}
            />
            <CardBody className="pt-0">
              <ProgressBar
                value={streak.goalPercentage}
                tone={streak.goalMet ? 'success' : 'brand'}
              />
              <p className="mt-2.5 text-[12px] text-ink-500 dark:text-ink-400">
                {streak.goalMet
                  ? 'Daily goal reached. Anything more is a bonus.'
                  : streak.countsTowardStreak
                    ? `${streak.goal - streak.minutesToday} min left to hit your goal.`
                    : `${streak.minutesUntilStreak} more min counts this day toward your streak.`}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60">
                <Flame
                  size={22}
                  className={streak.current > 0 ? 'text-amber-500' : 'text-ink-400'}
                />
              </span>
              <div>
                <p className="text-xl font-semibold tabular-nums tracking-tight text-ink-900 dark:text-ink-50">
                  {streak.current} day{streak.current === 1 ? '' : 's'}
                </p>
                <p className="text-[12px] text-ink-500 dark:text-ink-400">
                  Current streak - longest {streak.longest}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Modules"
          value={`${stats.modulesCompleted}/${stats.totalModules}`}
          hint="Completed"
          icon={<GraduationCap size={15} />}
        />
        <StatTile
          label="Tests taken"
          value={stats.testsTaken}
          hint={stats.testsTaken ? `${stats.passRate}% passed` : 'No tests yet'}
          icon={<BarChart3 size={15} />}
        />
        <StatTile
          label="Average score"
          value={`${stats.averageScore}%`}
          hint={`Best ${stats.bestScore}%`}
          icon={<Award size={15} />}
        />
        <StatTile
          label="Study time"
          value={formatMinutes(stats.studyMinutes)}
          hint={`${stats.xp} XP earned`}
          icon={<Clock size={15} />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Grammar stages" subtitle={`${STAGES.length} stages in order`} />
          <CardBody className="pt-1">
            <StageTrack />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Study activity" subtitle="Minutes studied per day" />
          <CardBody className="pt-1">
            <ActivityCalendar />
          </CardBody>
        </Card>
      </div>

      {state.badges.length ? (
        <Card>
          <CardHeader title="Badges" subtitle={`${state.badges.length} earned`} />
          <CardBody className="flex flex-wrap gap-2 pt-1">
            {state.badges.map((id) => {
              const badge = badgeById(id)
              if (!badge) return null
              return (
                <span
                  key={id}
                  title={badge.description}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-[13px] font-medium text-ink-800 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100"
                >
                  <Award size={14} className="text-amber-500" />
                  {badge.name}
                </span>
              )
            })}
          </CardBody>
        </Card>
      ) : null}
    </div>
  )
}
