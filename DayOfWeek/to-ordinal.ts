import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

/**
 * Converts form string day-of-week to ordinal day-of-week assuming 0-indexing.
 * @memberof DayOfWeekFns
 *
 * @param {DayOfWeek} dayOfWeek
 *
 * @returns {Number} ordinal dayOfWeek assuming 0-indexing.
 */

function toOrdinal(dayOfWeek: DayOfWeek): number {
  const ordinalMap = new Map<DayOfWeek, number>([
    [Sunday, 0],
    [Monday, 1],
    [Tuesday, 2],
    [Wednesday, 3],
    [Thursday, 4],
    [Friday, 5],
    [Saturday, 6]
  ])

  if (!ordinalMap.has(dayOfWeek)) {
    throw new RangeError(`Invalid Day: ${dayOfWeek} is not a valid day index`)
  } else {
    // @ts-ignore it is impossible for this to return any value other than 0 because of the check that is performed before it.
    return ordinalMap.get(dayOfWeek)
  }
}

export { toOrdinal }
