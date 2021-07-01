import { Instant } from '../iso-types'

export function minusMilliseconds(instant: Instant, millisecondsToSubtract: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCMilliseconds()
  const newDate = new Date(date.setUTCMilliseconds(current - millisecondsToSubtract))
  return newDate.toISOString()
}
