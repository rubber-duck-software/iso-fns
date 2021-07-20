import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { isLeap as isYearLeap } from '../Year/is-leap'

/**
 * Receives a local date and returns if it is a leap year
 * @memberof LocalDateFns
 *
 * @param {LocalDate} yearMonth
 *
 * @returns {Boolean}
 */

function isLeap(yearMonth: LocalDate): boolean {
  return isYearLeap(getYear(yearMonth))
}

export { isLeap }