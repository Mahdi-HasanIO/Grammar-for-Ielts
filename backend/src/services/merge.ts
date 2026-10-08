import type { Bookmark, DayActivity, ModuleProgress, ProgressState, TestAttempt } from '../validators/progress.js'

/*
 * Merges for sync conflicts: the client's write was based on an older
 * version than the server's. Both sides may hold data the other lacks, so
 * every merge here is a union that never discards anything; for an item on
 * both sides, the newer (or more advanced) value wins.
 */

const time = (iso: string | undefined) => (iso ? Date.parse(iso) : Number.NaN)

const earliest = (a: string | undefined, b: string | undefined) => {
  if (!a) return b
  if (!b) return a
  return time(a) <= time(b) ? a : b
}

/**
 * Progress only moves forward: a module completed or viewed on either side
 * stays so, scores and counts take the higher value, and latestScore comes
 * from the side with more attempts (the newer one).
 */
function mergeModule(server: ModuleProgress, client: ModuleProgress): ModuleProgress {
  const merged: ModuleProgress = {
    moduleId: client.moduleId,
    completed: server.completed || client.completed,
    lessonViewed: server.lessonViewed || client.lessonViewed,
    practiceCompleted: server.practiceCompleted || client.practiceCompleted,
    bestScore: Math.max(server.bestScore, client.bestScore),
    latestScore: server.attempts > client.attempts ? server.latestScore : client.latestScore,
    attempts: Math.max(server.attempts, client.attempts),
  }
  const completedAt = earliest(server.completedAt, client.completedAt)
  if (completedAt) merged.completedAt = completedAt
  return merged
}

/** Each device counts its own activity; the larger figure for each field is kept, so nothing is lost or double counted. */
function mergeDay(server: DayActivity, client: DayActivity): DayActivity {
  return {
    date: client.date,
    minutes: Math.max(server.minutes, client.minutes),
    modulesCompleted: Math.max(server.modulesCompleted, client.modulesCompleted),
    testsTaken: Math.max(server.testsTaken, client.testsTaken),
    questionsAnswered: Math.max(server.questionsAnswered, client.questionsAnswered),
    questionsCorrect: Math.max(server.questionsCorrect, client.questionsCorrect),
  }
}

const attemptKey = (a: TestAttempt) => `${a.moduleId}|${a.at}|${a.score}|${a.total}|${a.percentage}|${a.passed}`

export function mergeProgress(server: ProgressState, client: ProgressState): ProgressState {
  const modules: Record<string, ModuleProgress> = { ...server.modules }
  for (const [key, mod] of Object.entries(client.modules)) {
    const existing = modules[key]
    modules[key] = existing ? mergeModule(existing, mod) : mod
  }

  const attempts = new Map<string, TestAttempt>()
  for (const attempt of [...server.attempts, ...client.attempts]) attempts.set(attemptKey(attempt), attempt)

  const activity: Record<string, DayActivity> = { ...server.activity }
  for (const [date, day] of Object.entries(client.activity)) {
    const existing = activity[date]
    activity[date] = existing ? mergeDay(existing, day) : day
  }

  return {
    schemaVersion: client.schemaVersion,
    modules,
    // Oldest first, as the frontend appends.
    attempts: [...attempts.values()].sort((a, b) => time(a.at) - time(b.at)),
    activity,
    badges: [...new Set([...server.badges, ...client.badges])],
    xp: Math.max(server.xp, client.xp),
    startedAt: earliest(server.startedAt, client.startedAt) ?? client.startedAt,
  }
}

/**
 * Union by path; for a path on both sides the one saved later wins. A
 * bookmark removed on a stale client comes back (it is still on the
 * server): the client must sync before deleting, never lose a bookmark.
 */
export function mergeBookmarks(server: readonly Bookmark[], client: readonly Bookmark[]): Bookmark[] {
  const byPath = new Map<string, Bookmark>()
  for (const item of server) byPath.set(item.path, item)
  for (const item of client) {
    const existing = byPath.get(item.path)
    if (!existing || time(item.savedAt) >= time(existing.savedAt)) byPath.set(item.path, item)
  }
  return [...byPath.values()]
}
