import { DayOfWeek } from '../iso-types'
import { Saturday, Sunday } from './values'

/**
 * Receives a day-of-week variable and returns a boolean value indicating if it is a weekend or not
 * @param {DayOfWeek} dayOfWeek
 * @returns {Boolean}
 */

export function isWeekend(dayOfWeek: DayOfWeek): boolean {
  return dayOfWeek === Saturday || dayOfWeek === Sunday
}
