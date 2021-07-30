import isLeapYear from './isLeapYear'
import { IsoYearMonth, IsoDateTime, IsoDate } from 'iso-types'

export default function getDaysInYear(date: IsoDate): number
export default function getDaysInYear(dateTime: IsoDateTime): number
export default function getDaysInYear(yearMonth: IsoYearMonth): number
export default function getDaysInYear(year: number): number

export default function getDaysInYear(input: any): number {
  return isLeapYear(input) ? 366 : 365
}
