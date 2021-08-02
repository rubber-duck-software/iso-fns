import { IsoDate, IsoDateTime, IsoTime } from './iso-types'
import isValidDateTime from './isValidDateTime'
import { JsDateToIsoDateTime } from './utils/jsdateConversions'
import isoDate from './isoDate'
import isoTime from './isoTime'
import getFields from './getFields'
import isValidDate from './isValidDate'

function isoDateTime(): IsoDateTime

function isoDateTime(fields: {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  second?: number
  millisecond?: number
}): IsoDateTime
function isoDateTime(date: IsoDate): IsoDateTime
function isoDateTime(input: string): IsoDateTime

function isoDateTime(date: IsoDate, time: IsoTime): IsoDateTime
function isoDateTime(
  date: IsoDate,
  time: {
    hour: number
    minute?: number
    second?: number
    millisecond?: number
  }
): IsoDateTime
function isoDateTime(
  date: {
    year: number
    month: number
    day: number
  },
  time: IsoTime
): IsoDateTime
function isoDateTime(
  date: {
    year: number
    month: number
    day: number
  },
  time: {
    hour: number
    minute?: number
    second?: number
    millisecond?: number
  }
): IsoDateTime
function isoDateTime(
  year: number,
  month: number,
  day: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number
): IsoTime

function isoDateTime(...args: any[]): any {
  if (!args?.length) {
    return JsDateToIsoDateTime(new Date())
  } else if (args.length === 1) {
    const input = args[0]
    if (isValidDateTime(input)) {
      return input
    } else if (isValidDate(input)) {
      return isoDateTime(input, '00:00:00.000')
    } else if (isDateTimeFields(input)) {
      const { year, month, day, hour, minute = 0, second = 0, millisecond = 0 } = input
      const date = new Date(0)
      date.setUTCFullYear(year)
      date.setUTCMonth(month - 1)
      date.setUTCDate(day)
      date.setUTCHours(hour)
      date.setUTCMinutes(minute)
      date.setUTCSeconds(second)
      date.setUTCMilliseconds(millisecond)
      return JsDateToIsoDateTime(date)
    } else {
      throw new Error(`Unrecognized input: ${input}`)
    }
  } else if (args.length === 2) {
    const date = isoDate(args[0])
    const time = isoTime(args[1])
    return isoDateTime({
      ...getFields(date),
      ...getFields(time)
    })
  } else if (args.length > 2) {
    const [year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0] = args
    return isoDateTime({
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond
    })
  } else {
    throw new Error(`Unrecognized input: ${args}`)
  }
}

function isDateTimeFields(input: any): input is {
  month: number
  day: number
  year: number
  hour: number
  minute?: number
  second?: number
  millisecond?: number
} {
  try {
    return (
      Object.keys(input).includes('year') &&
      Object.keys(input).includes('month') &&
      Object.keys(input).includes('day') &&
      Object.keys(input).includes('hour') &&
      Number.isFinite(input.year) &&
      Number.isFinite(input.month) &&
      Number.isFinite(input.day) &&
      Number.isFinite(input.hour) &&
      (input.minute === undefined || Number.isFinite(input.minute)) &&
      (input.second === undefined || Number.isFinite(input.second)) &&
      (input.millisecond === undefined || Number.isFinite(input.millisecond))
    )
  } catch {
    throw new Error(`Unrecognized Input: ${input}`)
  }
}

export default isoDateTime
