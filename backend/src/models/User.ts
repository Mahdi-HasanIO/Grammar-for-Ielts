import { Schema, type Connection, type InferSchemaType } from 'mongoose'

/*
 * Indexes (users), checked by tests/indexes.test.ts:
 * - _id (default): findById for sessions, account tokens and profile updates.
 * - { email: 1 } unique: login and forgot-password lookups, and the race-safe duplicate check on register.
 * No others: profile fields are only ever read by _id.
 */
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    // Never sent to clients or logged: the repository maps documents to UserRecord, and the API to PublicUser.
    passwordHash: { type: String, required: true },
    emailVerifiedAt: { type: Date },
    // Granted only by the grant-admin script; never set through the API.
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Set by an admin (PUT /api/admin/users/:id/plan) or, later, a verified payment webhook; never by the user.
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    planExpiresAt: { type: Date },
    // Profile (all optional; validated by validators/profile.ts before they get here).
    displayName: { type: String, maxlength: 50 },
    targetBand: { type: Number, min: 4, max: 9 },
    examDate: { type: String },
    timezone: { type: String },
    dailyGoalMinutes: { type: Number, min: 1, max: 600 },
    language: { type: String, enum: ['en', 'bn'] },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false },
)

export type UserDocument = InferSchemaType<typeof userSchema>

/** Registers the model on this connection (or returns it if already registered). */
export function userModel(connection: Connection) {
  return connection.model('User', userSchema)
}
