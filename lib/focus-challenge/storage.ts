import { FOCUS_CHALLENGE_MAX_COUNT } from './constants'
import type { FocusChallengeProgress, FocusChallengeSession } from './types'

const SESSION_KEY = 'focusChallenge_session_v1'
const PROGRESS_KEY = 'focusChallenge_progress_v1'
const REWARD_PREFIX = 'focusChallenge_reward_'

function getDefaultProgress(dateKey: string): FocusChallengeProgress {
  return {
    completedCount: 0,
    todayCompleted: false,
    lastCompletedDate: undefined,
    attemptCount: 0,
    successCount: 0,
  }
}

function normalizeProgress(value: Partial<FocusChallengeProgress> | null | undefined, dateKey: string): FocusChallengeProgress {
  const base = getDefaultProgress(dateKey)
  const merged = { ...base, ...value }
  return {
    ...merged,
    completedCount: Math.max(0, Math.min(FOCUS_CHALLENGE_MAX_COUNT, Number(merged.completedCount || 0))),
    attemptCount: Math.max(0, Number(merged.attemptCount || 0)),
    successCount: Math.max(0, Number(merged.successCount || 0)),
    todayCompleted: merged.lastCompletedDate === dateKey,
  }
}

export function readFocusProgress(dateKey: string): FocusChallengeProgress {
  if (typeof window === 'undefined') return getDefaultProgress(dateKey)
  const raw = window.localStorage.getItem(PROGRESS_KEY)
  if (!raw) return getDefaultProgress(dateKey)

  try {
    return normalizeProgress(JSON.parse(raw) as FocusChallengeProgress, dateKey)
  } catch {
    return getDefaultProgress(dateKey)
  }
}

export function writeFocusProgress(progress: FocusChallengeProgress) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function readFocusSession(): FocusChallengeSession | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as FocusChallengeSession
  } catch {
    return null
  }
}

export function writeFocusSession(session: FocusChallengeSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearFocusSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}

export function incrementFocusAttempt(dateKey: string) {
  const current = readFocusProgress(dateKey)
  const next = { ...current, attemptCount: current.attemptCount + 1 }
  writeFocusProgress(next)
  return next
}

export function completeFocusProgress(dateKey: string) {
  const current = readFocusProgress(dateKey)
  if (current.todayCompleted) return current

  const next = {
    ...current,
    completedCount: Math.min(FOCUS_CHALLENGE_MAX_COUNT, current.completedCount + 1),
    successCount: current.successCount + 1,
    todayCompleted: true,
    lastCompletedDate: dateKey,
  }

  writeFocusProgress(next)
  return next
}

export function recordFocusSuccess(dateKey: string) {
  const current = readFocusProgress(dateKey)
  const next = {
    ...current,
    successCount: current.successCount + 1,
  }

  writeFocusProgress(next)
  return next
}

export function writeFocusRewardCode(dateKey: string, code: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`${REWARD_PREFIX}${dateKey}`, code)
}

export function readFocusRewardCode(dateKey: string) {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(`${REWARD_PREFIX}${dateKey}`)
}
