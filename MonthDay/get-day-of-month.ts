import { MonthDay } from '../iso-types'

/**
 * Gets the numerical day of month from a monthDay
 * @memberof MonthDayFns
 *
 * @param {MonthDay} monthDay
 *
 * @returns {number}
 */

function getDayOfMonth(monthDay: MonthDay): number {
  return new Date(`2000-${monthDay}`).getUTCDate()
}

export { getDayOfMonth }
