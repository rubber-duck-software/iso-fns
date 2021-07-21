import { Instant } from '../iso-types'

/**
 * Removes some number of seconds from an instant in time
 * @memberof InstantFns
 *
 * @param {Instant} instant
 * @param {Number} secondsToSubtract
 *
 * @returns {Instant} Instant with seconds removed
 */

export function minusSeconds(instant: Instant, secondsToSubtract: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCSeconds()
  const newDate = new Date(date.setUTCSeconds(current - secondsToSubtract))
  return newDate.toISOString()
}
