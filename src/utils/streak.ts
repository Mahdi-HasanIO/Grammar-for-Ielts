import type { DayActivity } from '@/types'
import { ACTIVE_DAY_MINUTES } from '@/utils/progression'
import { addDays, daysBetween, fromDateKey, toDateKey } from '@/utils/date'

export function isActiveDay(day: DayActivity | undefined): boolean {
  if (!day) return false
  return day.minutes >= ACTIVE_DAY_MINUTES
}

export function activeDayKeys(activity: Record<string, DayActivity>): string[] {
  return Object.values(activity)
    .filter(isActiveDay)
    .map((d) => d.date)
    .sort()
}

/**
 * Current streak counts back from today; a streak stays alive if yesterday
 * was active and today has not been completed yet.
 */
export function computeStreak(activity: Record<string, DayActivity>) {
  const keys = activeDayKeys(activity)
  if (keys.length === 0) return { current: 0, longest: 0, activeDays: 0 }

  const set = new Set(keys)
  const today = toDateKey()

  let current = 0
  let cursor = set.has(today) ? new Date() : addDays(new Date(), -1)
  while (set.has(toDateKey(cursor))) {
    current += 1
    cursor = addDays(cursor, -1)
  }

  let longest = 1
  let run = 1
  for (let i = 1; i < keys.length; i += 1) {
    if (daysBetween(keys[i - 1], keys[i]) === 1) {
      run += 1
    } else {
      run = 1
    }
    longest = Math.max(longest, run)
  }

  return { current, longest: Math.max(longest, current), activeDays: keys.length }
}

/** Builds a Monday-first month grid for the activity calendar. */
export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const lead = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = []
  for (let i = 0; i < lead; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(toDateKey(new Date(year, month, d)))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

/** Last `days` date keys ending today, oldest first. */
export function recentDays(days: number): string[] {
  const out: string[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    out.push(toDateKey(addDays(new Date(), -i)))
  }
  return out
}

export function dayLabel(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
