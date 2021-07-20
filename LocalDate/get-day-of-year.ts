import { LocalDate, Year } from '../iso-types'
import { getMonth } from './get-month'
import { getYear } from './get-year'
import { isLeap as isYearLeap } from '../Year/is-leap'
import { firstDayOfYear } from '../Month/first-day-of-year'
import { getDayOfMonth } from './get-day-of-month'

/**
 * Determines the day-of-year of a given date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {Year} day-of-year
 */

function getDayOfYear(localDate: LocalDate): Year {
  const month = getMonth(localDate)
  const year = getYear(localDate)
  const leap = isYearLeap(year)
  const dayOfMonth = getDayOfMonth(localDate)
  return firstDayOfYear(month, leap) + dayOfMonth - 1
}

export { getDayOfYear }