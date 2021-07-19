import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getMonth } from './get-month'
import { ordinal as monthOrdinal } from '../Month/ordinal'

/**
 * Receives a date and adds a number of months to it
 * @param {LocalDate} localDate
 * @param {number} monthsToAdd
 * @returns {LocalDate}
 */

export function plusMonths(localDate: LocalDate, monthsToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = monthOrdinal(getMonth(localDate))
  const newDate = date.setUTCDate(month + monthsToAdd)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
