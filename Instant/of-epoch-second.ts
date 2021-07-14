import { Instant } from '../iso-types'

/**
 * Converts epoch seconds to a human-readable datetime
 * @param epochSecond
 * @returns human-readable datetime
 */

export function ofEpochSecond(epochSecond: number): Instant {
  return new Date(epochSecond * 1000).toISOString()
}
