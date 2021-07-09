import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

/**
 * Receives a day-of-the-week value and converts it to the corresponding ordinal assuming 1-indexing.
 * @param dayOfWeek
 * @returns
 */

export function toOrdinal_1(dayOfWeek: DayOfWeek): number {
  let ordinalMap = new Map()
  ordinalMap.set(Sunday, 1)
  ordinalMap.set(Monday, 2)
  ordinalMap.set(Tuesday, 3)
  ordinalMap.set(Wednesday, 4)
  ordinalMap.set(Thursday, 5)
  ordinalMap.set(Friday, 6)
  ordinalMap.set(Saturday, 7)

  try {
    return ordinalMap.get(dayOfWeek)
    // This is being tested, but due to how beartest handles detecting thrown errors, c8 doesn't recognize that it is covered.
    /* c8 ignore next 3 */
  } catch {
    throw new TypeError(`${dayOfWeek} does not match type DayOfWeek`)
  }
}
