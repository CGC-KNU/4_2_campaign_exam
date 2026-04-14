import type { Question } from './types'

export const SURVIVAL_PACK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    prompt: '공부 시작 직전, 지금 제일 먼저 필요한 건?',
    options: [
      { label: '익숙하고 든든한 한 끼로 먼저 안정시키기', scores: { pack01: 2, pack04: 1, pack12: 1 } },
      { label: '시원한 걸로 머리 식히고 다시 들어가기', scores: { pack02: 2, pack06: 1 } },
      { label: '가볍고 깔끔한 메뉴로 루틴 지키기', scores: { pack03: 2, pack08: 1 } },
      { label: '카페 자리나 같이 버틸 분위기 세팅하기', scores: { pack09: 1, pack10: 2, pack13: 1 } },
    ],
  },
  {
    id: 'q2',
    prompt: '집중이 살짝 끊길 때 가장 끌리는 보상은?',
    options: [
      { label: '짧고 달콤한 디저트 한 입', scores: { pack05: 2, pack06: 1 } },
      { label: '바삭하고 짭짤한 한 입 보상', scores: { pack07: 2, pack11: 1 } },
      { label: '같은 메뉴라도 더 만족스럽게 업그레이드', scores: { pack11: 2, pack04: 1 } },
      { label: '혼자보다 같이 나눠 먹는 보상', scores: { pack09: 1, pack13: 2 } },
    ],
  },
  {
    id: 'q3',
    prompt: '시험기간 내 공부 스타일에 가장 가까운 건?',
    options: [
      { label: '정해둔 루틴을 깔끔하게 유지해야 안정된다', scores: { pack03: 2, pack10: 1 } },
      { label: '한 번 자리에 앉으면 오래 버티는 편이다', scores: { pack10: 2, pack03: 1 } },
      { label: '이건 체력전이라 단백질 보충이 중요하다', scores: { pack12: 2, pack04: 1 } },
      { label: '중간중간 가볍게 집어먹어야 흐름이 산다', scores: { pack08: 2, pack05: 1, pack07: 1 } },
    ],
  },
  {
    id: 'q4',
    prompt: '공부하다 지칠 때 나를 다시 살리는 방식은?',
    options: [
      { label: '익숙한 메뉴로 텐션을 회복한다', scores: { pack01: 2, pack04: 1 } },
      { label: '차갑고 시원한 걸로 머리를 식힌다', scores: { pack02: 2, pack06: 1 } },
      { label: '당 충전으로 기분부터 끌어올린다', scores: { pack06: 2, pack05: 1 } },
      { label: '사람 만나 같이 먹고 이야기해야 살아난다', scores: { pack09: 1, pack13: 2 } },
    ],
  },
  {
    id: 'q5',
    prompt: '오늘 시험공부 끝나면 가장 하고 싶은 건?',
    options: [
      { label: '제대로 된 한 끼로 배부터 채우기', scores: { pack04: 2, pack12: 1 } },
      { label: '디저트로 짧고 확실하게 보상받기', scores: { pack05: 2, pack06: 1 } },
      { label: '버거나 사이드를 업그레이드해 만족감 챙기기', scores: { pack07: 1, pack11: 2 } },
      { label: '저녁에 사람들과 같이 먹으며 하루 마무리하기', scores: { pack09: 2, pack13: 1 } },
    ],
  },
]
