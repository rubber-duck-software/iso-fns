import isLeapYear from './isLeapYear'
import { IsoYearMonth, IsoDateTime, IsoDate } from 'iso-types'

function getDaysInYear(date: IsoDate): number
function getDaysInYear(dateTime: IsoDateTime): number
function getDaysInYear(yearMonth: IsoYearMonth): number
function getDaysInYear(year: number): number

function getDaysInYear(input: any): number {
  return isLeapYear(input) ? 366 : 365
}

export default getDaysInYear
