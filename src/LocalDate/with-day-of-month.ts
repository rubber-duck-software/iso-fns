import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'

/**
 * Creates a localDate with an existing date and a day of the month
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} dayOfMonth
 *
 * @returns {LocalDate}
 */

function withDayOfMonth(localDate: LocalDate, dayOfMonth: number): LocalDate {
  const date = new Date(localDate.toString())
  const newDate = date.setUTCDate(dayOfMonth)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { withDayOfMonth }
