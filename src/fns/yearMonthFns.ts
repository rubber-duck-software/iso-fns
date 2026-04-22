import { Temporal } from 'temporal-polyfill'
import { IYearMonthFns, IYearMonthChain } from '../types'
import { Iso } from '../iso-types'
import { buildChain, isIsoYearMonth, slotsFromYearMonth, toIsoDate, toIsoDuration, toIsoYearMonth } from '../temporal'
import { buildDurationChain } from './durationFns'
import { buildDateChain } from './dateFns'
import format from '../format'

export const yearMonthFns: IYearMonthFns = {
  fromNumbers(year, month) {
    if (arguments.length < 2) {
      throw new RangeError('missing argument: isoYear and isoMonth are required')
    }
    return toIsoYearMonth(new Temporal.PlainYearMonth(year, month))
  },
  isValid(yearMonth): yearMonth is Iso.YearMonth {
    return isIsoYearMonth(yearMonth)
  },
  assertIsValid(yearMonth): asserts yearMonth is Iso.YearMonth {
    if (!isIsoYearMonth(yearMonth)) throw new TypeError('invalid receiver')
  },
  getYear: (ym) => Temporal.PlainYearMonth.from(ym).year,
  getMonth: (ym) => Temporal.PlainYearMonth.from(ym).month,
  getDaysInMonth: (ym) => Temporal.PlainYearMonth.from(ym).daysInMonth,
  getDaysInYear: (ym) => Temporal.PlainYearMonth.from(ym).daysInYear,
  inLeapYear: (ym) => Temporal.PlainYearMonth.from(ym).inLeapYear,
  with: (ym, ymLike, options) => toIsoYearMonth(Temporal.PlainYearMonth.from(ym).with(ymLike, options)),
  add: (ym, durationLike, options) => toIsoYearMonth(Temporal.PlainYearMonth.from(ym).add(durationLike as any, options)),
  subtract: (ym, durationLike, options) =>
    toIsoYearMonth(Temporal.PlainYearMonth.from(ym).subtract(durationLike as any, options)),
  until: (ym, other, options) => toIsoDuration(Temporal.PlainYearMonth.from(ym).until(other, options as any)),
  since: (ym, other, options) => toIsoDuration(Temporal.PlainYearMonth.from(ym).since(other, options as any)),
  equals: (ym, other) => Temporal.PlainYearMonth.from(ym).equals(other),
  isEqual: (ym, other) => Temporal.PlainYearMonth.compare(ym, other) === 0,
  isBefore: (ym, other) => Temporal.PlainYearMonth.compare(ym, other) < 0,
  isAfter: (ym, other) => Temporal.PlainYearMonth.compare(ym, other) > 0,
  isEqualOrBefore: (ym, other) => Temporal.PlainYearMonth.compare(ym, other) <= 0,
  isEqualOrAfter: (ym, other) => Temporal.PlainYearMonth.compare(ym, other) >= 0,
  toDate: (ym, day) => {
    if (typeof day !== 'number') throw new TypeError('argument should be a number')
    return toIsoDate(Temporal.PlainYearMonth.from(ym).toPlainDate({ day }))
  },
  getFields: (ym) => slotsFromYearMonth(Temporal.PlainYearMonth.from(ym)),
  from: (item, options) => toIsoYearMonth(Temporal.PlainYearMonth.from(item, options)),
  compare: (one, two) => Temporal.PlainYearMonth.compare(one, two),
  format: (ym, formatString) => format(slotsFromYearMonth(Temporal.PlainYearMonth.from(ym)), formatString),
  chain: buildYearMonthChain
}

export function buildYearMonthChain(input: Iso.YearMonth | Temporal.PlainYearMonth): IYearMonthChain {
  const pym = typeof input === 'string' ? Temporal.PlainYearMonth.from(input) : input
  return {
    value: () => toIsoYearMonth(pym),
    getYear: () => buildChain(pym.year),
    getMonth: () => buildChain(pym.month),
    getDaysInMonth: () => buildChain(pym.daysInMonth),
    getDaysInYear: () => buildChain(pym.daysInYear),
    inLeapYear: () => buildChain(pym.inLeapYear),
    with: (ymLike, options) => buildYearMonthChain(pym.with(ymLike, options)),
    add: (durationLike, options) => buildYearMonthChain(pym.add(durationLike as any, options)),
    subtract: (durationLike, options) => buildYearMonthChain(pym.subtract(durationLike as any, options)),
    until: (other, options) => buildDurationChain(pym.until(other, options as any)),
    since: (other, options) => buildDurationChain(pym.since(other, options as any)),
    equals: (other) => buildChain(pym.equals(other)),
    isEqual: (other) => buildChain(Temporal.PlainYearMonth.compare(pym, other) === 0),
    isBefore: (other) => buildChain(Temporal.PlainYearMonth.compare(pym, other) < 0),
    isAfter: (other) => buildChain(Temporal.PlainYearMonth.compare(pym, other) > 0),
    isEqualOrBefore: (other) => buildChain(Temporal.PlainYearMonth.compare(pym, other) <= 0),
    isEqualOrAfter: (other) => buildChain(Temporal.PlainYearMonth.compare(pym, other) >= 0),
    toDate: (day) => buildDateChain(pym.toPlainDate({ day })),
    getFields: () => buildChain(slotsFromYearMonth(pym)),
    format: (formatString) => buildChain(format(slotsFromYearMonth(pym), formatString))
  }
}
