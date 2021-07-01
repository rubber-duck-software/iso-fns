import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

export function ordinal(dayOfWeek: DayOfWeek): number {
  switch (dayOfWeek) {
    case Sunday:
      return 0
    case Monday:
      return 1
    case Tuesday:
      return 2
    case Wednesday:
      return 3
    case Thursday:
      return 4
    case Friday:
      return 5
    case Saturday:
      return 6
    default:
      throw new TypeError(`${dayOfWeek} does not match type DayOfWeek`)
  }
}
