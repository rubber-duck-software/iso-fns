import getFields from './getFields'
import { IsoDate, IsoYearMonth, IsoDateTime } from './iso-types'
import { JsDateToIsoYearMonth } from './utils/jsdateConversions'
import isValidYearMonth from './isValidYearMonth'
import isValidDate from './isValidDate'
import isValidDateTime from './isValidDateTime'

function isoYearMonth(): IsoYearMonth
function isoYearMonth(fields: { year: number; month: number }): IsoYearMonth
function isoYearMonth(date: IsoDate): IsoYearMonth
function isoYearMonth(dateTime: IsoDateTime): IsoYearMonth
function isoYearMonth(input: string): IsoYearMonth
function isoYearMonth(year: number, month: number): IsoYearMonth

function isoYearMonth(...args: any[]): IsoYearMonth {
  if (args.length === 0) {
    const myDate = new Date()
    return JsDateToIsoYearMonth(myDate)
  } else if (args.length === 1) {
    const input = args[0]
    if (isValidYearMonth(input)) {
      return input
    } else if (isValidDate(input)) {
      return isoYearMonth(getFields(input))
    } else if (isValidDateTime(input)) {
      return isoYearMonth(getFields(input))
    } else if (isYearMonthFields(input)) {
      const myDate = new Date(`2000-01-01T00:00:00.000Z`)
      myDate.setUTCMonth(input.month - 1)
      myDate.setUTCFullYear(input.year)
      return JsDateToIsoYearMonth(myDate)
    } else {
      throw new Error(`Unrecognized input: ${input}`)
    }
  } else if (args.length === 2) {
    return isoYearMonth({ year: args[0], month: args[1] })
  } else {
    throw new Error(`Unrecognized input: ${args}`)
  }
}

function isYearMonthFields(input: any): input is { month: number; year: number } {
  try {
    return (
      Object.keys(input).includes('month') &&
      Object.keys(input).includes('year') &&
      Number.isFinite(input.month) &&
      Number.isFinite(input.year)
    )
  } catch {
    throw new Error(`Unrecognized Input: ${input}`)
  }
}

export default isoYearMonth
