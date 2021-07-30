import getFields from './getFields'
import isLeapYear from './isLeapYear'
import { IsoDate, IsoDateTime, IsoYearMonth } from 'iso-types'
import { getDaysInMonthByNumber } from './utils/getDaysInMonthByNumber'

export default function getDaysInMonth(date: IsoDate): number
export default function getDaysInMonth(dateTime: IsoDateTime): number
export default function getDaysInMonth(yearMonth: IsoYearMonth): number
export default function getDaysInMonth(month: number, isLeap?: boolean): number

export default function getDaysInMonth(...args: any[]): number {
  if (args.length === 0) {
    throw new Error('No arguments supplied')
  }
  if (args.length === 1) {
    const input = args[0]
    if (typeof input === 'string') {
      const leap = isLeapYear(input as any)
      const { month } = getFields(input as any)
      return getDaysInMonthByNumber(month, leap)
    } else {
      return getDaysInMonthByNumber(input, false)
    }
  } else if (args.length === 2) {
    return getDaysInMonthByNumber(args[0], args[1])
  } else {
    throw new Error('Invalid arguments supplied')
  }
}
