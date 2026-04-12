import { RESULT_TYPES } from './result-types'
import type { PackId, Scores } from './types'

const PACK_PRIORITY: PackId[] = RESULT_TYPES.map((result) => result.id)

export function createEmptyScores(): Scores {
  return {
    pack01: 0,
    pack02: 0,
    pack03: 0,
    pack04: 0,
    pack05: 0,
    pack06: 0,
    pack07: 0,
    pack08: 0,
    pack09: 0,
    pack10: 0,
    pack11: 0,
    pack12: 0,
    pack13: 0,
  }
}

export function addScores(base: Scores, next: Partial<Scores>) {
  const merged = { ...base }

  Object.entries(next).forEach(([key, value]) => {
    merged[key as keyof Scores] += value ?? 0
  })

  return merged
}

export function resolvePack(scores: Scores): PackId {
  let bestPack: PackId = PACK_PRIORITY[0]
  let bestScore = scores[bestPack]

  PACK_PRIORITY.slice(1).forEach((packId) => {
    const score = scores[packId]

    if (score > bestScore) {
      bestPack = packId
      bestScore = score
    }
  })

  return bestPack
}

export function getResultRank(packId: PackId) {
  return RESULT_TYPES.findIndex((result) => result.id === packId) + 1
}
