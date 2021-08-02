import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoMonthDay, IsoYearMonth } from './iso-types'

function getMonth(date: IsoDate): number
function getMonth(dateTime: IsoDateTime): number
function getMonth(monthDay: IsoMonthDay): number
function getMonth(yearMonth: IsoYearMonth): number

function getMonth(input: any): number {
  return getFields(input).month
}

export default getMonth
