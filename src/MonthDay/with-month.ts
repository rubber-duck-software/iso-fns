import { Month, MonthDay } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import { ofMonthAndNumber } from './of-month-and-number'

/**
 * Updates the month of a monthDay
 * @memberof MonthDayFns
 *
 * @param {MonthDay} monthDay
 * @param {Month} month
 *
 * @returns {MonthDay}
 */

function withMonth(monthDay: MonthDay, month: Month): MonthDay {
  const dayOfMonth = getDayOfMonth(monthDay)
  return ofMonthAndNumber(month, dayOfMonth)
}

export { withMonth }
