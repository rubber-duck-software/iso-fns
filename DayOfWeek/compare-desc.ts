import { DayOfWeek } from '../iso-types'
import { toOrdinal } from './to-ordinal'

/**
 * Determines if two days of the week are in descending order
 * @memberof DayOfWeekFns
 *
 * @param {DayOfWeek} leftMonth
 * @param {DayOfWeek} rightMonth
 *
 * @returns {Number} -1 if they days are in descending order, 1 if they are in ascending order, and 0 if they are the same day.
 */

function compareDesc(leftMonth: DayOfWeek, rightMonth: DayOfWeek): number {
  const leftOrdinal = toOrdinal(leftMonth)
  const rightOrdinal = toOrdinal(rightMonth)

  const diff = leftOrdinal - rightOrdinal

  if (diff > 0) {
    return -1
  } else if (diff < 0) {
    return 1
  } else {
    return 0
  }
}

export { compareDesc }