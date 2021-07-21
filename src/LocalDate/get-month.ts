import { LocalDate, Month } from '../iso-types'
import { fromOrdinal } from '../Month/from-ordinal'

/**
 * Determines the month string of a given date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {Month} string month
 */

function getMonth(localDate: LocalDate): Month {
  const month = new Date(localDate.toString()).getUTCMonth()
  return fromOrdinal(month)
}

export { getMonth }
