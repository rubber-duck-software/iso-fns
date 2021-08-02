import getEpochMilliseconds from './getEpochMilliseconds'
import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoDuration, IsoInstant, IsoTime, IsoYearMonth } from './iso-types'
import isoDate from './isoDate'
import isoDuration from './isoDuration'
import isValidDate from './isValidDate'
import isValidDateTime from './isValidDateTime'
import isValidInstant from './isValidInstant'
import isValidTime from './isValidTime'
import isValidYearMonth from './isValidYearMonth'
import round from './round'
import { BalanceDurationUnits } from './utils/balanceDuration'
import isoDateTime from './isoDateTime'

function difference(
  instantLeft: IsoInstant,
  instantRight: IsoInstant,
  options?: {
    largestUnit?: 'auto' | 'hour' | 'minute' | 'second' | 'millisecond'
    smallestUnit?: 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoDuration

function difference(
  dateTimeLeft: IsoDateTime,
  dateTimeRight: IsoDateTime,
  options?: {
    largestUnit?: 'auto' | 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    smallestUnit?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoDuration

function difference(
  dateLeft: IsoDate,
  dateRight: IsoDate,
  options?: {
    largestUnit?: 'auto' | 'year' | 'month' | 'week' | 'day'
    smallestUnit?: 'year' | 'month' | 'week' | 'day'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoDuration

function difference(
  timeLeft: IsoTime,
  timeRight: IsoTime,
  options?: {
    largestUnit?: 'auto' | 'hour' | 'minute' | 'second' | 'millisecond'
    smallestUnit?: 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoDuration

function difference(
  yearMonthLeft: IsoYearMonth,
  yearMonthRight: IsoYearMonth,
  options?: {
    largestUnit?: 'auto' | 'year' | 'month'
    smallestUnit?: 'year' | 'month'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoDuration

function difference(
  left: string,
  right: string,
  options: {
    largestUnit?: 'auto' | 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    smallestUnit?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  } = {}
): any {
  if (isValidInstant(left) && isValidInstant(right)) {
    const milliseconds = getEpochMilliseconds(right) - getEpochMilliseconds(left)
    let { largestUnit = 'hour', smallestUnit = 'millisecond', roundingIncrement = 1, roundingMode = 'trunc' } = options

    return round(isoDuration({ milliseconds }), {
      largestUnit,
      smallestUnit,
      roundingIncrement,
      roundingMode
    })
  } else if (isValidDateTime(left) && isValidDateTime(right)) {
    return DateTimeDifference(left, right, options)
  } else if (isValidDate(left) && isValidDate(right)) {
    return DateDifference(left, right, options)
  } else if (isValidTime(left) && isValidTime(right)) {
    return TimeDifference(left, right, options)
  } else if (isValidYearMonth(left) && isValidYearMonth(right)) {
    return YearMonthDifference(left, right, options)
  } else {
    throw new Error(`Invalid inputs: ${left}, ${right}`)
  }
}

function DateTimeDifference(left: IsoDateTime, right: IsoDateTime, options: any = {}): IsoDuration {
  const {
    year: year1,
    month: month1,
    day: day1,
    hour: hour1,
    minute: minute1,
    second: second1,
    millisecond: millisecond1
  } = getFields(left)
  const {
    year: year2,
    month: month2,
    day: day2,
    hour: hour2,
    minute: minute2,
    second: second2,
    millisecond: millisecond2
  } = getFields(right)
  const { largestUnit = 'auto', smallestUnit = 'millisecond', roundingIncrement = 1, roundingMode = 'trunc' } = options
  return round(
    isoDuration(
      BalanceDurationUnits(
        {
          years: year2 - year1,
          months: month2 - month1,
          days: day2 - day1,
          hours: hour2 - hour1,
          minutes: minute2 - minute1,
          seconds: second2 - second1,
          milliseconds: millisecond2 - millisecond1
        },
        largestUnit,
        left
      )
    ),
    {
      largestUnit,
      smallestUnit,
      roundingIncrement,
      roundingMode,
      relativeTo: left
    }
  )
}

function DateDifference(left: IsoDate, right: IsoDate, options: any = {}): IsoDuration {
  const { year: year1, month: month1, day: day1 } = getFields(left)
  const { year: year2, month: month2, day: day2 } = getFields(right)
  const { largestUnit = 'auto', smallestUnit = 'day', roundingIncrement = 1, roundingMode = 'trunc' } = options
  return round(
    isoDuration(
      BalanceDurationUnits(
        {
          years: year2 - year1,
          months: month2 - month1,
          days: day2 - day1
        },
        largestUnit,
        isoDateTime(left)
      )
    ),
    {
      largestUnit,
      smallestUnit,
      roundingIncrement,
      roundingMode,
      relativeTo: left
    }
  )
}

function TimeDifference(left: IsoTime, right: IsoTime, options: any = {}): IsoDuration {
  const { hour: hour1, minute: minute1, second: second1, millisecond: millisecond1 } = getFields(left)
  const { hour: hour2, minute: minute2, second: second2, millisecond: millisecond2 } = getFields(right)
  const { largestUnit = 'auto', smallestUnit = 'millisecond', roundingIncrement = 1, roundingMode = 'trunc' } = options
  return round(
    isoDuration(
      BalanceDurationUnits(
        {
          hours: hour2 - hour1,
          minutes: minute2 - minute1,
          seconds: second2 - second1,
          milliseconds: millisecond2 - millisecond1
        },
        largestUnit
      )
    ),
    {
      largestUnit,
      smallestUnit,
      roundingIncrement,
      roundingMode
    }
  )
}

function YearMonthDifference(left: IsoYearMonth, right: IsoYearMonth, options: any = {}): IsoDuration {
  const { year: year1, month: month1 } = getFields(left)
  const { year: year2, month: month2 } = getFields(right)
  const { largestUnit = 'auto', smallestUnit = 'month', roundingIncrement = 1, roundingMode = 'trunc' } = options
  return round(
    isoDuration(
      BalanceDurationUnits(
        {
          years: year2 - year1,
          months: month2 - month1
        },
        largestUnit,
        isoDateTime(isoDate(left, 1))
      )
    ),
    {
      largestUnit,
      smallestUnit,
      roundingIncrement,
      roundingMode,
      relativeTo: isoDate(left, 1)
    }
  )
}

export default difference
