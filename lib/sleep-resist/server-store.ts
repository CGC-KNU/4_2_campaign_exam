import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { SleepResistRecord } from './types'

const DEFAULT_DATA_FILE = '/tmp/sleep-resist-leaderboard.json'

function getDataFilePath() {
  const configuredPath = process.env.SLEEP_RESIST_DATA_FILE?.trim()
  return configuredPath || DEFAULT_DATA_FILE
}

function getTodayKey(now = new Date()) {
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

export async function readSleepRecords() {
  const dataFilePath = getDataFilePath()

  try {
    const raw = await readFile(dataFilePath, 'utf8')
    const parsed = JSON.parse(raw) as SleepResistRecord[]
    return Array.isArray(parsed) ? sortSleepRecords(parsed) : []
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code === 'ENOENT') return []
    throw error
  }
}

async function writeSleepRecords(records: SleepResistRecord[]) {
  const dataFilePath = getDataFilePath()
  await mkdir(path.dirname(dataFilePath), { recursive: true })
  await writeFile(dataFilePath, JSON.stringify(sortSleepRecords(records), null, 2), 'utf8')
}

export async function upsertSleepRecord(input: Pick<SleepResistRecord, 'nickname' | 'survivalTime'>) {
  const records = await readSleepRecords()
  const now = Date.now()
  const record: SleepResistRecord = {
    id: `${now}-${input.nickname}`,
    nickname: input.nickname,
    survivalTime: Number(input.survivalTime.toFixed(1)),
    createdAt: now,
    dateKey: getTodayKey(),
  }
  const sameNicknameIndex = records.findIndex((item) => item.nickname === record.nickname)

  if (sameNicknameIndex >= 0) {
    if (records[sameNicknameIndex].survivalTime >= record.survivalTime) {
      return records[sameNicknameIndex]
    }

    records[sameNicknameIndex] = record
  } else {
    records.push(record)
  }

  await writeSleepRecords(records)
  return record
}
