import { Schema, type Connection } from 'mongoose'

/*
 * Content collections. Documents are validated by validators/content.ts
 * before they are written, so the schemas only declare the key fields
 * (strict: false keeps every other field as given).
 *
 * Indexes, checked by tests/indexes.test.ts:
 * - stages        { id: 1 } unique: lookup and upsert by stage number.
 * - modules       { legacyId: 1 } unique: course order, /module/:id, upsert key.
 *                 { slug: 1 } unique: lookup by stable slug; stops two modules sharing one.
 *                 { 'topic.slug': 1 } unique: lookup by public topic slug (/grammar/:slug).
 * - lessons       { moduleId: 1, language: 1 } unique: one lesson per module and language.
 * - questions     { id: 1 } unique: upsert and admin edits by question id.
 *                 { moduleId: 1, set: 1, position: 1 }: a module's practice or test set, in order.
 * - blog_posts    { slug: 1 } unique: lookup by URL slug.
 *                 { date: -1 }: the post list, newest first.
 * Plus the default _id index on each, unused by queries.
 */

const options = { strict: false, versionKey: false } as const

const stageSchema = new Schema({ id: { type: Number, required: true, unique: true } }, { ...options, collection: 'stages' })

const moduleSchema = new Schema(
  {
    legacyId: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    topic: { slug: { type: String, required: true, unique: true } },
  },
  { ...options, collection: 'modules' },
)

const lessonSchema = new Schema({ moduleId: { type: Number, required: true }, language: { type: String, required: true } }, { ...options, collection: 'lessons' })
lessonSchema.index({ moduleId: 1, language: 1 }, { unique: true })

const questionSchema = new Schema(
  { id: { type: String, required: true, unique: true }, moduleId: { type: Number, required: true }, set: { type: String, required: true }, position: { type: Number, required: true } },
  { ...options, collection: 'questions' },
)
questionSchema.index({ moduleId: 1, set: 1, position: 1 })

const postSchema = new Schema({ slug: { type: String, required: true, unique: true }, date: { type: String, required: true } }, { ...options, collection: 'blog_posts' })
postSchema.index({ date: -1 })

export function contentModels(connection: Connection) {
  return {
    stages: connection.model('Stage', stageSchema),
    modules: connection.model('ContentModule', moduleSchema),
    lessons: connection.model('Lesson', lessonSchema),
    questions: connection.model('Question', questionSchema),
    posts: connection.model('BlogPost', postSchema),
  }
}
