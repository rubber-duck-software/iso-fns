import getFields from '../getFields'
import { IsoInstant, IsoDuration, IsoDateTime, IsoDate, IsoTime, IsoYearMonth } from '../iso-types'
import isoDuration from '../isoDuration'
import { IsoSplitter } from './isoFlexFunction'
import {
  IsoInstantToJsDate,
  JsDateToIsoInstant,
  JsDateToIsoDateTime,
  JsDateToIsoDate,
  JsDateToIsoTime,
  JsDateToIsoYearMonth
} from './jsdateConversions'
import { getDaysInMonthByNumber } from './getDaysInMonthByNumber'
import { getIsLeapByYearNumber } from './getIsLeapByYearNumber'

export function addTemporal(
  instant: IsoInstant,
  duration: {
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }
): IsoInstant
export function addTemporal(instant: IsoInstant, duration: IsoDuration): IsoInstant

export function addTemporal(
  dateTime: IsoDateTime,
  duration: {
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDateTime
export function addTemporal(
  dateTime: IsoDateTime,
  duration: IsoDuration,
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDateTime

export function addTemporal(
  date: IsoDate,
  duration: {
    years?: number
    months?: number
    weeks?: number
    days?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDate
export function addTemporal(date: IsoDate, duration: IsoDuration, options?: { overflow?: 'constrain' | 'reject' }): IsoDate

export function addTemporal(
  time: IsoTime,
  duration: {
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }
): IsoTime
export function addTemporal(time: IsoTime, duration: IsoDuration): IsoTime

export function addTemporal(
  yearMonth: IsoYearMonth,
  duration: {
    years?: number
    months?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoYearMonth
export function addTemporal(
  yearMonth: IsoYearMonth,
  duration: IsoDuration,
  options?: { overflow?: 'constrain' | 'reject' }
): IsoYearMonth

export function addTemporal(input: string, duration: any, options: { overflow?: 'constrain' | 'reject' } = {}) {
  const durationFields = getFields(isoDuration(duration))
  return IsoSplitter(input, {
    Instant(input) {
      const { overflow = 'constrain' } = options
      const jsDate = IsoInstantToJsDate(input)
      const fields = {
        year: jsDate.getUTCFullYear(),
        month: jsDate.getUTCMonth() + 1,
        day: jsDate.getUTCDate(),
        hour: jsDate.getUTCHours(),
        minute: jsDate.getUTCMinutes(),
        second: jsDate.getUTCSeconds(),
        millisecond: jsDate.getUTCMilliseconds()
      }
      return JsDateToIsoInstant(
        temporalAddHelper(fields, durationFields, { overflow }, ['days', 'weeks', 'months', 'years'])
      )
    },
    DateTime(input) {
      const { overflow = 'constrain' } = options
      return JsDateToIsoDateTime(temporalAddHelper(getFields(input), durationFields, { overflow }))
    },
    Date(input) {
      const { overflow = 'constrain' } = options
      return JsDateToIsoDate(
        temporalAddHelper(getFields(input), durationFields, { overflow }, ['hours', 'minutes', 'seconds', 'milliseconds'])
      )
    },
    Time(input) {
      const { overflow = 'constrain' } = options
      return JsDateToIsoTime(
        temporalAddHelper(getFields(input), durationFields, { overflow }, ['days', 'weeks', 'months', 'years'])
      )
    },
    YearMonth(input) {
      const { overflow = 'constrain' } = options
      return JsDateToIsoYearMonth(
        temporalAddHelper(getFields(input), durationFields, { overflow }, [
          'hours',
          'minutes',
          'seconds',
          'milliseconds',
          'days',
          'weeks'
        ])
      )
    }
  })
}

function temporalAddHelper(
  { year = 1970, month = 1, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0 },
  durationFields: {
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  },
  { overflow }: { overflow: 'constrain' | 'reject' },
  unsupportedKeys: ('years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds')[] = []
) {
  const {
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0
  } = durationFields
  if (unsupportedKeys.some((key) => durationFields[key])) {
    throw new Error(`Unsupported field ${unsupportedKeys.find((key) => durationFields[key])} on duration`)
  }

  const jsDate = new Date(0)
  jsDate.setUTCFullYear(year + years)
  jsDate.setUTCMonth(month + months - 1)

  const newYear = jsDate.getUTCFullYear()
  const newMonth = jsDate.getUTCMonth() + 1

  const maxDays = getDaysInMonthByNumber(newMonth, getIsLeapByYearNumber(newYear))
  if (day > maxDays && overflow === 'constrain') {
    day = maxDays
  } else if (day > maxDays && overflow === 'reject') {
    throw new RangeError(`${newYear}-${newMonth} does not have ${day} days.`)
  }

  jsDate.setUTCDate(day + 7 * weeks + days)
  jsDate.setUTCHours(hour + hours)
  jsDate.setUTCMinutes(minute + minutes)
  jsDate.setUTCSeconds(second + seconds)
  jsDate.setUTCMilliseconds(millisecond + milliseconds)
  return jsDate
}
