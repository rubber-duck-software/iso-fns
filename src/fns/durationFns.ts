import { IDurationChain, IDurationFns } from '../types'
import * as ES from '../ecmascript'
import { Iso } from '../iso-types'

export const durationFns: IDurationFns = {
  fromNumbers(years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
    years = ES.ToIntegerThrowOnInfinity(years)
    months = ES.ToIntegerThrowOnInfinity(months)
    weeks = ES.ToIntegerThrowOnInfinity(weeks)
    days = ES.ToIntegerThrowOnInfinity(days)
    hours = ES.ToIntegerThrowOnInfinity(hours)
    minutes = ES.ToIntegerThrowOnInfinity(minutes)
    seconds = ES.ToIntegerThrowOnInfinity(seconds)
    milliseconds = ES.ToIntegerThrowOnInfinity(milliseconds)

    const sign = ES.DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds)
    for (const prop of [years, months, weeks, days, hours, minutes, seconds, milliseconds]) {
      if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields')
      const propSign = Math.sign(prop)
      if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields')
    }

    return ES.CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  },
  isValid(duration): duration is Iso.Duration {
    return ES.IsTemporalDuration(duration)
  },
  assertIsValid(duration): asserts duration is Iso.Duration {
    ES.AssertIsDuration(duration)
  },
  getYears(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).years
  },
  getMonths(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).months
  },
  getWeeks(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).weeks
  },
  getDays(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).days
  },
  getHours(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).hours
  },
  getMinutes(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).minutes
  },
  getSeconds(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).seconds
  },
  getMilliseconds(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration).milliseconds
  },
  getSign(duration) {
    ES.AssertIsDuration(duration)
    const slots = ES.GetDurationSlots(duration)
    return ES.DurationSign(
      slots.years,
      slots.months,
      slots.weeks,
      slots.days,
      slots.hours,
      slots.minutes,
      slots.seconds,
      slots.milliseconds
    )
  },
  isBlank(duration) {
    ES.AssertIsDuration(duration)
    const slots = ES.GetDurationSlots(duration)
    return (
      ES.DurationSign(
        slots.years,
        slots.months,
        slots.weeks,
        slots.days,
        slots.hours,
        slots.minutes,
        slots.seconds,
        slots.milliseconds
      ) === 0
    )
  },
  with(duration, durationLike) {
    ES.AssertIsDuration(duration)
    const props = ES.ToPartialRecord(durationLike, [
      'days',
      'hours',
      'milliseconds',
      'minutes',
      'months',
      'seconds',
      'weeks',
      'years'
    ])
    if (!props) {
      throw new TypeError('invalid duration-like')
    }
    const slots = ES.GetDurationSlots(duration)
    let {
      years = slots.years,
      months = slots.months,
      weeks = slots.weeks,
      days = slots.days,
      hours = slots.hours,
      minutes = slots.minutes,
      seconds = slots.seconds,
      milliseconds = slots.milliseconds
    } = props
    return ES.CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  },
  negated(duration) {
    ES.AssertIsDuration(duration)
    return ES.CreateNegatedTemporalDuration(duration)
  },
  abs(duration) {
    ES.AssertIsDuration(duration)
    const slots = ES.GetDurationSlots(duration)
    return ES.CreateTemporalDuration(
      Math.abs(slots.years),
      Math.abs(slots.months),
      Math.abs(slots.weeks),
      Math.abs(slots.days),
      Math.abs(slots.hours),
      Math.abs(slots.minutes),
      Math.abs(slots.seconds),
      Math.abs(slots.milliseconds)
    )
  },
  add(duration, other, options = undefined) {
    ES.AssertIsDuration(duration)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.ToLimitedTemporalDuration(other)
    options = ES.GetOptionsObject(options)
    const relativeTo = ES.ToRelativeTemporalObject(options)
    const thisSlots = ES.GetDurationSlots(duration)
    ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.AddDuration(
      thisSlots.years,
      thisSlots.months,
      thisSlots.weeks,
      thisSlots.days,
      thisSlots.hours,
      thisSlots.minutes,
      thisSlots.seconds,
      thisSlots.milliseconds,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      relativeTo
    ))
    return ES.CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  },
  subtract(duration, other, options = undefined) {
    ES.AssertIsDuration(duration)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.ToLimitedTemporalDuration(other)
    options = ES.GetOptionsObject(options)
    const relativeTo = ES.ToRelativeTemporalObject(options)
    const thisSlots = ES.GetDurationSlots(duration)
    ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.AddDuration(
      thisSlots.years,
      thisSlots.months,
      thisSlots.weeks,
      thisSlots.days,
      thisSlots.hours,
      thisSlots.minutes,
      thisSlots.seconds,
      thisSlots.milliseconds,
      -years,
      -months,
      -weeks,
      -days,
      -hours,
      -minutes,
      -seconds,
      -milliseconds,
      relativeTo
    ))
    return ES.CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  },
  round(duration, options) {
    ES.AssertIsDuration(duration)
    if (options === undefined) throw new TypeError('options parameter is required')
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.GetDurationSlots(duration)

    let defaultLargestUnit = ES.DefaultTemporalLargestUnit(years, months, weeks, days, hours, minutes, seconds, milliseconds)
    options = ES.GetOptionsObject(options)
    let smallestUnit = ES.ToSmallestTemporalUnit(options, undefined)
    let smallestUnitPresent = true
    if (!smallestUnit) {
      smallestUnitPresent = false
      smallestUnit = 'millisecond'
    }
    defaultLargestUnit = ES.LargerOfTwoTemporalUnits(defaultLargestUnit, smallestUnit)
    let largestUnit = ES.ToLargestTemporalUnit(options, undefined)
    let largestUnitPresent = true
    if (!largestUnit) {
      largestUnitPresent = false
      largestUnit = defaultLargestUnit
    }
    if (largestUnit === 'auto') largestUnit = defaultLargestUnit
    if (!smallestUnitPresent && !largestUnitPresent) {
      throw new RangeError('at least one of smallestUnit or largestUnit is required')
    }
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'halfExpand')
    const roundingIncrement = ES.ToTemporalDateTimeRoundingIncrement(options, smallestUnit)
    let relativeTo = ES.ToRelativeTemporalObject(options)

    ;({ years, months, weeks, days } = ES.UnbalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo))
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
      relativeTo
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
      smallestUnit,
      roundingMode,
      relativeTo
    ))
    ;({ years, months, weeks, days } = ES.BalanceDurationRelative(years, months, weeks, days, largestUnit, relativeTo))
    if (ES.IsTemporalZonedDateTime(relativeTo)) {
      relativeTo = ES.MoveRelativeZonedDateTime(relativeTo, years, months, weeks, 0)
    }
    ;({ days, hours, minutes, seconds, milliseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      largestUnit,
      relativeTo
    ))

    return ES.CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  },
  total(duration, options) {
    ES.AssertIsDuration(duration)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = ES.GetDurationSlots(duration)

    if (options === undefined) throw new TypeError('options argument is required')
    options = ES.GetOptionsObject(options)
    const unit = ES.ToTemporalDurationTotalUnit(options)
    if (unit === undefined) throw new RangeError('unit option is required')
    const relativeTo = ES.ToRelativeTemporalObject(options)

    // Convert larger units down to days
    ;({ years, months, weeks, days } = ES.UnbalanceDurationRelative(years, months, weeks, days, unit, relativeTo))
    // If the unit we're totalling is smaller than `days`, convert days down to that unit.
    let intermediate
    if (ES.IsTemporalZonedDateTime(relativeTo)) {
      intermediate = ES.MoveRelativeZonedDateTime(relativeTo, years, months, weeks, 0)
    }
    ;({ days, hours, minutes, seconds, milliseconds } = ES.BalanceDuration(
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      unit,
      intermediate
    ))
    // Finally, truncate to the correct unit and calculate remainder
    const { total } = ES.RoundDuration(
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      1,
      unit,
      'trunc',
      relativeTo
    )
    return total
  },
  getFields(duration) {
    ES.AssertIsDuration(duration)
    return ES.GetDurationSlots(duration)
  },
  from(item) {
    if (ES.IsTemporalDuration(item)) {
      const slots = ES.GetDurationSlots(item)
      return ES.CreateTemporalDuration(
        slots.years,
        slots.months,
        slots.weeks,
        slots.days,
        slots.hours,
        slots.minutes,
        slots.seconds,
        slots.milliseconds
      )
    }
    return ES.ToTemporalDuration(item)
  },
  compare(one, two, options = undefined) {
    one = ES.ToTemporalDuration(one)
    two = ES.ToTemporalDuration(two)
    options = ES.GetOptionsObject(options)
    const relativeTo = ES.ToRelativeTemporalObject(options)
    let {
      years: y1,
      months: mon1,
      weeks: w1,
      days: d1,
      hours: h1,
      minutes: min1,
      seconds: s1,
      milliseconds: ms1
    } = ES.GetDurationSlots(one)
    let {
      years: y2,
      months: mon2,
      weeks: w2,
      days: d2,
      hours: h2,
      minutes: min2,
      seconds: s2,
      milliseconds: ms2
    } = ES.GetDurationSlots(two)
    const shift1 = ES.CalculateOffsetShift(relativeTo, y1, mon1, w1, d1, h1, min1, s1, ms1)
    const shift2 = ES.CalculateOffsetShift(relativeTo, y2, mon2, w2, d2, h2, min2, s2, ms2)
    if (y1 !== 0 || y2 !== 0 || mon1 !== 0 || mon2 !== 0 || w1 !== 0 || w2 !== 0) {
      ;({ days: d1 } = ES.UnbalanceDurationRelative(y1, mon1, w1, d1, 'day', relativeTo))
      ;({ days: d2 } = ES.UnbalanceDurationRelative(y2, mon2, w2, d2, 'day', relativeTo))
    }
    ms1 = ES.TotalDurationMilliseconds(d1, h1, min1, s1, ms1, shift1)
    ms2 = ES.TotalDurationMilliseconds(d2, h2, min2, s2, ms2, shift2)
    return ES.ComparisonResult(ms1 - ms2)
  },
  chain: buildDurationChain
}

