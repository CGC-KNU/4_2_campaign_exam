import type { CouponBundle, CouponBundleItem } from './types'

const DAILY_COUPON_START_DATE = '2026-04-15'

export const DEFAULT_COUPON_BUNDLE: CouponBundle = {
  coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['MTRQVAA'] },
  coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['QMVLTBA'] },
  coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['PLKTRCA'] },
  coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['VKQPWDA'] },
  coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['TQWPMEA'] },
  coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['LQWMRFA'] },
  coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['RPXWTGA'] },
  coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['XQTRPHA'] },
  coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['MKWQPIA'] },
  coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['PTQRMJA'] },
  coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['TRWQPKA'] },
  coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['QTRNPLA'] },
  coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['VTQKRMA'] },
}

export const DAILY_COUPON_BUNDLES: Record<string, CouponBundle> = {
  '2026-04-15': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['MTRQVAA'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['QMVLTBA'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['PLKTRCA'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['VKQPWDA'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['TQWPMEA'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['LQWMRFA'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['RPXWTGA'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['XQTRPHA'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['MKWQPIA'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['PTQRMJA'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['TRWQPKA'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['QTRNPLA'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['VTQKRMA'] },
  },
  '2026-04-16': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['KPLNWAB'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['XRDKPBB'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['NWQXRCB'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['RTNXLDB'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['NXRKPEB'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['XPTKNFB'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['CKLQRGB'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['LNVKPHB'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['RVTLNIB'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['XNWLKJB'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['NXLVQKB'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['XDMWKLB'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['XPLNWMB'] },
  },
  '2026-04-17': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['ZDXRJAC'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['JTNWCBC'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['GVDJMCC'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['CPJMRDC'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['DLVJQEC'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['CRDVQFC'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['VTMNDGC'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['CRWJTHC'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['CQXJRIC'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['CVDRPJC'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['CDJMRKC'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['CVQJPLC'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['CJDRQMC'] },
  },
  '2026-04-18': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['FVQTMAD'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['LQPVSBD'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['TRMPLCD'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['LWQVKDD'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['HPTMXED'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['HJWMXFD'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['HQRPLGD'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['PMXQLHD'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['HPMKWID'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['HQLMTJD'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['HQTPWKD'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['HNRXWLD'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['HWMKTMD'] },
  },
  '2026-04-19': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['HCNWKAE'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['CKMRWBE'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['XCKQNCE'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['HMXPTDE'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['CKQWNEE'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['NLBTKFE'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['NWXKQGE'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['DKTRNHE'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['NTDRQIE'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['NKXWPJE'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['BVKRNKE'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['BKTPQLE'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['NQXPRME'] },
  },
  '2026-04-20': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['RJLPTAF'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['VTXQLBF'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['BJLWVCF'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['QNRCWDF'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['RJVLPEF'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['QXRPCFF'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['DJVTRGF'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['VQWLPHF'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['XLVCPIF'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['RTPVCJF'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['YPLXQKF'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['YVMCQLF'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['BLTVQMF'] },
  },
  '2026-04-21': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['BQVMXAG'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['DPRNJBG'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['QTPRNCG'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['BDTLKDG'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['BMXTQEG'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['VTMKDFG'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['LXPMWGG'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['HJCNKHG'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['BJQWNIG'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['BJWQNJG'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['RDMTCKG'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['RJWNTLG'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['RCKWNMG'] },
  },
  '2026-04-22': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['TLDRWAH'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['HWMKYBH'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['HVKLMCH'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['XCVPRDH'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['WPDNKEH'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['BPRNWFH'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['QCRNKGH'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['TRMVPHH'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['TKRPMIH'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['LMDRKJH'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['WQJNVKH'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['PLDQKLH'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['YPMDJMH'] },
  },
  '2026-04-23': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['NQKJVAI'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['RCLVTBI'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['YRDQPCI'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['JWKQNDI'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['QCLVTEI'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['DKXQLFI'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['BTVJPGI'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['BQXKDHI'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['DWNXLII'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['QXPTNJI'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['KCPTRKI'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['MCTXQLI'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['QTRXLMI'] },
  },
  '2026-04-24': {
    coupon_01: { store: '통통주먹구이 경북대점', label: '추억의 도시락', codes: ['WCPRXAJ'] },
    coupon_02: { store: '포차1번지먹새통 경북대점', label: '미니빙수 제공', codes: ['ZQNXPBJ'] },
    coupon_03: { store: '스톡홀롬샐러드 경대정문점', label: '샐러드 구매시 아메리카노 기본/빅사이즈 1,000원', codes: ['MNBXTCJ'] },
    coupon_04: { store: '마름모식당', label: '생연어덮밥 10,000원 식사권', codes: ['PMTRXDJ'] },
    coupon_05: { store: '주비 두루 향기롭다', label: '우유 푸딩 테이크아웃 시 아메리카노 500원', codes: ['ZTRPJEJ'] },
    coupon_06: { store: '사랑과평화 경북대점', label: '뻥튀기 아이스크림 제공', codes: ['MTCVPFJ'] },
    coupon_07: { store: '부리또익스프레스', label: '감자튀김 제공', codes: ['YMKQRGJ'] },
    coupon_08: { store: '고씨네 대구경북대본점', label: '인당 해시포테이토 1개', codes: ['YNPLTHJ'] },
    coupon_09: { store: '정직유부 경북대점', label: '[17~20시 사용] 9,000원 이상 결제 시 테이블당 모든 유부 2P 제공', codes: ['QCVTMIJ'] },
    coupon_10: { store: '웃찌커피', label: '아메리카노 / 라떼 / 아이스티 사이즈 업', codes: ['VDCLMJJ'] },
    coupon_11: { store: '기프트버거 경대점', label: '갈릭버터 프라이즈 변경 (버거 주문시)', codes: ['MXVLQKJ'] },
    coupon_12: { store: '다원국밥', label: '고기 추가 (방문시 - 소고기류 제외)', codes: ['DNVPRLJ'] },
    coupon_13: { store: '혜화문식당', label: '인원수 맞게 새우튀김 서비스', codes: ['DKVCPMJ'] },
  },
}

export function getTodayCouponBundle(dateKey: string) {
  if (dateKey < DAILY_COUPON_START_DATE) {
    return DEFAULT_COUPON_BUNDLE
  }

  return DAILY_COUPON_BUNDLES[dateKey] ?? DEFAULT_COUPON_BUNDLE
}

function hashSeed(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

export function pickCouponCode(coupon: CouponBundleItem, seed: string) {
  const index = hashSeed(seed) % coupon.codes.length
  return coupon.codes[index]
}
