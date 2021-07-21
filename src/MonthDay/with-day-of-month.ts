import { MonthDay } from '../iso-types'
import { getMonth } from './get-month'
import { ofMonthAndNumber } from './of-month-and-number'

/**
 * Changes the day of a monthDay
 * @memberof MonthDayFns
 *
 * @param {MonthDay} monthDay
 * @param {number} dayOfMonth
 *
 * @returns {MonthDay}
 */

function withDayOfMonth(monthDay: MonthDay, dayOfMonth: number): MonthDay {
  const month = getMonth(monthDay)
  return ofMonthAndNumber(month, dayOfMonth)
}

export { withDayOfMonth }
