import { DayOfWeek } from '../iso-types'
import { ordinal } from './ordinal'

/**
 * Compares two days of the week and returns 1 if they days are in descending order, -1 if they are in ascending order, and 0 if they are the same day
 * @param leftMonth
 * @param rightMonth
 * @returns
 */

export function compareDesc(leftMonth: DayOfWeek, rightMonth: DayOfWeek): number {
  const leftOrdinal = ordinal(leftMonth)
  const rightOrdinal = ordinal(rightMonth)

  const diff = leftOrdinal - rightOrdinal

  if (diff > 0) {
    return -1
  } else if (diff < 0) {
    return 1
  } else {
    return diff
  }
}
