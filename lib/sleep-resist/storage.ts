import type { SleepResistRecord } from './types'

const PERSONAL_BEST_KEY = 'sleepResist_personalBest_v1'

export function sortSleepRecords(records: SleepResistRecord[]) {
  return [...records].sort((a, b) => b.survivalTime - a.survivalTime || a.createdAt - b.createdAt)
}

export async function fetchSleepLeaderboard() {
  if (typeof window === 'undefined') return [] as SleepResistRecord[]

  const response = await fetch('/api/sleep-resist/leaderboard')
  if (!response.ok) {
    throw new Error('랭킹을 불러오지 못했습니다.')
  }

  const payload = (await response.json()) as { records?: SleepResistRecord[] }
  return Array.isArray(payload.records) ? sortSleepRecords(payload.records) : []
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

export async function saveSleepRecord(input: Pick<SleepResistRecord, 'nickname' | 'survivalTime'>) {
  const response = await fetch('/api/sleep-resist/leaderboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(payload?.error || '랭킹 저장에 실패했습니다.')
  }

  const payload = (await response.json()) as { record: SleepResistRecord }
  updatePersonalBest(input.survivalTime)
  return payload.record
}
