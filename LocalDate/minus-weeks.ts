import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getDayOfMonth } from './get-day-of-month'

/**
 * Removes a number of weeks from a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} weeksToSubtract
 *
 * @returns {LocalDate} date with weeks removed
 */

function minusWeeks(localDate: LocalDate, weeksToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const day = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(day - weeksToSubtract * 7)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { minusWeeks }
