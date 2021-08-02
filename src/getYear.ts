import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoYearMonth } from 'iso-types'

function getYear(date: IsoDate): number
function getYear(dateTime: IsoDateTime): number
function getYear(yearMonth: IsoYearMonth): number

function getYear(input: any): any {
  return getFields(input).year
}

export default getYear
