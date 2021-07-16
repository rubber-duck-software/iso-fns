import { DayOfWeek } from '../iso-types'
import { toOrdinal } from './to-ordinal'

/**
 * Compares two days of the week
 * @param leftDay
 * @param rightDay
 * @returns -1 if the days are in ascending order, 1 if they are in descending order, and 0 if they are the same day
 */

export function compareAsc(leftDay: DayOfWeek, rightDay: DayOfWeek): number {
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
