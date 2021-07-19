import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { ofYearDay } from './of-year-day'

/**
 * Uses a date and a number of a day in the year (out of 365) and returns the date corresponding to the given day of the year.
 * @param {LocalDate} localDate
 * @param {number} dayOfYear
 * @returns {LocalDate}
 */

export function withDayOfYear(localDate: LocalDate, dayOfYear: number): LocalDate {
  const year = getYear(localDate)
  return ofYearDay(year, dayOfYear)
}
