import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { SleepResistRecord } from './types'

const DEFAULT_DATA_FILE = '/tmp/sleep-resist-leaderboard.json'
const OVERALL_RETENTION_END_DATE_KEY = '2026-04-24'
const OVERALL_LIMIT = 10
const DAILY_LIMIT = 30

interface SleepLeaderboardStore {
  overallTop: SleepResistRecord[]
  dailyTopByDate: Record<string, SleepResistRecord[]>
}

function createEmptyStore(): SleepLeaderboardStore {
  return {
    overallTop: [],
    dailyTopByDate: {},
  }
}

function getDataFilePath() {
  const configuredPath = process.env.SLEEP_RESIST_DATA_FILE?.trim()
  return configuredPath || DEFAULT_DATA_FILE
}

function getDateKey(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function sortSleepRecords(records: SleepResistRecord[]) {
  return [...records].sort((a, b) => b.survivalTime - a.survivalTime || a.createdAt - b.createdAt)
}

function dedupeByNickname(records: SleepResistRecord[]) {
  const byNickname = new Map<string, SleepResistRecord>()

  for (const record of sortSleepRecords(records)) {
    const current = byNickname.get(record.nickname)
    if (!current || current.survivalTime < record.survivalTime) {
      byNickname.set(record.nickname, record)
    }
  }

  return sortSleepRecords([...byNickname.values()])
}

function normalizeStore(raw: unknown) {
  if (!raw || typeof raw !== 'object') return createEmptyStore()

  const candidate = raw as Partial<SleepLeaderboardStore>
  const overallTop = Array.isArray(candidate.overallTop) ? dedupeByNickname(candidate.overallTop).slice(0, OVERALL_LIMIT) : []
  const dailyTopByDate = Object.fromEntries(
    Object.entries(candidate.dailyTopByDate || {}).map(([dateKey, records]) => [
      dateKey,
      Array.isArray(records) ? dedupeByNickname(records).slice(0, DAILY_LIMIT) : [],
    ]),
  )

  return {
    overallTop,
    dailyTopByDate,
  }
}

export async function readSleepStore() {
  const dataFilePath = getDataFilePath()

  try {
    const raw = await readFile(dataFilePath, 'utf8')
    return normalizeStore(JSON.parse(raw))
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'ENOENT') return createEmptyStore()
    throw error
  }
}

async function writeSleepStore(store: SleepLeaderboardStore) {
  const dataFilePath = getDataFilePath()
  await mkdir(path.dirname(dataFilePath), { recursive: true })
  await writeFile(dataFilePath, JSON.stringify(normalizeStore(store), null, 2), 'utf8')
}

function upsertRankedRecord(records: SleepResistRecord[], record: SleepResistRecord, limit: number) {
  const filtered = records.filter((item) => item.nickname !== record.nickname)
  filtered.push(record)
  return dedupeByNickname(filtered).slice(0, limit)
}

export async function saveSleepRecord(input: Pick<SleepResistRecord, 'nickname' | 'survivalTime'>) {
  const store = await readSleepStore()
  const now = Date.now()
  const todayKey = getDateKey()
  const record: SleepResistRecord = {
    id: `${now}-${input.nickname}`,
    nickname: input.nickname,
    survivalTime: Number(input.survivalTime.toFixed(1)),
    createdAt: now,
    dateKey: todayKey,
  }

  const todayRecords = store.dailyTopByDate[todayKey] || []
  const existingTodayRecord = todayRecords.find((item) => item.nickname === record.nickname)
  const existingOverallRecord = store.overallTop.find((item) => item.nickname === record.nickname)

  if (existingTodayRecord && existingTodayRecord.survivalTime >= record.survivalTime) {
    return {
      record: existingTodayRecord,
      store,
    }
  }

  store.dailyTopByDate[todayKey] = upsertRankedRecord(todayRecords, record, DAILY_LIMIT)

  if (todayKey <= OVERALL_RETENTION_END_DATE_KEY) {
    if (!existingOverallRecord || existingOverallRecord.survivalTime < record.survivalTime) {
      store.overallTop = upsertRankedRecord(store.overallTop, record, OVERALL_LIMIT)
    }
  }

  await writeSleepStore(store)

  return {
    record,
    store,
  }
}
