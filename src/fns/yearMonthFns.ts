import { IYearMonthFns, IYearMonthChain } from '../types'
import * as ES from '../ecmascript'
import { Iso } from '../iso-types'
import { buildDurationChain } from './durationFns'
import { buildDateChain } from './dateFns'
import format from '../format'

const DISALLOWED_UNITS: ES.TemporalSingularUnit[] = ['week', 'day', 'hour', 'minute', 'second', 'millisecond']

export const yearMonthFns: IYearMonthFns = {
  fromNumbers(year, month) {
    year = ES.ToIntegerThrowOnInfinity(year)
    month = ES.ToIntegerThrowOnInfinity(month)

    // Note: if the arguments are not passed,
    //       ToIntegerThrowOnInfinity(undefined) will have returned 0, which will
    //       be rejected by RejectISODate in CreateTemporalYearMonthSlots. This
    //       check exists only to improve the error message.
    if (arguments.length < 2) {
      throw new RangeError('missing argument: isoYear and isoMonth are required')
    }

    return ES.CreateTemporalYearMonth(year, month)
  },
  getYear(yearMonth) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    return ES.CalendarYear(yearMonth)
  },
  getMonth(yearMonth) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    return ES.CalendarMonth(yearMonth)
  },
  getDaysInMonth(yearMonth) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInMonth(yearMonth)
  },
  getDaysInYear(yearMonth) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    return ES.CalendarDaysInYear(yearMonth)
  },
  inLeapYear(yearMonth) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    return ES.CalendarInLeapYear(yearMonth)
  },
  with(yearMonth, temporalYearMonthLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    if (typeof temporalYearMonthLike !== 'object') {
      throw new TypeError('invalid argument')
    }
    if ((temporalYearMonthLike as any).timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property')
    }

    const props = ES.ToPartialRecord(temporalYearMonthLike, ['month', 'year'])
    if (!props) {
      throw new TypeError('invalid year-month-like')
    }
    let fields = ES.ToTemporalYearMonthFields(ES.GetYearMonthSlots(yearMonth))
    fields = ES.CalendarMergeFields(fields, props) as any
    fields = ES.ToTemporalYearMonthFields(fields)

    options = ES.GetOptionsObject(options)

    return ES.YearMonthFromFields(fields, options)
  },
  add(yearMonth, temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    const duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = duration
    ;({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, 'day'))

    options = ES.GetOptionsObject(options)

    const fields = ES.ToTemporalYearMonthFields(ES.GetYearMonthSlots(yearMonth))
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0)
    const day = sign < 0 ? ES.ToPositiveInteger(ES.CalendarDaysInMonth(yearMonth)) : 1
    const startDate = ES.DateFromFields({ ...fields, day })
    const optionsCopy = { ...options }
    const addedDate = ES.CalendarDateAdd(startDate, { ...duration, days }, options)
    const addedDateFields = ES.ToTemporalYearMonthFields(ES.GetDateSlots(addedDate))

    return ES.YearMonthFromFields(addedDateFields, optionsCopy)
  },
  subtract(yearMonth, temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike)
    duration = {
      years: -duration.years,
      months: -duration.months,
      weeks: -duration.weeks,
      days: -duration.days,
      hours: -duration.hours,
      minutes: -duration.minutes,
      seconds: -duration.seconds,
      milliseconds: -duration.milliseconds
    }
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds } = duration
    ;({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, 'day'))

    options = ES.GetOptionsObject(options)

    const fields = ES.ToTemporalYearMonthFields(ES.GetYearMonthSlots(yearMonth))
    const sign = ES.DurationSign(years, months, weeks, days, 0, 0, 0, 0)
    const day = sign < 0 ? ES.ToPositiveInteger(ES.CalendarDaysInMonth(yearMonth)) : 1
    const startDate = ES.DateFromFields({ ...fields, day })
    const optionsCopy = { ...options }
    const addedDate = ES.CalendarDateAdd(startDate, { ...duration, days }, options)
    const addedDateFields = ES.ToTemporalYearMonthFields(ES.GetDateSlots(addedDate))

    return ES.YearMonthFromFields(addedDateFields, optionsCopy)
  },
  until(yearMonth, other, options = undefined) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalYearMonth(other)
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'month', DISALLOWED_UNITS)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', DISALLOWED_UNITS, 'year') as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false)

    const otherFields = ES.ToTemporalYearMonthFields(ES.GetYearMonthSlots(other))
    const thisFields = ES.ToTemporalYearMonthFields(ES.GetYearMonthSlots(yearMonth))
    const otherDate = ES.DateFromFields({ ...otherFields, day: 1 })
    const thisDate = ES.DateFromFields({ ...thisFields, day: 1 })

    const untilOptions = { ...options, largestUnit }
    const result = ES.CalendarDateUntil(thisDate, otherDate, untilOptions)
    if (smallestUnit === 'month' && roundingIncrement === 1) return result

    let { years, months } = ES.GetDurationSlots(result)
    const thisDateSlots = ES.GetDateSlots(thisDate)
    const relativeTo = ES.CreateTemporalDateTime(thisDateSlots.year, thisDateSlots.month, thisDateSlots.day, 0, 0, 0, 0)
    ;({ years, months } = ES.RoundDuration(
      years,
      months,
      0,
      0,
      0,
      0,
      0,
      0,
      roundingIncrement,
      smallestUnit,
      roundingMode,
      relativeTo
    ))

    return ES.CreateTemporalDuration(years, months, 0, 0, 0, 0, 0, 0)
  },
  since(yearMonth, other, options = undefined) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalYearMonth(other)
    options = ES.GetOptionsObject(options)
    const smallestUnit = ES.ToSmallestTemporalUnit(options, 'month', DISALLOWED_UNITS)
    const largestUnit = ES.ToLargestTemporalUnit(options, 'auto', DISALLOWED_UNITS, 'year') as ES.TemporalSingularUnit
    ES.ValidateTemporalUnitRange(largestUnit, smallestUnit)
    const roundingMode = ES.ToTemporalRoundingMode(options, 'trunc')
    const roundingIncrement = ES.ToTemporalRoundingIncrement(options, undefined, false)

    const otherFields = ES.ToTemporalYearMonthFields(ES.GetYearMonthSlots(other))
    const thisFields = ES.ToTemporalYearMonthFields(ES.GetYearMonthSlots(yearMonth))
    const otherDate = ES.DateFromFields({ ...otherFields, day: 1 })
    const thisDate = ES.DateFromFields({ ...thisFields, day: 1 })

    const untilOptions = { ...options, largestUnit }
    let { years, months } = ES.GetDurationSlots(ES.CalendarDateUntil(thisDate, otherDate, untilOptions))
    if (smallestUnit === 'month' && roundingIncrement === 1) {
      return ES.CreateTemporalDuration(-years, -months, 0, 0, 0, 0, 0, 0)
    }
    const thisDateSlots = ES.GetDateSlots(thisDate)

    const relativeTo = ES.CreateTemporalDateTime(thisDateSlots.year, thisDateSlots.month, thisDateSlots.day, 0, 0, 0, 0)
    ;({ years, months } = ES.RoundDuration(
      years,
      months,
      0,
      0,
      0,
      0,
      0,
      0,
      roundingIncrement,
      smallestUnit,
      ES.NegateTemporalRoundingMode(roundingMode),
      relativeTo
    ))

    return ES.CreateTemporalDuration(-years, -months, 0, 0, 0, 0, 0, 0)
  },
  equals(yearMonth, other) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalYearMonth(other)
    const slots1 = ES.GetYearMonthSlots(yearMonth)
    const slots2 = ES.GetYearMonthSlots(other)

    for (const slot of ['year', 'month'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 !== val2) return false
    }
    return true
  },
  toDate(yearMonth, day) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    if (typeof day !== 'number') throw new TypeError('argument should be a number')

    return ES.DateFromFields(
      {
        ...ES.GetYearMonthSlots(yearMonth),
        day
      },
      { overflow: 'reject' }
    )
  },
  getFields(yearMonth) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    return ES.GetYearMonthSlots(yearMonth)
  },
  from(item, options = undefined) {
    options = ES.GetOptionsObject(options)
    if (ES.IsTemporalYearMonth(item)) {
      ES.ToTemporalOverflow(options) // validate and ignore
      const slots = ES.GetYearMonthSlots(item)
      return ES.CreateTemporalYearMonth(slots.year, slots.month)
    }
    return ES.ToTemporalYearMonth(item, options)
  },
  compare(one, two) {
    one = ES.ToTemporalYearMonth(one)
    two = ES.ToTemporalYearMonth(two)
    const slots1 = ES.GetYearMonthSlots(one)
    const slots2 = ES.GetYearMonthSlots(two)

    return ES.CompareISODate(slots1.year, slots1.month, 1, slots2.year, slots2.month, 1)
  },
  format(yearMonth, formatString) {
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid receiver')
    return format(ES.GetYearMonthSlots(yearMonth), formatString)
  },
  chain: buildYearMonthChain
}

