import { Month, MonthDay } from '../iso-types'
import { fromOrdinal as fromMonthOrdinal } from '../Month/from-ordinal'

/**
 * Gets the string month from a monthDay
 * @memberof MonthDayFns
 *
 * @param {MonthDay} monthDay
 *
 * @returns {Month} string
 */

function getMonth(monthDay: MonthDay): Month {
  return fromMonthOrdinal(new Date(`2000-${monthDay}`).getUTCMonth())
}

export { getMonth }
