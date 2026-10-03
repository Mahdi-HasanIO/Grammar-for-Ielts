import type { ProgressState } from '@/types'
import { MODULES } from '@/data/modules'
import { completedCount, moduleById } from '@/utils/progression'
import { PASS_THRESHOLD } from '@/utils/progression'

export function totalStudyMinutes(state: ProgressState): number {
  return Object.values(state.activity).reduce((sum, d) => sum + d.minutes, 0)
}

export function formatMinutes(total: number): string {
  if (total < 60) return `${total}m`
  const hours = Math.floor(total / 60)
  const mins = total % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

export function testStats(state: ProgressState) {
  const attempts = state.attempts
  const scores = attempts.map((a) => a.percentage)
  const average = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0
  const best = scores.length ? Math.max(...scores) : 0

  const answered = Object.values(state.activity).reduce(
    (sum, d) => sum + d.questionsAnswered,
    0,
  )
  const correct = Object.values(state.activity).reduce(
    (sum, d) => sum + d.questionsCorrect,
    0,
  )

  return {
    testsTaken: attempts.length,
    averageScore: average,
    bestScore: best,
    passRate: attempts.length
      ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100)
      : 0,
    questionsAnswered: answered,
    questionAccuracy: answered ? Math.round((correct / answered) * 100) : 0,
  }
}

export interface WeakArea {
  moduleId: number
  title: string
  average: number
  attempts: number
  bestScore: number
  completed: boolean
}

/**
 * Modules where the learner's average test score sits below the pass mark.
 * Uses every attempt, so one lucky pass does not hide a shaky topic.
 */
export function weakAreas(state: ProgressState, limit = 6): WeakArea[] {
  const byModule = new Map<number, number[]>()
  state.attempts.forEach((a) => {
    const list = byModule.get(a.moduleId) ?? []
    list.push(a.percentage)
    byModule.set(a.moduleId, list)
  })

  const areas: WeakArea[] = []
  byModule.forEach((scores, moduleId) => {
    const meta = moduleById(moduleId)
    if (!meta) return
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    if (average >= PASS_THRESHOLD + 5) return
    areas.push({
      moduleId,
      title: meta.title,
      average,
      attempts: scores.length,
      bestScore: Math.max(...scores),
      completed: state.modules[moduleId]?.completed ?? false,
    })
  })

  return areas.sort((a, b) => a.average - b.average).slice(0, limit)
}

export function overviewStats(state: ProgressState) {
  return {
    modulesCompleted: completedCount(state),
    totalModules: MODULES.length,
    studyMinutes: totalStudyMinutes(state),
    xp: state.xp,
    badges: state.badges.length,
    ...testStats(state),
  }
}
