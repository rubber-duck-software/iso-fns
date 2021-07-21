/* c8 ignore start */

import { Year } from '../iso-types'
import dateFormat from 'dateformat'

/**
 * Converts a year to an accepted string-based format
 * @memberof YearFns
 *
 * @param year
 * @param format
 *
 * @returns {string} Formatted Year
 */

function format(year: Year, format: string): string {
  const date = new Date(new Date().setUTCFullYear(year))
  return dateFormat(date, format, true)
}

export { format }

/* c8 ignore stop */
