import { LocalDate } from '../iso-types'

/**
 * Determines the numerical month of a date assuming 0-indexing.
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {number} Ordinal Month
 */

function getDayOfMonth(localDate: LocalDate): number {
  const dayOfMonth = new Date(localDate.toString()).getUTCDate()
  return dayOfMonth
}

export { getDayOfMonth }
