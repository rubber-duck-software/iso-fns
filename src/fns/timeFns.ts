import { ITimeChain, ITimeFns } from '../types'
import * as ES from '../ecmascript'
import { Iso } from '../iso-types'
import { buildDurationChain } from './durationFns'
import { buildDateTimeChain } from './dateTimeFns'
import { buildZonedDateTimeChain } from './zonedDateTimeFns'
import format from '../format'

const ObjectAssign = Object.assign

const DISALLOWED_UNITS: ES.TemporalSingularUnit[] = ['year', 'month', 'week', 'day']
const MAX_INCREMENTS = {
  hour: 24,
  minute: 60,
  second: 60,
  millisecond: 1000
}

export const timeFns: ITimeFns = {
  now(timeZone = ES.SystemTimeZone()) {
    timeZone = ES.ToTemporalTimeZone(timeZone)
    return ES.TemporalDateTimeToTime(ES.BuiltinTimeZoneGetPlainDateTimeFor(timeZone, ES.SystemUTCEpochMilliSeconds()))
  },
  fromNumbers(hour = 0, minute = 0, second = 0, millisecond = 0) {
    hour = ES.ToIntegerThrowOnInfinity(hour)
    minute = ES.ToIntegerThrowOnInfinity(minute)
    second = ES.ToIntegerThrowOnInfinity(second)
    millisecond = ES.ToIntegerThrowOnInfinity(millisecond)

    ES.RejectTime(hour, minute, second, millisecond)

    return ES.CreateTemporalTime(hour, minute, second, millisecond)
  },
  isValid(time): time is Iso.Time {
    return ES.IsTemporalTime(time)
  },
  assertIsValid(time): asserts time is Iso.Time {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
  },
  getHour(time) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    return ES.GetTimeSlots(time).hour
  },
  getMinute(time) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    return ES.GetTimeSlots(time).minute
  },
  getSecond(time) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    return ES.GetTimeSlots(time).second
  },
  getMillisecond(time) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    return ES.GetTimeSlots(time).millisecond
  },
  with(time, temporalTimeLike, options = undefined) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    if (typeof temporalTimeLike !== 'object') {
      throw new TypeError('invalid argument')
    }
    if ((temporalTimeLike as any).timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property')
    }

    options = ES.GetOptionsObject(options)
    const overflow = ES.ToTemporalOverflow(options)

    const props = ES.ToPartialRecord(temporalTimeLike, [
      'hour',
      'microsecond',
      'millisecond',
      'minute',
      'nanosecond',
      'second'
    ])
    if (!props) {
      throw new TypeError('invalid time-like')
    }
    const fields = ES.ToTemporalTimeRecord(ES.GetTimeSlots(time))
    let { hour, minute, second, millisecond } = ObjectAssign(fields, props)
    ;({ hour, minute, second, millisecond } = ES.RegulateTime(hour, minute, second, millisecond, overflow))
    return ES.CreateTemporalTime(hour, minute, second, millisecond)
  },
  add(time, temporalDurationLike) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    const { hours, minutes, seconds, milliseconds } = duration
    let { hour, minute, second, millisecond } = ES.GetTimeSlots(time)
    ;({ hour, minute, second, millisecond } = ES.AddTime(
      hour,
      minute,
      second,
      millisecond,
      hours,
      minutes,
      seconds,
      milliseconds
    ))
    ;({ hour, minute, second, millisecond } = ES.RegulateTime(hour, minute, second, millisecond, 'reject'))
    return ES.CreateTemporalTime(hour, minute, second, millisecond)
  },
  subtract(time, temporalDurationLike) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    const { hours, minutes, seconds, milliseconds } = duration
    let { hour, minute, second, millisecond } = ES.GetTimeSlots(time)

    ;({ hour, minute, second, millisecond } = ES.AddTime(
      hour,
      minute,
      second,
      millisecond,
      -hours,
      -minutes,
      -seconds,
      -milliseconds
    ))
    ;({ hour, minute, second, millisecond } = ES.RegulateTime(hour, minute, second, millisecond, 'reject'))
    return ES.CreateTemporalTime(hour, minute, second, millisecond)
  },
  until(time, other, options = undefined) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalTime(other)
    options = ES.GetOptionsObject(options)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', DISALLOWED_UNITS, 'hour') as ES.TemporalSingularUnit
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond', DISALLOWED_UNITS) as Exclude<
      ES.TemporalSingularUnit,
      'year' | 'month' | 'week' | 'day'
    >
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false)
    const timeSlots = ES.GetTimeSlots(time)
    const otherSlots = ES.GetTimeSlots(other)

    let { hours, minutes, seconds, milliseconds } = ES.DifferenceTime(
      timeSlots.hour,
      timeSlots.minute,
      timeSlots.second,
      timeSlots.millisecond,
      otherSlots.hour,
      otherSlots.minute,
      otherSlots.second,
      otherSlots.millisecond
    )
    ;({ hours, minutes, seconds, milliseconds } = ES.RoundDuration(
      0,
      0,
      0,
      0,
      hours,
      minutes,
      seconds,
      milliseconds,
      roundingIncrement,
      smallestUnit,
      roundingMode
    ))
    ;({ hours, minutes, seconds, milliseconds } = ES.BalanceDuration(0, hours, minutes, seconds, milliseconds, largestUnit))
    return ES.CreateTemporalDuration(0, 0, 0, 0, hours, minutes, seconds, milliseconds)
  },
  since(time, other, options = undefined) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalTime(other)
    options = ES.GetOptionsObject(options)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', DISALLOWED_UNITS, 'hour') as ES.TemporalSingularUnit
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond', DISALLOWED_UNITS) as Exclude<
      ES.TemporalSingularUnit,
      'year' | 'month' | 'week' | 'day'
    >
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false)
    const timeSlots = ES.GetTimeSlots(time)
    const otherSlots = ES.GetTimeSlots(other)
    let { hours, minutes, seconds, milliseconds } = ES.DifferenceTime(
      timeSlots.hour,
      timeSlots.minute,
      timeSlots.second,
      timeSlots.millisecond,
      otherSlots.hour,
      otherSlots.minute,
      otherSlots.second,
      otherSlots.millisecond
    )
    ;({ hours, minutes, seconds, milliseconds } = ES.RoundDuration(
      0,
      0,
      0,
      0,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      roundingIncrement,
      smallestUnit,
      ES.NegateTemporalRoundingMode(roundingMode)
    ))
    hours = -hours
    minutes = -minutes
    seconds = -seconds
    milliseconds = -milliseconds
    ;({ hours, minutes, seconds, milliseconds } = ES.BalanceDuration(0, hours, minutes, seconds, milliseconds, largestUnit))
    return ES.CreateTemporalDuration(0, 0, 0, 0, hours, minutes, seconds, milliseconds)
  },
  round(time, options) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    if (options === undefined) throw new TypeError('options parameter is required')
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, undefined, DISALLOWED_UNITS) as Exclude<
      ES.TemporalSingularUnit,
      'year' | 'month' | 'week' | 'day'
    >
    if (smallestUnit === undefined) throw new RangeError('smallestUnit is required')
    const roundingMode = ES.ToTemporalRoundingMode(options, 'halfExpand')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_INCREMENTS[smallestUnit], false)

    let { hour, minute, second, millisecond } = ES.GetTimeSlots(time)

    ;({ hour, minute, second, millisecond } = ES.RoundTime(
      hour,
      minute,
      second,
      millisecond,
      roundingIncrement,
      smallestUnit,
      roundingMode
    ))

    return ES.CreateTemporalTime(hour, minute, second, millisecond)
  },
  equals(time, other) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalTime(other)) throw new TypeError('invalid receiver')

    const slots1 = ES.GetTimeSlots(time)
    const slots2 = ES.GetTimeSlots(other)

    for (const slot of ['hour', 'minute', 'second', 'millisecond'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 !== val2) return false
    }
    return true
  },
  toDateTime(time, temporalDate) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')

    temporalDate = ES.ToTemporalDate(temporalDate)

    let { year, month, day } = ES.GetDateSlots(temporalDate)
    let { hour, minute, second, millisecond } = ES.GetTimeSlots(time)

    return ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
  },
  toZonedDateTime(time, item) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')

    if (typeof item !== 'object') {
      throw new TypeError('invalid argument')
    }

    const dateLike = item.date
    if (dateLike === undefined) {
      throw new TypeError('missing date property')
    }
    const temporalDate = ES.ToTemporalDate(dateLike)

    const timeZoneLike = item.timeZone
    if (timeZoneLike === undefined) {
      throw new TypeError('missing timeZone property')
    }
    const timeZone = ES.ToTemporalTimeZone(timeZoneLike)

    const { year, month, day } = ES.GetDateSlots(temporalDate)
    const { hour, minute, second, millisecond } = ES.GetTimeSlots(time)

    const dt = ES.CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
    const instant = ES.BuiltinTimeZoneGetInstantFor(timeZone, dt, 'compatible')
    return ES.CreateTemporalZonedDateTime(instant, timeZone)
  },
  getFields(time) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    return ES.GetTimeSlots(time)
  },
  from(item, options = undefined) {
    options = ES.GetOptionsObject(options)
    const overflow = ES.ToTemporalOverflow(options)
    if (ES.IsTemporalTime(item)) {
      const slots = ES.GetTimeSlots(item)
      return ES.CreateTemporalTime(slots.hour, slots.minute, slots.second, slots.millisecond)
    }
    return ES.ToTemporalTime(item, overflow)
  },
  compare(one, two) {
    one = ES.ToTemporalTime(one)
    two = ES.ToTemporalTime(two)

    const slots1 = ES.GetTimeSlots(one)
    const slots2 = ES.GetTimeSlots(two)
    for (const slot of ['hour', 'minute', 'second', 'millisecond'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2)
    }
    return 0
  },
  format(time, formatString) {
    if (!ES.IsTemporalTime(time)) throw new TypeError('invalid receiver')
    return format(ES.GetTimeSlots(time), formatString)
  },
  chain: buildTimeChain
}

