import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

/**
 * Converts from string day-of-week to ordinal assuming 1-indexing
 * @memberof DayOfWeekFns
 *
 * @param {DayOfWeek} dayOfWeek
 *
 * @returns {Number} ordinal dayOfWeek
 */

function toOrdinal_1(dayOfWeek: DayOfWeek): number {
  const ordinalMap = new Map<DayOfWeek, number>([
    [Sunday, 1],
    [Monday, 2],
    [Tuesday, 3],
    [Wednesday, 4],
    [Thursday, 5],
    [Friday, 6],
    [Saturday, 7]
  ])

  if (!ordinalMap.has(dayOfWeek)) {
    throw new RangeError(`Invalid Day: ${dayOfWeek} is not a valid day of the week`)
  } else {
    // @ts-ignore it is impossible for this to return any value other than 0 because of the check that is performed before it.
    return ordinalMap.get(dayOfWeek)
  }
}

export { toOrdinal_1 }
