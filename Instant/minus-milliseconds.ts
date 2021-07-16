import { Instant } from '../iso-types'

/**
 * Subtracts some amount of milliseconds from an instant in time
 * @param {Instant} instant
 * @param {Number} millisecondsToSubtract
 * @returns {Instant}
 */

export function minusMilliseconds(instant: Instant, millisecondsToSubtract: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCMilliseconds()
  const newDate = new Date(date.setUTCMilliseconds(current - millisecondsToSubtract))
  return newDate.toISOString()
}
