import { Schema, type Connection, type InferSchemaType } from 'mongoose'

const accountTokenSchema = new Schema(
  {
    // SHA-256 of the one-time token. The token itself only exists in the email that was sent.
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true, enum: ['password_reset', 'email_verification'] },
    // TTL index: MongoDB deletes expired tokens (about once a minute); expiry is also checked on use.
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    createdAt: { type: Date, required: true },
  },
  { versionKey: false, collection: 'account_tokens' },
)

// One live token per user and type: requesting a new link replaces (and so invalidates) the old one.
accountTokenSchema.index({ userId: 1, type: 1 }, { unique: true })

export type AccountTokenDocument = InferSchemaType<typeof accountTokenSchema>

/** Registers the model on this connection (or returns it if already registered). */
export function accountTokenModel(connection: Connection) {
  return connection.model('AccountToken', accountTokenSchema)
}
