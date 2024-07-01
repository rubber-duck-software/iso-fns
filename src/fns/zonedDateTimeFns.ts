import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IZonedDateTimeFns, IZonedDateTimeChain } from '../types'
import { buildDurationChain } from './durationFns'
import { buildInstantChain } from './instantFns'
import { buildDateChain } from './dateFns'
import { buildTimeChain } from './timeFns'
import { buildDateTimeChain } from './dateTimeFns'
import { buildYearMonthChain } from './yearMonthFns'
import { buildMonthDayChain } from './monthDayFns'
import format from '../format'

export const zonedDateTimeFns: IZonedDateTimeFns = {
  now(timeZone = ES.DefaultTimeZone()) {
    timeZone = ES.ToTemporalTimeZone(timeZone)
    return ES.CreateTemporalZonedDateTime(ES.SystemUTCEpochMilliSeconds(), timeZone)
  },
  currentTimeZone() {
    return ES.DefaultTimeZone()
  },
  fromEpochMilliseconds(epochMilliseconds, timeZone) {
    // Note: if the argument is not passed, ToBigInt(undefined) will throw. This check exists only
    //       to improve the error message.
    //       ToTemporalTimeZone(undefined) will end up calling TimeZone.from("undefined"), which
    //       could succeed.
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochMilliseconds is required')
    }
    timeZone = ES.ToTemporalTimeZone(timeZone)

    return ES.CreateTemporalZonedDateTime(epochMilliseconds, timeZone)
  },
  isValid(zonedDateTime): zonedDateTime is Iso.ZonedDateTime {
    return ES.IsTemporalZonedDateTime(zonedDateTime)
  },
  assertIsValid(zonedDateTime): asserts zonedDateTime is Iso.ZonedDateTime {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
  },
  getTimeZone(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.GetZonedDateTimeSlots(zonedDateTime).timeZone
  },
  getYear(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarYear(dateTime(zonedDateTime))
  },
  getMonth(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarMonth(dateTime(zonedDateTime))
  },
  getDay(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDay(dateTime(zonedDateTime))
  },
  getHour(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime(zonedDateTime)).hour
  },
  getMinute(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime(zonedDateTime)).minute
  },
  getSecond(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime(zonedDateTime)).second
  },
  getMillisecond(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.GetDateTimeSlots(dateTime(zonedDateTime)).millisecond
  },
  getEpochSeconds(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const { epochMilliseconds } = ES.GetZonedDateTimeSlots(zonedDateTime)
    return Math.floor(+epochMilliseconds / 1e3)
  },
  getEpochMilliseconds(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const { epochMilliseconds } = ES.GetZonedDateTimeSlots(zonedDateTime)
    return epochMilliseconds
  },
  getDayOfWeek(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDayOfWeek(dateTime(zonedDateTime))
  },
  getDayOfYear(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDayOfYear(dateTime(zonedDateTime))
  },
  getWeekOfYear(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarWeekOfYear(dateTime(zonedDateTime))
  },
  getHoursInDay(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const dt = dateTime(zonedDateTime)
    const { year, month, day } = ES.GetDateTimeSlots(dt)
    const today = ES.CreateTemporalDateTime(year, month, day, 0, 0, 0, 0)
    const tomorrowFields = ES.AddISODate(year, month, day, 0, 0, 0, 1, 'reject')
    const tomorrow = ES.CreateTemporalDateTime(tomorrowFields.year, tomorrowFields.month, tomorrowFields.day, 0, 0, 0, 0)
    const timeZone = ES.GetSlots(zonedDateTime).timeZone
    const todayMs = ES.BuiltinTimeZoneGetInstantFor(timeZone, today, 'compatible')
    const tomorrowMs = ES.BuiltinTimeZoneGetInstantFor(timeZone, tomorrow, 'compatible')
    return (tomorrowMs - todayMs) / 3.6e6
  },
  getDaysInMonth(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInMonth(dateTime(zonedDateTime))
  },
  getDaysInYear(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInYear(dateTime(zonedDateTime))
  },
  inLeapYear(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CalendarInLeapYear(dateTime(zonedDateTime))
  },
  getOffset(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const slots = ES.GetZonedDateTimeSlots(zonedDateTime)
    return ES.BuiltinTimeZoneGetOffsetStringFor(slots.timeZone, slots.epochMilliseconds)
  },
  getOffsetMilliseconds(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const slots = ES.GetZonedDateTimeSlots(zonedDateTime)
    return ES.GetOffsetMillisecondsFor(slots.timeZone, slots.epochMilliseconds)
  },
  with(zonedDateTime, zonedDateTimeLike, options = {}) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    if (typeof zonedDateTimeLike !== 'object') {
      throw new TypeError('invalid zoned-date-time-like')
    }
    if ((zonedDateTimeLike as any)['timeZone'] !== undefined) {
      throw new TypeError('timeZone invalid for with(). use withTimeZone()')
    }

    options = ES.GetOptionsObject(options)
    const disambiguation = ES.ToTemporalDisambiguation(options)
    const offset = ES.ToTemporalOffset(options, 'prefer')

    const timeZone = ES.GetZonedDateTimeSlots(zonedDateTime).timeZone

    const props = ES.ToPartialRecord(zonedDateTimeLike, [
      'day',
      'hour',
      'millisecond',
      'minute',
      'month',
      'second',
      'year',
      'offset'
    ])
    if (!props) {
      throw new TypeError('invalid zoned-date-time-like')
    }
    let fields = ES.ToTemporalZonedDateTimeFields(ES.GetZonedDateTimeSlots(zonedDateTime))
    fields = ES.CalendarMergeFields(fields, props) as any
    fields = ES.ToTemporalZonedDateTimeFields(fields)
    let { year, month, day, hour, minute, second, millisecond } = ES.InterpretTemporalDateTimeFields(fields, options)
    const offsetMs = ES.ParseOffsetString(fields.offset)
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      'option',
      offsetMs as number,
      timeZone,
      disambiguation,
      offset
    )
    const result = ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone)
    return result
  },
  withDate(zonedDateTime, date) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')

    date = ES.ToTemporalDate(date)
    const { year, month, day } = ES.GetDateSlots(date)
    const thisDt = dateTime(zonedDateTime)
    const { hour, minute, second, millisecond } = ES.GetDateTimeSlots(thisDt)

    const timeZone = ES.GetZonedDateTimeSlots(zonedDateTime).timeZone
    const dt = ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible')
    return ES.CreateTemporalZonedDateTime(instant, timeZone)
  },
  withTime(zonedDateTime, time) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')

    const isoTime = time == undefined ? ES.CreateTemporalTime(0, 0, 0, 0) : ES.ToTemporalTime(time)

    const thisDt = dateTime(zonedDateTime)
    const { year, month, day } = ES.GetDateTimeSlots(thisDt)
    const { hour, minute, second, millisecond } = ES.GetTimeSlots(isoTime)

    const timeZone = ES.GetZonedDateTimeSlots(zonedDateTime).timeZone
    const dt = ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible')
    return ES.CreateTemporalZonedDateTime(instant, timeZone)
  },
  withTimeZone(zonedDateTime, timeZone) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    timeZone = ES.ToTemporalTimeZone(timeZone)
    const { epochMilliseconds } = ES.GetZonedDateTimeSlots(zonedDateTime)
    return ES.CreateTemporalZonedDateTime(epochMilliseconds, timeZone)
  },
  add(zonedDateTime, temporalDurationLike, options = {}) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds } = duration
    options = ES.GetOptionsObject(options)

    const { timeZone, epochMilliseconds } = ES.GetZonedDateTimeSlots(zonedDateTime)
    const ms = ES.AddZonedDateTime(
      epochMilliseconds,
      timeZone,
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
    return ES.CreateTemporalZonedDateTime(ms, timeZone)
  },
  subtract(zonedDateTime, temporalDurationLike, options = {}) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    const { years, months, weeks, days, hours, minutes, seconds, milliseconds } = duration
    options = ES.GetOptionsObject(options)

    const { timeZone, epochMilliseconds } = ES.GetZonedDateTimeSlots(zonedDateTime)
    const epochNanoseconds = ES.AddZonedDateTime(
      epochMilliseconds,
      timeZone,
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
    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone)
  },
  until(zonedDateTime, other, options = {}) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalZonedDateTime(other)

    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond')
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('hour', smallestUnit as ES.TemporalSingularUnit)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit as ES.TemporalSingularUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit as ES.TemporalSingularUnit)

    const { epochMilliseconds: ms1, timeZone } = ES.GetZonedDateTimeSlots(zonedDateTime)
    const { epochMilliseconds: ms2, timeZone: otherTimeZone } = ES.GetZonedDateTimeSlots(other)
    let years, months, weeks, days, hours, minutes, seconds, milliseconds
    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
      // The user is only asking for a time difference, so return difference of instants.
      years = 0
      months = 0
      weeks = 0
      days = 0
      ;({ seconds, milliseconds } = ES.DifferenceInstant(ms1, ms2, roundingIncrement, smallestUnit as any, roundingMode))
      ;({ hours, minutes, seconds, milliseconds } = ES.BalanceDuration(0, 0, 0, seconds, milliseconds, largestUnit))
    } else {
      if (!ES.TimeZoneEquals(timeZone, otherTimeZone)) {
        throw new RangeError(
          "When calculating difference between time zones, largestUnit must be 'hours' " +
            'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
        )
      }
      const untilOptions = { ...options, largestUnit }
      ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.DifferenceZonedDateTime(
        ms1,
        ms2,
        timeZone,
        largestUnit,
        untilOptions
      ))
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
        zonedDateTime
      ))
      ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.AdjustRoundedDurationDays(
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        roundingIncrement,
        smallestUnit as ES.TemporalSingularUnit,
        roundingMode,
        zonedDateTime
      ))
    }
    return ES.CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  },
  since(zonedDateTime, other, options = {}) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalZonedDateTime(other)
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond')
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('hour', smallestUnit as ES.TemporalSingularUnit)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', [], defaultLargestUnit) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit as ES.TemporalSingularUnit)
    let roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    roundingMode = ES.NegateTemporalRoundingMode(roundingMode)
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit as ES.TemporalSingularUnit)

    const { epochMilliseconds: ms1, timeZone } = ES.GetZonedDateTimeSlots(zonedDateTime)
    const { epochMilliseconds: ms2, timeZone: otherTimeZone } = ES.GetZonedDateTimeSlots(other)
    let years, months, weeks, days, hours, minutes, seconds, milliseconds
    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
      // The user is only asking for a time difference, so return difference of instants.
      years = 0
      months = 0
      weeks = 0
      days = 0
      ;({ seconds, milliseconds } = ES.DifferenceInstant(ms1, ms2, roundingIncrement, smallestUnit as any, roundingMode))
      ;({ hours, minutes, seconds, milliseconds } = ES.BalanceDuration(0, 0, 0, seconds, milliseconds, largestUnit))
    } else {
      if (!ES.TimeZoneEquals(timeZone, otherTimeZone)) {
        throw new RangeError(
          "When calculating difference between time zones, largestUnit must be 'hours' " +
            'or smaller because day lengths can vary between time zones due to DST or time zone offset changes.'
        )
      }
      const untilOptions = { ...options, largestUnit }
      ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.DifferenceZonedDateTime(
        ms1,
        ms2,
        timeZone,
        largestUnit,
        untilOptions
      ))
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
        zonedDateTime
      ))
      ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.AdjustRoundedDurationDays(
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        roundingIncrement,
        smallestUnit as ES.TemporalSingularUnit,
        roundingMode,
        zonedDateTime
      ))
    }

    return ES.CreateTemporalDuration(-years, -months, -weeks, -days, -hours, -minutes, -seconds, -milliseconds)
  },
  round(zonedDateTime, options) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
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
      millisecond: 1000,
      microsecond: 1000,
      nanosecond: 1000
    }
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false)

    // first, round the underlying DateTime fields
    const dt = dateTime(zonedDateTime)
    let { year, month, day, hour, minute, second, millisecond } = ES.GetDateTimeSlots(dt)
    const { timeZone, epochMilliseconds } = ES.GetZonedDateTimeSlots(zonedDateTime)

    const dtStart = ES.CreateTemporalDateTime(year, month, day, 0, 0, 0, 0)
    const instantStart = ES.BuiltinTimeZoneGetInstantFor(timeZone, dtStart, 'compatible')
    const endMs = ES.AddZonedDateTime(instantStart, timeZone, 0, 0, 0, 1, 0, 0, 0, 0)
    const dayLengthMs = endMs - instantStart
    if (dayLengthMs === 0) {
      throw new RangeError('cannot round a ZonedDateTime in a calendar with zero-length days')
    }
    ;({ year, month, day, hour, minute, second, millisecond } = ES.RoundISODateTime(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      roundingIncrement,
      smallestUnit as any,
      roundingMode,
      dayLengthMs
    ))

    // Now reset all DateTime fields but leave the TimeZone. The offset will
    // also be retained if the new date/time values are still OK with the old
    // offset. Otherwise the offset will be changed to be compatible with the
    // new date/time values. If DST disambiguation is required, the `compatible`
    // disambiguation algorithm will be used.
    const offsetNs = ES.GetOffsetMillisecondsFor(timeZone, epochMilliseconds)
    const epochNanoseconds = ES.InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      'option',
      offsetNs,
      timeZone,
      'compatible',
      'prefer'
    )

    return ES.CreateTemporalZonedDateTime(epochNanoseconds, timeZone)
  },
  equals(zonedDateTime, other): boolean {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalZonedDateTime(other)) throw new TypeError('invalid receiver')
    const one = ES.GetZonedDateTimeSlots(zonedDateTime)
    const two = ES.GetZonedDateTimeSlots(other)
    return one.epochMilliseconds === two.epochMilliseconds && ES.TimeZoneEquals(one.timeZone, two.timeZone)
  },
  startOfDay(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const dt = ES.GetDateTimeSlots(dateTime(zonedDateTime))

    const dtStart = ES.CreateTemporalDateTime(dt.year, dt.month, dt.day, 0, 0, 0, 0)
    const { timeZone } = ES.GetZonedDateTimeSlots(zonedDateTime)
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dtStart, 'compatible')
    return ES.CreateTemporalZonedDateTime(instant, timeZone)
  },
  toInstant(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.CreateTemporalInstant(ES.GetZonedDateTimeSlots(zonedDateTime).epochMilliseconds)
  },
  toDate(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.TemporalDateTimeToDate(dateTime(zonedDateTime))
  },
  toTime(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return ES.TemporalDateTimeToTime(dateTime(zonedDateTime))
  },
  toDateTime(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return dateTime(zonedDateTime)
  },
  toYearMonth(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const fields = ES.ToTemporalYearMonthFields(ES.GetDateTimeSlots(dateTime(zonedDateTime)))
    return ES.YearMonthFromFields(fields)
  },
  toMonthDay(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const fields = ES.ToTemporalMonthDayFields(ES.GetDateTimeSlots(dateTime(zonedDateTime)))
    return ES.MonthDayFromFields(fields)
  },
  getFields(zonedDateTime) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    const dt = ES.GetSlots(dateTime(zonedDateTime))
    const { timeZone, epochMilliseconds } = ES.GetZonedDateTimeSlots(zonedDateTime)
    return {
      day: dt.day,
      hour: dt.hour,
      millisecond: dt.millisecond,
      minute: dt.minute,
      month: dt.month,
      second: dt.second,
      year: dt.year,
      offset: ES.BuiltinTimeZoneGetOffsetStringFor(timeZone, epochMilliseconds),
      timeZone
    }
  },
  from(item, options = {}) {
    options = ES.GetOptionsObject(options)
    if (ES.IsTemporalZonedDateTime(item)) {
      ES.ToTemporalOverflow(options) // validate and ignore
      ES.ToTemporalDisambiguation(options)
      ES.ToTemporalOffset(options, 'reject')
      const { epochMilliseconds, timeZone } = ES.GetZonedDateTimeSlots(item)
      return ES.CreateTemporalZonedDateTime(epochMilliseconds, timeZone)
    }
    return ES.ToTemporalZonedDateTime(item, options)
  },
  compare(one, two) {
    if (!ES.IsTemporalZonedDateTime(one)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalZonedDateTime(two)) throw new TypeError('invalid receiver')
    const ms1 = ES.GetZonedDateTimeSlots(one).epochMilliseconds
    const ms2 = ES.GetZonedDateTimeSlots(two).epochMilliseconds
    if (ms1 < ms2) return -1
    if (ms1 > ms2) return 1
    return 0
  },
  format(zonedDateTime, formatString) {
    if (!ES.IsTemporalZonedDateTime(zonedDateTime)) throw new TypeError('invalid receiver')
    return format(ES.GetZonedDateTimeSlots(zonedDateTime), formatString)
  },
  chain: buildZonedDateTimeChain
}

