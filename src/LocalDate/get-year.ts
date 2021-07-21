import { LocalDate, Year } from '../iso-types'

/**
 * Determines the year of a given date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {Year} Year from date
 */

function getYear(localDate: LocalDate): Year {
  const year = new Date(localDate.toString()).getUTCFullYear()
  return year
}

export { getYear }
