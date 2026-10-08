import { Schema, type Connection } from 'mongoose'

/*
 * Append-only record of admin actions (content writes, role and plan grants).
 *
 * Indexes (audit_log), checked by tests/indexes.test.ts:
 * - _id (default): unused by queries.
 * - { at: -1 }: the admin audit view, newest first, paged by time.
 * No TTL: entries are kept until a retention policy is decided.
 */
const auditSchema = new Schema(
  {
    at: { type: Date, required: true, index: -1 },
    actor: { type: Schema.Types.Mixed, required: true },
    action: { type: String, required: true },
    target: { collection: { type: String, required: true }, key: { type: String, required: true } },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
  },
  { versionKey: false, minimize: false, collection: 'audit_log' },
)

export function auditModel(connection: Connection) {
  return connection.model('AuditLog', auditSchema)
}
