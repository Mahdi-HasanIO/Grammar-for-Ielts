import { MODULES, STAGES } from '@/data/modules'
import { GRAMMAR_TOPICS, type GrammarTopic } from '@/data/grammarTopics'
import type { ModuleMeta, Stage, StageId } from '@/types'

/*
 * The grammar catalogue: one entity per grammar area.
 *
 * The course module (data/modules.ts) and the public grammar topic
 * (data/grammarTopics.ts) are two views of the same thing: the topic page
 * at /grammar/:topicSlug teaches the same lesson as the course module at
 * /module/:id. This file joins them once, so the rest of the app asks for a
 * GrammarModule instead of looking things up in two catalogues by number.
 *
 * Identity rules:
 * - `slug` is the stable identity. It never changes, even if the course is
 *   reordered. New URLs, bookmarks and (later) database rows key on it.
 * - `legacyId` is the numeric id used today for course order, progress keys
 *   and /module/:id URLs. It is kept for backwards compatibility.
 * - `topic.slug` is the public SEO URL (/grammar/articles). It is also stable,
 *   because changing it would break indexed pages.
 */

export interface GrammarModule {
  /** Stable identity, e.g. 'articles-and-determiners'. */
  slug: string
  /** Numeric id from before stable slugs. Course position and progress key. */
  legacyId: number
  stage: StageId
  /** Course metadata (Bangla summary and IELTS note; localise with utils/i18n). */
  module: ModuleMeta
  /** Public grammar-topic view of the same lesson. */
  topic: GrammarTopic
}

/** Anything that identifies a module: legacy id, module slug or topic slug. */
export type ModuleRef = string | number

const topicByModuleId = new Map(GRAMMAR_TOPICS.map((t) => [t.moduleId, t]))

/** Modules without a public topic are skipped; the catalogue tests require that there are none. */
export const GRAMMAR_MODULES: readonly GrammarModule[] = MODULES.flatMap((module) => {
  const topic = topicByModuleId.get(module.id)
  if (!topic) return []
  return [{ slug: module.slug, legacyId: module.id, stage: module.stage, module, topic }]
})

const byLegacyId = new Map(GRAMMAR_MODULES.map((m) => [m.legacyId, m]))
const bySlug = new Map(GRAMMAR_MODULES.map((m) => [m.slug, m]))
const byTopicSlug = new Map(GRAMMAR_MODULES.map((m) => [m.topic.slug, m]))

export function moduleByLegacyId(id: number): GrammarModule | undefined {
  return byLegacyId.get(id)
}

export function moduleBySlug(slug: string | undefined): GrammarModule | undefined {
  return slug === undefined ? undefined : bySlug.get(slug)
}

export function moduleByTopicSlug(slug: string | undefined): GrammarModule | undefined {
  return slug === undefined ? undefined : byTopicSlug.get(slug)
}

/**
 * Resolves any module reference. Accepts a legacy numeric id (as a number or
 * a digit string from a URL), a stable module slug, or a public topic slug.
 */
export function resolveModule(ref: ModuleRef | undefined): GrammarModule | undefined {
  if (ref === undefined) return undefined
  if (typeof ref === 'number') return byLegacyId.get(ref)
  if (/^\d+$/.test(ref)) return byLegacyId.get(Number(ref))
  return bySlug.get(ref) ?? byTopicSlug.get(ref)
}

export function catalogStages(): Stage[] {
  return STAGES
}
