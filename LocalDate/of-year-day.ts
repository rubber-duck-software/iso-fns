import { Year } from '../iso-types'
import { fromOrdinal as fromMonthOrdinal } from '../Month/from-ordinal'
import { isLeap } from '../Year/is-leap'
import { length } from '../Month/length'
import { firstDayOfYear } from '../Month/first-day-of-year'
import { plus } from '../Month/plus'
import { ofYearMonthDay } from './of-year-month-day'

/**
 * Determines the nth day of a year
 * @memberof LocalDateFns
 *
 * @param {Year} year
 * @param {number} dayOfYear
 *
 * @returns {LocalDate}
 */

function ofYearDay(year: Year, dayOfYear: number) {
  const leap = isLeap(year)
  if (dayOfYear === 366 && leap === false) {
    throw new Error("Invalid date 'DayOfYear 366' as '" + year + "' is not a leap year")
  }
  let moy = fromMonthOrdinal(Math.floor((dayOfYear - 1) / 31 + 1))
  const monthEnd = firstDayOfYear(moy, leap) + length(moy, leap) - 1
  if (dayOfYear > monthEnd) {
    moy = plus(moy, 1)
  }
  const dom = dayOfYear - firstDayOfYear(moy, leap) + 1
  return ofYearMonthDay(year, moy, dom)
}

export { ofYearDay }
