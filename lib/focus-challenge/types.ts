export type FocusChallengeStatus = 'idle' | 'running' | 'completed' | 'abandoned' | 'expired'

export type FocusChallengeTaskType =
  | 'major'
  | 'general'
  | 'assignment'
  | 'memorization'
  | 'problem_solving'
  | 'custom'

export interface FocusChallengeSession {
  sessionId: string
  dateKey: string
  status: FocusChallengeStatus
  taskType?: FocusChallengeTaskType
  taskLabel?: string
  startedAt?: number
  endsAt?: number
  completedAt?: number
}

export interface FocusChallengeProgress {
  completedCount: number
  todayCompleted: boolean
  lastCompletedDate?: string
  attemptCount: number
  successCount: number
}

export type FocusRewardType = 'single_pack' | 'bundle3' | 'bundle5' | 'bundle10'

export interface FocusRewardResult {
  rewardType: FocusRewardType
  code?: string
  title: string
  description: string
}
