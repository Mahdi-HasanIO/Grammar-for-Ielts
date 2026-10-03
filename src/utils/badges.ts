import type { Badge, ProgressState } from '@/types'
import { MODULES } from '@/data/modules'
import { completedCount, stageProgress } from '@/utils/progression'
import { computeStreak } from '@/utils/streak'

export const BADGES: Badge[] = [
  { id: 'first-module', name: 'First Module Complete', description: 'You passed your first module test.', icon: 'Flag' },
  { id: 'foundation-mastered', name: 'Foundation Mastered', description: 'All five Stage 1 modules completed.', icon: 'Blocks' },
  { id: 'core-grammar', name: 'Core Grammar Secured', description: 'All Stage 2 modules completed.', icon: 'Layers' },
  { id: 'complex-control', name: 'Complex Sentence Control', description: 'All Stage 3 modules completed.', icon: 'GitBranch' },
  { id: 'advanced-grammar', name: 'Advanced Grammar', description: 'All Stage 4 modules completed.', icon: 'Sparkles' },
  { id: 'professional-writing', name: 'Professional Writer', description: 'All 24 modules completed.', icon: 'Trophy' },
  { id: 'halfway', name: 'Halfway There', description: 'Twelve modules completed.', icon: 'Milestone' },
  { id: 'flawless', name: 'Flawless Test', description: 'Scored 100% on a module test.', icon: 'Target' },
  { id: 'streak-3', name: '3-Day Streak', description: 'Studied three days in a row.', icon: 'Flame' },
  { id: 'streak-7', name: '7-Day Streak', description: 'Studied seven days in a row.', icon: 'Flame' },
  { id: 'streak-30', name: '30-Day Streak', description: 'Studied thirty days in a row.', icon: 'Flame' },
]

export function badgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id)
}

/** Recomputes the full badge list from state, so it is always consistent. */
export function earnedBadges(state: ProgressState): string[] {
  const earned = new Set<string>()
  const done = completedCount(state)

  if (done >= 1) earned.add('first-module')
  if (done >= 12) earned.add('halfway')
  if (done >= MODULES.length) earned.add('professional-writing')

  if (stageProgress(state, 1).status === 'completed') earned.add('foundation-mastered')
  if (stageProgress(state, 2).status === 'completed') earned.add('core-grammar')
  if (stageProgress(state, 3).status === 'completed') earned.add('complex-control')
  if (stageProgress(state, 4).status === 'completed') earned.add('advanced-grammar')

  if (state.attempts.some((a) => a.percentage === 100)) earned.add('flawless')

  const { current, longest } = computeStreak(state.activity)
  const best = Math.max(current, longest)
  if (best >= 3) earned.add('streak-3')
  if (best >= 7) earned.add('streak-7')
  if (best >= 30) earned.add('streak-30')

  return BADGES.filter((b) => earned.has(b.id)).map((b) => b.id)
}
