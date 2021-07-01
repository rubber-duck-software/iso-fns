import { LocalDateTime } from '../iso-types'

export function getMinute(localDateTime: LocalDateTime): number {
  const date = new Date(`${localDateTime}Z`)
  return date.getUTCMinutes()
}
