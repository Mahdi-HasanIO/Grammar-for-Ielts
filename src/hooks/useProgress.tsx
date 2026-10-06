import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { progressRepository, type ProgressRepository } from '@/repositories'
import { createInitialState, DEFAULT_PREFERENCES } from '@/services/progress'
import { toDateKey } from '@/utils/date'
import { earnedBadges } from '@/utils/badges'
import {
  emptyModuleProgress,
  getModuleProgress,
  PASS_THRESHOLD,
} from '@/utils/progression'
import type {
  DayActivity,
  Preferences,
  ProgressState,
  TestAttempt,
} from '@/types'

export { DEFAULT_PREFERENCES }

function emptyDay(date: string): DayActivity {
  return {
    date,
    minutes: 0,
    modulesCompleted: 0,
    testsTaken: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
  }
}

function withToday(
  state: ProgressState,
  mutate: (day: DayActivity) => DayActivity,
): ProgressState {
  const key = toDateKey()
  const day = state.activity[key] ?? emptyDay(key)
  return { ...state, activity: { ...state.activity, [key]: mutate(day) } }
}

export interface TestResultSummary {
  passed: boolean
  percentage: number
  score: number
  total: number
  unlockedModuleId?: number
  newBadges: string[]
  xpEarned: number
}

interface ProgressContextValue {
  state: ProgressState
  preferences: Preferences
  setPreferences: (next: Partial<Preferences>) => void
  markLessonViewed: (moduleId: number) => void
  markPracticeCompleted: (moduleId: number) => void
  recordAnswers: (correct: number, total: number) => void
  recordTest: (moduleId: number, score: number, total: number) => TestResultSummary
  addStudyMinutes: (minutes: number) => void
  resetProgress: () => void
  importState: (next: ProgressState) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({
  children,
  repository = progressRepository,
}: {
  children: ReactNode
  /** Where progress is loaded from and saved to. Defaults to this browser's localStorage. */
  repository?: ProgressRepository
}) {
  // Loading migrates older saves to the current schema; the first save below persists that.
  const [state, setState] = useState<ProgressState>(() => repository.loadProgress())
  const [preferences, setPrefsRaw] = useState<Preferences>(() => repository.loadPreferences())

  useEffect(() => {
    repository.saveProgress(state)
  }, [repository, state])

  useEffect(() => {
    repository.savePreferences(preferences)
  }, [repository, preferences])

  // Keep tabs in sync: another tab's save replaces this tab's copy.
  useEffect(
    () =>
      repository.subscribe((change) => {
        if (change.progress) setState(change.progress)
        if (change.preferences) setPrefsRaw(change.preferences)
      }),
    [repository],
  )

  const setPreferences = useCallback(
    (next: Partial<Preferences>) => setPrefsRaw((prev) => ({ ...prev, ...next })),
    [setPrefsRaw],
  )

  const markLessonViewed = useCallback(
    (moduleId: number) => {
      setState((prev) => {
        const current = getModuleProgress(prev, moduleId)
        if (current.lessonViewed) return prev
        return {
          ...prev,
          modules: {
            ...prev.modules,
            [moduleId]: { ...current, lessonViewed: true },
          },
        }
      })
    },
    [setState],
  )

  const markPracticeCompleted = useCallback(
    (moduleId: number) => {
      setState((prev) => {
        const current = getModuleProgress(prev, moduleId)
        if (current.practiceCompleted) return prev
        return {
          ...prev,
          xp: prev.xp + 10,
          modules: {
            ...prev.modules,
            [moduleId]: { ...current, practiceCompleted: true },
          },
        }
      })
    },
    [setState],
  )

  const recordAnswers = useCallback(
    (correct: number, total: number) => {
      setState((prev) =>
        withToday(prev, (day) => ({
          ...day,
          questionsAnswered: day.questionsAnswered + total,
          questionsCorrect: day.questionsCorrect + correct,
        })),
      )
    },
    [setState],
  )

  const addStudyMinutes = useCallback(
    (minutes: number) => {
      if (minutes <= 0) return
      setState((prev) =>
        withToday(prev, (day) => ({ ...day, minutes: day.minutes + minutes })),
      )
    },
    [setState],
  )

  /**
   * Records a test attempt and, on a pass, completes the module. The next
   * module unlocks implicitly because unlocking is derived from completion.
   */
  const recordTest = useCallback(
    (moduleId: number, score: number, total: number): TestResultSummary => {
      const percentage = total > 0 ? Math.round((score / total) * 100) : 0
      const passed = percentage >= PASS_THRESHOLD
      const xpEarned = passed ? 100 + Math.round((percentage - PASS_THRESHOLD) * 2) : 20

      let summary: TestResultSummary = {
        passed,
        percentage,
        score,
        total,
        newBadges: [],
        xpEarned,
      }

      setState((prev) => {
        const current = getModuleProgress(prev, moduleId)
        const wasCompleted = current.completed

        const attempt: TestAttempt = {
          moduleId,
          at: new Date().toISOString(),
          score,
          total,
          percentage,
          passed,
        }

        const updatedModule = {
          ...(current ?? emptyModuleProgress(moduleId)),
          attempts: current.attempts + 1,
          latestScore: percentage,
          bestScore: Math.max(current.bestScore, percentage),
          completed: current.completed || passed,
          completedAt:
            current.completedAt ?? (passed ? new Date().toISOString() : undefined),
        }

        let next: ProgressState = {
          ...prev,
          xp: prev.xp + xpEarned,
          attempts: [...prev.attempts, attempt],
          modules: { ...prev.modules, [moduleId]: updatedModule },
        }

        next = withToday(next, (day) => ({
          ...day,
          testsTaken: day.testsTaken + 1,
          questionsAnswered: day.questionsAnswered + total,
          questionsCorrect: day.questionsCorrect + score,
          modulesCompleted:
            day.modulesCompleted + (passed && !wasCompleted ? 1 : 0),
        }))

        const badges = earnedBadges(next)
        const newBadges = badges.filter((b) => !prev.badges.includes(b))
        next = { ...next, badges }

        summary = {
          ...summary,
          newBadges,
          unlockedModuleId: passed && !wasCompleted ? moduleId + 1 : undefined,
        }

        return next
      })

      return summary
    },
    [setState],
  )

  const resetProgress = useCallback(() => {
    setState(createInitialState())
  }, [setState])

  const importState = useCallback(
    (next: ProgressState) => setState(next),
    [setState],
  )

  const value = useMemo(
    () => ({
      state,
      preferences,
      setPreferences,
      markLessonViewed,
      markPracticeCompleted,
      recordAnswers,
      recordTest,
      addStudyMinutes,
      resetProgress,
      importState,
    }),
    [
      state,
      preferences,
      setPreferences,
      markLessonViewed,
      markPracticeCompleted,
      recordAnswers,
      recordTest,
      addStudyMinutes,
      resetProgress,
      importState,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
