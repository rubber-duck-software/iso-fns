import { LocalDateTime } from '../iso-types'

export function plusDays(localDateTime: LocalDateTime, daysToAdd: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const currentDayOfMonth = date.getUTCDate()
  const newDate = new Date(date.setUTCDate(currentDayOfMonth + daysToAdd))
  return newDate.toISOString().replace('Z', '')
}
