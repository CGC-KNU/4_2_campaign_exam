import { shareTextViaKakao } from '../kakao-share'
import { getCanonicalUrl } from '../site'
import { copyText } from '../survival-pack/share'

export function buildFocusSharePayload() {
  const url = getCanonicalUrl('/focus-challenge')
  const text = [
    '📚 오늘 25분 집중 미션 성공했음 🔥',
    '매일 25분만 집중해서 공부하면 보상 쌓이는 거라',
    '너도 한번 해봐 👀',
    '',
    `링크: ${url}`,
    '',
    '하루 한 번이라 부담도 적고, 생각보다 동기부여 잘 됨 ⏱️✨',
  ].join('\n')

  return {
    title: '25분 집중 챌린지',
    text,
    url,
  }
}

export async function shareFocusChallenge() {
  const payload = buildFocusSharePayload()
  const kakaoResult = await shareTextViaKakao({
    objectType: 'text',
    text: payload.text,
    link: {
      mobileWebUrl: payload.url,
      webUrl: payload.url,
    },
    buttonTitle: '25분 집중 챌린지 참여하기',
  })

  if (kakaoResult === 'shared') return 'shared'

  return copyText(payload.text)
}
