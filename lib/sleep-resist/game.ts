import type { SleepEvent } from './types'

export const SLEEP_EVENTS = [
  '카톡 옴',
  '침대 생각남',
  '유튜브 켜짐',
  '배고픔 경고',
  '5분만 잘까?',
  '눈 감김 주의',
  '이불 생각남',
]

export function getDrainRate(seconds: number) {
  if (seconds < 5) return 8.5
  if (seconds < 10) return 10
  if (seconds < 20) return 12
  if (seconds < 35) return 14.5
  if (seconds < 50) return 17
  return 20
}

export function getSleepTitle(seconds: number) {
  if (seconds < 10) return '도서관 입장 5분 컷'
  if (seconds < 20) return '커피가 시급한 상태'
  if (seconds < 35) return '평범한 시험기간 생존자'
  if (seconds < 50) return '밤샘 적응자'
  if (seconds < 70) return '사실상 각성 상태'
  return '경북대 불면 랭커'
}

export function getSleepStatusCopy(gauge: number) {
  if (gauge < 15) return '지금 졸면 끝입니다'
  if (gauge < 30) return '눈꺼풀 위험'
  if (gauge < 50) return '버텨라...'
  if (gauge < 75) return '카페인 없이 버티는 중'
  return '집중 중'
}

export function getDifficultyLabel(seconds: number) {
  if (seconds < 10) return '튜토리얼 구간'
  if (seconds < 20) return '졸음 상승 중'
  if (seconds < 35) return '긴장감 시작'
  if (seconds < 50) return '중상위권 구간'
  return '랭킹권 경쟁'
}

export function maybeCreateSleepEvent(now: number, lastEventAt: number, seconds: number) {
  if (seconds < 4) return null

  const minGap = 5000
  if (now - lastEventAt < minGap) return null

  const eventIndex = Math.floor((now / 1000) % SLEEP_EVENTS.length)
  const event: SleepEvent = {
    id: `${now}-${eventIndex}`,
    text: SLEEP_EVENTS[eventIndex],
    multiplier: seconds < 10 ? 2.2 : seconds < 20 ? 2.6 : seconds < 35 ? 3.1 : 3.5,
    endsAt: now + (seconds < 10 ? 900 : seconds < 20 ? 1050 : seconds < 35 ? 1200 : 1350),
    isDanger: true,
  }

  return event
}
