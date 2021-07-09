import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

/**
 * Receives a day-of-week value and returns the corresponding ordinal value of that day.
 * @param dayOfWeek
 * @returns
 */

export function toOrdinal(dayOfWeek: DayOfWeek): number {
  let ordinalMap = new Map()
  ordinalMap.set(Sunday, 0)
  ordinalMap.set(Monday, 1)
  ordinalMap.set(Tuesday, 2)
  ordinalMap.set(Wednesday, 3)
  ordinalMap.set(Thursday, 4)
  ordinalMap.set(Friday, 5)
  ordinalMap.set(Saturday, 6)

  try {
    return ordinalMap.get(dayOfWeek)
    // This is being tested, but due to how beartest handles detecting thrown errors, c8 doesn't recognize that it is covered.
    /* c8 ignore next 3 */
  } catch {
    throw new TypeError(`${dayOfWeek} does not match type DayOfWeek`)
  }
}
