import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

/**
 * Converts a day-of-week from ordinal to string
 * @memberof DayOfWeekFns
 *
 * @param {Number} dayOfWeek
 *
 * @returns {DayOfWeek} string day-of-week
 */

function fromOrdinal(dayOfWeek: number): DayOfWeek {
  const dayMap = new Map<number, DayOfWeek>([
    [0, Sunday],
    [1, Monday],
    [2, Tuesday],
    [3, Wednesday],
    [4, Thursday],
    [5, Friday],
    [6, Saturday]
  ])

  if (!dayMap.has(dayOfWeek)) {
    throw new RangeError(`Invalid Day: ${dayOfWeek} is not a valid day index`)
  } else {
    // @ts-ignore it is impossible for this to return any value other than 0 because of the check that is performed before it.
    return dayMap.get(dayOfWeek)
  }
}

export { fromOrdinal }
