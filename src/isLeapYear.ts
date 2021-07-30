import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoYearMonth } from 'iso-types'
import { IsoSplitter } from './utils/isoFlexFunction'
import { getIsLeapByYearNumber } from './utils/getIsLeapByYearNumber'

export default function isLeapYear(date: IsoDate): boolean
export default function isLeapYear(dateTime: IsoDateTime): boolean
export default function isLeapYear(yearMonth: IsoYearMonth): boolean
export default function isLeapYear(year: number): boolean

export default function isLeapYear(input: any) {
  if (typeof input === 'number') {
    return getIsLeapByYearNumber(input)
  } else {
    return IsoSplitter(input, {
      Date(input) {
        const year = getFields(input).year
        return getIsLeapByYearNumber(year)
      },
      DateTime(input) {
        const year = getFields(input).year
        return getIsLeapByYearNumber(year)
      },
      YearMonth(input) {
        const year = getFields(input).year
        return getIsLeapByYearNumber(year)
      }
    })
  }
}
