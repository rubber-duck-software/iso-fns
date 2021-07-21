import { LocalDate } from '../iso-types'

/**
 * Determines the month of a given date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {number} Ordinal Month
 */

function getMonthOrdinal(localDate: LocalDate): number {
  const month = new Date(localDate.toString()).getUTCMonth()
  return month
}

export { getMonthOrdinal }
