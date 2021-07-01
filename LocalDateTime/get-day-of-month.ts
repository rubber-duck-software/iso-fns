import { LocalDateTime } from '../iso-types'

export function getDayOfMonth(localDateTime: LocalDateTime): number {
  const date = new Date(`${localDateTime}Z`)
  return date.getUTCDate()
}
