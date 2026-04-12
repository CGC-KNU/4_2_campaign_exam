import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getCampaignNow } from '../lib/campaign'
import { getCanonicalUrl } from '../lib/site'
import { shareViaKakao } from '../lib/kakao-share'
import { getTodayCouponBundle, pickCouponCode } from '../lib/survival-pack/coupon-bundles'
import { SURVIVAL_PACK_QUESTIONS } from '../lib/survival-pack/questions'
import { getResultType } from '../lib/survival-pack/result-types'
import { addScores, createEmptyScores, resolvePack } from '../lib/survival-pack/scoring'
import { buildSharePayload, copyText, shareResult } from '../lib/survival-pack/share'
import { readClaim, writeClaim } from '../lib/survival-pack/storage'
import type { ClaimRecord } from '../lib/survival-pack/types'

const APP_STORE_URL = 'https://apps.apple.com/kr/app/wouldulike/id6740640251'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.coggiri.new1'

const RESULT_FLAVOR_COPY: Record<string, string> = {
  pack01: '지금 필요한 건 의지보다 익숙한 한 끼입니다.',
  pack02: '머리가 뜨거워질수록 잠깐 식혀줘야 다시 들어갑니다.',
  pack03: '오늘은 무너지지 않는 루틴이 가장 큰 무기입니다.',
  pack04: '배터리를 채워야 공부 모드도 켜집니다.',
  pack05: '짧고 달콤한 보상이 오늘 집중력을 다시 붙잡습니다.',
  pack06: '효율보다 먼저 기분부터 회복해야 버틸 수 있는 날입니다.',
  pack07: '버티는 사람에게는 바삭한 보상도 꽤 중요합니다.',
  pack08: '한입씩 보급해야 오늘 흐름이 안 끊깁니다.',
  pack09: '혼자보다 같이 버틸 때 훨씬 강해지는 타입입니다.',
  pack10: '오늘은 자리 잘 잡는 게 반쯤 이긴 겁니다.',
  pack11: '같은 메뉴도 업그레이드되면 동기부여가 확 살아납니다.',
  pack12: '오늘은 배가 아니라 체력을 채워야 하는 날입니다.',
  pack13: '시험기간도 결국 같이 버텨야 오래 갑니다.',
}

const RESULT_DETAIL_COPY: Record<string, string> = {
  pack01: '익숙한 메뉴로 텐션과 집중력을 같이 회복하는 편이 잘 맞아요.',
  pack02: '길게 쉬기보다 잠깐 식히고 다시 들어가는 리듬이 더 잘 맞습니다.',
  pack03: '과하지 않은 보급으로 흐름을 안 끊는 게 오늘의 핵심입니다.',
  pack04: '집중력보다 먼저 배터리를 채워야 공부 모드가 켜지는 날입니다.',
  pack05: '짧고 확실한 당 보상으로 리셋하는 쪽이 훨씬 효율적입니다.',
  pack06: '오늘은 효율보다 기분 회복이 먼저라서 달달한 전환이 필요합니다.',
  pack07: '손에 잡히는 보상이 있어야 끝까지 밀어붙일 수 있는 날입니다.',
  pack08: '작은 간식으로 집중 흐름을 이어가는 운영이 제일 잘 맞습니다.',
  pack09: '혼자 버티기보다 사람과 리듬을 맞출 때 에너지가 더 살아납니다.',
  pack10: '자리를 잘 잡고 오래 가는 운영이 오늘의 정답에 가깝습니다.',
  pack11: '작은 업그레이드가 하루 전체 만족도와 의욕을 같이 올려줍니다.',
  pack12: '포만감보다 버티는 체력을 채워주는 보급이 필요한 날입니다.',
  pack13: '함께 먹고 같이 버티는 순간이 곧 회복이 되는 타입입니다.',
}

