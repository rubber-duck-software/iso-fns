import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

/**
 * Receives an ordinal number and converts it to the corresponding day-of-week.
 * @param {Number} dayOfWeek
 * @returns {DayOfWeek}
 */

export function fromOrdinal(dayOfWeek: number): DayOfWeek {
  let dayMap = new Map()
  dayMap.set(0, Sunday)
  dayMap.set(1, Monday)
  dayMap.set(2, Tuesday)
  dayMap.set(3, Wednesday)
  dayMap.set(4, Thursday)
  dayMap.set(5, Friday)
  dayMap.set(6, Saturday)

  try {
    return dayMap.get(dayOfWeek)
    // This is being tested, but due to how beartest handles detecting thrown errors, c8 doesn't recognize that it is covered.
    /* c8 ignore next 3 */
  } catch {
    throw new TypeError(`${dayOfWeek} does not match type DayOfWeek`)
  }
}
