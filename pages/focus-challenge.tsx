import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { getCampaignNow } from '../lib/campaign'
import { getCanonicalUrl } from '../lib/site'
import { shareFocusChallenge } from '../lib/focus-challenge/share'
import { FOCUS_CHALLENGE_MAX_COUNT, FOCUS_TASK_OPTIONS } from '../lib/focus-challenge/constants'
import { createFocusSession, finalizeFocusSession, getFocusStatusMessage, getRemainingMs, restoreFocusState, abandonFocusSession } from '../lib/focus-challenge/session'
import { getNextRewardLabel, getRewardStepLabel, resolveFocusReward } from '../lib/focus-challenge/rewards'
import { readFocusProgress, readFocusRewardCode, readFocusSession } from '../lib/focus-challenge/storage'
import { copyText } from '../lib/survival-pack/share'
import type { FocusChallengeProgress, FocusChallengeSession, FocusChallengeTaskType, FocusRewardResult } from '../lib/focus-challenge/types'

type FocusScreen = 'intro' | 'setup' | 'running' | 'completed' | 'already-done'

const CAMPAIGN_END_DATE_KEY = '2026-04-25'

function getDaysUntil(targetKey: string, todayKey: string) {
  const current = new Date(`${todayKey}T00:00:00+09:00`).getTime()
  const target = new Date(`${targetKey}T00:00:00+09:00`).getTime()
  return Math.max(0, Math.ceil((target - current) / 86400000))
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function FocusChallengePage() {
  const canonicalUrl = getCanonicalUrl('/focus-challenge')
  const [campaignNow, setCampaignNow] = useState(() => getCampaignNow())
  const [screen, setScreen] = useState<FocusScreen>('intro')
  const [progress, setProgress] = useState<FocusChallengeProgress>({
    completedCount: 0,
    todayCompleted: false,
    attemptCount: 0,
    successCount: 0,
  })
  const [session, setSession] = useState<FocusChallengeSession | null>(null)
  const [completedSession, setCompletedSession] = useState<FocusChallengeSession | null>(null)
  const [reward, setReward] = useState<FocusRewardResult | null>(null)
  const [rewardCode, setRewardCode] = useState<string | null>(null)
  const [selectedTaskType, setSelectedTaskType] = useState<FocusChallengeTaskType>('major')
  const [taskLabel, setTaskLabel] = useState('')
  const [feedback, setFeedback] = useState('')
  const [remainingMs, setRemainingMs] = useState(0)
  const [statusMessage, setStatusMessage] = useState('오늘 버티는 데 필요한 25분입니다')
  const { todayKey, isCampaignLive } = campaignNow
  const isCampaignEnded = todayKey > CAMPAIGN_END_DATE_KEY
  const isPreviewPlayable = !isCampaignEnded

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCampaignNow(getCampaignNow())
    }, 30000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const storedSession = readFocusSession()
    const restored = restoreFocusState(storedSession, todayKey)
    const latestProgress = readFocusProgress(todayKey)

    setProgress(latestProgress)
    setSession(restored.session)
    setRewardCode(readFocusRewardCode(todayKey))

    if (restored.shouldAutoComplete && restored.session) {
      const completed = finalizeFocusSession(restored.session, { official: isCampaignLive })
      setSession(null)
      setCompletedSession(completed.session)
      setProgress(completed.progress)
      setReward(completed.reward)
      setRewardCode(completed.reward.code ?? null)
      setScreen('completed')
      return
    }

    if (latestProgress.todayCompleted) {
      setReward(resolveFocusReward(latestProgress.completedCount))
      setScreen('already-done')
      return
    }

    if (restored.session?.status === 'running') {
      setRemainingMs(getRemainingMs(restored.session))
      setStatusMessage(getFocusStatusMessage(restored.session))
      setScreen('running')
      return
    }

    setScreen('intro')
  }, [todayKey, isCampaignLive])

  useEffect(() => {
    if (screen !== 'running' || !session) return

    const tick = () => {
      const nextRemaining = getRemainingMs(session)
      setRemainingMs(nextRemaining)
      setStatusMessage(getFocusStatusMessage(session))

      if (nextRemaining <= 0) {
        const completed = finalizeFocusSession(session, { official: isCampaignLive })
        setSession(null)
        setCompletedSession(completed.session)
        setProgress(completed.progress)
        setReward(completed.reward)
        setRewardCode(completed.reward.code ?? null)
        setScreen('completed')
      }
    }

    tick()
    const timer = window.setInterval(tick, 1000)

    return () => window.clearInterval(timer)
  }, [screen, session, isCampaignLive])

  const completedDisplayCount = Math.min(progress.completedCount, FOCUS_CHALLENGE_MAX_COUNT)
  const nextRewardLabel = getNextRewardLabel(completedDisplayCount)
  const rewardStepLabel = getRewardStepLabel(completedDisplayCount)
  const currentTaskLabel = useMemo(() => {
    if (session?.taskLabel?.trim()) return session.taskLabel.trim()
    return FOCUS_TASK_OPTIONS.find((option) => option.id === session?.taskType)?.label ?? '오늘 가장 급한 한 과목'
  }, [session])
  const progressPercent = session ? Math.min(100, ((25 * 60 * 1000 - remainingMs) / (25 * 60 * 1000)) * 100) : 0
  const ringStyle = { ['--focus-progress' as '--focus-progress']: `${progressPercent * 3.6}deg` } as CSSProperties
  const remainingToMax = Math.max(0, FOCUS_CHALLENGE_MAX_COUNT - completedDisplayCount)
  const nextTierRemaining =
    completedDisplayCount < 4 ? 4 - completedDisplayCount :
    completedDisplayCount < 7 ? 7 - completedDisplayCount :
    completedDisplayCount < 9 ? 9 - completedDisplayCount :
    completedDisplayCount < 10 ? 10 - completedDisplayCount :
    0

  function handleStartIntro() {
    if (!isPreviewPlayable) return
    setFeedback('')
    setScreen(progress.todayCompleted ? 'already-done' : 'setup')
  }

  function handleCreateSession() {
    if (!isPreviewPlayable) return
    const nextSession = createFocusSession(todayKey, selectedTaskType, taskLabel)
    setProgress(readFocusProgress(todayKey))
    setSession(nextSession)
    setCompletedSession(null)
    setReward(null)
    setRewardCode(null)
    setRemainingMs(getRemainingMs(nextSession))
    setStatusMessage(getFocusStatusMessage(nextSession))
    setFeedback('')
    setScreen('running')
  }

  function handleAbandon() {
    if (!session) return
    const shouldLeave = window.confirm('지금 종료하면 오늘 미션은 인정되지 않아요. 이번 집중을 종료할까요?')
    if (!shouldLeave) return

    abandonFocusSession(session)
    setSession(null)
    setRemainingMs(0)
    setStatusMessage('오늘 버티는 데 필요한 25분입니다')
    setFeedback('이번 미션은 종료됐어요. 오늘 안에는 다시 시작할 수 있습니다.')
    setScreen('setup')
  }

  async function copyRewardCode() {
    const code = rewardCode ?? reward?.code
    if (!code) {
      setFeedback('복사할 보상 코드가 없어요.')
      return
    }

    const result = await copyText(code)
    if (result === 'copied') {
      setFeedback('보상 코드가 복사됐어요.')
      return
    }
    if (result === 'prompted') {
      setFeedback('복사 창을 열었어요. 길게 눌러 복사해 주세요.')
      return
    }
    setFeedback('이 기기에서는 코드 복사를 지원하지 않아요.')
  }

  async function handleShareChallenge() {
    try {
      const result = await shareFocusChallenge()
      if (result === 'shared') {
        setFeedback('카카오톡 공유 창을 열었어요.')
        return
      }
      if (result === 'copied') {
        setFeedback('공유 문구를 복사했어요. 카카오톡에 붙여넣어 보내면 됩니다.')
        return
      }
      if (result === 'prompted') {
        setFeedback('공유 문구 창을 열었어요. 내용을 복사해 카카오톡에 붙여넣어 주세요.')
        return
      }
      setFeedback('이 기기에서는 공유를 지원하지 않아요.')
    } catch {
      setFeedback('공유를 여는 중 문제가 생겼어요.')
    }
  }

  const introPrimaryLabel = isCampaignEnded ? '캠페인 종료' : progress.todayCompleted && isCampaignLive ? '오늘 완료 현황 보기' : '집중 시작하기'
  const focusStatusLabel = '하루 1회'

  return (
    <div className="container focus-page">
      <Head>
        <title>25분 집중 챌린지 | 우주라이크 캠페인</title>
        <meta name="description" content="25분만 버티면 누적 보상이 열리는 시험기간 집중 미션입니다." />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <section className="mobile-shell focus-shell">
        <div className="survival-back-link">
          <Link href="/">메인으로 돌아가기</Link>
        </div>

        <section className="card focus-hero-card">
          <div className="focus-hero-topline">
            <span className="focus-hero-badge">FOCUS MISSION</span>
            <span className="focus-alert-badge">{isCampaignEnded ? 'ENDED' : 'LIMITED'}</span>
          </div>
          <h1>25분 집중하면 누적 보상이 올라갑니다</h1>
          <p>하루 한 번, 25분만 집중하면 누적 보상이 쌓입니다.</p>

          <div className="focus-inline-notes">
            <span className="focus-chip status">25분 미션</span>
            <span className="focus-chip status">{isCampaignEnded ? '캠페인 종료' : '하루 1회'}</span>
            <span className="focus-chip period">누적 {completedDisplayCount} / {FOCUS_CHALLENGE_MAX_COUNT}</span>
            <span className="focus-chip reward">다음 보상: {nextRewardLabel}</span>
          </div>

            <div className="focus-hero-board" aria-hidden="true">
              <div className="focus-board-stamp">FOCUS ACTIVE</div>
              <div className="focus-board-clock">{isCampaignEnded ? 'END' : '25:00'}</div>
            <div className="focus-board-note note-a">오늘 {progress.todayCompleted ? '완료됨' : '도전 가능'}</div>
            <div className="focus-board-note note-b">다음 보상: {nextRewardLabel}</div>
            <div className="focus-board-note note-c">{completedDisplayCount === 0 ? '첫 미션 대기 중' : rewardStepLabel}</div>
            <div className="focus-board-lines" />
          </div>
        </section>

        {screen === 'intro' && (
          <section className="card focus-panel">
            <div className="focus-section-head">
              <span className="focus-eyebrow">Mission Brief</span>
              <strong>오늘 집중 미션과 누적 보상을 확인해보세요</strong>
            </div>

            <div className="focus-dashboard-grid">
              <div className="focus-stat-card">
                <span className="focus-label">현재 상태</span>
                <strong>누적 완료 {completedDisplayCount} / {FOCUS_CHALLENGE_MAX_COUNT}</strong>
                <p>{progress.todayCompleted && isCampaignLive ? '오늘 완료됨' : '오늘 도전 가능'}</p>
              </div>
              <div className="focus-stat-card accent">
                <span className="focus-label">현재 보상 구간</span>
                <strong>
                  {completedDisplayCount < 5 ? '1~4회 성공 시 랜덤 쿠폰 코드 1종 제공' :
                    completedDisplayCount < 8 ? '5~7회 성공 시 랜덤 쿠폰 코드 3종 제공' :
                    completedDisplayCount < 10 ? '8~9회 성공 시 랜덤 쿠폰 코드 5종 제공' :
                    '10회 성공 시 랜덤 쿠폰 코드 10종 제공'}
                </strong>
                <p>{completedDisplayCount >= FOCUS_CHALLENGE_MAX_COUNT ? '최종 보상 구간까지 모두 달성했어요.' : '완료할수록 상위 보상 구간이 열립니다.'}</p>
              </div>
              <div className="focus-stat-card">
                <span className="focus-label">기록 방식</span>
                <strong>도전 {progress.attemptCount}회 · 완료 {progress.successCount}회</strong>
                <p>도전 수와 완료 수는 캠페인 동안 누적됩니다.</p>
              </div>
            </div>

            <div className="focus-milestone-card">
              <span className="focus-label">보상 단계</span>
              <div className="focus-milestone-steps">
                <div className={`focus-step ${completedDisplayCount >= 1 ? 'active' : ''}`}><strong>1~4회</strong><span>쿠폰 코드 1종</span></div>
                <div className={`focus-step ${completedDisplayCount >= 5 ? 'active' : ''}`}><strong>5~7회</strong><span>쿠폰 코드 3종</span></div>
                <div className={`focus-step ${completedDisplayCount >= 8 ? 'active' : ''}`}><strong>8~9회</strong><span>쿠폰 코드 5종</span></div>
                <div className={`focus-step ${completedDisplayCount >= 10 ? 'active' : ''}`}><strong>10회</strong><span>쿠폰 코드 10종</span></div>
              </div>
            </div>

            <div className="survival-actions two-up">
              <button type="button" className="btn" onClick={handleStartIntro} disabled={isCampaignEnded}>
                {introPrimaryLabel}
              </button>
              <Link href="/survival-pack" className="survival-text-link">
                생존팩 먼저 보기
              </Link>
            </div>

            <p className="focus-panel-caption">
              {isCampaignEnded
                  ? '캠페인 기간이 종료되어 새 미션 시작은 닫혀 있어요.'
                  : '완료 횟수가 쌓일수록 보상이 커집니다.'}
            </p>
            {feedback && <p className="survival-feedback">{feedback}</p>}
          </section>
        )}

        {screen === 'setup' && (
          <section className="card focus-panel">
            <div className="focus-section-head">
              <span className="focus-eyebrow">Task Setup</span>
              <strong>이번 25분 동안 할 일을 정해주세요</strong>
            </div>
            <p className="focus-panel-caption">짧게 적어두면 끝났을 때 더 뿌듯해요.</p>

            <div className="focus-field-label">이번 미션 유형 선택</div>
            <div className="focus-task-grid">
              {FOCUS_TASK_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`focus-task-chip ${selectedTaskType === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTaskType(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <label className="focus-input-wrap">
              <span className="focus-label">이번 목표 한 줄 입력</span>
              <input
                className="focus-input"
                type="text"
                value={taskLabel}
                onChange={(event) => setTaskLabel(event.target.value)}
                placeholder="예: 코딩 / 3장 복습 / 영어 단어 50개"
                maxLength={60}
              />
            </label>

            <div className="survival-actions focus-setup-actions">
              <button type="button" className="btn" onClick={handleCreateSession}>
                이 목표로 시작하기
              </button>
            </div>
            <button type="button" className="focus-back-link" onClick={() => setScreen('intro')}>
              인트로 다시 보기
            </button>
          </section>
        )}

        {screen === 'running' && session && (
          <section className="card focus-panel focus-running-panel">
            <div className="focus-progress-head">
              <span>집중 미션 진행 중</span>
              <span>{focusStatusLabel}</span>
            </div>

            <div className="focus-timer-layout">
              <div className="focus-ring-shell">
                <div className="focus-ring" style={ringStyle}>
                  <div className="focus-ring-inner">
                    <strong>{formatRemaining(remainingMs)}</strong>
                    <span>MISSION RUNNING</span>
                  </div>
                </div>
              </div>

              <div className="focus-running-copy">
                <p className="focus-running-goal">이번 목표: <strong>{currentTaskLabel}</strong></p>
                <p className="focus-running-status">{statusMessage}</p>
                <p className="focus-running-support">앱을 벗어나도 남은 시간은 계속 흐릅니다.</p>
              </div>
            </div>

            <button type="button" className="focus-quit-link" onClick={handleAbandon}>
              이번엔 종료하기
            </button>
          </section>
        )}

        {screen === 'completed' && reward && (
          <section className="card focus-panel focus-complete-panel">
            <div className="survival-result-head">
              <div className="focus-result-badge">MISSION COMPLETE</div>
              <div className="survival-issued-stamp">COMPLETE</div>
            </div>

            <h2>25분 집중 성공</h2>
            <p className="focus-result-lead">오늘의 생존 루틴 하나를 완료했어요.</p>

            <div className="focus-complete-grid">
              <div className="focus-stat-card">
                <span className="focus-label">완료 정보</span>
                <strong>완료 시간 25분</strong>
                <p>오늘 목표: {completedSession?.taskLabel || FOCUS_TASK_OPTIONS.find((option) => option.id === completedSession?.taskType)?.label || '오늘 가장 급한 한 과목'}</p>
                <p>누적 완료: {completedDisplayCount} / {FOCUS_CHALLENGE_MAX_COUNT}</p>
              </div>
              <div className="focus-stat-card accent">
                <span className="focus-label">이번 보상</span>
                <strong>{reward.title}</strong>
                <p>{reward.description}</p>
                {reward.code && <p className="focus-inline-code">{reward.code}</p>}
              </div>
            </div>

            <div className="focus-reward-card">
              <span className="focus-label">다음 단계</span>
              <strong>
                {remainingToMax === 0
                    ? '최종 누적 보상을 모두 달성했어요.'
                    : `${Math.max(1, nextTierRemaining)}회만 더 완료하면 다음 보상 구간이 열립니다.`}
              </strong>
              <p>{rewardStepLabel}</p>
            </div>

            <div className="survival-actions stack-mobile">
              {reward.code ? (
                <button type="button" className="btn" onClick={copyRewardCode}>
                  보상 확인하기
                </button>
              ) : (
                <Link href="/survival-pack" className="btn">
                  오늘의 생존팩 보기
                </Link>
              )}
              <Link href="/survival-pack" className="btn secondary">
                오늘의 생존팩 보기
              </Link>
              <button type="button" className="btn secondary" onClick={handleShareChallenge}>
                친구한테 공유하기
              </button>
            </div>

            <div className="survival-actions stack-mobile">
              <Link href="/" className="survival-text-link">메인으로 돌아가기</Link>
              <span className="survival-text-link focus-muted-link">졸음 참기 하러 가기</span>
            </div>
            {feedback && <p className="survival-feedback">{feedback}</p>}
          </section>
        )}

        {screen === 'already-done' && (
          <section className="card focus-panel">
            <div className="survival-result-head">
              <div className="focus-result-badge">TODAY COMPLETE</div>
              <div className="survival-issued-stamp">1 DAY CLEAR</div>
            </div>

            <h2>오늘의 25분 집중 미션은 완료했어요</h2>
            <p className="focus-panel-caption">이 챌린지는 하루 1회만 인정돼요. 내일 다시 도전할 수 있어요.</p>

            <div className="focus-dashboard-grid">
              <div className="focus-stat-card">
                <span className="focus-label">현재 누적 현황</span>
                <strong>{completedDisplayCount} / {FOCUS_CHALLENGE_MAX_COUNT}</strong>
                <p>다음 보상: {nextRewardLabel}</p>
              </div>
              <div className="focus-stat-card accent">
                <span className="focus-label">오늘 받은 보상</span>
                <strong>{resolveFocusReward(completedDisplayCount).title}</strong>
                <p>{rewardCode ? `오늘 저장된 코드: ${rewardCode}` : '오늘 지급된 쿠폰 코드 보상이 반영되어 있어요.'}</p>
              </div>
            </div>

            <div className="survival-actions stack-mobile">
              <Link href="/survival-pack" className="btn">
                오늘의 생존팩 하러 가기
              </Link>
              <button type="button" className="btn secondary" onClick={handleShareChallenge}>
                친구한테 공유하기
              </button>
              <Link href="/" className="btn secondary">
                메인으로 돌아가기
              </Link>
            </div>
          </section>
        )}
      </section>
    </div>
  )
}
