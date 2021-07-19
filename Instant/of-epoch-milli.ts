import { Instant } from '../iso-types'

/**
 * Converts form epoch milliseconds to human-readable datetime
 * @memberof InstantFns
 *
 * @param epochMilli epoch milliseconds
 *
 * @returns human-readable datetime
 */

function ofEpochMilli(epochMilli: number): Instant {
  return new Date(epochMilli).toISOString()
}

export { ofEpochMilli }
