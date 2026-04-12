import { BUNDLE10_CODES, BUNDLE3_CODES, BUNDLE5_CODES, SINGLE_PACK_CODES } from './constants'
import type { FocusRewardResult } from './types'

function pickRandomCode(codes: string[], seed = Date.now()) {
  return codes[seed % codes.length]
}

export function resolveFocusReward(completedCount: number, seed = Date.now()): FocusRewardResult {
  if (completedCount >= 1 && completedCount <= 4) {
    return {
      rewardType: 'single_pack',
      code: pickRandomCode(SINGLE_PACK_CODES, seed),
      title: '랜덤 쿠폰 코드 1종 제공',
      description: '1~4회 성공 구간 보상으로 쿠폰 코드 1종이 지급됐어요.',
    }
  }

  if (completedCount >= 5 && completedCount <= 7) {
    return {
      rewardType: 'bundle3',
      code: pickRandomCode(BUNDLE3_CODES, seed),
      title: '랜덤 쿠폰 코드 3종 제공',
      description: '5~7회 성공 구간 보상으로 쿠폰 코드 3종이 지급됐어요.',
    }
  }

  if (completedCount >= 8 && completedCount <= 9) {
    return {
      rewardType: 'bundle5',
      code: pickRandomCode(BUNDLE5_CODES, seed),
      title: '랜덤 쿠폰 코드 5종 제공',
      description: '8~9회 성공 구간 보상으로 쿠폰 코드 5종이 지급됐어요.',
    }
  }

  if (completedCount >= 10) {
    return {
      rewardType: 'bundle10',
      code: pickRandomCode(BUNDLE10_CODES, seed),
      title: '랜덤 쿠폰 코드 10종 제공',
      description: '10회 성공 보상으로 쿠폰 코드 10종이 지급됐어요.',
    }
  }

  return {
    rewardType: 'single_pack',
    title: '보상 없음',
    description: '집중 기록은 정상 반영됐어요.',
  }
}

export function getNextRewardLabel(completedCount: number) {
  if (completedCount < 4) return '쿠폰 코드 1종'
  if (completedCount < 7) return '쿠폰 코드 3종'
  if (completedCount < 9) return '쿠폰 코드 5종'
  if (completedCount < 10) return '쿠폰 코드 10종'
  return '최종 보상 달성'
}

export function getRewardStepLabel(completedCount: number) {
  if (completedCount >= 10) return '최종 누적 보상 달성'
  if (completedCount >= 8) return '쿠폰 코드 5종 보상 구간 진입'
  if (completedCount >= 5) return '쿠폰 코드 3종 보상 구간 진입'
  if (completedCount >= 1) return '쿠폰 코드 1종 누적 구간 진행 중'
  return '첫 집중 미션 대기 중'
}
