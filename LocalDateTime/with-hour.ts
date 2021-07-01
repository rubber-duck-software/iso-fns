import { LocalDateTime } from '../iso-types'

export function withHour(localDateTime: LocalDateTime, hour: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const newDate = new Date(date.setUTCHours(hour))
  return newDate.toISOString().replace('Z', '')
}
