import type { SleepResistRecord } from './types'

const LEADERBOARD_KEY = 'sleepResist_leaderboard_v1'
const PERSONAL_BEST_KEY = 'sleepResist_personalBest_v1'

function readAllRecords() {
  if (typeof window === 'undefined') return [] as SleepResistRecord[]
  const raw = window.localStorage.getItem(LEADERBOARD_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as SleepResistRecord[]
  } catch {
    return []
  }
}

function writeAllRecords(records: SleepResistRecord[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(records))
}

export function getSleepLeaderboard(limit = 10) {
  return readAllRecords()
    .sort((a, b) => b.survivalTime - a.survivalTime || a.createdAt - b.createdAt)
    .slice(0, limit)
}

export function getTodaySleepLeaderboard(dateKey: string, limit = 10) {
  return readAllRecords()
    .filter((record) => record.dateKey === dateKey)
    .sort((a, b) => b.survivalTime - a.survivalTime || a.createdAt - b.createdAt)
    .slice(0, limit)
}

export function getPersonalBest() {
  if (typeof window === 'undefined') return 0
  return Number(window.localStorage.getItem(PERSONAL_BEST_KEY) || 0)
}

export function updatePersonalBest(value: number) {
  if (typeof window === 'undefined') return value
  const current = getPersonalBest()
  const next = Math.max(current, value)
  window.localStorage.setItem(PERSONAL_BEST_KEY, String(next))
  return next
}

export function saveSleepRecord(record: SleepResistRecord) {
  const records = readAllRecords()
  const sameNicknameIndex = records.findIndex((item) => item.nickname === record.nickname)

  if (sameNicknameIndex >= 0) {
    if (records[sameNicknameIndex].survivalTime >= record.survivalTime) {
      updatePersonalBest(record.survivalTime)
      return records[sameNicknameIndex]
    }
    records[sameNicknameIndex] = record
  } else {
    records.push(record)
  }

  writeAllRecords(records)
  updatePersonalBest(record.survivalTime)
  return record
}
