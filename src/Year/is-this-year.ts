/* c8 ignore start */

import { Year } from '../iso-types'

/**
 * Determines if the given year is the current year
 * @memberof YearFns
 *
 * @param year
 *
 * @returns {boolean}
 */

export function isThisYear(year: Year): boolean {
  return year === new Date(Date.now()).getFullYear()
}

/* c8 ignore stop */
