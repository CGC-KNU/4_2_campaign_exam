export const CAMPAIGN_LAUNCH_DATE_KEY = '2026-04-15'
export const CAMPAIGN_LAUNCH_AT = '2026-04-15T00:00:00+09:00'

function getSeoulParts(now: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(now)
  const read = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: Number(read('hour')),
    minute: Number(read('minute')),
  }
}

function getDaysUntilLaunch(todayKey: string) {
  const current = new Date(`${todayKey}T00:00:00+09:00`).getTime()
  const target = new Date(`${CAMPAIGN_LAUNCH_DATE_KEY}T00:00:00+09:00`).getTime()
  return Math.max(0, Math.ceil((target - current) / 86400000))
}

export function getCampaignNow(now = new Date()) {
  const seoul = getSeoulParts(now)
  const todayKey = `${seoul.year}-${seoul.month}-${seoul.day}`
  const isCampaignLive = now.getTime() >= new Date(CAMPAIGN_LAUNCH_AT).getTime()

  return {
    todayKey,
    seoulHour: seoul.hour,
    seoulMinute: seoul.minute,
    isCampaignLive,
    daysUntilLaunch: getDaysUntilLaunch(todayKey),
  }
}
