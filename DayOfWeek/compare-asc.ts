import { DayOfWeek } from '../iso-types'
import { ordinal } from './ordinal'

/**
 * Compares two days of the week and returns 1 if the days are in ascending order, -1 if they are in descending order, and 0 if they are the same day.
 * @param leftDay
 * @param rightDay
 * @returns
 */

export function compareAsc(leftDay: DayOfWeek, rightDay: DayOfWeek): number {
  const leftOrdinal = ordinal(leftDay)
  const rightOrdinal = ordinal(rightDay)

  const diff = leftOrdinal - rightOrdinal

  if (diff < 0) {
    return -1
  } else if (diff > 0) {
    return 1
  } else {
    return diff
  }
}