export function buildTimeChain(time: Iso.Time): ITimeChain {
  return {
    value() {
      return time
    },
    getHour() {
      return ES.buildChain(timeFns.getHour(time))
    },
    getMinute() {
      return ES.buildChain(timeFns.getMinute(time))
    },
    getSecond() {
      return ES.buildChain(timeFns.getSecond(time))
    },
    getMillisecond() {
      return ES.buildChain(timeFns.getMillisecond(time))
    },
    with(timeLike, options) {
      return buildTimeChain(timeFns.with(time, timeLike, options))
    },
    add(temporalDurationLike, options) {
      return buildTimeChain(timeFns.add(time, temporalDurationLike, options))
    },
    subtract(temporalDurationLike, options) {
      return buildTimeChain(timeFns.subtract(time, temporalDurationLike, options))
    },
    until(other, options) {
      return buildDurationChain(timeFns.until(time, other, options))
    },
    since(other, options) {
      return buildDurationChain(timeFns.since(time, other, options))
    },
    round(options) {
      return buildTimeChain(timeFns.round(time, options))
    },
    equals(other) {
      return ES.buildChain(timeFns.equals(time, other))
    },
    toDateTime(date) {
      return buildDateTimeChain(timeFns.toDateTime(time, date))
    },
    toZonedDateTime(item) {
      return buildZonedDateTimeChain(timeFns.toZonedDateTime(time, item))
    },
    getFields() {
      return ES.buildChain(timeFns.getFields(time))
    },
    format(formatString) {
      return ES.buildChain(timeFns.format(time, formatString))
    }
  }
}
