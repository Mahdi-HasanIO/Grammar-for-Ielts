import { pathToFileURL } from 'node:url'
import { EnvError, loadEnv } from '../config/env.js'
import { createLogger } from '../config/logger.js'
import { createMongoRepositories } from '../repositories/mongo.js'
import type { Repositories } from '../repositories/types.js'
import { createDatabase } from '../services/database.js'

/*
 * The only way to store the admin role (besides ADMIN_EMAILS for verified
 * addresses): run on the server by someone with database access.
 *
 *   npm run admin:grant -- someone@example.com
 *   npm run admin:grant -- someone@example.com --revoke
 *
 * Each change is written to the audit log.
 */

export async function setAdminRole(repositories: Pick<Repositories, 'users' | 'audit'>, email: string, admin: boolean, now = new Date()): Promise<string> {
  const user = await repositories.users.findByEmail(email.trim().toLowerCase())
  if (!user) throw new Error(`No account with the email ${email}`)
  const role = admin ? 'admin' : 'user'
  if (user.role === role) return `${user.email} already has the ${role} role`
  await repositories.users.update(user.id, { role })
  await repositories.audit.append({
    at: now,
    actor: { type: 'script', name: 'grant-admin' },
    action: admin ? 'grant_role' : 'revoke_role',
    target: { collection: 'users', key: user.id },
    before: { role: user.role },
    after: { role },
  })
  return `${user.email} now has the ${role} role`
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const email = args.find((a) => !a.startsWith('--'))
  if (!email) throw new Error('Usage: npm run admin:grant -- <email> [--revoke]')
  try {
    process.loadEnvFile()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  const env = loadEnv()
  const db = createDatabase({ uri: env.MONGODB_URI, logger: createLogger(env), retryDelayMs: 60_000 })
  await db.connect()
  if (db.state() !== 'connected') throw new Error('Could not connect to MongoDB (see the log above)')
  try {
    console.log(await setAdminRole(createMongoRepositories(db.connection), email, !args.includes('--revoke')))
  } finally {
    await db.disconnect()
  }
}

// Run only as a script, not when imported by tests.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof EnvError || error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
