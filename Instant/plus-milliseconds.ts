import { Instant } from '../iso-types'

export function plusMilliseconds(instant: Instant, millisecondsToAdd: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCMilliseconds()
  const newDate = new Date(date.setUTCMilliseconds(current + millisecondsToAdd))
  return newDate.toISOString()
}
