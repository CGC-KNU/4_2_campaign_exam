import { FOCUS_CHALLENGE_DURATION_MS, FOCUS_STATUS_MESSAGES } from './constants'
import { clearFocusSession, completeFocusProgress, incrementFocusAttempt, readFocusProgress, readFocusRewardCode, recordFocusSuccess, writeFocusRewardCode, writeFocusSession } from './storage'
import { resolveFocusReward } from './rewards'
import type { FocusChallengeSession, FocusChallengeTaskType } from './types'

export function createFocusSession(dateKey: string, taskType?: FocusChallengeTaskType, taskLabel?: string): FocusChallengeSession {
  const now = Date.now()
  const session: FocusChallengeSession = {
    sessionId: `${dateKey}-${now}`,
    dateKey,
    status: 'running',
    taskType,
    taskLabel: taskLabel?.trim(),
    startedAt: now,
    endsAt: now + FOCUS_CHALLENGE_DURATION_MS,
  }

  writeFocusSession(session)
  incrementFocusAttempt(dateKey)
  return session
}

export function abandonFocusSession(session: FocusChallengeSession) {
  const next: FocusChallengeSession = {
    ...session,
    status: 'abandoned',
  }
  writeFocusSession(next)
  clearFocusSession()
}

export function expireFocusSession(session: FocusChallengeSession) {
  const next: FocusChallengeSession = {
    ...session,
    status: 'expired',
  }
  writeFocusSession(next)
  clearFocusSession()
}

export function finalizeFocusSession(session: FocusChallengeSession, options?: { official?: boolean }) {
  const official = options?.official ?? true
  const completedAt = Date.now()
  const progress = official ? completeFocusProgress(session.dateKey) : recordFocusSuccess(session.dateKey)
  const completedSession: FocusChallengeSession = {
    ...session,
    status: 'completed',
    completedAt,
  }

  const existingCode = readFocusRewardCode(session.dateKey)
  const reward = resolveFocusReward(progress.completedCount, completedAt)
  if (reward.code && !existingCode) {
    writeFocusRewardCode(session.dateKey, reward.code)
  }
  if (reward.code && existingCode) {
    reward.code = existingCode
  }

  writeFocusSession(completedSession)
  clearFocusSession()

  return {
    session: completedSession,
    progress,
    reward,
  }
}

export function restoreFocusState(session: FocusChallengeSession | null, dateKey: string) {
  const progress = readFocusProgress(dateKey)
  if (!session) {
    return { session: null, progress, shouldAutoComplete: false }
  }

  if (session.dateKey !== dateKey) {
    expireFocusSession(session)
    return { session: null, progress, shouldAutoComplete: false }
  }

  if (session.status !== 'running') {
    return { session: null, progress, shouldAutoComplete: false }
  }

  if ((session.endsAt ?? 0) <= Date.now()) {
    return { session, progress, shouldAutoComplete: !progress.todayCompleted }
  }

  return { session, progress, shouldAutoComplete: false }
}

export function getRemainingMs(session: FocusChallengeSession | null) {
  if (!session?.endsAt) return 0
  return Math.max(0, session.endsAt - Date.now())
}

export function getFocusStatusMessage(session: FocusChallengeSession | null) {
  if (!session?.startedAt) return '오늘 버티는 데 필요한 25분입니다'
  const elapsedMinutes = Math.floor((Date.now() - session.startedAt) / 60000)
  const bucket = FOCUS_STATUS_MESSAGES.find((item) => elapsedMinutes < item.maxElapsedMinutes) ?? FOCUS_STATUS_MESSAGES[FOCUS_STATUS_MESSAGES.length - 1]
  return bucket.lines[elapsedMinutes % bucket.lines.length]
}
