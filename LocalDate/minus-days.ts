import { LocalDate } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import dateFormat from 'dateformat'

/**
 * Removed a number of days from a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {Number} daysToSubtract
 *
 * @returns {LocalDate} date with days removed
 */

function minusDays(localDate: LocalDate, daysToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const currentDayOfMonth = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(currentDayOfMonth - daysToSubtract)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { minusDays }