export function buildYearMonthChain(yearMonth: Iso.YearMonth): IYearMonthChain {
  return {
    value() {
      return yearMonth
    },
    getYear() {
      return ES.buildChain(yearMonthFns.getYear(yearMonth))
    },
    getMonth() {
      return ES.buildChain(yearMonthFns.getMonth(yearMonth))
    },
    getDaysInMonth() {
      return ES.buildChain(yearMonthFns.getDaysInMonth(yearMonth))
    },
    getDaysInYear() {
      return ES.buildChain(yearMonthFns.getDaysInYear(yearMonth))
    },
    inLeapYear() {
      return ES.buildChain(yearMonthFns.inLeapYear(yearMonth))
    },
    with(yearMonthLike, options) {
      return buildYearMonthChain(yearMonthFns.with(yearMonth, yearMonthLike, options))
    },
    add(temporalDurationLike, options) {
      return buildYearMonthChain(yearMonthFns.add(yearMonth, temporalDurationLike, options))
    },
    subtract(temporalDurationLike, options) {
      return buildYearMonthChain(yearMonthFns.subtract(yearMonth, temporalDurationLike, options))
    },
    until(other, options) {
      return buildDurationChain(yearMonthFns.until(yearMonth, other, options))
    },
    since(other, options) {
      return buildDurationChain(yearMonthFns.since(yearMonth, other, options))
    },
    equals(other) {
      return ES.buildChain(yearMonthFns.equals(yearMonth, other))
    },
    toDate(day) {
      return buildDateChain(yearMonthFns.toDate(yearMonth, day))
    },
    getFields() {
      return ES.buildChain(yearMonthFns.getFields(yearMonth))
    },
    format(formatString) {
      return ES.buildChain(yearMonthFns.format(yearMonth, formatString))
    }
  }
}
