import { Navigate, useParams } from 'react-router-dom'
import { resolveModule } from '@/content/catalog'
import { modulePath, moduleTestPath } from '@/content/paths'

/**
 * /learn/:slug and /learn/:slug/test: slug-based lesson URLs. For now they
 * redirect to the canonical numeric URL (/module/:id), which stays the
 * progress identity. When slug URLs become canonical, this redirect flips.
 * Accepts a stable module slug, a public topic slug or a legacy id.
 */
export function LearnRedirect({ test = false }: { test?: boolean }) {
  const { slug } = useParams()
  const entry = resolveModule(slug)
  if (!entry) return <Navigate to="/course" replace />
  return <Navigate to={test ? moduleTestPath(entry.legacyId) : modulePath(entry.legacyId)} replace />
}
