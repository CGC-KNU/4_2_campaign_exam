import type { NextApiRequest, NextApiResponse } from 'next'
import { readSleepStore, saveSleepRecord } from '../../../lib/sleep-resist/server-store'

function getTodayKey(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function validateNickname(value: unknown) {
  const trimmed = typeof value === 'string' ? value.trim() : ''
  if (trimmed.length < 2 || trimmed.length > 8) return '닉네임은 2~8자로 입력해주세요.'
  if (!/^[A-Za-z0-9가-힣]+$/.test(trimmed)) return '닉네임은 한글, 영문, 숫자만 사용할 수 있어요.'
  return ''
}

function validateSurvivalTime(value: unknown) {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return null
  return numeric
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const store = await readSleepStore()
      const todayKey = getTodayKey()
      return res.status(200).json({
        overallRecords: store.overallTop,
        todayRecords: store.dailyTopByDate[todayKey] || [],
        todayKey,
      })
    }

    if (req.method === 'POST') {
      const nicknameError = validateNickname(req.body?.nickname)
      if (nicknameError) {
        return res.status(400).json({ error: nicknameError })
      }

      const survivalTime = validateSurvivalTime(req.body?.survivalTime)
      if (survivalTime === null) {
        return res.status(400).json({ error: '기록 값이 올바르지 않습니다.' })
      }

      const result = await saveSleepRecord({
        nickname: req.body.nickname.trim(),
        survivalTime,
      })

      return res.status(200).json({
        record: result.record,
        overallRecords: result.store.overallTop,
        todayRecords: result.store.dailyTopByDate[result.record.dateKey] || [],
        todayKey: result.record.dateKey,
      })
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' })
  } catch (error) {
    console.error('[sleep-resist] leaderboard api error', error)
    return res.status(500).json({ error: '랭킹 처리 중 문제가 발생했습니다.' })
  }
}
