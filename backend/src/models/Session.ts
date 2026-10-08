import { Schema, type Connection, type InferSchemaType } from 'mongoose'

const sessionSchema = new Schema(
  {
    // SHA-256 of the session token. The token itself only ever exists in the user's cookie.
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    // TTL index: MongoDB deletes the document once expiresAt has passed. The sweep runs about once
    // a minute, so expiry is also checked on every lookup.
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
)

export type SessionDocument = InferSchemaType<typeof sessionSchema>

/** Registers the model on this connection (or returns it if already registered). */
export function sessionModel(connection: Connection) {
  return connection.model('Session', sessionSchema)
}
