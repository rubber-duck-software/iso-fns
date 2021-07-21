import { Instant } from '../iso-types'

/**
 * Converts epoch seconds to a human-readable datetime
 * @memberof InstantFns
 *
 * @param epochSecond
 *
 * @returns human-readable datetime
 */

function ofEpochSecond(epochSecond: number): Instant {
  return new Date(epochSecond * 1000).toISOString()
}

export { ofEpochSecond }
