import { useProgress } from '@/hooks/useProgress'
import { getCurrentModule } from '@/utils/progression'
import { useHydrated } from '@/hooks/useHydrated'

/** Start Learning for new visitors, Continue Course (to the current module) once they have begun. */
export function useCourseCta() {
  const { state } = useProgress()
  const hydrated = useHydrated()
  const started =
    hydrated &&
    (Object.values(state.modules).some((m) => m.lessonViewed) || state.attempts.length > 0)
  const current = getCurrentModule(state)
  return started
    ? { label: 'Continue Course', to: `/module/${current.id}`, started }
    : { label: 'Start Learning', to: '/course', started }
}
