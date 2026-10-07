import type { GrammarModule, ModuleRef } from '@/content/catalog'
import type { BlogCategory, BlogPostMeta } from '@/data/blog/posts'
import type { BlogBlock } from '@/data/blog/articles'
import type { LessonLanguage, Lesson, Question, Stage } from '@/types'

/* Content record types, re-exported so UI code never imports from src/data. */
export type { BlogBlock, BlogCategory, BlogPostMeta, GrammarModule, ModuleRef }
export type { GrammarTopic } from '@/content/catalog'

export interface BlogPost {
  meta: BlogPostMeta
  blocks: BlogBlock[]
}

/**
 * Read access to course and blog content.
 *
 * Every method is async so a remote implementation (API or CMS) can replace
 * the static one without changing callers. Module lookups accept a stable
 * slug, a public topic slug, or a legacy numeric id while URLs migrate.
 *
 * Implementations must return the same promise for the same arguments
 * (React's `use()` needs a stable promise to avoid refetching on re-render).
 */
export interface ContentService {
  getStages(): Promise<Stage[]>
  getModules(): Promise<readonly GrammarModule[]>
  getModule(ref: ModuleRef): Promise<GrammarModule | undefined>
  getLesson(ref: ModuleRef, locale: LessonLanguage): Promise<Lesson | undefined>
  getPracticeQuestions(ref: ModuleRef): Promise<Question[]>
  getTestQuestions(ref: ModuleRef): Promise<Question[]>
  /** Public grammar topics. Same entities as getModules(), in topic order. */
  getGrammarTopics(): Promise<readonly GrammarModule[]>
  getGrammarTopic(topicSlug: string): Promise<GrammarModule | undefined>
  /** Topics featured on the homepage, in display order. */
  getFeaturedGrammarTopics(): Promise<readonly GrammarModule[]>
  /** Newest first. */
  getBlogPosts(): Promise<readonly BlogPostMeta[]>
  getBlogPost(slug: string): Promise<BlogPost | undefined>
  /** Blog categories, in display order. */
  getBlogCategories(): Promise<readonly BlogCategory[]>
}
