import { Instant } from '../iso-types'

/**
 * Converts and instant in time to epoch seconds
 * @memberof InstantFns
 *
 * @param {Instant} instant
 *
 * @returns {Number} epoch seconds
 */

function getEpochSecond(instant: Instant): number {
  return Math.floor(new Date(instant.toString()).getTime() / 1000)
}

export { getEpochSecond }
