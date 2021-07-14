import { Instant } from '../iso-types'

/**
 * Converts form epoch milliseconds to human-readable datetime
 * @param epochMilli epoch seconds
 * @returns human-readable datetime
 */

export function ofEpochMilli(epochMilli: number): Instant {
  return new Date(epochMilli).toISOString()
}
