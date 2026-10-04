import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  BarChart3,
  Clock,
  Flame,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'
import { MODULES, STAGES } from '@/data/modules'
import { useProgress } from '@/hooks/useProgress'
import { useStreak } from '@/hooks/useStreak'
import {
  ACTIVE_DAY_MINUTES,
  completedCount,
  getCurrentModule,
  overallPercentage,
  stageById,
} from '@/utils/progression'
import { dayLabel, recentDays } from '@/utils/streak'
import { fromDateKey } from '@/utils/date'
import { cn } from '@/utils/cn'
import { formatMinutes, overviewStats } from '@/utils/stats'
import { badgeById } from '@/utils/badges'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { StatTile } from '@/components/ui/StatTile'
import { Reveal } from '@/components/ui/Reveal'
import { StageTrack } from '@/components/dashboard/StageTrack'
import { ActivityCalendar } from '@/components/dashboard/ActivityCalendar'
import { CommunityCard } from '@/components/dashboard/CommunityCard'
import { PageHeader } from '@/components/PageHeader'
import { useLessonLanguage } from '@/hooks/useLessonLanguage'
import { localizeModule } from '@/utils/i18n'

function HeroGlow() {
  return (
    <>
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
    </>
  )
}

function WelcomeHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-6 text-white shadow-glow-lg sm:p-8">
      <HeroGlow />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold ring-1 ring-inset ring-white/25 backdrop-blur">
          <GraduationCap size={13} /> Start your grammar journey
        </span>
        <h2 className="mt-4 max-w-xl text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
          Accuracy first, then complexity, then control
        </h2>
        <p className="mt-3 max-w-xl text-[14.5px] leading-7 text-white/80">
          Twenty-four modules across five stages, ordered so that you secure the structures that
          cost the most marks before you reach the advanced ones.
        </p>

        <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
          {[
            { value: '24', label: 'Modules' },
            { value: '5', label: 'Stages' },
            { value: '8+', label: 'Target band' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="animate-fade-up stagger rounded-2xl bg-white/10 px-3 py-3 ring-1 ring-inset ring-white/15 backdrop-blur"
              style={{ '--i': i + 2 } as React.CSSProperties}
            >
              <p className="font-display text-2xl font-extrabold tracking-tight">{item.value}</p>
              <p className="text-[11.5px] font-medium text-white/70">{item.label}</p>
            </div>
          ))}
        </div>

        <Link to="/module/1" className="mt-7 inline-block w-full sm:w-auto">
          <Button
            size="lg"
            variant="secondary"
            className="group w-full border-transparent bg-white text-brand-700 hover:bg-white hover:shadow-lift sm:w-auto dark:border-transparent dark:bg-white dark:text-brand-700 dark:hover:bg-white"
          >
            Begin Module 1
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function ContinueCard() {
  const { state } = useProgress()
  const done = completedCount(state)
  const pct = overallPercentage(state)
  const { language } = useLessonLanguage()
  const current = localizeModule(getCurrentModule(state), language)
  const currentStage = stageById(current.stage)

  return (
    <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-6 text-white shadow-glow-lg sm:p-7">
      <HeroGlow />
      <div className="relative flex h-full flex-col gap-6 sm:flex-row sm:items-center">
        <div className="self-start rounded-full bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur sm:self-auto">
          <ProgressRing value={pct} sublabel="complete" size={112} stroke={9} inverted />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">
            Stage {currentStage.id} · {currentStage.name}
          </p>
          <h2 className="mt-1.5 text-[22px] font-extrabold leading-tight tracking-tight">
            Module {current.id}: {current.title}
          </h2>
          <p className="bn-text mt-2 text-[14px] text-white/80">{current.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to={`/module/${current.id}`}>
              <Button
                variant="secondary"
                className="group border-transparent bg-white text-brand-700 hover:bg-white hover:shadow-lift dark:border-transparent dark:bg-white dark:text-brand-700 dark:hover:bg-white"
              >
                Continue learning
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <span className="text-[13px] font-medium text-white/75">
              {done} of {MODULES.length} modules complete
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Last seven days at a glance: filled once a day reaches the streak threshold. */
function WeekStrip() {
  const { state } = useProgress()
  return (
    <div className="flex justify-between gap-1.5">
      {recentDays(7).map((key, i) => {
        const minutes = state.activity[key]?.minutes ?? 0
        const active = minutes >= ACTIVE_DAY_MINUTES
        return (
          <div key={key} className="flex flex-1 flex-col items-center gap-1.5" title={`${dayLabel(key)}: ${minutes} min`}>
            <span
              style={{ '--i': i } as React.CSSProperties}
              className={cn(
                'h-7 w-full max-w-[2rem] animate-pop-in stagger rounded-lg',
                active
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_6px_16px_-6px_rgba(249,115,22,0.6)]'
                  : minutes > 0
                    ? 'bg-amber-100 dark:bg-amber-950/60'
                    : 'bg-ink-100 dark:bg-ink-800',
                i === 6 && 'ring-2 ring-brand-400 ring-offset-2 ring-offset-white dark:ring-offset-ink-900',
              )}
            />
            <span className="text-[10px] font-semibold uppercase text-ink-400 dark:text-ink-500">
              {fromDateKey(key).toLocaleDateString(undefined, { weekday: 'narrow' })}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function Dashboard() {
  const { state } = useProgress()
  const streak = useStreak()
  const stats = overviewStats(state)
  const done = completedCount(state)
  const isNew = done === 0 && state.attempts.length === 0

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={isNew ? 'Welcome to Grammar Path' : 'Welcome back'}
        description={
          isNew
            ? 'A sequential grammar course for IELTS Writing Band 8+ and professional English.'
            : 'Keep the streak going and work through the course in order.'
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="animate-fade-up lg:col-span-2">{isNew ? <WelcomeHero /> : <ContinueCard />}</div>

        {/* Daily goal and streak */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
          <Card
            className="flex animate-fade-up stagger flex-col justify-center"
            style={{ '--i': 1 } as React.CSSProperties}
          >
            <CardHeader
              title="Today's goal"
              subtitle={`${streak.minutesToday} / ${streak.goal} min`}
              icon={<Target size={16} />}
            />
            <CardBody className="pt-4">
              <ProgressBar
                value={streak.goalPercentage}
                tone={streak.goalMet ? 'success' : 'brand'}
              />
              <p className="mt-3 text-[12.5px] text-ink-500 dark:text-ink-400">
                {streak.goalMet
                  ? 'Daily goal reached. Anything more is a bonus.'
                  : streak.countsTowardStreak
                    ? `${streak.goal - streak.minutesToday} min left to hit your goal.`
                    : `${streak.minutesUntilStreak} more min counts this day toward your streak.`}
              </p>
            </CardBody>
          </Card>

          <Card
            interactive
            className="flex animate-fade-up stagger flex-col justify-center"
            style={{ '--i': 2 } as React.CSSProperties}
          >
            <CardBody className="flex items-center gap-4 pb-0 sm:pb-0">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 ring-1 ring-inset ring-amber-200/70 dark:from-amber-950/80 dark:to-orange-950/60 dark:ring-amber-800/50">
                <Flame
                  size={26}
                  className={streak.current > 0 ? 'animate-sparkle text-orange-500' : 'text-ink-400'}
                />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold tabular-nums tracking-tight text-ink-900 dark:text-ink-50">
                  {streak.current} day{streak.current === 1 ? '' : 's'}
                </p>
                <p className="text-[12.5px] text-ink-500 dark:text-ink-400">
                  Current streak · longest {streak.longest}
                </p>
              </div>
            </CardBody>
            <CardBody className="pt-4">
              <WeekStrip />
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: 'Modules',
            value: `${stats.modulesCompleted}/${stats.totalModules}`,
            hint: 'Completed',
            icon: <GraduationCap size={15} />,
          },
          {
            label: 'Tests taken',
            value: stats.testsTaken,
            hint: stats.testsTaken ? `${stats.passRate}% passed` : 'No tests yet',
            icon: <BarChart3 size={15} />,
          },
          {
            label: 'Average score',
            value: `${stats.averageScore}%`,
            hint: `Best ${stats.bestScore}%`,
            icon: <Award size={15} />,
          },
          {
            label: 'Study time',
            value: formatMinutes(stats.studyMinutes),
            hint: `${stats.xp} XP earned`,
            icon: <Clock size={15} />,
          },
        ].map((tile, i) => (
          <StatTile
            key={tile.label}
            {...tile}
            className="animate-fade-up stagger"
            style={{ '--i': i + 3 } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <Card className="h-full">
            <CardHeader
              title="Grammar stages"
              subtitle={`${STAGES.length} stages in order`}
              icon={<Trophy size={16} />}
            />
            <CardBody className="pt-4">
              <StageTrack />
            </CardBody>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card className="h-full">
            <CardHeader
              title="Study activity"
              subtitle="Minutes studied per day"
              icon={<BarChart3 size={16} />}
            />
            <CardBody className="pt-4">
              <ActivityCalendar />
            </CardBody>
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <CommunityCard />
      </Reveal>

      {state.badges.length ? (
        <Reveal>
          <Card>
            <CardHeader
              title="Badges"
              subtitle={`${state.badges.length} earned`}
              icon={<Sparkles size={16} />}
            />
            <CardBody className="flex flex-wrap gap-2 pt-4">
              {state.badges.map((id, i) => {
                const badge = badgeById(id)
                if (!badge) return null
                return (
                  <span
                    key={id}
                    title={badge.description}
                    style={{ '--i': i } as React.CSSProperties}
                    className="inline-flex animate-pop-in stagger items-center gap-1.5 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-3.5 py-2 text-[13px] font-semibold text-amber-900 transition-transform duration-200 hover:-translate-y-0.5 dark:border-amber-900/60 dark:from-amber-950/50 dark:to-orange-950/30 dark:text-amber-100"
                  >
                    <Award size={14} className="text-amber-500" />
                    {badge.name}
                  </span>
                )
              })}
            </CardBody>
          </Card>
        </Reveal>
      ) : null}
    </div>
  )
}
