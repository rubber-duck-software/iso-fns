import { Instant } from '../iso-types'

/**
 * Removes some number of seconds from an instant in time
 * @param instant
 * @param secondsToSubtract
 * @returns
 */

export function minusSeconds(instant: Instant, secondsToSubtract: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCSeconds()
  const newDate = new Date(date.setUTCSeconds(current - secondsToSubtract))
  return newDate.toISOString()
}
