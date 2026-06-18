import { Temporal } from 'temporal-polyfill'
import { type IDateChain, type IDateFns } from '../types/index.ts'
import { type Iso } from '../iso-types.ts'
import {
  buildChain,
  isIsoDate,
  slotsFromDate,
  toIsoDate,
  toIsoDateTime,
  toIsoDuration,
  toIsoMonthDay,
  toIsoYearMonth,
  toIsoZonedDateTime
} from '../temporal.ts'
import { buildDurationChainFromTemporal } from './durationFns.ts'
import { buildDateTimeChainFromTemporal } from './dateTimeFns.ts'
import { buildZonedDateTimeChainFromTemporal } from './zonedDateTimeFns.ts'
import { buildYearMonthChainFromTemporal } from './yearMonthFns.ts'
import { buildMonthDayChainFromTemporal } from './monthDayFns.ts'
import { format } from '../format/index.ts'

export const dateFns: IDateFns = {
  now(timeZone) {
    return toIsoDate(Temporal.Now.plainDateISO(timeZone))
  },
  fromNumbers(year, month, day) {
    if (arguments.length < 3) {
      throw new RangeError('missing argument: isoYear, isoMonth and isoDay are required')
    }
    return toIsoDate(new Temporal.PlainDate(year, month, day))
  },
  isValid(date): date is Iso.Date {
    return isIsoDate(date)
  },
  assertIsValid(date): asserts date is Iso.Date {
    if (!isIsoDate(date)) throw new TypeError('invalid receiver')
  },
  getYear: (date) => Temporal.PlainDate.from(date).year,
  getMonth: (date) => Temporal.PlainDate.from(date).month,
  getDay: (date) => Temporal.PlainDate.from(date).day,
  getDayOfWeek: (date) => Temporal.PlainDate.from(date).dayOfWeek,
  getDayOfYear: (date) => Temporal.PlainDate.from(date).dayOfYear,
  getWeekOfYear: (date) => Temporal.PlainDate.from(date).weekOfYear as number,
  getDaysInMonth: (date) => Temporal.PlainDate.from(date).daysInMonth,
  getDaysInYear: (date) => Temporal.PlainDate.from(date).daysInYear,
  inLeapYear: (date) => Temporal.PlainDate.from(date).inLeapYear,
  with: (date, temporalDateLike, options) => toIsoDate(Temporal.PlainDate.from(date).with(temporalDateLike, options)),
  add: (date, durationLike, options) => toIsoDate(Temporal.PlainDate.from(date).add(durationLike, options)),
  subtract: (date, durationLike, options) => toIsoDate(Temporal.PlainDate.from(date).subtract(durationLike, options)),
  until: (date, other, options) => toIsoDuration(Temporal.PlainDate.from(date).until(other, options)),
  since: (date, other, options) => toIsoDuration(Temporal.PlainDate.from(date).since(other, options)),
  equals: (date, other) => Temporal.PlainDate.from(date).equals(other),
  isEqual: (date, other) => Temporal.PlainDate.from(date).equals(other),
  isBefore: (date, other) => Temporal.PlainDate.compare(date, other) < 0,
  isAfter: (date, other) => Temporal.PlainDate.compare(date, other) > 0,
  isEqualOrBefore: (date, other) => Temporal.PlainDate.compare(date, other) <= 0,
  isEqualOrAfter: (date, other) => Temporal.PlainDate.compare(date, other) >= 0,
  toDateTime: (date, time) => toIsoDateTime(Temporal.PlainDate.from(date).toPlainDateTime(time)),
  toZonedDateTime: (date, item) => {
    if (typeof item !== 'object' || item === null) throw new TypeError('invalid argument')
    return toIsoZonedDateTime(
      Temporal.PlainDate.from(date).toZonedDateTime({ timeZone: item.timeZone, plainTime: item.time })
    )
  },
  toYearMonth: (date) => toIsoYearMonth(Temporal.PlainDate.from(date).toPlainYearMonth()),
  toMonthDay: (date) => toIsoMonthDay(Temporal.PlainDate.from(date).toPlainMonthDay()),
  getFields: (date) => slotsFromDate(Temporal.PlainDate.from(date)),
  from: (item, options) => toIsoDate(Temporal.PlainDate.from(item, options)),
  compare: (one, two) => Temporal.PlainDate.compare(one, two),
  format: (date, formatString, options) => format(Temporal.PlainDate.from(date), formatString, options),
  chain: buildDateChain
}

export function buildDateChain(input: Iso.Date): IDateChain {
  return buildDateChainFromTemporal(Temporal.PlainDate.from(input))
}

export function buildDateChainFromTemporal(pd: Temporal.PlainDate): IDateChain {
  return {
    value: () => toIsoDate(pd),
    getYear: () => buildChain(pd.year),
    getMonth: () => buildChain(pd.month),
    getDay: () => buildChain(pd.day),
    getDayOfWeek: () => buildChain(pd.dayOfWeek),
    getDayOfYear: () => buildChain(pd.dayOfYear),
    getWeekOfYear: () => buildChain(pd.weekOfYear as number),
    getDaysInMonth: () => buildChain(pd.daysInMonth),
    getDaysInYear: () => buildChain(pd.daysInYear),
    inLeapYear: () => buildChain(pd.inLeapYear),
    with: (dateLike, options) => buildDateChainFromTemporal(pd.with(dateLike, options)),
    add: (durationLike, options) => buildDateChainFromTemporal(pd.add(durationLike, options)),
    subtract: (durationLike, options) => buildDateChainFromTemporal(pd.subtract(durationLike, options)),
    until: (other, options) => buildDurationChainFromTemporal(pd.until(other, options)),
    since: (other, options) => buildDurationChainFromTemporal(pd.since(other, options)),
    equals: (other) => buildChain(pd.equals(other)),
    isEqual: (other) => buildChain(pd.equals(other)),
    isBefore: (other) => buildChain(Temporal.PlainDate.compare(pd, other) < 0),
    isAfter: (other) => buildChain(Temporal.PlainDate.compare(pd, other) > 0),
    isEqualOrBefore: (other) => buildChain(Temporal.PlainDate.compare(pd, other) <= 0),
    isEqualOrAfter: (other) => buildChain(Temporal.PlainDate.compare(pd, other) >= 0),
    toDateTime: (time) => buildDateTimeChainFromTemporal(pd.toPlainDateTime(time)),
    toZonedDateTime: (item) => {
      if (typeof item !== 'object' || item === null) throw new TypeError('invalid argument')
      return buildZonedDateTimeChainFromTemporal(pd.toZonedDateTime({ timeZone: item.timeZone, plainTime: item.time }))
    },
    toYearMonth: () => buildYearMonthChainFromTemporal(pd.toPlainYearMonth()),
    toMonthDay: () => buildMonthDayChainFromTemporal(pd.toPlainMonthDay()),
    getFields: () => buildChain(slotsFromDate(pd)),
    format: (formatString, options) => buildChain(format(pd, formatString, options))
  }
}
