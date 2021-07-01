import { MonthDay } from '../iso-types'

export function compareDesc(leftMonthDay: MonthDay, rightYearMonth: MonthDay): number {
  if (leftMonthDay > rightYearMonth) {
    return -1
  } else if (leftMonthDay < rightYearMonth) {
    return 1
  } else {
    return 0
  }
}
