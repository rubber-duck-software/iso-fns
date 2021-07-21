import { LocalDateTime } from '../iso-types'

export function withMillisecond(localDateTime: LocalDateTime, millisecond: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const newDate = new Date(date.setUTCMilliseconds(millisecond))
  return newDate.toISOString().replace('Z', '')
}
