import { YearMonth } from '../iso-types'

export function compareDesc(leftYearMonth: YearMonth, rightYearMonth: YearMonth): number {
  if (leftYearMonth > rightYearMonth) {
    return -1
  } else if (leftYearMonth < rightYearMonth) {
    return 1
  } else {
    return 0
  }
}
