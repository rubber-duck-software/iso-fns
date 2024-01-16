import { IDateChain, IDateFns } from '../types'
import * as ES from '../ecmascript'
import { Iso } from '../iso-types'
import { buildDurationChain } from './durationFns'
import { buildDateTimeChain } from './dateTimeFns'
import { buildZonedDateTimeChain } from './zonedDateTimeFns'
import { buildYearMonthChain } from './yearMonthFns'
import { buildMonthDayChain } from './monthDayFns'
import format from '../format'

const DISALLOWED_UNITS: ES.TemporalSingularUnit[] = ['hour', 'minute', 'second', 'millisecond']

export const dateFns: IDateFns = {
  now(timeZone = ES.DefaultTimeZone()) {
    timeZone = ES.ToTemporalTimeZone(timeZone)
    return ES.TemporalDateTimeToDate(ES.BuiltinTimeZoneGetPlainDateTimeFor(timeZone, ES.SystemUTCEpochMilliSeconds()))
  },
  fromNumbers(year, month, day) {
    year = ES.ToIntegerThrowOnInfinity(year)
    month = ES.ToIntegerThrowOnInfinity(month)
    day = ES.ToIntegerThrowOnInfinity(day)

    // Note: if the arguments are not passed,
    //       ToIntegerThrowOnInfinity(undefined) will have returned 0, which will
    //       be rejected by RejectISODate in CreateTemporalDateSlots. This check
    //       exists only to improve the error message.
    if (arguments.length < 3) {
      throw new RangeError('missing argument: isoYear, isoMonth and isoDay are required')
    }

    return ES.CreateTemporalDate(year, month, day)
  },
  isValid(date): date is Iso.Date {
    return ES.IsTemporalDate(date)
  },
  assertIsValid(date): asserts date is Iso.Date {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
  },
  getYear(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarYear(date)
  },
  getMonth(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarMonth(date)
  },
  getDay(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarDay(date)
  },
  getDayOfWeek(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarDayOfWeek(date)
  },
  getDayOfYear(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarDayOfYear(date)
  },
  getWeekOfYear(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarWeekOfYear(date)
  },
  getDaysInMonth(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInMonth(date)
  },
  getDaysInYear(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInYear(date)
  },
  inLeapYear(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.CalendarInLeapYear(date)
  },
  with(date, temporalDateLike, options = undefined) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    if (typeof temporalDateLike !== 'object') {
      throw new TypeError('invalid argument')
    }
    if ((temporalDateLike as any).timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property')
    }

    const props = ES.ToPartialRecord(temporalDateLike, ['day', 'month', 'year'])
    if (!props) {
      throw new TypeError('invalid date-like')
    }
    let fields = ES.ToTemporalDateFields(ES.GetDateSlots(date))
    fields = ES.CalendarMergeFields(fields, props) as any
    fields = ES.ToTemporalDateFields(fields)

    options = ES.GetOptionsObject(options)

    return ES.DateFromFields(fields, options)
  },
  add(date, temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')

    const duration = ES.ToTemporalDuration(temporalDurationLike)
    options = ES.GetOptionsObject(options)

    return ES.CalendarDateAdd(date, duration, options)
  },
  subtract(date, temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')

    const duration = ES.CreateNegatedTemporalDuration(ES.ToTemporalDuration(temporalDurationLike))
    options = ES.GetOptionsObject(options)

    return ES.CalendarDateAdd(date, duration, options)
  },
  until(date, other, options = undefined) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid receiver')

    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'day', DISALLOWED_UNITS)
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('day', smallestUnit)
    const largestUnit = ES.ToLargestTemporalUnit(
      options,
      'auto',
      DISALLOWED_UNITS,
      defaultLargestUnit
    ) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false)

    const untilOptions = { ...options, largestUnit }
    const result = ES.CalendarDateUntil(date, other, untilOptions)
    if (smallestUnit === 'day' && roundingIncrement === 1) return result

    let { years, months, weeks, days } = ES.GetDurationSlots(result)
    const dateSlots = ES.GetDateSlots(date)
    const relativeTo = ES.CreateTemporalDateTime(dateSlots.year, dateSlots.month, dateSlots.day, 0, 0, 0, 0)
    ;({ years, months, weeks, days } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      0,
      0,
      0,
      0,
      roundingIncrement,
      smallestUnit,
      roundingMode,
      relativeTo
    ))
    return ES.CreateTemporalDuration(years, months, weeks, days, 0, 0, 0, 0)
  },
  since(date, other, options = undefined) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid receiver')

    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'day', DISALLOWED_UNITS)
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('day', smallestUnit)
    const largestUnit = ES.ToLargestTemporalUnit(
      options,
      'auto',
      DISALLOWED_UNITS,
      defaultLargestUnit
    ) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false)

    const untilOptions = { ...options, largestUnit }
    let { years, months, weeks, days } = ES.GetDurationSlots(ES.CalendarDateUntil(date, other, untilOptions))
    if (smallestUnit === 'day' && roundingIncrement === 1) {
      return ES.CreateTemporalDuration(-years, -months, -weeks, -days, 0, 0, 0, 0)
    }
    const dateSlots = ES.GetDateSlots(date)
    const relativeTo = ES.CreateTemporalDateTime(dateSlots.year, dateSlots.month, dateSlots.day, 0, 0, 0, 0)
    ;({ years, months, weeks, days } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      0,
      0,
      0,
      0,
      roundingIncrement,
      smallestUnit,
      ES.NegateTemporalRoundingMode(roundingMode),
      relativeTo
    ))

    return ES.CreateTemporalDuration(-years, -months, -weeks, -days, 0, 0, 0, 0)
  },
  equals(date, other) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid receiver')
    const slots1 = ES.GetSlots(date)
    const slots2 = ES.GetSlots(other)

    for (const slot of ['year', 'month', 'day'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 !== val2) return false
    }
    return true
  },
  isEqual(date, other) {
    return dateFns.equals(date, other)
  },
  isBefore(date, other) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid receiver')
    const slots1 = ES.GetSlots(date)
    const slots2 = ES.GetSlots(other)

    for (const slot of ['year', 'month', 'day'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 < val2) return true
      else if (val1 > val2) return false
    }
    return false
  },
  isAfter(date, other) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid receiver')
    const slots1 = ES.GetSlots(date)
    const slots2 = ES.GetSlots(other)

    for (const slot of ['year', 'month', 'day'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 > val2) return true
      else if (val1 < val2) return false
    }
    return false
  },
  isEqualOrBefore(date, other) {
    return dateFns.isEqual(date, other) || dateFns.isBefore(date, other)
  },
  isEqualOrAfter(date, other) {
    return dateFns.isEqual(date, other) || dateFns.isAfter(date, other)
  },
  toDateTime(date, time = undefined) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    const { year, month, day } = ES.GetDateSlots(date)

    if (time === undefined) return ES.CreateTemporalDateTime(year, month, day, 0, 0, 0, 0)

    time = ES.ToTemporalTime(time)
    const { hour, minute, second, millisecond } = ES.GetTimeSlots(time)

    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  toZonedDateTime(date, item) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    if (typeof item !== 'object') throw new TypeError('invalid receiver')
    const timeZone = ES.ToTemporalTimeZone(item.timeZone)
    if (!ES.IsTemporalTimeZone(timeZone)) throw new TypeError('invalid receiver')

    const { year, month, day } = ES.GetDateSlots(date)

    let hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
      microsecond = 0,
      nanosecond = 0
    if (item.time !== undefined) {
      const time = ES.ToTemporalTime(item.time)
      ;({ hour, minute, second, millisecond } = ES.GetTimeSlots(time))
    }

    const dt = ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible')
    return ES.CreateTemporalZonedDateTime(instant, timeZone)
  },
  toYearMonth(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    const fields = ES.ToTemporalYearMonthFields(ES.GetDateSlots(date))
    return ES.YearMonthFromFields(fields)
  },
  toMonthDay(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    const fields = ES.ToTemporalMonthDayFields(ES.GetDateSlots(date))
    return ES.MonthDayFromFields(fields)
  },
  getFields(date) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return ES.GetDateSlots(date)
  },
  from(item, options = undefined) {
    options = ES.GetOptionsObject(options)
    if (ES.IsTemporalDate(item)) {
      ES.ToTemporalOverflow(options) // validate and ignore
      const { year, month, day } = ES.GetDateSlots(item)
      return ES.CreateTemporalDate(year, month, day)
    }
    return ES.ToTemporalDate(item, options)
  },
  compare(one, two) {
    if (!ES.IsTemporalDate(one)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDate(two)) throw new TypeError('invalid receiver')
    const oneSlots = ES.GetDateSlots(one)
    const twoSlots = ES.GetDateSlots(two)

    return ES.CompareISODate(oneSlots.year, oneSlots.month, oneSlots.day, twoSlots.year, twoSlots.month, twoSlots.day)
  },
  format(date, formatString) {
    if (!ES.IsTemporalDate(date)) throw new TypeError('invalid receiver')
    return format(ES.GetDateSlots(date), formatString)
  },
  chain: buildDateChain
}

