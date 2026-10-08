import { Schema, type Connection } from 'mongoose'

/** Counters are kept this long after their day, then MongoDB deletes them. */
export const USAGE_RETENTION_DAYS = 35

/*
 * Daily per-user counters (AI requests and other metered features).
 *
 * Indexes (usage_counters), checked by tests/indexes.test.ts:
 * - _id (default): unused by queries.
 * - { userId: 1, metric: 1, day: 1 } unique: the atomic "add one if below the limit" upsert and reads;
 *   the unique index is also what turns a second insert at the limit into "limit reached".
 * - { expiresAt: 1 } TTL (expireAfterSeconds 0): old days are deleted after USAGE_RETENTION_DAYS.
 */
const usageSchema = new Schema(
  {
    userId: { type: String, required: true },
    metric: { type: String, required: true },
    day: { type: String, required: true },
    count: { type: Number, required: true, min: 0, default: 0 },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { versionKey: false, collection: 'usage_counters' },
)
usageSchema.index({ userId: 1, metric: 1, day: 1 }, { unique: true })

export function usageModel(connection: Connection) {
  return connection.model('UsageCounter', usageSchema)
}
