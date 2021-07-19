import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getMonth } from './get-month'
import { ordinal as monthOrdinal } from '../Month/ordinal'

/**
 * Removes a number of months from a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} monthsToSubtract
 *
 * @returns {LocalDate} date with months removed
 */

function minusMonths(localDate: LocalDate, monthsToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = monthOrdinal(getMonth(localDate))
  const newDate = date.setUTCMonth(month - monthsToSubtract)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { minusMonths }
