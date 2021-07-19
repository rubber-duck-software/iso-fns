import { LocalDate } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import dateFormat from 'dateformat'

// This function should use mod when subtracting daysToSubtract from the currentDayOfMonth.

/**
 * Receives a local date, removes a given number of days from the date, and returns the new date.
 * @param {LocalDate} localDate
 * @param {number} daysToSubtract
 * @returns {LocalDate}
 */

export function minusDays(localDate: LocalDate, daysToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const currentDayOfMonth = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(currentDayOfMonth - daysToSubtract + 1)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
