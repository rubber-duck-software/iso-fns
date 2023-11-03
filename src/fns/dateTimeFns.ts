import { IDateTimeFns, IDateTimeChain } from '../types'
import * as ES from '../ecmascript'
import { Iso } from '../iso-types'
import { buildDurationChain } from './durationFns'
import { buildZonedDateTimeChain } from './zonedDateTimeFns'
import { buildDateChain } from './dateFns'
import { buildYearMonthChain } from './yearMonthFns'
import { buildMonthDayChain } from './monthDayFns'
import { buildTimeChain } from './timeFns'
import format from '../format'

export const dateTimeFns: IDateTimeFns = {
  now(timeZone = ES.DefaultTimeZone()) {
    timeZone = ES.ToTemporalTimeZone(timeZone)
    return ES.BuiltinTimeZoneGetPlainDateTimeFor(timeZone, ES.SystemUTCEpochMilliSeconds())
  },
  fromNumbers(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) {
    year = ES.ToIntegerThrowOnInfinity(year)
    month = ES.ToIntegerThrowOnInfinity(month)
    day = ES.ToIntegerThrowOnInfinity(day)
    hour = ES.ToIntegerThrowOnInfinity(hour)
    minute = ES.ToIntegerThrowOnInfinity(minute)
    second = ES.ToIntegerThrowOnInfinity(second)
    millisecond = ES.ToIntegerThrowOnInfinity(millisecond)

    // Note: if the arguments are not passed,
    //       ToIntegerThrowOnInfinity(undefined) will have returned 0, which will
    //       be rejected by RejectDateTime in CreateTemporalDateTimeSlots. This
    //       check exists only to improve the error message.
    if (arguments.length < 3) {
      throw new RangeError('missing argument: isoYear, isoMonth and isoDay are required')
    }

    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  isValid(dateTime): dateTime is Iso.DateTime {
    return ES.IsTemporalDateTime(dateTime)
  },
  assertIsValid(dateTime): asserts dateTime is Iso.DateTime {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
  },
  getYear(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarYear(dateTime)
  },
  getMonth(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarMonth(dateTime)
  },
  getDay(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDay(dateTime)
  },
  getHour(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime).hour
  },
  getMinute(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime).minute
  },
  getSecond(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime).second
  },
  getMillisecond(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime).millisecond
  },
  getDayOfWeek(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDayOfWeek(dateTime)
  },
  getDayOfYear(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDayOfYear(dateTime)
  },
  getWeekOfYear(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarWeekOfYear(dateTime)
  },
  getDaysInYear(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInYear(dateTime)
  },
  getDaysInMonth(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInMonth(dateTime)
  },
  getInLeapYear(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarInLeapYear(dateTime)
  },
  with(dateTime, temporalDateTimeLike, options = {}) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    if (typeof temporalDateTimeLike !== 'object') {
      throw new TypeError('invalid argument')
    }
    if ((temporalDateTimeLike as any)['timeZone'] !== undefined) {
      throw new TypeError('withFields() does not support a timeZone property')
    }

    options = ES.GetOptionsObject(options)
    const props = ES.ToPartialRecord(temporalDateTimeLike, [
      'day',
      'hour',
      'millisecond',
      'minute',
      'month',
      'second',
      'year'
    ])
    if (!props) {
      throw new TypeError('invalid date-time-like')
    }
    let fields = ES.ToTemporalDateTimeFields(ES.GetDateTimeSlots(dateTime))
    fields = ES.CalendarMergeFields(fields, props) as any
    fields = ES.ToTemporalDateTimeFields(fields)
    const { year, month, day, hour, minute, second, millisecond } = ES.InterpretTemporalDateTimeFields(fields, options)

    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  withTime(dateTime, time = undefined) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    const { year, month, day } = ES.GetDateTimeSlots(dateTime)

    if (time === undefined) return ES.CreateTemporalDateTime(year, month, day, 0, 0, 0, 0)

    time = ES.ToTemporalTime(time)
    const { hour, minute, second, millisecond } = ES.GetTimeSlots(time)

    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  withDate(dateTime, temporalDate) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')

    temporalDate = ES.ToTemporalDate(temporalDate)
    const { year, month, day } = ES.GetDateSlots(temporalDate)

    const { hour, minute, second, millisecond } = ES.GetDateTimeSlots(dateTime)
    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  add(dateTime, temporalDurationLike, options = {}) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = duration
    options = ES.GetOptionsObject(options)
    const mySlots = ES.GetDateTimeSlots(dateTime)
    const { year, month, day, hour, minute, second, millisecond } = ES.AddDateTime(
      mySlots.year,
      mySlots.month,
      mySlots.day,
      mySlots.hour,
      mySlots.minute,
      mySlots.second,
      mySlots.millisecond,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      options
    )
    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  subtract(dateTime, temporalDurationLike, options = {}) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = duration
    options = ES.GetOptionsObject(options)
    const mySlots = ES.GetDateTimeSlots(dateTime)
    const { year, month, day, hour, minute, second, millisecond } = ES.AddDateTime(
      mySlots.year,
      mySlots.month,
      mySlots.day,
      mySlots.hour,
      mySlots.minute,
      mySlots.second,
      mySlots.millisecond,
      -years,
      -months,
      -weeks,
      -days,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      options
    )
    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  until(from, until, options = {}) {
    if (!ES.IsTemporalDateTime(from)) throw new TypeError('invalid receiver')
    until = ES.ToTemporalDateTime(until)
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond')
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('day', smallestUnit)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit)

    const thisSlots = ES.GetDateTimeSlots(from)
    const untilSlots = ES.GetDateTimeSlots(until)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.DifferenceISODateTime(
      thisSlots.year,
      thisSlots.month,
      thisSlots.day,
      thisSlots.hour,
      thisSlots.minute,
      thisSlots.second,
      thisSlots.millisecond,
      untilSlots.year,
      untilSlots.month,
      untilSlots.day,
      untilSlots.hour,
      untilSlots.minute,
      untilSlots.second,
      untilSlots.millisecond,
      largestUnit,
      options
    )

    ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      roundingIncrement,
      smallestUnit,
      roundingMode,
      from
    ))
    ;({ days, hours, minutes, seconds, milliseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      largestUnit
    ))

    return ES.CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  },
  since(dateTime, other, options = {}) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalDateTime(other)
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond')
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('day', smallestUnit)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit)

    const thisSlots = ES.GetDateTimeSlots(dateTime)
    const untilSlots = ES.GetDateTimeSlots(other)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.DifferenceISODateTime(
      thisSlots.year,
      thisSlots.month,
      thisSlots.day,
      thisSlots.hour,
      thisSlots.minute,
      thisSlots.second,
      thisSlots.millisecond,
      untilSlots.year,
      untilSlots.month,
      untilSlots.day,
      untilSlots.hour,
      untilSlots.minute,
      untilSlots.second,
      untilSlots.millisecond,
      largestUnit,
      options
    )

    ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      roundingIncrement,
      smallestUnit,
      ES.NegateTemporalRoundingMode(roundingMode),
      dateTime
    ))
    ;({ days, hours, minutes, seconds, milliseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      largestUnit
    ))

    return ES.CreateTemporalDuration(-years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds)
  },
  round(dateTime, options) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    if (options === undefined) throw new TypeError('options parameter is required')
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, undefined, ['year', 'month', 'week']) as Exclude<
      ES.TemporalSingularUnit,
      'year' | 'month' | 'week'
    >
    if (smallestUnit === undefined) throw new RangeError('smallestUnit is required')
    const roundingMode = ES.ToTemporalRoundingMode(options, 'halfExpand')
    const maximumIncrements = {
      day: 1,
      hour: 24,
      minute: 60,
      second: 60,
      millisecond: 1000
    }
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false)

    let { year, month, day, hour, minute, second, millisecond } = ES.GetDateTimeSlots(dateTime)

    ;({ year, month, day, hour, minute, second, millisecond } = ES.RoundISODateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      roundingIncrement,
      smallestUnit,
      roundingMode
    ))

    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  equals(dateTime, other) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDateTime(other)) throw new TypeError('invalid receiver')

    const slots1 = ES.GetDateTimeSlots(dateTime)
    const slots2 = ES.GetDateTimeSlots(other)

    for (const slot of ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 !== val2) return false
    }
    return true
  },
  isEqual(dateTime, other) {
    return dateTimeFns.equals(dateTime, other)
  },
  isBefore(dateTime, other) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDateTime(other)) throw new TypeError('invalid receiver')

    const slots1 = ES.GetDateTimeSlots(dateTime)
    const slots2 = ES.GetDateTimeSlots(other)

    for (const slot of ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 < val2) return true
      else if (val1 > val2) return false
    }
    return false
  },
  isAfter(dateTime, other) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDateTime(other)) throw new TypeError('invalid receiver')

    const slots1 = ES.GetDateTimeSlots(dateTime)
    const slots2 = ES.GetDateTimeSlots(other)

    for (const slot of ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 > val2) return true
      else if (val1 < val2) return false
    }
    return false
  },
  isEqualOrBefore(dateTime, other) {
    return dateTimeFns.isEqual(dateTime, other) || dateTimeFns.isBefore(dateTime, other)
  },
  isEqualOrAfter(dateTime, other) {
    return dateTimeFns.isEqual(dateTime, other) || dateTimeFns.isAfter(dateTime, other)
  },
  toZonedDateTime(dateTime, timeZone, options) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalTimeZone(timeZone)) throw new TypeError('invalid receiver')
    options = ES.GetOptionsObject(options)
    const disambiguation = ES.ToTemporalDisambiguation(options)
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dateTime, disambiguation)
    return ES.CreateTemporalZonedDateTime(instant, timeZone)
  },
  toDate(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.TemporalDateTimeToDate(dateTime)
  },
  toYearMonth(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    const fields = ES.ToTemporalYearMonthFields(ES.GetDateTimeSlots(dateTime))
    return ES.YearMonthFromFields(fields)
  },
  toMonthDay(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    const fields = ES.ToTemporalMonthDayFields(ES.GetDateTimeSlots(dateTime))
    return ES.MonthDayFromFields(fields)
  },
  toTime(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.TemporalDateTimeToTime(dateTime)
  },
  getFields(dateTime) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime)
  },

  from(item, options) {
    options = ES.GetOptionsObject(options)
    if (ES.IsTemporalDateTime(item)) {
      ES.ToTemporalOverflow(options) // validate and ignore
      const slots = ES.GetDateTimeSlots(item)
      return ES.CreateTemporalDateTime(
        slots.year,
        slots.month,
        slots.day,
        slots.hour,
        slots.minute,
        slots.second,
        slots.millisecond
      )
    }
    return ES.ToTemporalDateTime(item, options)
  },
  compare(one, two) {
    if (!ES.IsTemporalDateTime(one)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalDateTime(two)) throw new TypeError('invalid receiver')

    const slots1 = ES.GetDateTimeSlots(one)
    const slots2 = ES.GetDateTimeSlots(two)

    for (const slot of ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2)
    }
    return 0
  },
  format(dateTime, formatString) {
    if (!ES.IsTemporalDateTime(dateTime)) throw new TypeError('invalid receiver')
    return format(ES.GetDateTimeSlots(dateTime), formatString)
  },
  chain: buildDateTimeChain
}

