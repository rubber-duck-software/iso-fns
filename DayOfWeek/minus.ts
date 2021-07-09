import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { toOrdinal } from './to-ordinal'

/**
 * Removes a given number of days from a day of the week.
 * (e.g. Friday - 5 = Sunday)
 * @param dayOfWeek
 * @param days
 * @returns
 */

export function minus(dayOfWeek: DayOfWeek, days: number): DayOfWeek {
  const oldOrdinal = toOrdinal(dayOfWeek)
  const newOrdinal = oldOrdinal - (days % 7)
  return fromOrdinal(newOrdinal)
}
