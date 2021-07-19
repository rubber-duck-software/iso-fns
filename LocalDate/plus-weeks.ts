import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getDayOfMonth } from './get-day-of-month'

/**
 * Adds a number of weeks to a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} weeksToAdd
 *
 * @returns {LocalDate} date with weeks added
 */

function plusWeeks(localDate: LocalDate, weeksToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(month + weeksToAdd * 7)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { plusWeeks }
