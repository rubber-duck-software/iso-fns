import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getMonth } from './get-month'
import { ordinal as monthOrdinal } from '../Month/ordinal'

/**
 * Adds a number of months to a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} monthsToAdd
 *
 * @returns {LocalDate} date with months added
 */

function plusMonths(localDate: LocalDate, monthsToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = monthOrdinal(getMonth(localDate))
  const newDate = date.setUTCMonth(month + monthsToAdd)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { plusMonths }
