import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/useProgress'
import { useTheme } from '@/hooks/useTheme'
import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'

/* The lesson and question banks are large, so the content-heavy routes load on demand. */
const Course = lazy(() => import('@/pages/Course').then((m) => ({ default: m.Course })))
const ModulePage = lazy(() => import('@/pages/Module').then((m) => ({ default: m.ModulePage })))
const TestPage = lazy(() => import('@/pages/Test').then((m) => ({ default: m.TestPage })))
const Review = lazy(() => import('@/pages/Review').then((m) => ({ default: m.Review })))
const ProgressPage = lazy(() =>
  import('@/pages/Progress').then((m) => ({ default: m.ProgressPage })),
)
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })))

function RouteFallback() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-ink-200 dark:bg-ink-800" />
      <div className="h-32 animate-pulse rounded-2xl bg-ink-200 dark:bg-ink-800" />
      <div className="h-32 animate-pulse rounded-2xl bg-ink-200 dark:bg-ink-800" />
    </div>
  )
}

function ThemedRoutes() {
  useTheme()

  return (
    <Layout>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/module/:id" element={<ModulePage />} />
          <Route path="/module/:id/test" element={<TestPage />} />
          <Route path="/review" element={<Review />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <ThemedRoutes />
    </ProgressProvider>
  )
}