export function buildDateTimeChain(dateTime: Iso.DateTime): IDateTimeChain {
  return {
    value() {
      return dateTime
    },
    getYear() {
      return ES.buildChain(dateTimeFns.getYear(dateTime))
    },
    getMonth() {
      return ES.buildChain(dateTimeFns.getMonth(dateTime))
    },
    getDay() {
      return ES.buildChain(dateTimeFns.getDay(dateTime))
    },
    getHour() {
      return ES.buildChain(dateTimeFns.getHour(dateTime))
    },
    getMinute() {
      return ES.buildChain(dateTimeFns.getMinute(dateTime))
    },
    getSecond() {
      return ES.buildChain(dateTimeFns.getSecond(dateTime))
    },
    getMillisecond() {
      return ES.buildChain(dateTimeFns.getMillisecond(dateTime))
    },
    getDayOfWeek() {
      return ES.buildChain(dateTimeFns.getDayOfWeek(dateTime))
    },
    getDayOfYear() {
      return ES.buildChain(dateTimeFns.getDayOfYear(dateTime))
    },
    getWeekOfYear() {
      return ES.buildChain(dateTimeFns.getWeekOfYear(dateTime))
    },
    getDaysInYear() {
      return ES.buildChain(dateTimeFns.getDaysInYear(dateTime))
    },
    getDaysInMonth() {
      return ES.buildChain(dateTimeFns.getDaysInMonth(dateTime))
    },
    getInLeapYear() {
      return ES.buildChain(dateTimeFns.getInLeapYear(dateTime))
    },
    with(temporalDateTimeLike, options) {
      return buildDateTimeChain(dateTimeFns.with(dateTime, temporalDateTimeLike, options))
    },
    withTime(time) {
      return buildDateTimeChain(dateTimeFns.withTime(dateTime, time))
    },
    withDate(temporalDate) {
      return buildDateTimeChain(dateTimeFns.withDate(dateTime, temporalDate))
    },
    add(temporalDurationLike, options) {
      return buildDateTimeChain(dateTimeFns.add(dateTime, temporalDurationLike, options))
    },
    subtract(temporalDurationLike, options) {
      return buildDateTimeChain(dateTimeFns.subtract(dateTime, temporalDurationLike, options))
    },
    until(until, options) {
      return buildDurationChain(dateTimeFns.until(dateTime, until, options))
    },
    since(other, options) {
      return buildDurationChain(dateTimeFns.since(dateTime, other, options))
    },
    round(options) {
      return buildDateTimeChain(dateTimeFns.round(dateTime, options))
    },
    equals(other) {
      return ES.buildChain(dateTimeFns.equals(dateTime, other))
    },
    isEqual(other) {
      return ES.buildChain(dateTimeFns.isEqual(dateTime, other))
    },
    isBefore(other) {
      return ES.buildChain(dateTimeFns.isBefore(dateTime, other))
    },
    isAfter(other) {
      return ES.buildChain(dateTimeFns.isBefore(dateTime, other))
    },
    isEqualOrBefore(other) {
      return ES.buildChain(dateTimeFns.isEqualOrBefore(dateTime, other))
    },
    isEqualOrAfter(other) {
      return ES.buildChain(dateTimeFns.isEqualOrAfter(dateTime, other))
    },
    toZonedDateTime(timeZone, options) {
      return buildZonedDateTimeChain(dateTimeFns.toZonedDateTime(dateTime, timeZone, options))
    },
    toDate() {
      return buildDateChain(dateTimeFns.toDate(dateTime))
    },
    toYearMonth() {
      return buildYearMonthChain(dateTimeFns.toYearMonth(dateTime))
    },
    toMonthDay() {
      return buildMonthDayChain(dateTimeFns.toMonthDay(dateTime))
    },
    toTime() {
      return buildTimeChain(dateTimeFns.toTime(dateTime))
    },
    getFields() {
      return ES.buildChain(dateTimeFns.getFields(dateTime))
    },
    format(formatString) {
      return ES.buildChain(dateTimeFns.format(dateTime, formatString))
    }
  }
}
