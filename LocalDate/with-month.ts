import { LocalDate, Month } from '../iso-types'
import dateFormat from 'dateformat'
import { ordinal as monthOrdinal } from '../Month/ordinal'
import { plusDays } from './plus-days'

/**
 * Uses a string month and sets the month of a LocalDate to that month
 * @param {LocalDate} localDate
 * @param {Month} month
 * @returns {LocalDate}
 */

export function withMonth(localDate: LocalDate, month: Month): LocalDate {
  const date = new Date(localDate.toString())
  const monthOrd = monthOrdinal(month)
  const newDate = date.setUTCMonth(monthOrd)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