export default function SurvivalPackPage() {
  const canonicalUrl = getCanonicalUrl('/survival-pack')
  const [appPrimaryUrl, setAppPrimaryUrl] = useState(PLAY_STORE_URL)
  const [campaignNow, setCampaignNow] = useState(() => getCampaignNow())
  const [answers, setAnswers] = useState<number[]>([])
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [claimRecord, setClaimRecord] = useState<ClaimRecord | null>(null)
  const [copyMessage, setCopyMessage] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const quizSectionRef = useRef<HTMLElement | null>(null)
  const resultSectionRef = useRef<HTMLElement | null>(null)
  const { todayKey, seoulHour, isCampaignLive } = campaignNow
  const isPreviewMode = !isCampaignLive

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCampaignNow(getCampaignNow())
    }, 30000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setAppPrimaryUrl(APP_STORE_URL)
      return
    }
    setAppPrimaryUrl(PLAY_STORE_URL)
  }, [])

  useEffect(() => {
    if (isPreviewMode) {
      setClaimRecord(null)
      return
    }

    const storedClaim = readClaim(todayKey)
    if (!storedClaim) {
      setClaimRecord(null)
      return
    }

    setClaimRecord(storedClaim)
  }, [isPreviewMode, todayKey])

  useEffect(() => {
    if (step === 'quiz') {
      quizSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    if (step === 'result') {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  const currentQuestionIndex = answers.length
  const currentQuestion = SURVIVAL_PACK_QUESTIONS[currentQuestionIndex]
  const progress = claimRecord ? 100 : (answers.length / SURVIVAL_PACK_QUESTIONS.length) * 100
  const resultType = claimRecord ? getResultType(claimRecord.packId) : undefined
  const sharePayload = claimRecord ? buildSharePayload(claimRecord) : null
  const timeCopy = '시험기간엔 의지보다 보급이 먼저입니다.'

  function startQuiz() {
    setCopyMessage('')
    setShareMessage('')
    setAnswers([])
    setStep('quiz')
  }

  function handleAnswer(optionIndex: number) {
    const nextAnswers = [...answers, optionIndex]
    setAnswers(nextAnswers)

    if (nextAnswers.length < SURVIVAL_PACK_QUESTIONS.length) {
      return
    }

    const scores = nextAnswers.reduce((acc, answerIndex, questionIndex) => {
      const option = SURVIVAL_PACK_QUESTIONS[questionIndex].options[answerIndex]
      return addScores(acc, option.scores)
    }, createEmptyScores())

    const packId = resolvePack(scores)
    const result = getResultType(packId)
    const couponBundle = getTodayCouponBundle(todayKey)

    if (!result) return

    const coupon = couponBundle[result.couponKey]
    const couponCode = pickCouponCode(coupon, `${todayKey}-${packId}`)
    const record: ClaimRecord = {
      date: todayKey,
      packId,
      couponCode,
      couponKey: result.couponKey,
      store: coupon.store,
      label: coupon.label,
      sharedText: result.title,
      createdAt: new Date().toISOString(),
    }

    if (isCampaignLive) {
      writeClaim(record)
    }

    setClaimRecord(record)
    setStep('result')
    setCopyMessage('')
    setShareMessage('')
  }

  async function copyCouponCode() {
    if (!claimRecord?.couponCode) {
      setCopyMessage('복사할 생존 코드가 없어요.')
      return
    }

    try {
      const result = await copyText(claimRecord.couponCode)

      if (result === 'copied') {
        setCopyMessage('생존 코드가 복사됐어요.')
        return
      }

      if (result === 'prompted') {
        setCopyMessage('복사 창을 열었어요. 길게 눌러 복사해 주세요.')
        return
      }

      setCopyMessage('이 브라우저에서는 복사를 지원하지 않아요.')
    } catch {
      setCopyMessage('복사에 실패했어요. 다시 시도해주세요.')
    }
  }

  function openAppDownload() {
    if (typeof window === 'undefined') return
    window.location.href = appPrimaryUrl
  }

  async function handleShare() {
    if (!claimRecord) return

    try {
      const kakaoResult = await shareViaKakao(claimRecord)

      if (kakaoResult === 'shared') {
        setShareMessage('카카오톡 공유 창을 열었어요.')
        return
      }

      if (kakaoResult === 'missing_key') {
        setShareMessage('카카오 JavaScript 키가 없어 공유 문구 복사로 대체했어요.')
      }

      const result = await shareResult(claimRecord)

      if (result === 'shared') {
        setShareMessage('공유 창을 열었어요.')
        return
      }

      if (result === 'copied') {
        setShareMessage('공유 문구를 복사했어요. 카카오톡에 붙여넣어 보내면 됩니다.')
        return
      }

      if (result === 'prompted') {
        setShareMessage('공유 문구 창을 열었어요. 내용을 복사해 카카오톡에 붙여넣어 주세요.')
        return
      }

      setShareMessage('이 기기에서는 공유를 지원하지 않아요.')
    } catch {
      setShareMessage('공유를 여는 중 문제가 생겼어요.')
    }
  }

  function viewExistingResult() {
    if (!claimRecord) return
    setStep('result')
  }

  const periodChip = '하루 1회'
  const heroCtaLabel = claimRecord && isCampaignLive ? '오늘 발급된 보급품 보기' : '지금 생존팩 받기'
  const heroCaption = '하루 1회 참여 가능, 코드는 바로 저장됩니다.'
  const boardClock = 'TODAY'
  const boardStatus = '오늘 참여 가능'
  const boardNeed = '오늘 필요한 생존팩'
  const boardAction = '지금 1분 진단'

  return (
    <div className="container survival-page">
      <Head>
        <title>오늘의 생존팩 뽑기 | 우주라이크 캠페인</title>
        <meta name="description" content="5문항만 답하면 오늘 필요한 시험기간 생존 보급품과 쿠폰 코드를 받을 수 있어요." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="우주라이크 중간고사 생존팩" />
        <meta property="og:description" content="5문항 답하고 오늘의 생존 보급품 받기" />
        <meta property="og:url" content={canonicalUrl} />
      </Head>

      <section className="mobile-shell survival-shell">
        <div className="survival-back-link">
          <Link href="/">메인으로 돌아가기</Link>
        </div>

        <section className="card survival-hero-card">
          <div className="survival-hero-grid">
            <div className="survival-hero-copy-block">
              <div className="survival-hero-topline">
                <span className="survival-hero-badge">Midterm Survival System</span>
                <span className="survival-alert-badge">LIMITED</span>
              </div>
              <h1>오늘 버티게 해줄 생존팩 찾기</h1>
              <p>{timeCopy}</p>

              <div className="survival-metric-strip" aria-label="핵심 정보">
                <span>1분 진단</span>
                <span>5문항</span>
                <span>쿠폰 1종 지급</span>
              </div>

              <div className="survival-inline-notes">
                <span className="survival-chip period">{periodChip}</span>
                <span className="survival-chip reward">친구 공유 가능</span>
              </div>

              <div className="survival-hero-actions">
                <button type="button" className="btn survival-primary-btn" onClick={claimRecord && isCampaignLive ? viewExistingResult : startQuiz}>
                  {heroCtaLabel}
                </button>
                <p className="survival-hero-caption">{heroCaption}</p>
              </div>
            </div>

            <div className="survival-hero-board" aria-hidden="true">
              <div className="survival-board-stamp">A+ 기원</div>
              <div className="survival-board-clock">{boardClock}</div>
              <div className="survival-board-note note-a">{boardStatus}</div>
              <div className="survival-board-note note-b">{boardNeed}</div>
              <div className="survival-board-note note-c">{boardAction}</div>
              <div className="survival-board-lines" />
            </div>
          </div>
        </section>

        {step === 'intro' && (
          <section ref={quizSectionRef} className="card survival-panel">
            <div className="survival-section-head">
              <span className="survival-eyebrow">Mission Brief</span>
              <strong>오늘 필요한 생존 자원부터 확인하세요</strong>
            </div>

            {isCampaignLive && claimRecord ? (
              <div className="survival-claimed-box">
                <strong>오늘 생존 코드는 이미 발급 완료됐어요.</strong>
                <p>오늘은 1회만 다시 볼 수 있고, 저장된 결과와 코드가 그대로 유지됩니다.</p>
              </div>
            ) : (
              <div className="survival-brief-grid">
                <div className="survival-brief-card">
                  <span className="survival-label">지금 뭐 하는 건지</span>
                  <strong>시험기간 생존 상태 분석</strong>
                  <p>오늘 더 급한 보급품이 뭔지 빠르게 찾아줍니다.</p>
                </div>
                <div className="survival-brief-card accent">
                  <span className="survival-label">지금 받을 수 있는 것</span>
                  <strong>유형별 매장 쿠폰 지급</strong>
                  <p>결과에 맞는 실제 매장 혜택과 오늘의 생존 코드가 바로 발급됩니다.</p>
                </div>
                <div className="survival-brief-card danger">
                  <span className="survival-label">참여 조건</span>
                  <strong>캠페인 진행 중, 하루 1회 발급</strong>
                  <p>발급된 코드는 오늘 보관되고, 내일 다시 새로 받을 수 있어요.</p>
                </div>
              </div>
            )}

            <div className="survival-actions two-up">
              {isCampaignLive && claimRecord ? (
                <button type="button" className="btn" onClick={viewExistingResult}>
                  오늘 발급 결과 보기
                </button>
              ) : (
                <button type="button" className="btn" onClick={startQuiz}>
                  지금 생존팩 받기
                </button>
              )}
              <Link href="/" className="survival-text-link">
                메인으로 돌아가기
              </Link>
            </div>

            {copyMessage && <p className="survival-feedback">{copyMessage}</p>}
          </section>
        )}

        {step === 'quiz' && currentQuestion && (
          <section ref={quizSectionRef} className="card survival-panel">
            <div className="survival-progress-head">
              <span>분석 {currentQuestionIndex + 1} / {SURVIVAL_PACK_QUESTIONS.length}</span>
              <span>오늘 버티게 해줄 보급품 탐색 중</span>
            </div>
            <div className="progress survival-progress">
              <i style={{ width: `${progress}%` }} />
            </div>

            <h2>{currentQuestion.prompt}</h2>
            <p className="survival-question-caption">지금 너한테 더 급한 생존 자원을 하나만 골라주세요.</p>

            <div className="survival-options">
              {currentQuestion.options.map((option, optionIndex) => (
                <button
                  key={option.label}
                  type="button"
                  className="survival-option"
                  onClick={() => handleAnswer(optionIndex)}
                >
                  <span className="survival-option-index">{String(optionIndex + 1).padStart(2, '0')}</span>
                  <span className="survival-option-label">{option.label}</span>
                  <span className="survival-option-arrow">pick</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'result' && claimRecord && resultType && sharePayload && (
          <section ref={resultSectionRef} className="card survival-panel result-panel">
            <div className="survival-result-head">
              <div className="survival-result-badge">보급품 매칭 완료</div>
              <div className="survival-issued-stamp">보급 완료</div>
            </div>
            <h2>{resultType.title}</h2>
            <p className="survival-result-lead">{RESULT_FLAVOR_COPY[claimRecord.packId]}</p>

            <div className="survival-pack-card">
              <span className="survival-pack-tag">오늘의 상태 설명</span>
              <strong>{resultType.shortDesc}</strong>
              <p>{RESULT_DETAIL_COPY[claimRecord.packId]}</p>
            </div>

            <div className="survival-coupon-card">
              <div className="survival-benefit-panel">
                <span className="survival-label">지급된 실제 혜택</span>
                <strong>{claimRecord.store}</strong>
                <p className="survival-benefit-name">{claimRecord.label}</p>
                <p className="survival-benefit-caption">지금 컨디션에 맞는 혜택으로 바로 버텨보세요.</p>
              </div>
              <div className="survival-code-box">
                <span className="survival-label">오늘의 생존 코드</span>
                <div className="survival-code-row">
                  <strong>{claimRecord.couponCode}</strong>
                  <button type="button" className="survival-code-copy-btn" onClick={copyCouponCode}>
                    복사
                  </button>
                </div>
                <p>survival issued</p>
              </div>
            </div>

            <div className="survival-pack-card spotlight">
              <span className="survival-pack-tag">공유 미션</span>
              <strong>같이 버틸 친구에게 보내기</strong>
              <p>친구도 자기 생존팩을 바로 뽑아볼 수 있어요.</p>
            </div>

            <div className="survival-actions stack-mobile">
              <button type="button" className="btn" onClick={openAppDownload}>
                우주라이크에서 쿠폰 적용하기
              </button>
              <button type="button" className="btn secondary" onClick={handleShare}>
                친구한테 보급품 보내기
              </button>
            </div>
            <div className="survival-feedback-group">
              {copyMessage && <p className="survival-feedback">{copyMessage}</p>}
              {shareMessage && <p className="survival-feedback alt">{shareMessage}</p>}
            </div>
          </section>
        )}
      </section>
    </div>
  )
}
