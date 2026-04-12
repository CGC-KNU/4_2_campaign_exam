import type { ResultType } from './types'

export const RESULT_TYPES: ResultType[] = [
  {
    id: 'pack01',
    title: '레트로 도시락 회복형',
    shortDesc: '정신없을수록 익숙한 한 끼가 필요한 타입',
    packDesc: '낯선 자극보다 익숙한 메뉴로 마음과 집중력을 다시 붙잡는 쪽에 가깝습니다.',
    couponKey: 'coupon_01',
  },
  {
    id: 'pack02',
    title: '머리 식히는 리프레시형',
    shortDesc: '공부 열이 오르면 잠깐 식혀야 다시 버티는 타입',
    packDesc: '한 번 식히고 다시 들어가는 리듬이 잘 맞는 날입니다.',
    couponKey: 'coupon_02',
  },
  {
    id: 'pack03',
    title: '깔끔 루틴 유지형',
    shortDesc: '무겁지 않게 먹고 맑게 집중하는 타입',
    packDesc: '과하지 않은 보급으로 공부 루틴을 흐트러뜨리지 않는 편이 좋습니다.',
    couponKey: 'coupon_03',
  },
  {
    id: 'pack04',
    title: '한 끼 승부형',
    shortDesc: '제대로 먹어야 공부도 시작되는 타입',
    packDesc: '집중력보다 먼저 배터리를 채워야 흐름이 살아나는 날입니다.',
    couponKey: 'coupon_04',
  },
  {
    id: 'pack05',
    title: '디저트 브레이크형',
    shortDesc: '짧고 달콤한 보상 뒤에 다시 달리는 타입',
    packDesc: '길게 쉬기보다 짧고 확실한 당 보상으로 리셋하는 편이 잘 맞습니다.',
    couponKey: 'coupon_05',
  },
  {
    id: 'pack06',
    title: '기분전환 당충전형',
    shortDesc: '공부 효율보다 멘탈 회복이 먼저인 타입',
    packDesc: '오늘은 효율 계산보다 기분을 끌어올리는 보급이 더 중요합니다.',
    couponKey: 'coupon_06',
  },
  {
    id: 'pack07',
    title: '짭짤 보상형',
    shortDesc: '끝나고 뭔가 바삭한 보상이 있어야 버티는 타입',
    packDesc: '버티는 힘을 주는 건 묵직한 보상보다 손에 잡히는 만족감에 가깝습니다.',
    couponKey: 'coupon_07',
  },
  {
    id: 'pack08',
    title: '한입 간식 집중형',
    shortDesc: '중간중간 가볍게 집어먹으며 흐름 유지하는 타입',
    packDesc: '한 번에 크게 쉬기보다 작은 간식으로 집중 흐름을 이어가는 편입니다.',
    couponKey: 'coupon_08',
  },
  {
    id: 'pack09',
    title: '저녁 합공형',
    shortDesc: '혼자보다 같이 먹고 같이 버틸 때 강한 타입',
    packDesc: '혼자 버티는 것보다 사람과 리듬을 맞출 때 더 힘이 나는 날입니다.',
    couponKey: 'coupon_09',
  },
  {
    id: 'pack10',
    title: '카페 장기전형',
    shortDesc: '한 번 앉으면 오래 버티는 카공형',
    packDesc: '자리를 잘 잡고 길게 가는 운영이 가장 잘 맞는 타입입니다.',
    couponKey: 'coupon_10',
  },
  {
    id: 'pack11',
    title: '업그레이드 만족형',
    shortDesc: '같은 메뉴라도 더 만족스럽게 먹어야 동기 생기는 타입',
    packDesc: '작은 업그레이드가 하루 전체 만족도를 끌어올리는 편입니다.',
    couponKey: 'coupon_11',
  },
  {
    id: 'pack12',
    title: '든든 단백질 보충형',
    shortDesc: '배를 채우는 게 아니라 체력을 충전해야 하는 타입',
    packDesc: '이번 시험기간은 포만감보다 버티는 체력을 채우는 보급이 핵심입니다.',
    couponKey: 'coupon_12',
  },
  {
    id: 'pack13',
    title: '같이 먹어야 사는 나눔형',
    shortDesc: '시험기간도 결국 사람과 같이 버텨야 하는 타입',
    packDesc: '함께 나눠 먹는 순간이 곧 회복이 되는 타입에 가깝습니다.',
    couponKey: 'coupon_13',
  },
]

export function getResultType(packId: string) {
  return RESULT_TYPES.find((result) => result.id === packId)
}
