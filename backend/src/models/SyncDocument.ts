import { Schema, type Connection } from 'mongoose'

/*
 * One document per user per synced kind: `progress` and `bookmarks` collections.
 *
 * Indexes (both collections), checked by tests/indexes.test.ts:
 * - _id (default): unused by queries.
 * - { userId: 1 } unique: every read and the compare-and-set write ({ userId, version }) find the
 *   user's single document through it; the unique index also stops two first writes racing into
 *   two documents.
 */
function syncSchema() {
  return new Schema(
    {
      userId: { type: Schema.Types.ObjectId, required: true, unique: true },
      version: { type: Number, required: true, min: 1 },
      // Validated by validators/progress.ts before it is stored; kept as given.
      data: { type: Schema.Types.Mixed, required: true },
      updatedAt: { type: Date, required: true },
    },
    { versionKey: false, minimize: false },
  )
}

const progressSchema = syncSchema().set('collection', 'progress')
const bookmarksSchema = syncSchema().set('collection', 'bookmarks')

export function progressModel(connection: Connection) {
  return connection.model('Progress', progressSchema)
}

export function bookmarksModel(connection: Connection) {
  return connection.model('Bookmarks', bookmarksSchema)
}
