import { DayOfWeek, LocalDate } from '../iso-types'
import { fromOrdinal } from '../DayOfWeek/from-ordinal'

/**
 * receives a local date and returns the corresponding day-of-week
 * @param {LocalDate} localDate
 * @returns {DayOfWeek}
 */

export function getDayOfWeek(localDate: LocalDate): DayOfWeek {
  const dayOfWeek = new Date(localDate.toString()).getUTCDay()
  return fromOrdinal(dayOfWeek)
}
