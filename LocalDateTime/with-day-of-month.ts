import { LocalDateTime } from '../iso-types'

export function withDayOfMonth(localDateTime: LocalDateTime, dayOfMonth: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const newDate = new Date(date.setUTCDate(dayOfMonth))
  return newDate.toISOString().replace('Z', '')
}
