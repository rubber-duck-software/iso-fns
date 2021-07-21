import { LocalDateTime } from '../iso-types'

export function getHour(localDateTime: LocalDateTime): number {
  const date = new Date(`${localDateTime}Z`)
  return date.getUTCHours()
}
