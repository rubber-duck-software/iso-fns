import { LocalDateTime } from '../iso-types'

export function minusMonths(localDateTime: LocalDateTime, monthsToSubtract: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCMonth()
  const newDate = new Date(date.setUTCMonth(current - monthsToSubtract))
  return newDate.toISOString().replace('Z', '')
}
