import { Schema, type Connection, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    // Never sent to clients or logged: the repository maps documents to UserRecord, and the API to PublicUser.
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
)

export type UserDocument = InferSchemaType<typeof userSchema>

/** Registers the model on this connection (or returns it if already registered). */
export function userModel(connection: Connection) {
  return connection.model('User', userSchema)
}
