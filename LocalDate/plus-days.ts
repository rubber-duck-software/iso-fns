import { LocalDate } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import dateFormat from 'dateformat'

/**
 * Receives a LocalDate and adds a given number of days to the date
 * @param {LocalDate} localDate
 * @param {number} daysToAdd
 * @returns {LocalDate}
 */

export function plusDays(localDate: LocalDate, daysToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const currentDayOfMonth = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(currentDayOfMonth + daysToAdd + 1)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
