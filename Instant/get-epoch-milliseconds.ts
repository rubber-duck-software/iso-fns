import { Instant } from '../iso-types'

/**
 * Converts an instant in time to epoch milliseconds
 * @memberof InstantFns
 *
 * @param {Instant} instant
 *
 * @returns {Number} epoch milliseconds
 */

function getEpochMilliseconds(instant: Instant): number {
  return Math.floor(new Date(instant.toString()).getTime())
}

export { getEpochMilliseconds }
