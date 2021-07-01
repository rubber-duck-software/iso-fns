import { LocalDateTime } from '../iso-types'

export function minusDays(localDateTime: LocalDateTime, daysToSubtract: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const currentDayOfMonth = date.getUTCDate()
  const newDate = new Date(date.setUTCDate(currentDayOfMonth - daysToSubtract))
  return newDate.toISOString().replace('Z', '')
}
