import { getCanonicalUrl } from '../site'
import type { ClaimRecord } from './types'

export async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return 'copied'
  }

  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.top = '-9999px'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()

    try {
      const copied = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (copied) return 'copied'
    } catch {
      document.body.removeChild(textarea)
    }
  }

  if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
    window.prompt('아래 내용을 복사해 주세요.', text)
    return 'prompted'
  }

  return 'unsupported'
}

export function buildSharePayload(record: ClaimRecord) {
  const url = getCanonicalUrl('/survival-pack')
  const text = [
    '시험기간 생존팩 하나 보냄 📦',
    '나는 방금 우주라이크에서 생존팩 뽑았는데, 너도 한 번 해봐 ㅋㅋ',
    `내 생존코드: ${record.couponCode}`,
    `참여 링크: ${url}`,
    '1분이면 끝나고, 오늘 상태에 맞는 생존팩이랑 혜택 바로 뜸',
  ].join('\n')

  return {
    title: '시험기간 생존팩 하나 보냄 📦',
    text,
    url,
  }
}

export async function shareResult(record: ClaimRecord) {
  const payload = buildSharePayload(record)
  const shareData = { title: payload.title, text: payload.text, url: payload.url }

  if (typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share(shareData)
    return 'shared'
  }

  return copyText(`${payload.title}\n${payload.text}`)
}
