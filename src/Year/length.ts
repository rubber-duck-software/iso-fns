/* c8 ignore start */

import { Year } from '../iso-types'
import { isLeap } from './is-leap'

/**
 * Determines if the given year is 366 or 365 days long
 * @memberof YearFns
 *
 * @param year
 *
 * @returns {number}
 */

export function length(year: Year): number {
  return isLeap(year) ? 366 : 365
}

/* c8 ignore stop */
