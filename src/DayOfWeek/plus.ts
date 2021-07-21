import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { toOrdinal } from './to-ordinal'

/**
 * Adds a given number of days to a give day of the week
 * @memberof DayOfWeek
 *
 * @param {DayOfWeek} dayOfWeek
 * @param {Number} days
 *
 * @returns {DayOfWeek} DayOfWeek with days added
 */

function plus(dayOfWeek: DayOfWeek, days: number): DayOfWeek {
  const oldOrdinal = toOrdinal(dayOfWeek)
  const newOrdinal = oldOrdinal + (days % 7)
  return fromOrdinal(newOrdinal)
}

export { plus }