export function buildDateChain(date: Iso.Date): IDateChain {
  return {
    value() {
      return date
    },
    getYear() {
      return ES.buildChain(dateFns.getYear(date))
    },
    getMonth() {
      return ES.buildChain(dateFns.getMonth(date))
    },
    getDay() {
      return ES.buildChain(dateFns.getDay(date))
    },
    getDayOfWeek() {
      return ES.buildChain(dateFns.getDayOfWeek(date))
    },
    getDayOfYear() {
      return ES.buildChain(dateFns.getDayOfYear(date))
    },
    getWeekOfYear() {
      return ES.buildChain(dateFns.getWeekOfYear(date))
    },
    getDaysInMonth() {
      return ES.buildChain(dateFns.getDaysInMonth(date))
    },
    getDaysInYear() {
      return ES.buildChain(dateFns.getDaysInYear(date))
    },
    inLeapYear() {
      return ES.buildChain(dateFns.inLeapYear(date))
    },
    with(temporalDateLike, options) {
      return buildDateChain(dateFns.with(date, temporalDateLike, options))
    },
    add(temporalDurationLike, options) {
      return buildDateChain(dateFns.add(date, temporalDurationLike, options))
    },
    subtract(temporalDurationLike, options) {
      return buildDateChain(dateFns.subtract(date, temporalDurationLike, options))
    },
    until(other, options) {
      return buildDurationChain(dateFns.until(date, other, options))
    },
    since(other, options) {
      return buildDurationChain(dateFns.since(date, other, options))
    },
    equals(other) {
      return ES.buildChain(dateFns.equals(date, other))
    },
    isEqual(other) {
      return ES.buildChain(dateFns.isEqual(date, other))
    },
    isBefore(other) {
      return ES.buildChain(dateFns.isBefore(date, other))
    },
    isAfter(other) {
      return ES.buildChain(dateFns.isAfter(date, other))
    },
    isEqualOrBefore(other) {
      return ES.buildChain(dateFns.isEqualOrBefore(date, other))
    },
    isEqualOrAfter(other) {
      return ES.buildChain(dateFns.isEqualOrAfter(date, other))
    },
    toDateTime(time) {
      return buildDateTimeChain(dateFns.toDateTime(date, time))
    },
    toZonedDateTime(item) {
      return buildZonedDateTimeChain(dateFns.toZonedDateTime(date, item))
    },
    toYearMonth() {
      return buildYearMonthChain(dateFns.toYearMonth(date))
    },
    toMonthDay() {
      return buildMonthDayChain(dateFns.toMonthDay(date))
    },
    getFields() {
      return ES.buildChain(dateFns.getFields(date))
    },
    format(formatString) {
      return ES.buildChain(dateFns.format(date, formatString))
    }
  }
}
