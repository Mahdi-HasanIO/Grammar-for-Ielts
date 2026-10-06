import { use } from 'react'
import { createStaticContentService } from './staticContentService'
import type { ContentService } from './types'

export type { BlogPost, ContentService } from './types'
export { createStaticContentService } from './staticContentService'

/** The app's content source. Today: the bundled TypeScript data files. */
export const contentService: ContentService = createStaticContentService()

/**
 * Reads a content request inside a component.
 *
 * With the static service the value is available immediately (no Suspense,
 * identical prerender and hydration). With a future remote service the
 * component suspends until the data arrives, so pages that use it must sit
 * under a <Suspense> boundary (every lazy route already does).
 */
export function useContent<T>(request: Promise<T>): T {
  return use(request)
}
