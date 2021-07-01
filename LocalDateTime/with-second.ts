import { LocalDateTime } from '../iso-types'

export function withSecond(localDateTime: LocalDateTime, second: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const newDate = new Date(date.setUTCSeconds(second))
  return newDate.toISOString().replace('Z', '')
}
