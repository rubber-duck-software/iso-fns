import {
  IsoDateTimeToJsDate,
  IsoDateToJsDate,
  IsoMonthDayToJsDate,
  IsoTimeToJsDate,
  IsoYearMonthToJsDate,
  JsDateToIsoDate,
  JsDateToIsoDateTime,
  JsDateToIsoMonthDay,
  JsDateToIsoTime,
  JsDateToIsoYearMonth
} from './utils/jsdateConversions'
import { IsoDate, IsoDateTime, IsoDuration, IsoMonthDay, IsoTime, IsoYearMonth } from './iso-types'
import getFields from './getFields'
import { IsoSplitter } from './utils/isoFlexFunction'
import duration from './isoDuration'
import { getDaysInMonthByNumber } from './utils/getDaysInMonthByNumber'
import { getIsLeapByYearNumber } from './utils/getIsLeapByYearNumber'

export default function withFields(
  dateTime: IsoDateTime,
  values: {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
    millisecond?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDateTime

export default function withFields(
  date: IsoDate,
  values: { year?: number; month?: number; day?: number },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDate

export default function withFields(
  time: IsoTime,
  values: { hour?: number; minute?: number; second?: number; millisecond?: number },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoTime

export default function withFields(
  yearMonth: IsoYearMonth,
  values: {
    year?: number
    month?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoYearMonth

export default function withFields(
  monthDay: IsoMonthDay,
  values: {
    month?: number
    day?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoMonthDay

export default function withFields(
  duration: IsoDuration,
  values: {
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }
): IsoDuration

export default function withFields(
  input: string,
  values: Record<string, number>,
  options: { overflow?: 'constrain' | 'reject' } = {}
): any {
  const fieldKeys = Object.keys(values).filter((key) => Number.isFinite(values[key]))
  const fields = fieldKeys.reduce((acc, cur) => ({ ...acc, [cur]: values[cur] }), {} as Record<string, number>)

  return IsoSplitter(input, {
    DateTime(input) {
      const { overflow = 'constrain' } = options
      const jsDate = setTemporalFields(IsoDateTimeToJsDate(input), { overflow }, fields)
      return JsDateToIsoDateTime(jsDate)
    },
    Date(input) {
      const { overflow = 'constrain' } = options
      const jsDate = setTemporalFields(IsoDateToJsDate(input), { overflow }, fields)
      return JsDateToIsoDate(jsDate)
    },
    Time(input) {
      const { overflow = 'constrain' } = options
      const jsDate = setTemporalFields(IsoTimeToJsDate(input), { overflow }, fields)
      return JsDateToIsoTime(jsDate)
    },
    YearMonth(input) {
      const { overflow = 'constrain' } = options
      const jsDate = setTemporalFields(IsoYearMonthToJsDate(input), { overflow }, fields)
      return JsDateToIsoYearMonth(jsDate)
    },
    MonthDay(input) {
      const { overflow = 'constrain' } = options
      const jsDate = setTemporalFields(IsoMonthDayToJsDate(input), { overflow }, fields)
      return JsDateToIsoMonthDay(jsDate)
    },
    Duration(input) {
      return duration({
        ...getFields(input),
        ...fields
      })
    }
  })
}

function setTemporalFields(
  jsDate: Date,
  options: {
    overflow: 'constrain' | 'reject'
  },
  {
    year = jsDate.getUTCFullYear(),
    month = jsDate.getUTCMonth() + 1,
    day = jsDate.getUTCDate(),
    hour = jsDate.getUTCHours(),
    minute = jsDate.getUTCMinutes(),
    second = jsDate.getUTCSeconds(),
    millisecond = jsDate.getUTCSeconds()
  }
) {
  const dateClone = new Date(jsDate.toISOString())

  dateClone.setUTCDate(1)
  dateClone.setUTCFullYear(year)
  dateClone.setUTCMonth(month - 1)
  const maxDays = getDaysInMonthByNumber(dateClone.getUTCMonth() + 1, getIsLeapByYearNumber(dateClone.getUTCFullYear()))
  if (day > maxDays && options.overflow === 'constrain') {
    day = maxDays
  } else if (day > maxDays && options.overflow === 'reject') {
    throw new RangeError(`${year}-${month} does not have ${day} days.`)
  }
  dateClone.setUTCMilliseconds(millisecond)
  dateClone.setUTCSeconds(second)
  dateClone.setUTCMinutes(minute)
  dateClone.setUTCHours(hour)
  dateClone.setUTCDate(day)
  return dateClone
}
