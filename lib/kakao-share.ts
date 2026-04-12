import { getCanonicalUrl } from './site'
import type { ClaimRecord } from './survival-pack/types'

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.0/kakao.min.js'

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendDefault: (options: Record<string, unknown>) => Promise<unknown>
      }
    }
  }
}

function getKakaoKey() {
  return process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim() ?? ''
}

function loadKakaoSdk() {
  if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'))
  if (window.Kakao) return Promise.resolve(window.Kakao)

  return new Promise<typeof window.Kakao>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-sdk="true"]')

    if (existing) {
      existing.addEventListener('load', () => resolve(window.Kakao))
      existing.addEventListener('error', () => reject(new Error('kakao sdk load failed')))
      return
    }

    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL
    script.async = true
    script.crossOrigin = 'anonymous'
    script.dataset.kakaoSdk = 'true'
    script.onload = () => resolve(window.Kakao)
    script.onerror = () => reject(new Error('kakao sdk load failed'))
    document.head.appendChild(script)
  })
}

export function buildKakaoShareOptions(record: ClaimRecord) {
  const url = getCanonicalUrl('/survival-pack')

  return {
    objectType: 'text',
    text: [
      '시험기간 생존팩 하나 보냄 📦',
      '나는 방금 우주라이크에서 생존팩 뽑았는데, 너도 한 번 해봐 ㅋㅋ',
      `내 생존코드: ${record.couponCode}`,
      `참여 링크: ${url}`,
      '1분이면 끝나고, 오늘 상태에 맞는 생존팩이랑 혜택 바로 뜸',
    ].join('\n'),
    link: {
      mobileWebUrl: url,
      webUrl: url,
    },
    buttonTitle: '생존팩 참여하기',
  }
}

export async function shareTextViaKakao(options: Record<string, unknown>) {
  const kakaoKey = getKakaoKey()

  if (!kakaoKey) {
    return 'missing_key'
  }

  const Kakao = await loadKakaoSdk()

  if (!Kakao) {
    return 'sdk_unavailable'
  }

  if (!Kakao.isInitialized()) {
    Kakao.init(kakaoKey)
  }

  await Kakao.Share.sendDefault(options)
  return 'shared'
}

export async function shareViaKakao(record: ClaimRecord) {
  return shareTextViaKakao(buildKakaoShareOptions(record))
}
