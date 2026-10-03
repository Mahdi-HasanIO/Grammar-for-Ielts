import { useMemo } from 'react'
import { useProgress } from '@/hooks/useProgress'
import { computeStreak } from '@/utils/streak'
import { toDateKey } from '@/utils/date'
import { ACTIVE_DAY_MINUTES } from '@/utils/progression'

export function useStreak() {
  const { state, preferences } = useProgress()

  return useMemo(() => {
    const { current, longest, activeDays } = computeStreak(state.activity)
    const today = state.activity[toDateKey()]
    const minutesToday = today?.minutes ?? 0
    const goal = preferences.dailyGoalMinutes

    return {
      current,
      longest,
      activeDays,
      minutesToday,
      goal,
      goalMet: minutesToday >= goal,
      goalPercentage: goal > 0 ? Math.min(100, Math.round((minutesToday / goal) * 100)) : 0,
      countsTowardStreak: minutesToday >= ACTIVE_DAY_MINUTES,
      minutesUntilStreak: Math.max(0, ACTIVE_DAY_MINUTES - minutesToday),
    }
  }, [state.activity, preferences.dailyGoalMinutes])
}
