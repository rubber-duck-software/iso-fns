import { Instant } from '../iso-types'

export function minusSeconds(instant: Instant, secondsToSubtract: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCSeconds()
  const newDate = new Date(date.setUTCSeconds(current - secondsToSubtract))
  return newDate.toISOString()
}
