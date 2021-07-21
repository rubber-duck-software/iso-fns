import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { ofYearDay } from './of-year-day'

/**
 * Uses a localDate and day-of-year to create a new localDate
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} dayOfYear
 *
 * @returns {LocalDate}
 */

function withDayOfYear(localDate: LocalDate, dayOfYear: number): LocalDate {
  const year = getYear(localDate)
  return ofYearDay(year, dayOfYear)
}

export { withDayOfYear }
