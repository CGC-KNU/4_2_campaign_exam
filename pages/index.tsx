import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getCampaignNow } from '../lib/campaign'
import { getCanonicalUrl } from '../lib/site'

const APP_STORE_URL = 'https://apps.apple.com/kr/app/wouldulike/id6740640251'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.coggiri.new1'

export default function Home() {
  const [appPrimaryUrl, setAppPrimaryUrl] = useState(PLAY_STORE_URL)
  const [campaignNow, setCampaignNow] = useState(() => getCampaignNow())
  const canonicalUrl = getCanonicalUrl('/')
  const { isCampaignLive } = campaignNow

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setAppPrimaryUrl(APP_STORE_URL)
      return
    }
    setAppPrimaryUrl(PLAY_STORE_URL)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCampaignNow(getCampaignNow())
    }, 30000)

    return () => window.clearInterval(timer)
  }, [])

  const heroEyebrow = '시험기간 캠페인 진행 중'
  const heroTitle = '중간고사 시즌, 오늘 할 미션을 골라보세요'
  const heroCopy = '생존팩, 집중 챌린지, 졸음 참기까지 바로 이어집니다.'
  const appPromoTitle = '앱에서 캠페인 혜택 이어서 보기'
  const appPromoCopy = '쿠폰, 스탬프, 주변 식당 혜택을 앱에서 한 번에 볼 수 있어요.'
  return (
    <div className="container home-page exam-home-page">
      <Head>
        <title>우주라이크 시험기간 캠페인</title>
        <meta name="description" content="시험기간에 가볍게 눌러볼 수 있는 생존팩 뽑기와 집중 챌린지를 만나보세요." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>

      <section className="mobile-shell home-app-shell">
        <section className="card home-hero home-hero-app exam-home-hero">
            <div className="hero-topline">
              <div className="home-brand-block">
                <div className="campaign-label">우주라이크</div>
              </div>
              <div className="eyebrow">{heroEyebrow}</div>
            </div>

          <div className="home-promo-card exam-promo-card">
            <div className="home-promo-copy">
              <h1>{heroTitle}</h1>
              <p className="hero-copy">{heroCopy}</p>

              <div className="home-download-cta">
                <div className="home-download-copy">
                  <strong>{appPromoTitle}</strong>
                  <span>{appPromoCopy}</span>
                </div>
                <a className="home-store-btn unified" href={appPrimaryUrl} target="_blank" rel="noreferrer">
                  <span className="home-store-kicker">Wouldulike App</span>
                  <strong>앱 다운받기</strong>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section-head">
          <span className="home-section-kicker">Mission Lobby</span>
          <strong>지금 시작할 미션을 골라보세요</strong>
          <p>오늘 필요한 미션부터 바로 시작하면 됩니다.</p>
        </section>

        <section className="grid home-grid exam-home-grid">
          <Link href="/survival-pack" className="tile card event-card event-card-survival featured exam-event-card">
            <div className="event-thumb event-thumb-survival" aria-hidden="true">
              <span className="thumb-chip">Today Pack</span>
              <span className="thumb-survival-card thumb-survival-card-question">
                <span className="thumb-survival-card-title">Q1</span>
                <span className="thumb-survival-line" />
                <span className="thumb-survival-line thumb-survival-line-short" />
                <span className="thumb-survival-dot-row">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              <span className="thumb-survival-flow" />
              <span className="thumb-survival-result">
                <span className="thumb-survival-packbox-lid" />
                <span className="thumb-survival-ticket thumb-survival-ticket-main" />
                <span className="thumb-survival-result-card">
                  <span className="thumb-survival-result-top">오늘의 결과</span>
                  <span className="thumb-survival-result-title">쿠폰 지급</span>
                  <span className="thumb-survival-stamp">ISSUED</span>
                </span>
              </span>
            </div>
            <div className="event-top">
              <span className="event-badge live">LIVE</span>
              <span className="event-status">하루 1회</span>
            </div>
            <h3>오늘의 생존팩 뽑기</h3>
            <p className="muted">1분 진단 후 오늘 필요한 쿠폰 1종을 받아보세요. 하루 1회 참여 가능해요.</p>
            <div className="event-meta">
              <span>1분 진단</span>
              <span>유형 테스트</span>
              <span>쿠폰 1종</span>
            </div>
            <div className="event-helper-copy">가볍게 시작하고 바로 혜택까지 이어집니다.</div>
            <div className="event-cta">지금 시작하기</div>
          </Link>

          <Link href="/focus-challenge" className="tile card event-card event-card-focus exam-event-card">
            <div className="event-thumb event-thumb-focus" aria-hidden="true">
              <span className="thumb-chip">Focus Sprint</span>
              <span className="thumb-focus-ring">
                <span className="thumb-focus-ring-fill" />
                <span className="thumb-focus-ring-hole" />
              </span>
              <span className="thumb-focus-time">25:00</span>
              <span className="thumb-focus-steps">
                <span className="thumb-focus-step is-done" />
                <span className="thumb-focus-step is-done" />
                <span className="thumb-focus-step" />
              </span>
              <span className="thumb-focus-reward">
                <span className="thumb-focus-star" />
                <span>UP</span>
              </span>
            </div>
            <div className="event-top">
              <span className="event-badge live">LIVE</span>
              <span className="event-status">1일 1회</span>
            </div>
            <h3>25분 집중 챌린지</h3>
            <p className="muted">25분만 버티면 누적 횟수와 보상이 함께 올라갑니다.</p>
            <div className="event-meta">
              <span>집중 미션</span>
              <span>하루 1회</span>
              <span>누적 보상</span>
            </div>
            <div className="event-helper-copy">집중하고 누적 보상을 쌓는 메인 미션입니다.</div>
            <div className="event-cta">지금 시작하기</div>
          </Link>

          <Link href="/sleep-resist" className="tile card event-card event-card-awake exam-event-card">
            <div className="event-thumb event-thumb-awake" aria-hidden="true">
              <span className="thumb-chip">Stay Awake</span>
              <span className="thumb-mini-badge thumb-mini-badge-awake">TOP 10</span>
              <span className="thumb-awake-face">
                <span className="thumb-awake-brow thumb-awake-brow-a" />
                <span className="thumb-awake-brow thumb-awake-brow-b" />
                <span className="thumb-awake-eye-shell thumb-awake-eye-shell-a">
                  <span className="thumb-awake-eye-lid" />
                </span>
                <span className="thumb-awake-eye-shell thumb-awake-eye-shell-b">
                  <span className="thumb-awake-eye-lid" />
                </span>
                <span className="thumb-awake-mouth" />
              </span>
              <span className="thumb-awake-gauge">
                <span className="thumb-awake-gauge-fill" />
                <span className="thumb-awake-gauge-label">게이지</span>
              </span>
              <span className="thumb-awake-score thumb-awake-score-best">32.4s</span>
              <span className="thumb-awake-tap-ring thumb-awake-tap-ring-a" />
              <span className="thumb-awake-tap-ring thumb-awake-tap-ring-b" />
            </div>
            <div className="event-top">
              <span className="event-badge live">LIVE</span>
              <span className="event-status">기록 경쟁</span>
            </div>
            <h3>졸음 참기</h3>
            <p className="muted">탭으로 졸음을 버티고 기록을 남겨보세요. 랭킹과 친구 공유가 가능한 미니게임입니다.</p>
            <div className="event-meta">
              <span>반사신경</span>
              <span>랭킹</span>
              <span>공유</span>
            </div>
            <div className="event-helper-copy">가볍게 시작하는 기록 경쟁 미니게임입니다.</div>
            <div className="event-cta">지금 시작하기</div>
          </Link>
        </section>
      </section>
    </div>
  )
}
