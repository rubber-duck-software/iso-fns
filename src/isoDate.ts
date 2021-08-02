import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoMonthDay, IsoYearMonth } from 'iso-types'
import isValidDate from './isValidDate'
import isValidDateTime from './isValidDateTime'
import isValidMonthDay from './isValidMonthDay'
import isValidYearMonth from './isValidYearMonth'
import { JsDateToIsoDate } from './utils/jsdateConversions'

function isoDate(): IsoDate
function isoDate(fields: { year: number; month: number; day: number }): IsoDate
function isoDate(dateTime: IsoDateTime): IsoDate
function isoDate(input: string): IsoDate

function isoDate(monthDay: IsoMonthDay, year: number): IsoDate
function isoDate(yearMonth: IsoYearMonth, day: number): IsoDate

function isoDate(year: number, month: number, day: number): IsoDate

function isoDate(...args: any[]): any {
  if (!args?.length) {
    return JsDateToIsoDate(new Date())
  } else if (args.length === 1) {
    const input = args[0]
    if (isValidDate(input)) {
      return input
    } else if (isValidDateTime(input)) {
      return isoDate(getFields(input))
    } else if (isDateFields(input)) {
      const date = new Date('1970-01-01T00:00:00.000Z')
      date.setUTCFullYear(input.year)
      date.setUTCMonth(input.month - 1)
      date.setUTCDate(input.day)
      return JsDateToIsoDate(date)
    } else {
      throw new Error(`Unrecognized input: ${args}`)
    }
  } else if (args.length === 2) {
    if (isValidMonthDay(args[0]) && Number.isFinite(args[1])) {
      return isoDate({
        ...getFields(args[0]),
        year: args[1]
      })
    } else if (isValidYearMonth(args[0]) && Number.isFinite(args[1])) {
      return isoDate({
        ...getFields(args[0]),
        day: args[1]
      })
    } else {
      throw new Error(`Unrecognized input: ${args}`)
    }
  } else if (args.length === 3) {
    const [year, month, day] = args
    return isoDate({
      year,
      month,
      day
    })
  } else {
    throw new Error(`Unrecognized input: ${args}`)
  }
}

function isDateFields(input: any): input is { month: number; day: number; year: number } {
  try {
    return (
      Object.keys(input).includes('year') &&
      Object.keys(input).includes('month') &&
      Object.keys(input).includes('day') &&
      Number.isFinite(input.year) &&
      Number.isFinite(input.month) &&
      Number.isFinite(input.day)
    )
  } catch {
    return false
  }
}

export default isoDate
