import { Temporal } from 'temporal-polyfill'
import { IMonthDayFns, IMonthDayChain } from '../types'
import { Iso } from '../iso-types'
import { buildChain, isIsoMonthDay, slotsFromMonthDay, toIsoDate, toIsoMonthDay } from '../temporal'
import { buildDateChain } from './dateFns'
import format from '../format'

export const monthDayFns: IMonthDayFns = {
  fromNumbers(month, day) {
    if (arguments.length < 2) {
      throw new RangeError('missing argument: isoMonth and isoDay are required')
    }
    return toIsoMonthDay(new Temporal.PlainMonthDay(month, day))
  },
  isValid(monthDay): monthDay is Iso.MonthDay {
    return isIsoMonthDay(monthDay)
  },
  assertIsValid(monthDay): asserts monthDay is Iso.MonthDay {
    if (!isIsoMonthDay(monthDay)) throw new TypeError('invalid receiver')
  },
  getDay: (md) => Temporal.PlainMonthDay.from(md).day,
  getMonth: (md) => slotsFromMonthDay(Temporal.PlainMonthDay.from(md)).month,
  with: (md, mdLike, options) => toIsoMonthDay(Temporal.PlainMonthDay.from(md).with(mdLike, options)),
  equals: (md, other) => Temporal.PlainMonthDay.from(md).equals(other),
  toDate: (md, year) => toIsoDate(Temporal.PlainMonthDay.from(md).toPlainDate({ year })),
  getFields: (md) => slotsFromMonthDay(Temporal.PlainMonthDay.from(md)),
  from: (item, options) => toIsoMonthDay(Temporal.PlainMonthDay.from(item, options)),
  compare: (one, two) => {
    const a = slotsFromMonthDay(Temporal.PlainMonthDay.from(one))
    const b = slotsFromMonthDay(Temporal.PlainMonthDay.from(two))
    if (a.month !== b.month) return a.month < b.month ? -1 : 1
    if (a.day !== b.day) return a.day < b.day ? -1 : 1
    return 0
  },
  format: (md, formatString) => format(slotsFromMonthDay(Temporal.PlainMonthDay.from(md)), formatString),
  chain: buildMonthDayChain
}

export function buildMonthDayChain(input: Iso.MonthDay | Temporal.PlainMonthDay): IMonthDayChain {
  const pmd = typeof input === 'string' ? Temporal.PlainMonthDay.from(input) : input
  const slots = slotsFromMonthDay(pmd)
  return {
    value: () => toIsoMonthDay(pmd),
    getDay: () => buildChain(slots.day),
    getMonth: () => buildChain(slots.month),
    with: (mdLike, options) => buildMonthDayChain(pmd.with(mdLike, options)),
    equals: (other) => buildChain(pmd.equals(other)),
    toDate: (year: number) => buildDateChain(pmd.toPlainDate({ year })),
    getFields: () => buildChain(slots),
    format: (formatString) => buildChain(format(slots, formatString))
  }
}
