import { MonthDay } from '../iso-types'

/**
 * Determines if two monthDays are in descending order
 * @memberof MonthDayFns
 *
 * @param {MonthDay} leftMonthDay
 * @param {MonthDay} rightYearMonth
 *
 * @returns {number}
 */

function compareDesc(leftMonthDay: MonthDay, rightYearMonth: MonthDay): number {
  if (leftMonthDay > rightYearMonth) {
    return -1
  } else if (leftMonthDay < rightYearMonth) {
    return 1
  } else {
    return 0
  }
}

export { compareDesc }
