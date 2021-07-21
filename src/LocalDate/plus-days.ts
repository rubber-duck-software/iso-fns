import { LocalDate } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import dateFormat from 'dateformat'

/**
 * Adds a number of days to a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} daysToAdd
 *
 * @returns {LocalDate} date with days added
 */

function plusDays(localDate: LocalDate, daysToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const currentDayOfMonth = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(currentDayOfMonth + daysToAdd)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { plusDays }
