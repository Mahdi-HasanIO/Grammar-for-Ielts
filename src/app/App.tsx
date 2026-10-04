import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/hooks/useProgress'
import { useTheme } from '@/hooks/useTheme'
import { Layout } from '@/components/Layout'
import { PublicLayout } from '@/components/public/PublicLayout'
import { Home } from '@/pages/public/Home'
import { Skeleton } from '@/components/ui/Skeleton'

/* The lesson and question banks are large, so the content-heavy routes load on demand. */
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Course = lazy(() => import('@/pages/Course').then((m) => ({ default: m.Course })))
const ModulePage = lazy(() => import('@/pages/Module').then((m) => ({ default: m.ModulePage })))
const TestPage = lazy(() => import('@/pages/Test').then((m) => ({ default: m.TestPage })))
const Review = lazy(() => import('@/pages/Review').then((m) => ({ default: m.Review })))
const ProgressPage = lazy(() =>
  import('@/pages/Progress').then((m) => ({ default: m.ProgressPage })),
)
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })))

/* Public pages. The homepage is eager so the landing page paints without a second request. */
const GrammarIndex = lazy(() =>
  import('@/pages/public/GrammarIndex').then((m) => ({ default: m.GrammarIndex })),
)
const GrammarTopic = lazy(() =>
  import('@/pages/public/GrammarTopic').then((m) => ({ default: m.GrammarTopic })),
)
const BlogIndex = lazy(() => import('@/pages/public/BlogIndex').then((m) => ({ default: m.BlogIndex })))
const BlogPost = lazy(() => import('@/pages/public/BlogPost').then((m) => ({ default: m.BlogPost })))
const Practice = lazy(() => import('@/pages/public/Practice').then((m) => ({ default: m.Practice })))

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

/** The learning workspace: sidebar layout shared by the dashboard and course. */
function Workspace() {
  return (
    <Layout>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </Layout>
  )
}

function ThemedRoutes() {
  useTheme()

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="/grammar" element={<GrammarIndex />} />
        <Route path="/grammar/:slug" element={<GrammarTopic />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/practice" element={<Practice />} />
      </Route>
      <Route element={<Workspace />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course" element={<Course />} />
        <Route path="/module/:id" element={<ModulePage />} />
        <Route path="/module/:id/test" element={<TestPage />} />
        <Route path="/review" element={<Review />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <ThemedRoutes />
    </ProgressProvider>
  )
}
