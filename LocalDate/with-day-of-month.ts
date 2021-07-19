import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'

/**
 * Receives a LocalDate and sets the day of the month to a number
 * @param {LocalDate} localDate
 * @param {number} dayOfMonth
 * @returns {LocalDate}
 */

export function withDayOfMonth(localDate: LocalDate, dayOfMonth: number): LocalDate {
  const date = new Date(localDate.toString())
  const newDate = date.setUTCDate(dayOfMonth + 1)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
