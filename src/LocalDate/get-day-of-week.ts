import { DayOfWeek, LocalDate } from '../iso-types'
import { fromOrdinal } from '../DayOfWeek/from-ordinal'

/**
 * Determines the string day-of-week from a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 *
 * @returns {DayOfWeek} string day-of-week
 */

function getDayOfWeek(localDate: LocalDate): DayOfWeek {
  const dayOfWeek = new Date(localDate.toString()).getUTCDay()
  return fromOrdinal(dayOfWeek)
}

export { getDayOfWeek }
