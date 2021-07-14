import { Instant } from '../iso-types'

/**
 * Receives an instant in time and returns the corresponding number of epoch seconds.
 * @param instant
 * @returns
 */

export function getEpochSecond(instant: Instant): number {
  return Math.floor(new Date(instant.toString()).getTime() / 1000)
}
