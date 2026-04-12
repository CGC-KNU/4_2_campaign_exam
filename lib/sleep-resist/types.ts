export type SleepGameStatus = 'idle' | 'countdown' | 'running' | 'gameover'

export interface SleepGameState {
  status: SleepGameStatus
  sleepGauge: number
  survivalTime: number
  drainRate: number
  startedAt?: number
  endedAt?: number
  isBestRecord: boolean
}

export interface SleepResistRecord {
  id: string
  nickname: string
  survivalTime: number
  createdAt: number
  dateKey: string
}

export interface SleepEvent {
  id: string
  text: string
  multiplier: number
  endsAt: number
  isDanger: boolean
}
