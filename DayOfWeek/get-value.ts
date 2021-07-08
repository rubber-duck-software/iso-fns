import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

/**
 * Receives a day-of-the-week value and converts it to the corresponding ordinal.
 * @param dayOfWeek
 * @returns
 */

export function getValue(dayOfWeek: DayOfWeek): number {
  switch (dayOfWeek) {
    case Sunday:
      return 1
    case Monday:
      return 2
    case Tuesday:
      return 3
    case Wednesday:
      return 4
    case Thursday:
      return 5
    case Friday:
      return 6
    case Saturday:
      return 7
    default:
      throw new TypeError(`${dayOfWeek} does not match type DayOfWeek`)
  }
}
