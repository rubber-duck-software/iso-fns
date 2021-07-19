import { Month, Year } from '../iso-types'
import { ordinal as ordinalMonth } from '../Month/ordinal'
import dateFormat from 'dateformat'

/**
 * Receives a year, month, and number of day in the month and return the LocalDate
 * @param {Year} year
 * @param {Month} month
 * @param {number} dayOfMonth
 * @returns {LocalDate}
 */

export function ofYearMonthDay(year: Year, month: Month, dayOfMonth: number) {
  const date = new Date()
  const withYear = new Date(date.setUTCFullYear(year))
  const withMonth = new Date(withYear.setUTCMonth(ordinalMonth(month)))
  const withDayOfMonth = withMonth.setUTCDate(dayOfMonth)
  return dateFormat(withDayOfMonth, 'yyyy-mm-dd')
}
