import { IInstantChain, IInstantFns } from '../types'
import * as ES from '../ecmascript'
import { Iso } from '../iso-types'
import { buildDurationChain } from './durationFns'
import { buildZonedDateTimeChain } from './zonedDateTimeFns'

const DISALLOWED_UNITS: ES.TemporalSingularUnit[] = ['year', 'month', 'week', 'day']
const MAX_DIFFERENCE_INCREMENTS = {
  hour: 24,
  minute: 60,
  second: 60,
  millisecond: 1000,
  microsecond: 1000,
  nanosecond: 1000
}

export const instantFns: IInstantFns = {
  now() {
    return ES.CreateTemporalInstant(ES.SystemUTCEpochMilliSeconds())
  },
  fromEpochMilliseconds(epochMilliseconds) {
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochNanoseconds is required')
    }

    const ms = epochMilliseconds
    ES.ValidateEpochMilliseconds(ms)
    return ES.CreateTemporalInstant(ms)
  },
  getEpochSeconds(instant) {
    if (!ES.IsTemporalInstant(instant)) throw new TypeError('invalid receiver')
    const value = ES.GetInstantSlots(instant).epochMilliseconds
    return Math.floor(value / 1e3)
  },
  getEpochMilliseconds(instant) {
    if (!ES.IsTemporalInstant(instant)) throw new TypeError('invalid receiver')
    const value = ES.GetInstantSlots(instant).epochMilliseconds
    return value
  },
  add(instant, temporalDurationLike) {
    if (!ES.IsTemporalInstant(instant)) throw new TypeError('invalid receiver')
    const { hours, minutes, seconds, milliseconds } = ES.ToLimitedTemporalDuration(temporalDurationLike, [
      'years',
      'months',
      'weeks',
      'days'
    ])
    const ms = ES.AddInstant(ES.GetInstantSlots(instant).epochMilliseconds, hours, minutes, seconds, milliseconds)
    return ES.CreateTemporalInstant(ms)
  },
  subtract(instant, temporalDurationLike) {
    if (!ES.IsTemporalInstant(instant)) throw new TypeError('invalid receiver')
    const { hours, minutes, seconds, milliseconds } = ES.ToLimitedTemporalDuration(temporalDurationLike, [
      'years',
      'months',
      'weeks',
      'days'
    ])
    const ns = ES.AddInstant(ES.GetInstantSlots(instant).epochMilliseconds, -hours, -minutes, -seconds, -milliseconds)
    return ES.CreateTemporalInstant(ns)
  },
  until(from, until, options = {}) {
    if (!ES.IsTemporalInstant(from)) throw new TypeError('invalid receiver')

    until = ES.ToTemporalInstant(until)
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond', DISALLOWED_UNITS) as
      | 'hour'
      | 'minute'
      | 'second'
      | 'millisecond'
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('second', smallestUnit)
    const largestUnit = ES.ToLargestTemporalUnit(
      options,
      'auto',
      DISALLOWED_UNITS,
      defaultLargestUnit
    ) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit as ES.TemporalSingularUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_DIFFERENCE_INCREMENTS[smallestUnit], false)
    const oneMs = ES.GetInstantSlots(from).epochMilliseconds
    const twoMs = ES.GetInstantSlots(until).epochMilliseconds
    let { seconds, milliseconds } = ES.DifferenceInstant(oneMs, twoMs, roundingIncrement, smallestUnit, roundingMode)
    let hours, minutes
    ;({ hours, minutes, seconds, milliseconds } = ES.BalanceDuration(0, 0, 0, seconds, milliseconds, largestUnit))
    return ES.CreateTemporalDuration(0, 0, 0, 0, hours, minutes, seconds, milliseconds)
  },
  since(to, since, options = {}) {
    if (!ES.IsTemporalInstant(to)) throw new TypeError('invalid receiver')
    since = ES.ToTemporalInstant(since)
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'millisecond', DISALLOWED_UNITS) as
      | 'hour'
      | 'minute'
      | 'second'
      | 'millisecond'
    const defaultLargestUnit = ES.LargerOfTwoTemporalUnits('second', smallestUnit)
    const largestUnit = ES.ToLargestTemporalUnit(
      options,
      'auto',
      DISALLOWED_UNITS,
      defaultLargestUnit
    ) as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, MAX_DIFFERENCE_INCREMENTS[smallestUnit], false)
    const oneMs = ES.GetInstantSlots(to).epochMilliseconds
    const twoMs = ES.GetInstantSlots(since).epochMilliseconds
    let { seconds, milliseconds } = ES.DifferenceInstant(oneMs, twoMs, roundingIncrement, smallestUnit, roundingMode)
    let hours, minutes
    ;({ hours, minutes, seconds, milliseconds } = ES.BalanceDuration(0, 0, 0, seconds, milliseconds, largestUnit))
    return ES.CreateTemporalDuration(0, 0, 0, 0, hours, minutes, seconds, milliseconds)
  },
  round(instant, options) {
    if (!ES.IsTemporalInstant(instant)) throw new TypeError('invalid receiver')
    if (options === undefined) throw new TypeError('options parameter is required')
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, undefined, DISALLOWED_UNITS) as
      | 'hour'
      | 'minute'
      | 'second'
      | 'millisecond'
    if (smallestUnit === undefined) throw new RangeError('smallestUnit is required')
    const roundingMode = ES.ToTemporalRoundingMode(options, 'halfExpand')
    const maximumIncrements = {
      hour: 24,
      minute: 1440,
      second: 86400,
      millisecond: 86400e3,
      microsecond: 86400e6,
      nanosecond: 86400e9
    }
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], true)
    const ms = ES.GetInstantSlots(instant).epochMilliseconds
    const roundedNs = ES.RoundInstant(ms, roundingIncrement, smallestUnit, roundingMode)
    return ES.CreateTemporalInstant(roundedNs)
  },
  equals(instant, other) {
    if (!ES.IsTemporalInstant(instant)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalInstant(other)) throw new TypeError('invalid receiver')
    const one = ES.GetInstantSlots(instant).epochMilliseconds
    const two = ES.GetInstantSlots(other).epochMilliseconds
    return one === two
  },
  toZonedDateTime(instant, timeZone) {
    if (!ES.IsTemporalInstant(instant)) throw new TypeError('invalid receiver')
    timeZone = ES.ToTemporalTimeZone(timeZone)
    return ES.CreateTemporalZonedDateTime(ES.GetInstantSlots(instant).epochMilliseconds, timeZone)
  },
  fromEpochSeconds(epochSeconds) {
    epochSeconds = ES.ToNumber(epochSeconds)
    const epochNanoseconds = epochSeconds * 1e3
    ES.ValidateEpochMilliseconds(epochNanoseconds)
    return ES.CreateTemporalInstant(epochNanoseconds)
  },
  from(item) {
    if (ES.IsTemporalInstant(item)) {
      return ES.CreateTemporalInstant(ES.GetInstantSlots(item).epochMilliseconds)
    }
    return ES.ToTemporalInstant(item)
  },
  compare(one, two) {
    if (!ES.IsTemporalInstant(one)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalInstant(two)) throw new TypeError('invalid receiver')
    const oneMs = ES.GetInstantSlots(one).epochMilliseconds
    const twoMs = ES.GetInstantSlots(two).epochMilliseconds
    if (oneMs < twoMs) return -1
    if (oneMs > twoMs) return 1
    return 0
  },
  chain: buildInstantChain
}

export function buildInstantChain(instant: Iso.Instant): IInstantChain {
  return {
    value() {
      return instant
    },
    getEpochSeconds() {
      return ES.buildChain(instantFns.getEpochSeconds(instant))
    },
    getEpochMilliseconds() {
      return ES.buildChain(instantFns.getEpochMilliseconds(instant))
    },
    add(temporalDurationLike) {
      return buildInstantChain(instantFns.add(instant, temporalDurationLike))
    },
    subtract(temporalDurationLike) {
      return buildInstantChain(instantFns.subtract(instant, temporalDurationLike))
    },
    until(until, options) {
      return buildDurationChain(instantFns.until(instant, until, options))
    },
    since(since, options) {
      return buildDurationChain(instantFns.since(instant, since, options))
    },
    round(options) {
      return buildInstantChain(instantFns.round(instant, options))
    },
    equals(other) {
      return ES.buildChain(instantFns.equals(instant, other))
    },
    toZonedDateTime(timeZone) {
      return buildZonedDateTimeChain(instantFns.toZonedDateTime(instant, timeZone))
    }
  }
}
