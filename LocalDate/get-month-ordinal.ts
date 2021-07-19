import { LocalDate } from '../iso-types'

/**
 * Receives a local date and returns an ordinal month value
 * @param {LocalDate} localDate
 * @returns {number} Ordinal Month
 */

export function getMonthOrdinal(localDate: LocalDate): number {
  const month = new Date(localDate.toString()).getUTCMonth()
  return month
}
