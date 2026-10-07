/*
 * Every in-app URL for content is built here, so the switch from numeric
 * module URLs (/module/3) to stable slug URLs (/learn/articles-and-determiners)
 * is a change to this file plus a redirect, not a search through the app.
 */

/** Canonical lesson URL. Still the legacy numeric form; /learn/:slug redirects here. */
export function modulePath(legacyId: number): string {
  return `/module/${legacyId}`
}

export function moduleTestPath(legacyId: number): string {
  return `/module/${legacyId}/test`
}

/** Slug-based lesson URL. Works today as a redirect to modulePath(). */
export function learnPath(slug: string): string {
  return `/learn/${slug}`
}

export function learnTestPath(slug: string): string {
  return `/learn/${slug}/test`
}

export function grammarTopicPath(topicSlug: string): string {
  return `/grammar/${topicSlug}`
}

export function blogPostPath(slug: string): string {
  return `/blog/${slug}`
}
