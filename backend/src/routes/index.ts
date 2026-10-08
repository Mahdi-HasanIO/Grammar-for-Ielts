import { Router } from 'express'
import { liveness, readiness } from '../controllers/health.js'
import { csrfProtection } from '../middleware/csrf.js'
import { authRateLimiter, type RateLimitOptions } from '../middleware/rateLimit.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireDatabase } from '../middleware/requireDatabase.js'
import type { AccountService } from '../services/account.js'
import type { AuthService } from '../services/auth.js'
import type { DatabaseStatus } from '../services/database.js'
import type { ProfileService } from '../services/profile.js'
import type { SessionCookieConfig } from '../utils/sessionCookie.js'
import { createAuthRouter, type AccountRouteGuards } from './auth.js'
import { createProfileRouter } from './profile.js'
import { createSyncRouter } from './sync.js'
import { createContentRouter } from './content.js'
import type { ContentService } from '../services/content.js'
import type { AdminContentService } from '../services/adminContent.js'
import { createAdminRouter } from './admin.js'
import { createAiRouter } from './ai.js'
import type { AiService } from '../services/ai/service.js'
import type { SyncService } from '../services/sync.js'
import { putBookmarksBody, putProgressBody, type Bookmark, type ProgressState } from '../validators/progress.js'

export interface ApiRouterOptions {
  db: DatabaseStatus
  auth: AuthService
  account: AccountService
  profile: ProfileService
  sync: SyncServices
  content: ContentService
  admin: AdminContentService
  ai: AiService
  aiRateLimit?: RateLimitOptions
  cookie: SessionCookieConfig
  allowedOrigins: readonly string[]
  authRateLimit?: RateLimitOptions
}

export interface SyncServices {
  progress: SyncService<ProgressState>
  bookmarks: SyncService<Bookmark[]>
}

/** Everything under /api. Feature routers are added here as later phases introduce them. */
export function createApiRouter({ db, auth, account, profile, sync, content, admin, ai, aiRateLimit, cookie, allowedOrigins, authRateLimit }: ApiRouterOptions): Router {
  const guards: AccountRouteGuards = {
    limiter: authRateLimiter(authRateLimit),
    database: requireDatabase(db),
    csrf: csrfProtection(allowedOrigins),
    signedIn: requireAuth(auth, cookie),
  }

  const router = Router()
  router.get('/health', liveness)
  router.get('/health/ready', readiness(db))
  router.use('/auth', createAuthRouter({ auth, account, cookie, guards }))
  router.use('/profile', createProfileRouter({ profile, guards }))
  // Progress and bookmarks: global rate limit only (the frontend saves often).
  const syncGuards = { database: guards.database, csrf: guards.csrf, signedIn: guards.signedIn }
  router.use('/progress', createSyncRouter({ field: 'progress', service: sync.progress, body: putProgressBody, guards: syncGuards }))
  router.use('/bookmarks', createSyncRouter({ field: 'bookmarks', service: sync.bookmarks, body: putBookmarksBody, guards: syncGuards }))
  router.use('/content', createContentRouter({ content, database: guards.database }))
  router.use('/admin', createAdminRouter({ admin, guards: syncGuards }))
  router.use('/ai', createAiRouter({ ai, guards: syncGuards, rateLimit: aiRateLimit }))
  return router
}
