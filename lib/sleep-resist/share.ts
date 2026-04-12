import { shareTextViaKakao } from '../kakao-share'
import { getCanonicalUrl } from '../site'
import { copyText } from '../survival-pack/share'

export function buildSleepSharePayload(recordSeconds: number) {
  const url = getCanonicalUrl('/sleep-resist')
  const text = [
    '시험공부 잘되고 있냐? 😵‍💫',
    '지금 졸리면 그냥 이걸로 승부 보자 ㅋㅋ',
    '우주라이크 졸음 깨기 게임인데, 은근 자존심 상하게 만든다',
    '',
    `내 기록은 ${recordSeconds.toFixed(1)}초다`,
    '안 졸 자신 있으면 이거 깨고 와봐 👀',
    '괜히 들어왔다가 바로 털려도 난 모른다',
    '',
    `링크: ${url}`,
  ].join('\n')

  return {
    title: '우주라이크 졸음 참기',
    text,
    url,
  }
}

export async function shareSleepChallenge(recordSeconds: number) {
  const payload = buildSleepSharePayload(recordSeconds)
  const kakaoResult = await shareTextViaKakao({
    objectType: 'text',
    text: payload.text,
    link: {
      mobileWebUrl: payload.url,
      webUrl: payload.url,
    },
    buttonTitle: '졸음 참기 참여하기',
  })

  if (kakaoResult === 'shared') return 'shared'

  return copyText(payload.text)
}
