import mongoose from 'mongoose'
import { describe, expect, it } from 'vitest'
import { accountTokenModel } from '../src/models/AccountToken.js'
import { sessionModel } from '../src/models/Session.js'
import { bookmarksModel, progressModel } from '../src/models/SyncDocument.js'
import { userModel } from '../src/models/User.js'

/**
 * The index lists documented next to each schema. If a schema change adds or
 * drops an index, this fails until the comment (and this list) is updated.
 * Reads schema definitions only; no database needed.
 */
const connection = mongoose.createConnection()

describe('schema indexes match the documented review', () => {
  it('users', () => {
    expect(userModel(connection).schema.indexes()).toEqual([[{ email: 1 }, { unique: true }]])
  })

  it('sessions', () => {
    expect(sessionModel(connection).schema.indexes()).toEqual([
      [{ tokenHash: 1 }, { unique: true }],
      [{ userId: 1 }, {}],
      [{ expiresAt: 1 }, { expireAfterSeconds: 0 }],
    ])
  })

  it('account_tokens', () => {
    expect(accountTokenModel(connection).schema.indexes()).toEqual([
      [{ tokenHash: 1 }, { unique: true }],
      [{ expiresAt: 1 }, { expireAfterSeconds: 0 }],
      [{ userId: 1, type: 1 }, { unique: true }],
    ])
  })

  it('progress and bookmarks', () => {
    for (const model of [progressModel(connection), bookmarksModel(connection)]) {
      expect(model.schema.indexes()).toEqual([[{ userId: 1 }, { unique: true }]])
    }
  })
})
