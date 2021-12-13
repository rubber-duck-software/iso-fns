import { IMonthDayFns, IMonthDayChain } from '../types'
import * as ES from '../ecmascript'
import { Iso } from '../iso-types'
import { buildDateChain } from './dateFns'
import format from '../format'

export const monthDayFns: IMonthDayFns = {
  fromNumbers(month, day) {
    month = ES.ToIntegerThrowOnInfinity(month)
    day = ES.ToIntegerThrowOnInfinity(day)

    // Note: if the arguments are not passed,
    //       ToIntegerThrowOnInfinity(undefined) will have returned 0, which will
    //       be rejected by RejectISODate in CreateTemporalMonthDaySlots. This
    //       check exists only to improve the error message.
    if (arguments.length < 2) {
      throw new RangeError('missing argument: isoMonth and isoDay are required')
    }

    return ES.CreateTemporalMonthDay(month, day)
  },
  getDay(monthDay) {
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid receiver')
    return ES.CalendarDay(monthDay)
  },
  getMonth(monthDay) {
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid receiver')
    return ES.CalendarDay(monthDay)
  },
  with(monthDay, temporalMonthDayLike, options = undefined) {
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid receiver')
    if (typeof temporalMonthDayLike !== 'object') {
      throw new TypeError('invalid argument')
    }
    if ((temporalMonthDayLike as any).timeZone !== undefined) {
      throw new TypeError('with() does not support a timeZone property')
    }

    const props = ES.ToPartialRecord(temporalMonthDayLike, ['day', 'month', 'monthCode', 'year'])
    if (!props) {
      throw new TypeError('invalid month-day-like')
    }
    let fields = ES.ToTemporalMonthDayFields(ES.GetMonthDaySlots(monthDay))
    fields = ES.CalendarMergeFields(fields, props) as any
    fields = ES.ToTemporalMonthDayFields(fields)

    options = ES.GetOptionsObject(options)
    return ES.MonthDayFromFields(fields, options)
  },
  equals(monthDay, other) {
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid receiver')
    other = ES.ToTemporalMonthDay(other)
    const slots1 = ES.GetMonthDaySlots(monthDay)
    const slots2 = ES.GetMonthDaySlots(other)

    for (const slot of ['month', 'day'] as const) {
      const val1 = slots1[slot]
      const val2 = slots2[slot]
      if (val1 !== val2) return false
    }
    return true
  },
  toDate(monthDay, year) {
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid receiver')
    year = ES.ToIntegerThrowOnInfinity(year)
    const { month, day } = ES.GetMonthDaySlots(monthDay)
    ES.RegulateISODate(year, month, day, 'reject')
    return ES.CreateTemporalDate(year, month, day)
  },
  getFields(monthDay) {
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid receiver')
    return ES.GetMonthDaySlots(monthDay)
  },
  from(item, options = undefined) {
    options = ES.GetOptionsObject(options)
    if (ES.IsTemporalMonthDay(item)) {
      ES.ToTemporalOverflow(options) // validate and ignore
      const slots = ES.GetMonthDaySlots(item)
      return ES.CreateTemporalMonthDay(slots.month, slots.day)
    }
    return ES.ToTemporalMonthDay(item, options)
  },
  compare(one, two) {
    if (!ES.IsTemporalMonthDay(one)) throw new TypeError('invalid receiver')
    if (!ES.IsTemporalMonthDay(two)) throw new TypeError('invalid receiver')
    const oneSlots = ES.GetMonthDaySlots(one)
    const twoSlots = ES.GetMonthDaySlots(two)

    return ES.CompareISODate(1972, oneSlots.month, oneSlots.day, 1972, twoSlots.month, twoSlots.day)
  },
  format(monthDay, formatString) {
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid receiver')
    return format(ES.GetMonthDaySlots(monthDay), formatString)
  },
  chain: buildMonthDayChain
}

export function buildMonthDayChain(monthDay: Iso.MonthDay): IMonthDayChain {
  return {
    value() {
      return monthDay
    },
    getDay() {
      return ES.buildChain(monthDayFns.getDay(monthDay))
    },
    getMonth() {
      return ES.buildChain(monthDayFns.getMonth(monthDay))
    },
    with(monthDayLike, options) {
      return buildMonthDayChain(monthDayFns.with(monthDay, monthDayLike, options))
    },
    equals(other) {
      return ES.buildChain(monthDayFns.equals(monthDay, other))
    },
    toDate(year: number) {
      return buildDateChain(monthDayFns.toDate(monthDay, year))
    },
    getFields() {
      return ES.buildChain(monthDayFns.getFields(monthDay))
    },
    format(formatString) {
      return ES.buildChain(monthDayFns.format(monthDay, formatString))
    }
  }
}
