import { Instant } from '../iso-types'

export function plusSeconds(instant: Instant, secondsToAdd: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCSeconds()
  const newDate = new Date(date.setUTCSeconds(current + secondsToAdd))
  return newDate.toISOString()
}
