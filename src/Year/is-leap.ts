/* c8 ignore start */

import { Year } from '../iso-types'

/**
 * Determines if a year is a leap year
 * @memberof YearFns
 *
 * @param year
 *
 * @returns {boolean}
 */

export function isLeap(year: Year): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

/* c8 ignore stop */
