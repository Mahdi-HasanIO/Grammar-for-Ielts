import mongoose from 'mongoose'
import { describe, expect, it } from 'vitest'
import { accountTokenModel } from '../src/models/AccountToken.js'
import { auditModel } from '../src/models/AuditLog.js'
import { usageModel } from '../src/models/UsageCounter.js'
import { contentModels } from '../src/models/Content.js'
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

  it('content collections', () => {
    const models = contentModels(connection)
    expect(models.stages.schema.indexes()).toEqual([[{ id: 1 }, { unique: true }]])
    expect(models.modules.schema.indexes()).toEqual([
      [{ legacyId: 1 }, { unique: true }],
      [{ slug: 1 }, { unique: true }],
      [{ 'topic.slug': 1 }, { unique: true }],
    ])
    expect(models.lessons.schema.indexes()).toEqual([[{ moduleId: 1, language: 1 }, { unique: true }]])
    expect(models.questions.schema.indexes()).toEqual([
      [{ id: 1 }, { unique: true }],
      [{ moduleId: 1, set: 1, position: 1 }, {}],
    ])
    expect(models.posts.schema.indexes()).toEqual([
      [{ slug: 1 }, { unique: true }],
      [{ date: -1 }, {}],
    ])
  })

  it('audit_log', () => {
    expect(auditModel(connection).schema.indexes()).toEqual([[{ at: -1 }, {}]])
  })

  it('usage_counters', () => {
    expect(usageModel(connection).schema.indexes()).toEqual([
      [{ expiresAt: 1 }, { expireAfterSeconds: 0 }],
      [{ userId: 1, metric: 1, day: 1 }, { unique: true }],
    ])
  })
})
