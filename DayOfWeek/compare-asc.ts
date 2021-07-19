import { DayOfWeek } from '../iso-types'
import { toOrdinal } from './to-ordinal'

/**
 * Determines if two days of the week are in ascending order
 * @memberof DayOfWeekFns
 *
 * @param {DayOfWeek} leftDay
 * @param {DayOfWeek} rightDay
 *
 * @returns {Number} -1 if the days are in ascending order, 1 if they are in descending order, and 0 if they are the same day
 */

function compareAsc(leftDay: DayOfWeek, rightDay: DayOfWeek): number {
  const leftOrdinal = toOrdinal(leftDay)
  const rightOrdinal = toOrdinal(rightDay)

  const diff = leftOrdinal - rightOrdinal

  if (diff < 0) {
    return -1
  } else if (diff > 0) {
    return 1
  } else {
    return 0
  }
}

export { compareAsc }
