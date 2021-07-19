import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getMonth } from './get-month'
import { ordinal as monthOrdinal } from '../Month/ordinal'

/**
 * Removes a given number of months from a LocalDate
 * @param {LocalDate} localDate
 * @param {number} monthsToSubtract
 * @returns {LocalDate}
 */

export function minusMonths(localDate: LocalDate, monthsToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = monthOrdinal(getMonth(localDate))
  const newDate = date.setUTCMonth(month - monthsToSubtract)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
