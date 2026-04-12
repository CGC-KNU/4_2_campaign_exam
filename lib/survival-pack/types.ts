export type PackId =
  | 'pack01'
  | 'pack02'
  | 'pack03'
  | 'pack04'
  | 'pack05'
  | 'pack06'
  | 'pack07'
  | 'pack08'
  | 'pack09'
  | 'pack10'
  | 'pack11'
  | 'pack12'
  | 'pack13'

export type ScoreKey = PackId

export type Scores = Record<ScoreKey, number>

export type QuestionOption = {
  label: string
  scores: Partial<Scores>
}

export type Question = {
  id: string
  prompt: string
  options: QuestionOption[]
}

export type ResultType = {
  id: PackId
  title: string
  shortDesc: string
  packDesc: string
  couponKey: string
}

export type CouponBundleItem = {
  store: string
  label: string
  codes: string[]
}

export type CouponBundle = Record<string, CouponBundleItem>

export type ClaimRecord = {
  date: string
  packId: PackId
  couponCode: string
  couponKey: string
  store: string
  label: string
  sharedText: string
  createdAt: string
}
