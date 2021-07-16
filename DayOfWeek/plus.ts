import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { toOrdinal } from './to-ordinal'

/**
 * Adds a given number of days to a give day of the week
 * (e.g. Tuesday + 3 = Friday)
 * @param {DayOfWeek} dayOfWeek
 * @param {Number} days
 * @returns {DayOfWeek}
 */

export function plus(dayOfWeek: DayOfWeek, days: number): DayOfWeek {
  const oldOrdinal = toOrdinal(dayOfWeek)
  const newOrdinal = oldOrdinal + (days % 7)
  return fromOrdinal(newOrdinal)
}
