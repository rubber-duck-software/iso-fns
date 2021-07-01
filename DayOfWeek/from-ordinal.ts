import { DayOfWeek } from '../iso-types'
import { Friday, Monday, Saturday, Sunday, Thursday, Tuesday, Wednesday } from './values'

export function fromOrdinal(dayOfWeek: number): DayOfWeek {
  switch (dayOfWeek) {
    case 0:
      return Sunday
    case 1:
      return Monday
    case 2:
      return Tuesday
    case 3:
      return Wednesday
    case 4:
      return Thursday
    case 5:
      return Friday
    case 6:
      return Saturday
    default:
      throw new TypeError(`${dayOfWeek} does not match type DayOfWeek`)
  }
}