function dateTime(zdt: Iso.ZonedDateTime): Iso.DateTime {
  const slots = ES.GetZonedDateTimeSlots(zdt)
  return ES.BuiltinTimeZoneGetPlainDateTimeFor(slots.timeZone, slots.epochMilliseconds)
}

export function buildZonedDateTimeChain(zonedDateTime: Iso.ZonedDateTime): IZonedDateTimeChain {
  return {
    value() {
      return zonedDateTime
    },
    getTimeZone() {
      return ES.buildChain(zonedDateTimeFns.getTimeZone(zonedDateTime))
    },
    getYear() {
      return ES.buildChain(zonedDateTimeFns.getYear(zonedDateTime))
    },
    getMonth() {
      return ES.buildChain(zonedDateTimeFns.getMonth(zonedDateTime))
    },
    getDay() {
      return ES.buildChain(zonedDateTimeFns.getDay(zonedDateTime))
    },
    getHour() {
      return ES.buildChain(zonedDateTimeFns.getHour(zonedDateTime))
    },
    getMinute() {
      return ES.buildChain(zonedDateTimeFns.getMinute(zonedDateTime))
    },
    getSecond() {
      return ES.buildChain(zonedDateTimeFns.getSecond(zonedDateTime))
    },
    getMillisecond() {
      return ES.buildChain(zonedDateTimeFns.getMillisecond(zonedDateTime))
    },
    getEpochSeconds() {
      return ES.buildChain(zonedDateTimeFns.getEpochSeconds(zonedDateTime))
    },
    getEpochMilliseconds() {
      return ES.buildChain(zonedDateTimeFns.getEpochMilliseconds(zonedDateTime))
    },
    getDayOfWeek() {
      return ES.buildChain(zonedDateTimeFns.getDayOfWeek(zonedDateTime))
    },
    getDayOfYear() {
      return ES.buildChain(zonedDateTimeFns.getDayOfYear(zonedDateTime))
    },
    getWeekOfYear() {
      return ES.buildChain(zonedDateTimeFns.getWeekOfYear(zonedDateTime))
    },
    getHoursInDay() {
      return ES.buildChain(zonedDateTimeFns.getHoursInDay(zonedDateTime))
    },
    getDaysInMonth() {
      return ES.buildChain(zonedDateTimeFns.getDaysInMonth(zonedDateTime))
    },
    getDaysInYear() {
      return ES.buildChain(zonedDateTimeFns.getDaysInYear(zonedDateTime))
    },
    inLeapYear() {
      return ES.buildChain(zonedDateTimeFns.inLeapYear(zonedDateTime))
    },
    getOffset() {
      return ES.buildChain(zonedDateTimeFns.getOffset(zonedDateTime))
    },
    getOffsetMilliseconds() {
      return ES.buildChain(zonedDateTimeFns.getOffsetMilliseconds(zonedDateTime))
    },
    with(zonedDateTimeLike, options = {}) {
      return buildZonedDateTimeChain(zonedDateTimeFns.with(zonedDateTime, zonedDateTimeLike, options))
    },
    withDate(date) {
      return buildZonedDateTimeChain(zonedDateTimeFns.withDate(zonedDateTime, date))
    },
    withTime(time) {
      return buildZonedDateTimeChain(zonedDateTimeFns.withTime(zonedDateTime, time))
    },
    withTimeZone(timeZone) {
      return buildZonedDateTimeChain(zonedDateTimeFns.withTimeZone(zonedDateTime, timeZone))
    },
    add(temporalDurationLike, options) {
      return buildZonedDateTimeChain(zonedDateTimeFns.add(zonedDateTime, temporalDurationLike, options))
    },
    subtract(temporalDurationLike, options) {
      return buildZonedDateTimeChain(zonedDateTimeFns.subtract(zonedDateTime, temporalDurationLike, options))
    },
    until(other, options) {
      return buildDurationChain(zonedDateTimeFns.until(zonedDateTime, other, options))
    },
    since(other, options) {
      return buildDurationChain(zonedDateTimeFns.since(zonedDateTime, other, options))
    },
    round(options) {
      return buildZonedDateTimeChain(zonedDateTimeFns.round(zonedDateTime, options))
    },
    equals(other) {
      return ES.buildChain(zonedDateTimeFns.equals(zonedDateTime, other))
    },
    startOfDay() {
      return buildZonedDateTimeChain(zonedDateTimeFns.startOfDay(zonedDateTime))
    },
    toInstant() {
      return buildInstantChain(zonedDateTimeFns.toInstant(zonedDateTime))
    },
    toDate() {
      return buildDateChain(zonedDateTimeFns.toDate(zonedDateTime))
    },
    toTime() {
      return buildTimeChain(zonedDateTimeFns.toTime(zonedDateTime))
    },
    toDateTime() {
      return buildDateTimeChain(zonedDateTimeFns.toDateTime(zonedDateTime))
    },
    toYearMonth() {
      return buildYearMonthChain(zonedDateTimeFns.toYearMonth(zonedDateTime))
    },
    toMonthDay() {
      return buildMonthDayChain(zonedDateTimeFns.toMonthDay(zonedDateTime))
    },
    getFields() {
      return ES.buildChain(zonedDateTimeFns.getFields(zonedDateTime))
    },
    format(formatString) {
      return ES.buildChain(zonedDateTimeFns.format(zonedDateTime, formatString))
    }
  }
}
