import { LocalDateTime } from '../iso-types'

export function getSecond(localDateTime: LocalDateTime): number {
  const date = new Date(`${localDateTime}Z`)
  return date.getUTCSeconds()
}
