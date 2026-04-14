import type { ClaimRecord } from './types'

const STORAGE_PREFIX = 'survivalPack'

export function getTodayKey(dateKey: string) {
  return `${STORAGE_PREFIX}_${dateKey}`
}

export function readClaim(dateKey: string): ClaimRecord | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(getTodayKey(dateKey))
  if (!raw) return null

  try {
    return JSON.parse(raw) as ClaimRecord
  } catch {
    return null
  }
}

export function writeClaim(record: ClaimRecord) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getTodayKey(record.date), JSON.stringify(record))
}

export function hasClaimedToday(dateKey: string) {
  return Boolean(readClaim(dateKey))
}
