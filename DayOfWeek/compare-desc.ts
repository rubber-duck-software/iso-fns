import { DayOfWeek } from '../iso-types'
import { ordinal } from './ordinal'

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
