import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { getCampaignNow } from '../lib/campaign'
import { getCanonicalUrl } from '../lib/site'
import { getDifficultyLabel, getDrainRate, getSleepStatusCopy, getSleepTitle, maybeCreateSleepEvent } from '../lib/sleep-resist/game'
import { shareSleepChallenge } from '../lib/sleep-resist/share'
import { getPersonalBest, getSleepLeaderboard, getTodaySleepLeaderboard, saveSleepRecord, updatePersonalBest } from '../lib/sleep-resist/storage'
import type { SleepEvent, SleepGameState } from '../lib/sleep-resist/types'

const CAMPAIGN_END_DATE_KEY = '2026-04-25'

function formatSeconds(value: number) {
  return `${value.toFixed(1)}초`
}

function getDateKey(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export default function SleepResistPage() {
  const canonicalUrl = getCanonicalUrl('/sleep-resist')
  const [campaignNow, setCampaignNow] = useState(() => getCampaignNow())
  const [game, setGame] = useState<SleepGameState>({
    status: 'idle',
    sleepGauge: 70,
    survivalTime: 0,
    drainRate: getDrainRate(0),
    isBestRecord: false,
  })
  const [countdown, setCountdown] = useState(3)
  const [activeEvent, setActiveEvent] = useState<SleepEvent | null>(null)
  const [lastEventAt, setLastEventAt] = useState(0)
  const [tapCount, setTapCount] = useState(0)
  const [nickname, setNickname] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [leaderboardMode, setLeaderboardMode] = useState<'overall' | 'today'>('overall')
  const [recordsVersion, setRecordsVersion] = useState(0)
  const [tapPenaltyMessage, setTapPenaltyMessage] = useState('')
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [tapTargetOffset, setTapTargetOffset] = useState({ x: 0, y: 0, active: false })
  const [tapTargetMode, setTapTargetMode] = useState<'awake' | 'pill'>('awake')
  const [fakeTargetOffsets, setFakeTargetOffsets] = useState<Array<{ id: string; x: number; y: number }>>([])
  const animationRef = useRef<number | null>(null)
  const previousTickRef = useRef<number | null>(null)
  const countdownTimerRef = useRef<number | null>(null)
  const activeEventRef = useRef<SleepEvent | null>(null)
  const lastEventAtRef = useRef(0)
  const tapHistoryRef = useRef<number[]>([])
  const penaltyTimeoutRef = useRef<number | null>(null)
  const nextTargetShiftAtRef = useRef(0)
  const nextFakeSpawnAtRef = useRef(0)
  const fakeTargetsHideAtRef = useRef(0)
  const nextPillSwapAtRef = useRef(0)
  const pillModeUntilRef = useRef(0)
  const { todayKey } = campaignNow
  const isCampaignEnded = todayKey > CAMPAIGN_END_DATE_KEY

  useEffect(() => {
    const timer = window.setInterval(() => setCampaignNow(getCampaignNow()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const syncViewport = () => {
      setIsMobileViewport(window.matchMedia('(max-width: 640px), (pointer: coarse)').matches)
    }

    syncViewport()
    window.addEventListener('resize', syncViewport)
    return () => window.removeEventListener('resize', syncViewport)
  }, [])

  useEffect(() => {
    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current)
      if (countdownTimerRef.current) window.clearInterval(countdownTimerRef.current)
      if (penaltyTimeoutRef.current) window.clearTimeout(penaltyTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (game.status !== 'running') return

    const step = (timestamp: number) => {
      if (!previousTickRef.current) previousTickRef.current = timestamp
      const delta = (timestamp - previousTickRef.current) / 1000
      previousTickRef.current = timestamp
      let nextSurvivalTime = 0

      setGame((current) => {
        if (current.status !== 'running') return current

        const nextTime = current.survivalTime + delta
        nextSurvivalTime = nextTime
        const baseDrain = getDrainRate(nextTime)
        const eventMultiplier = activeEventRef.current && activeEventRef.current.endsAt > Date.now() ? activeEventRef.current.multiplier : 1
        const nextGauge = Math.max(0, current.sleepGauge - baseDrain * eventMultiplier * delta)
        const isBestRecord = nextTime > getPersonalBest()

        if (nextGauge <= 0) {
          return {
            ...current,
            status: 'gameover',
            sleepGauge: 0,
            survivalTime: nextTime,
            drainRate: baseDrain,
            endedAt: Date.now(),
            isBestRecord,
          }
        }

        return {
          ...current,
          sleepGauge: nextGauge,
          survivalTime: nextTime,
          drainRate: baseDrain,
          isBestRecord,
        }
      })

      const nextEvent = maybeCreateSleepEvent(Date.now(), lastEventAtRef.current, nextSurvivalTime)
      if (nextEvent) {
        setActiveEvent(nextEvent)
        activeEventRef.current = nextEvent
        setLastEventAt(Date.now())
        lastEventAtRef.current = Date.now()
        setTapPenaltyMessage('')
      }

      if (activeEventRef.current && activeEventRef.current.endsAt <= Date.now()) {
        setActiveEvent(null)
        activeEventRef.current = null
      }

      if (!nextTargetShiftAtRef.current) {
        nextTargetShiftAtRef.current = Date.now() + (isMobileViewport ? 1280 : 1140)
      } else if (Date.now() >= nextTargetShiftAtRef.current) {
        const horizontalRange = isMobileViewport
          ? Math.min(180, 96 + nextSurvivalTime * 2.4)
          : Math.min(320, 170 + nextSurvivalTime * 5.2)
        const verticalRange = isMobileViewport
          ? Math.min(128, 72 + nextSurvivalTime * 1.9)
          : Math.min(230, 120 + nextSurvivalTime * 3.6)
        const nextOffset = {
          x: Math.round((Math.random() - 0.5) * horizontalRange),
          y: Math.round((Math.random() - 0.5) * verticalRange),
          active: true,
        }
        setTapTargetOffset(nextOffset)
        nextTargetShiftAtRef.current = Date.now() + Math.max(isMobileViewport ? 620 : 440, (isMobileViewport ? 1180 : 1020) - nextSurvivalTime * (isMobileViewport ? 12 : 20))
      }

      if (!nextFakeSpawnAtRef.current) {
        nextFakeSpawnAtRef.current = Date.now() + 3000
      } else if (Date.now() >= nextFakeSpawnAtRef.current) {
        const fakeHorizontalRange = isMobileViewport
          ? Math.min(190, 104 + nextSurvivalTime * 2.8)
          : Math.min(340, 180 + nextSurvivalTime * 5.2)
        const fakeVerticalRange = isMobileViewport
          ? Math.min(136, 78 + nextSurvivalTime * 2.2)
          : Math.min(240, 120 + nextSurvivalTime * 3.8)
        setFakeTargetOffsets(
          Array.from({ length: 2 }, (_, index) => ({
            id: `fake-${Date.now()}-${index}`,
            x: Math.round((Math.random() - 0.5) * fakeHorizontalRange),
            y: Math.round((Math.random() - 0.5) * fakeVerticalRange),
          })),
        )
        fakeTargetsHideAtRef.current = Date.now() + 2000
        nextFakeSpawnAtRef.current = Date.now() + 3000
      }

      if (fakeTargetsHideAtRef.current && Date.now() >= fakeTargetsHideAtRef.current) {
        setFakeTargetOffsets([])
        fakeTargetsHideAtRef.current = 0
      }

      if (!nextPillSwapAtRef.current) {
        nextPillSwapAtRef.current = Date.now() + 5200 + Math.round(Math.random() * 2800)
      } else if (Date.now() >= nextPillSwapAtRef.current && tapTargetMode === 'awake') {
        setTapTargetMode('pill')
        pillModeUntilRef.current = Date.now() + 700
        nextPillSwapAtRef.current = Date.now() + 5600 + Math.round(Math.random() * 3400)
      }

      if (pillModeUntilRef.current && Date.now() >= pillModeUntilRef.current) {
        setTapTargetMode('awake')
        pillModeUntilRef.current = 0
      }

      animationRef.current = window.requestAnimationFrame(step)
    }

    animationRef.current = window.requestAnimationFrame(step)

    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current)
      previousTickRef.current = null
    }
  }, [game.status, isMobileViewport, tapTargetMode])

  useEffect(() => {
    if (game.status !== 'gameover') return
    updatePersonalBest(game.survivalTime)
  }, [game.status, game.survivalTime])

  const overallRecords = useMemo(() => getSleepLeaderboard(10), [recordsVersion])
  const todayRecords = useMemo(() => getTodaySleepLeaderboard(todayKey, 10), [recordsVersion, todayKey])
  const currentRecords = leaderboardMode === 'overall' ? overallRecords : todayRecords
  const personalBest = useMemo(() => getPersonalBest(), [recordsVersion, game.status])
  const eyeScale = 0.52 + (game.sleepGauge / 100) * 0.48
  const gaugePercent = Math.max(0, Math.min(100, game.sleepGauge))
  const title = getSleepTitle(game.survivalTime)
  const statusCopy = getSleepStatusCopy(game.sleepGauge)
  const difficultyCopy = getDifficultyLabel(game.survivalTime)
  const dangerActive = Boolean(activeEvent?.isDanger)
  const targetScale = isMobileViewport ? Math.max(0.76, 1 - game.survivalTime * 0.004) : Math.max(0.52, 1 - game.survivalTime * 0.012)

  function resetForNewGame() {
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
    setGame({
      status: 'idle',
      sleepGauge: 70,
      survivalTime: 0,
      drainRate: getDrainRate(0),
      isBestRecord: false,
    })
    setCountdown(3)
    setActiveEvent(null)
    setLastEventAt(0)
    activeEventRef.current = null
    lastEventAtRef.current = 0
    nextTargetShiftAtRef.current = 0
    nextFakeSpawnAtRef.current = 0
    fakeTargetsHideAtRef.current = 0
    nextPillSwapAtRef.current = 0
    pillModeUntilRef.current = 0
    setTapTargetMode('awake')
    setTapTargetOffset({ x: 0, y: 0, active: false })
    setFakeTargetOffsets([])
    setTapCount(0)
    tapHistoryRef.current = []
    setSaveMessage('')
    setShareMessage('')
    setTapPenaltyMessage('')
    previousTickRef.current = null
  }

  function startCountdown() {
    if (isCampaignEnded) return
    resetForNewGame()
    setGame((current) => ({ ...current, status: 'countdown' }))

    countdownTimerRef.current = window.setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          if (countdownTimerRef.current) window.clearInterval(countdownTimerRef.current)
          nextTargetShiftAtRef.current = Date.now() + 1200
          setGame({
            status: 'running',
            sleepGauge: 62,
            survivalTime: 0,
            drainRate: getDrainRate(0),
            startedAt: Date.now(),
            isBestRecord: false,
          })
          countdownTimerRef.current = null
          return 0
        }
        return value - 1
      })
    }, 1000)
  }

  function handleTap() {
    if (game.status !== 'running') return
    const now = Date.now()

    if (tapTargetMode === 'pill') {
      setTapPenaltyMessage('수면제 클릭! 게이지가 크게 줄었어요')
      if (penaltyTimeoutRef.current) window.clearTimeout(penaltyTimeoutRef.current)
      penaltyTimeoutRef.current = window.setTimeout(() => setTapPenaltyMessage(''), 900)
      setTapTargetMode('awake')
      pillModeUntilRef.current = 0
      setGame((current) => ({
        ...current,
        sleepGauge: Math.max(0, current.sleepGauge - 34),
      }))
      return
    }

    tapHistoryRef.current = [...tapHistoryRef.current.filter((time) => now - time < 1000), now]
    setTapCount((value) => value + 1)

    if (activeEventRef.current?.isDanger) {
      setGame((current) => ({
        ...current,
        sleepGauge: Math.max(0, current.sleepGauge - 18),
      }))
      setTapPenaltyMessage('헛탭! 딴생각 걸림!')
      if (penaltyTimeoutRef.current) window.clearTimeout(penaltyTimeoutRef.current)
      penaltyTimeoutRef.current = window.setTimeout(() => setTapPenaltyMessage(''), 900)
      setActiveEvent(null)
      activeEventRef.current = null
      return
    }

    const recentTapCount = tapHistoryRef.current.length
    const recoveryMultiplier = recentTapCount >= 10 ? 0.45 : recentTapCount >= 7 ? 0.7 : 1
    const recoveryAmount = 4 * recoveryMultiplier

    setGame((current) => ({
      ...current,
      sleepGauge: Math.min(100, current.sleepGauge + recoveryAmount),
    }))

    if (recentTapCount >= 10) {
      setTapPenaltyMessage('과한 연타! 회복 효율 감소')
    } else if (recentTapCount >= 7) {
      setTapPenaltyMessage('리듬 흔들림... 회복 약화')
    } else {
      setTapPenaltyMessage('')
    }
  }

  function handleFakeTap(targetId: string, event: ReactPointerEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (game.status !== 'running') return
    setTapPenaltyMessage('펑! 가짜 버튼이었어요')
    if (penaltyTimeoutRef.current) window.clearTimeout(penaltyTimeoutRef.current)
    penaltyTimeoutRef.current = window.setTimeout(() => setTapPenaltyMessage(''), 900)
    const target = event.currentTarget
    target.classList.add('burst')
    window.setTimeout(() => target.classList.remove('burst'), 220)
    setFakeTargetOffsets((current) => current.filter((item) => item.id !== targetId))
    setGame((current) => ({
      ...current,
      sleepGauge: Math.max(0, current.sleepGauge - 24),
    }))
  }

  function validateNickname(value: string) {
    const trimmed = value.trim()
    if (trimmed.length < 2 || trimmed.length > 8) return '닉네임은 2~8자로 입력해주세요.'
    if (!/^[A-Za-z0-9가-힣]+$/.test(trimmed)) return '닉네임은 한글, 영문, 숫자만 사용할 수 있어요.'
    return ''
  }

  function saveRanking() {
    const error = validateNickname(nickname)
    if (error) {
      setSaveMessage(error)
      return
    }

    const record = saveSleepRecord({
      id: `${Date.now()}-${nickname.trim()}`,
      nickname: nickname.trim(),
      survivalTime: Number(game.survivalTime.toFixed(1)),
      createdAt: Date.now(),
      dateKey: todayKey,
    })

    setSaveMessage(`${record.nickname} 이름으로 기록을 남겼어요.`)
    setRecordsVersion((value) => value + 1)
  }

  async function shareRecord() {
    const seconds = Number(game.survivalTime.toFixed(1))
    const result = await shareSleepChallenge(seconds)
    setShareMessage(result === 'shared' ? '카카오톡으로 도전장을 보냈어요.' : '공유 문구를 복사했어요. 카카오톡에 붙여넣어 보내면 됩니다.')
  }

  return (
    <div className="container sleep-page">
      <Head>
        <title>졸음 참기 | 우주라이크 캠페인</title>
        <meta name="description" content="눈꺼풀이 감기기 전에 최대한 오래 버텨보고 기록을 남겨보세요." />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <section className="mobile-shell sleep-shell">
        <div className="survival-back-link">
          <Link href="/">메인으로 돌아가기</Link>
        </div>

        <section className="card sleep-hero-card">
          <div className="sleep-hero-topline">
            <span className="sleep-hero-badge">SLEEP RESIST MODE</span>
            <span className="sleep-alert-badge">{isCampaignEnded ? 'ENDED' : 'LIVE RANKING'}</span>
          </div>
          <h1>졸음이 먼저 오나, 네가 먼저 버티나</h1>
          <p>탭으로 졸음을 버티고, 기록으로 랭킹에 도전해보세요.</p>

          <div className="sleep-inline-notes">
            <span className="sleep-chip status">기록 경쟁</span>
            <span className="sleep-chip period">점점 빨라짐</span>
            <span className="sleep-chip reward">친구 공유</span>
          </div>

          <div className="sleep-hero-board" aria-hidden="true">
            <div className="sleep-board-stamp">NO SLEEP</div>
            <div className="sleep-board-clock">{isCampaignEnded ? 'END' : 'TAP!'}</div>
            <div className="sleep-board-note note-a">탭해서 졸음 버티기</div>
            <div className="sleep-board-note note-b">기록: 버틴 시간</div>
            <div className="sleep-board-note note-c">랭킹: 최고 기록 반영</div>
            <div className="sleep-board-lines" />
          </div>
        </section>

        {(game.status === 'idle' || game.status === 'countdown') && (
          <section className="card sleep-panel">
            <div className="sleep-section-head">
              <span className="sleep-eyebrow">Mission Brief</span>
              <strong>버틴 시간으로 랭킹에 도전해보세요</strong>
            </div>

            <div className="sleep-brief-grid">
              <div className="sleep-brief-card">
                <span className="sleep-label">게임 방식</span>
                <strong>탭해서 졸음을 버티세요</strong>
                <p>게이지가 0이 되면 종료됩니다.</p>
              </div>
              <div className="sleep-brief-card accent">
                <span className="sleep-label">난이도</span>
                <strong>시간이 갈수록 더 어려워집니다</strong>
                <p>방해 이벤트가 뜨면 버티기 더 힘들어집니다.</p>
              </div>
              <div className="sleep-brief-card">
                <span className="sleep-label">랭킹 방식</span>
                <strong>여러 번 도전할 수 있고, 최고 기록만 반영됩니다.</strong>
                <p>같은 닉네임은 더 높은 기록일 때만 갱신됩니다.</p>
              </div>
            </div>

            <div className="survival-actions two-up">
              <button type="button" className="btn" onClick={startCountdown} disabled={isCampaignEnded}>
                {game.status === 'countdown' ? `시작 ${countdown}` : '지금 도전하기'}
              </button>
              <button type="button" className="sleep-rank-link-btn" onClick={() => setLeaderboardMode('overall')}>
                랭킹 보러가기
              </button>
            </div>
          </section>
        )}

        {game.status === 'running' && (
          <section className={`card sleep-panel sleep-running-panel ${dangerActive ? 'danger' : ''}`}>
            <div className="sleep-progress-head">
              <span>졸음 참기 진행 중</span>
              <span>{formatSeconds(game.survivalTime)}</span>
            </div>

            <div className="sleep-stage">
              <div className="sleep-avatar">
                <div className="sleep-eye-shell">
                  <div className="sleep-eye" style={{ transform: `scaleY(${eyeScale})` }} />
                </div>
                <div className="sleep-gauge">
                  <i style={{ width: `${gaugePercent}%` }} />
                </div>
                <strong>{formatSeconds(game.survivalTime)}</strong>
                <button
                  type="button"
                  className={`sleep-tap-target ${tapTargetOffset.active ? 'shifting' : ''} ${tapTargetMode === 'pill' ? 'pill-mode' : ''}`}
                  style={{ transform: `translate(${tapTargetOffset.x}px, ${tapTargetOffset.y}px) scale(${targetScale})` }}
                  onPointerDown={handleTap}
                >
                  {tapTargetMode === 'pill' ? (
                    <>
                      <span className="sleep-pill-shell" aria-hidden="true">
                        <span className="sleep-pill-half red" />
                        <span className="sleep-pill-half white" />
                      </span>
                      <span className="sleep-pill-label">수면제</span>
                    </>
                  ) : '각성 유지'}
                </button>
                {fakeTargetOffsets.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    className="sleep-tap-target fake"
                    style={{ transform: `translate(${target.x}px, ${target.y}px) scale(${Math.max(0.48, targetScale - 0.08)})` }}
                    onPointerDown={(event) => handleFakeTap(target.id, event)}
                  >
                    <span className="sleep-fake-dot" aria-hidden="true" />
                    <span className="sleep-fake-label">각성 유지</span>
                  </button>
                ))}
                <span>버튼은 계속 움직이고, 가짜 버튼과 수면제도 섞여 나옵니다</span>
              </div>

              <div className="sleep-running-copy">
                <p className="sleep-running-status">{statusCopy}</p>
                <p className="sleep-running-sub">{difficultyCopy}</p>
                {activeEvent ? <div className="sleep-event-bubble danger">지금 멈춰! {activeEvent.text}</div> : <div className="sleep-event-placeholder">버텨라...</div>}
                {tapPenaltyMessage && <p className="sleep-penalty-copy">{tapPenaltyMessage}</p>}
                {tapTargetOffset.active && <p className="sleep-target-warning">버튼 이동 중... 위치를 다시 잡으세요</p>}
              </div>
            </div>

            <button type="button" className="sleep-quit-link" onClick={(event) => { event.stopPropagation(); resetForNewGame() }}>
              포기하기
            </button>
          </section>
        )}

        {game.status === 'gameover' && (
          <section className="card sleep-panel">
            <div className="survival-result-head">
              <div className="sleep-result-badge">GAME OVER</div>
              <div className="survival-issued-stamp">RECORD</div>
            </div>

            <h2>오늘은 여기까지 버텼어요</h2>
            <p className="sleep-result-lead">{title}</p>

            <div className="sleep-result-grid">
              <div className="sleep-brief-card accent">
                <span className="sleep-label">버틴 시간</span>
                <strong>{formatSeconds(game.survivalTime)}</strong>
                <p>총 탭 {tapCount}회 · 난이도 {difficultyCopy}</p>
              </div>
              <div className="sleep-brief-card">
                <span className="sleep-label">내 최고 기록</span>
                <strong>{formatSeconds(personalBest)}</strong>
                <p>{game.isBestRecord ? 'BEST 기록을 갱신했어요.' : '조금만 더 버티면 최고 기록을 넘길 수 있어요.'}</p>
              </div>
            </div>

            <div className="sleep-rank-save">
              <span className="sleep-label">랭킹에 이름 남기기</span>
              <input
                className="sleep-input"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="친구들이 볼 닉네임을 입력해주세요"
                maxLength={8}
              />
              <div className="survival-actions stack-mobile">
                <button type="button" className="btn" onClick={saveRanking}>
                  랭킹에 기록 남기기
                </button>
                <button type="button" className="btn secondary" onClick={shareRecord}>
                  친구한테 도전장 보내기
                </button>
              </div>
              {saveMessage && <p className="survival-feedback">{saveMessage}</p>}
              {shareMessage && <p className="survival-feedback alt">{shareMessage}</p>}
            </div>

            <div className="survival-actions stack-mobile">
              <button type="button" className="btn ghost" onClick={startCountdown}>
                다시 도전하기
              </button>
              <Link href="/" className="survival-text-link">
                메인으로 돌아가기
              </Link>
            </div>
          </section>
        )}

        <section className="card sleep-panel">
          <div className="sleep-section-head">
            <span className="sleep-eyebrow">Leaderboard</span>
            <strong>누가 더 오래 버텼는지 확인해보세요</strong>
          </div>

          <div className="sleep-tab-row">
            <button type="button" className={`sleep-tab ${leaderboardMode === 'overall' ? 'active' : ''}`} onClick={() => setLeaderboardMode('overall')}>
              전체 랭킹
            </button>
            <button type="button" className={`sleep-tab ${leaderboardMode === 'today' ? 'active' : ''}`} onClick={() => setLeaderboardMode('today')}>
              오늘의 랭킹
            </button>
          </div>

          <div className="sleep-rank-list">
            {currentRecords.length > 0 ? currentRecords.map((record, index) => (
              <div key={record.id} className="sleep-rank-item">
                <span className="sleep-rank-order">#{index + 1}</span>
                <strong>{record.nickname}</strong>
                <span>{formatSeconds(record.survivalTime)}</span>
              </div>
            )) : (
              <p className="sleep-empty-rank">아직 기록이 없어요. 첫 기록을 남겨보세요.</p>
            )}
          </div>
        </section>
      </section>
    </div>
  )
}
