import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { isLeap as isYearLeap } from '../Year/is-leap'
import { getMonth } from './get-month'
import { length as monthLength } from '../Month/length'

/**
 * Determines the length of the month, in days, of a given date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {number} length of month
 */

function lengthOfMonth(localDate: LocalDate): number {
  const month = getMonth(localDate)
  const year = getYear(localDate)
  const leap = isYearLeap(year)
  return monthLength(month, leap)
}

export { lengthOfMonth }
