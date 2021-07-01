import { LocalDateTime } from '../iso-types'

export function getMillisecond(localDateTime: LocalDateTime): number {
  const date = new Date(`${localDateTime}Z`)
  return date.getUTCMilliseconds()
}
