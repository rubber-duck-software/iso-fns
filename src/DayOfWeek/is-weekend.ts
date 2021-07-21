import { DayOfWeek } from '../iso-types'
import { Saturday, Sunday } from './values'

/**
 * Determines if a day of the week is a weekend
 * @memberof DayOfWeekFns
 *
 * @param {DayOfWeek} dayOfWeek
 *
 * @returns {Boolean} true if weekend. false if not weekend.
 */

function isWeekend(dayOfWeek: DayOfWeek): boolean {
  return dayOfWeek === Saturday || dayOfWeek === Sunday
}

export { isWeekend }
