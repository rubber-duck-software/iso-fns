import { LocalDateTime } from '../iso-types'

export function plusMonths(localDateTime: LocalDateTime, monthsToAdd: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCMonth()
  const newDate = new Date(date.setUTCMonth(current + monthsToAdd))
  return newDate.toISOString().replace('Z', '')
}
