import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoMonthDay } from './iso-types'
import isValidDate from './isValidDate'
import isValidDateTime from './isValidDateTime'
import isValidMonthDay from './isValidMonthDay'
import { JsDateToIsoMonthDay } from './utils/jsdateConversions'

function isoMonthDay(): IsoMonthDay
function isoMonthDay(fields: { month: number; day: number }): IsoMonthDay
function isoMonthDay(date: IsoDate): IsoMonthDay
function isoMonthDay(dateTime: IsoDateTime): IsoMonthDay
function isoMonthDay(input: string): IsoMonthDay
function isoMonthDay(month: number, day: number): IsoMonthDay

function isoMonthDay(...args: any[]): any {
  if (args.length === 0) {
    const myDate = new Date()
    return JsDateToIsoMonthDay(myDate)
  } else if (args.length === 1) {
    const input = args[0]
    if (isValidMonthDay(input)) {
      return input
    } else if (isValidDate(input)) {
      return isoMonthDay(getFields(input))
    } else if (isValidDateTime(input)) {
      return isoMonthDay(getFields(input))
    } else if (isMonthDayFields(input)) {
      const myDate = new Date(`2000-01-01T00:00:00.000Z`)
      myDate.setUTCMonth(input.month - 1)
      myDate.setUTCDate(input.day)
      return JsDateToIsoMonthDay(myDate)
    } else {
      throw new Error(`Unrecognized input: ${input}`)
    }
  } else if (args.length === 2) {
    return isoMonthDay({ month: args[0], day: args[1] })
  } else {
    throw new Error(`Unrecognized input: ${args}`)
  }
}

function isMonthDayFields(input: any): input is { month: number; day: number } {
  try {
    return (
      Object.keys(input).includes('month') &&
      Object.keys(input).includes('day') &&
      Number.isFinite(input.month) &&
      Number.isFinite(input.day)
    )
  } catch {
    return false
  }
}

export default isoMonthDay
