import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/useProgress'
import { useTheme } from '@/hooks/useTheme'
import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Skeleton } from '@/components/ui/Skeleton'

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
    <div className="animate-fade-in space-y-5" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="h-9 w-72 max-w-full rounded-xl" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <Skeleton className="h-40 rounded-3xl" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
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
