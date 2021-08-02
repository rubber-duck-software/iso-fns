import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoYearMonth } from './iso-types'
import { IsoSplitter } from './utils/isoFlexFunction'
import { getIsLeapByYearNumber } from './utils/getIsLeapByYearNumber'

function isLeapYear(date: IsoDate): boolean
function isLeapYear(dateTime: IsoDateTime): boolean
function isLeapYear(yearMonth: IsoYearMonth): boolean
function isLeapYear(year: number): boolean

function isLeapYear(input: any) {
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

export default isLeapYear
