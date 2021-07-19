import { LocalDate } from '../iso-types'

/**
 * Receives a local date and returns the corresponding day of month
 * @param {LocalDate} localDate
 * @returns {number} Ordinal Month
 */

export function getDayOfMonth(localDate: LocalDate): number {
  const dayOfMonth = new Date(localDate.toString()).getUTCDate()
  return dayOfMonth
}