export function buildDurationChain(duration: Iso.Duration): IDurationChain {
  return {
    value() {
      return duration
    },
    getYears() {
      return ES.buildChain(durationFns.getYears(duration))
    },
    getMonths() {
      return ES.buildChain(durationFns.getMonths(duration))
    },
    getWeeks() {
      return ES.buildChain(durationFns.getWeeks(duration))
    },
    getDays() {
      return ES.buildChain(durationFns.getDays(duration))
    },
    getHours() {
      return ES.buildChain(durationFns.getHours(duration))
    },
    getMinutes() {
      return ES.buildChain(durationFns.getMinutes(duration))
    },
    getSeconds() {
      return ES.buildChain(durationFns.getSeconds(duration))
    },
    getMilliseconds() {
      return ES.buildChain(durationFns.getMilliseconds(duration))
    },
    getSign() {
      return ES.buildChain(durationFns.getSign(duration))
    },
    isBlank() {
      return ES.buildChain(durationFns.isBlank(duration))
    },
    with(durationLike) {
      return buildDurationChain(durationFns.with(duration, durationLike))
    },
    negated() {
      return buildDurationChain(durationFns.negated(duration))
    },
    abs() {
      return buildDurationChain(durationFns.abs(duration))
    },
    add(other, options) {
      return buildDurationChain(durationFns.add(duration, other, options))
    },
    subtract(other, options) {
      return buildDurationChain(durationFns.subtract(duration, other, options))
    },
    round(options) {
      return buildDurationChain(durationFns.round(duration, options))
    },
    total(options) {
      return ES.buildChain(durationFns.total(duration, options))
    },
    getFields() {
      return ES.buildChain(durationFns.getFields(duration))
    }
  }
}
