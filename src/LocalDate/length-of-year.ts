import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { length as yearLength } from '../Year/length'

/**
 * determines the length of a year in days
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {number} length of year
 */

function lengthOfYear(localDate: LocalDate): number {
  const year = getYear(localDate)
  return yearLength(year)
}

export { lengthOfYear }
