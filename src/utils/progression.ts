import { MODULES, STAGES } from '@/data/modules'
import { moduleByLegacyId, resolveModule } from '@/content/catalog'
import type { ModuleMeta, ModuleProgress, ProgressState, StageId } from '@/types'

export const PASS_THRESHOLD = 80
export const TEST_LENGTH = 10
export const ACTIVE_DAY_MINUTES = 10

export type ModuleStatus = 'completed' | 'unlocked' | 'locked'

export function emptyModuleProgress(moduleId: number): ModuleProgress {
  return {
    moduleId,
    completed: false,
    lessonViewed: false,
    practiceCompleted: false,
    bestScore: 0,
    latestScore: 0,
    attempts: 0,
  }
}

export function getModuleProgress(
  state: ProgressState,
  moduleId: number,
): ModuleProgress {
  return state.modules[moduleId] ?? emptyModuleProgress(moduleId)
}

export function isModuleCompleted(state: ProgressState, moduleId: number) {
  return getModuleProgress(state, moduleId).completed
}

/**
 * A module is unlocked when every module before it has been passed.
 * Module 1 is always available.
 */
export function getModuleStatus(
  state: ProgressState,
  moduleId: number,
): ModuleStatus {
  if (isModuleCompleted(state, moduleId)) return 'completed'
  if (moduleId <= 1) return 'unlocked'
  return isModuleCompleted(state, moduleId - 1) ? 'unlocked' : 'locked'
}

export function completedCount(state: ProgressState): number {
  return MODULES.filter((m) => isModuleCompleted(state, m.id)).length
}

export function overallPercentage(state: ProgressState): number {
  return Math.round((completedCount(state) / MODULES.length) * 100)
}

/** The furthest unlocked, not-yet-completed module. */
export function getCurrentModule(state: ProgressState): ModuleMeta {
  const next = MODULES.find((m) => !isModuleCompleted(state, m.id))
  return next ?? MODULES[MODULES.length - 1]
}

export function stageModules(stage: StageId): ModuleMeta[] {
  return MODULES.filter((m) => m.stage === stage)
}

export type StageStatus = 'completed' | 'in-progress' | 'locked'

export function getStageStatus(
  state: ProgressState,
  stage: StageId,
): StageStatus {
  const mods = stageModules(stage)
  const done = mods.filter((m) => isModuleCompleted(state, m.id)).length
  if (done === mods.length) return 'completed'
  const anyUnlocked = mods.some((m) => getModuleStatus(state, m.id) !== 'locked')
  return anyUnlocked ? 'in-progress' : 'locked'
}

export function stageProgress(state: ProgressState, stage: StageId) {
  const mods = stageModules(stage)
  const done = mods.filter((m) => isModuleCompleted(state, m.id)).length
  return {
    done,
    total: mods.length,
    percentage: mods.length ? Math.round((done / mods.length) * 100) : 0,
    status: getStageStatus(state, stage),
  }
}

export function stageById(stage: StageId) {
  return STAGES.find((s) => s.id === stage)!
}

export function moduleById(id: number): ModuleMeta | undefined {
  return moduleByLegacyId(id)?.module
}

/** Accepts a stable module slug or a public topic slug. */
export function moduleBySlug(slug: string): ModuleMeta | undefined {
  return resolveModule(slug)?.module
}
