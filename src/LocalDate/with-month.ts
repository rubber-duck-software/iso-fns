import { LocalDate, Month } from '../iso-types'
import dateFormat from 'dateformat'
import { ordinal as monthOrdinal } from '../Month/ordinal'

/**
 * Sets the month of a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {Month} month
 *
 * @returns {LocalDate}
 */

function withMonth(localDate: LocalDate, month: Month): LocalDate {
  const date = new Date(localDate.toString())
  const monthOrd = monthOrdinal(month)
  const newDate = date.setUTCMonth(monthOrd)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { withMonth }
