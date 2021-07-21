import { LocalDateTime } from '../iso-types'

export function minusSeconds(localDateTime: LocalDateTime, secondsToSubtract: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCSeconds()
  const newDate = new Date(date.setUTCSeconds(current - secondsToSubtract))
  return newDate.toISOString().replace('Z', '')
}
