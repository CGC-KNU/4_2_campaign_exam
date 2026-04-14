import type { FocusChallengeTaskType } from './types'

export const FOCUS_CHALLENGE_DURATION_MS = 25 * 60 * 1000
export const FOCUS_CHALLENGE_MAX_COUNT = 10

export const SINGLE_PACK_CODES = ['YHMPQRA', 'LZTNVBK', 'QWXJCPD', 'RKMVYEF']
export const BUNDLE3_CODES = ['BTLQWGH', 'CPNXJIK', 'DVRYMLN']
export const BUNDLE5_CODES = ['RVKJXTA', 'SWMNPUB']
export const BUNDLE10_CODES = ['DFLPRWX']

export const FOCUS_TASK_OPTIONS: Array<{ id: FocusChallengeTaskType; label: string }> = [
  { id: 'major', label: '전공 공부' },
  { id: 'general', label: '교양 공부' },
  { id: 'assignment', label: '과제' },
  { id: 'memorization', label: '암기' },
  { id: 'problem_solving', label: '문제풀이' },
]

export const FOCUS_STATUS_MESSAGES = [
  { maxElapsedMinutes: 2, lines: ['집중 미션 시작', '오늘 버티는 데 필요한 25분입니다', '일단 앉아 있는 것만으로도 반은 시작한 겁니다'] },
  { maxElapsedMinutes: 7, lines: ['초반 5분이 제일 어렵습니다', '지금 이탈하면 다시 앉기 더 힘들어요', '리듬 만드는 중'] },
  { maxElapsedMinutes: 13, lines: ['흐름이 생기기 시작했어요', '지금부터가 진짜 집중 구간입니다', '딱 한 챕터만 더 본다는 느낌으로 가세요'] },
  { maxElapsedMinutes: 20, lines: ['여기까지 왔으면 거의 성공입니다', '이제 멈추기엔 아까운 구간이에요', '조금만 더 버티면 보상이 열립니다'] },
  { maxElapsedMinutes: 25, lines: ['거의 다 왔어요', '보상 지급 준비 중', '마지막 5분만 넘기면 됩니다'] },
]
