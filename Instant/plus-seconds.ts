import { Instant } from '../iso-types'

/**
 * Adds a number of seconds to a given instance in time
 * @param instant
 * @param secondsToAdd
 * @returns new instance in time
 */

export function plusSeconds(instant: Instant, secondsToAdd: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCSeconds()
  const newDate = new Date(date.setUTCSeconds(current + secondsToAdd))
  return newDate.toISOString()
}
