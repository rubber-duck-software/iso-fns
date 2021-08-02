import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoMonthDay } from './iso-types'

function getDay(date: IsoDate): number
function getDay(dateTime: IsoDateTime): number
function getDay(monthDay: IsoMonthDay): number

function getDay(input: any): number {
  return getFields(input).day
}

export default getDay
