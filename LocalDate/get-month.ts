import { LocalDate, Month } from '../iso-types'
import { fromOrdinal } from '../Month/from-ordinal'

/**
 * Receive a local date and returns a string month
 * @param {LocalDate} localDate
 * @returns {Month}
 */

export function getMonth(localDate: LocalDate): Month {
  const month = new Date(localDate.toString()).getUTCMonth()
  return fromOrdinal(month)
}
