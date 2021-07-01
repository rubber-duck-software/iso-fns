import { LocalDateTime } from '../iso-types'

export function withMinute(localDateTime: LocalDateTime, minute: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const newDate = new Date(date.setUTCMinutes(minute))
  return newDate.toISOString().replace('Z', '')
}
