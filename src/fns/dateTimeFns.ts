import { Temporal } from 'temporal-polyfill'
import { IDateTimeFns, IDateTimeChain } from '../types'
import { Iso } from '../iso-types'
import {
  buildChain,
  isIsoDateTime,
  slotsFromDateTime,
  toIsoDate,
  toIsoDateTime,
  toIsoDuration,
  toIsoMonthDay,
  toIsoTime,
  toIsoYearMonth,
  toIsoZonedDateTime
} from '../temporal'
import { buildDurationChain } from './durationFns'
import { buildZonedDateTimeChain } from './zonedDateTimeFns'
import { buildDateChain } from './dateFns'
import { buildYearMonthChain } from './yearMonthFns'
import { buildMonthDayChain } from './monthDayFns'
import { buildTimeChain } from './timeFns'
import format from '../format'

export const dateTimeFns: IDateTimeFns = {
  now(timeZone) {
    return toIsoDateTime(Temporal.Now.plainDateTimeISO(timeZone))
  },
  fromNumbers(year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0) {
    if (arguments.length < 3) {
      throw new RangeError('missing argument: isoYear, isoMonth and isoDay are required')
    }
    return toIsoDateTime(new Temporal.PlainDateTime(year, month, day, hour, minute, second, millisecond))
  },
  isValid(dateTime): dateTime is Iso.DateTime {
    return isIsoDateTime(dateTime)
  },
  assertIsValid(dateTime): asserts dateTime is Iso.DateTime {
    if (!isIsoDateTime(dateTime)) throw new TypeError('invalid receiver')
  },
  getYear: (dt) => Temporal.PlainDateTime.from(dt).year,
  getMonth: (dt) => Temporal.PlainDateTime.from(dt).month,
  getDay: (dt) => Temporal.PlainDateTime.from(dt).day,
  getHour: (dt) => Temporal.PlainDateTime.from(dt).hour,
  getMinute: (dt) => Temporal.PlainDateTime.from(dt).minute,
  getSecond: (dt) => Temporal.PlainDateTime.from(dt).second,
  getMillisecond: (dt) => Temporal.PlainDateTime.from(dt).millisecond,
  getDayOfWeek: (dt) => Temporal.PlainDateTime.from(dt).dayOfWeek,
  getDayOfYear: (dt) => Temporal.PlainDateTime.from(dt).dayOfYear,
  getWeekOfYear: (dt) => Temporal.PlainDateTime.from(dt).weekOfYear as number,
  getDaysInYear: (dt) => Temporal.PlainDateTime.from(dt).daysInYear,
  getDaysInMonth: (dt) => Temporal.PlainDateTime.from(dt).daysInMonth,
  getInLeapYear: (dt) => Temporal.PlainDateTime.from(dt).inLeapYear,
  with: (dt, dtLike, options) => toIsoDateTime(Temporal.PlainDateTime.from(dt).with(dtLike, options)),
  withTime: (dt, time) => toIsoDateTime(Temporal.PlainDateTime.from(dt).withPlainTime(time)),
  withDate: (dt, date) => {
    const pd = Temporal.PlainDate.from(date)
    const { hour, minute, second, millisecond } = Temporal.PlainDateTime.from(dt)
    return toIsoDateTime(pd.toPlainDateTime({ hour, minute, second, millisecond }))
  },
  add: (dt, durationLike, options) => toIsoDateTime(Temporal.PlainDateTime.from(dt).add(durationLike as any, options)),
  subtract: (dt, durationLike, options) =>
    toIsoDateTime(Temporal.PlainDateTime.from(dt).subtract(durationLike as any, options)),
  until: (from, until, options) => toIsoDuration(Temporal.PlainDateTime.from(from).until(until, options as any)),
  since: (dt, other, options) => toIsoDuration(Temporal.PlainDateTime.from(dt).since(other, options as any)),
  round: (dt, options) => toIsoDateTime(Temporal.PlainDateTime.from(dt).round(options as any)),
  equals: (dt, other) => Temporal.PlainDateTime.from(dt).equals(other),
  isEqual: (dt, other) => Temporal.PlainDateTime.compare(dt, other) === 0,
  isBefore: (dt, other) => Temporal.PlainDateTime.compare(dt, other) < 0,
  isAfter: (dt, other) => Temporal.PlainDateTime.compare(dt, other) > 0,
  isEqualOrBefore: (dt, other) => Temporal.PlainDateTime.compare(dt, other) <= 0,
  isEqualOrAfter: (dt, other) => Temporal.PlainDateTime.compare(dt, other) >= 0,
  toZonedDateTime: (dt, timeZone, options) =>
    toIsoZonedDateTime(Temporal.PlainDateTime.from(dt).toZonedDateTime(timeZone, options)),
  toDate: (dt) => toIsoDate(Temporal.PlainDateTime.from(dt).toPlainDate()),
  toYearMonth: (dt) => toIsoYearMonth(Temporal.PlainDateTime.from(dt).toPlainDate().toPlainYearMonth()),
  toMonthDay: (dt) => toIsoMonthDay(Temporal.PlainDateTime.from(dt).toPlainDate().toPlainMonthDay()),
  toTime: (dt) => toIsoTime(Temporal.PlainDateTime.from(dt).toPlainTime()),
  getFields: (dt) => slotsFromDateTime(Temporal.PlainDateTime.from(dt)),
  from: (item, options) => toIsoDateTime(Temporal.PlainDateTime.from(item, options)),
  compare: (one, two) => Temporal.PlainDateTime.compare(one, two),
  format: (dt, formatString) => format(slotsFromDateTime(Temporal.PlainDateTime.from(dt)), formatString),
  chain: buildDateTimeChain
}

export function buildDateTimeChain(input: Iso.DateTime | Temporal.PlainDateTime): IDateTimeChain {
  const pdt = typeof input === 'string' ? Temporal.PlainDateTime.from(input) : input
  return {
    value: () => toIsoDateTime(pdt),
    getYear: () => buildChain(pdt.year),
    getMonth: () => buildChain(pdt.month),
    getDay: () => buildChain(pdt.day),
    getHour: () => buildChain(pdt.hour),
    getMinute: () => buildChain(pdt.minute),
    getSecond: () => buildChain(pdt.second),
    getMillisecond: () => buildChain(pdt.millisecond),
    getDayOfWeek: () => buildChain(pdt.dayOfWeek),
    getDayOfYear: () => buildChain(pdt.dayOfYear),
    getWeekOfYear: () => buildChain(pdt.weekOfYear as number),
    getDaysInYear: () => buildChain(pdt.daysInYear),
    getDaysInMonth: () => buildChain(pdt.daysInMonth),
    getInLeapYear: () => buildChain(pdt.inLeapYear),
    with: (dtLike, options) => buildDateTimeChain(pdt.with(dtLike, options)),
    withTime: (time) => buildDateTimeChain(pdt.withPlainTime(time)),
    withDate: (date) => {
      const pd = Temporal.PlainDate.from(date)
      return buildDateTimeChain(
        pd.toPlainDateTime({ hour: pdt.hour, minute: pdt.minute, second: pdt.second, millisecond: pdt.millisecond })
      )
    },
    add: (durationLike, options) => buildDateTimeChain(pdt.add(durationLike as any, options)),
    subtract: (durationLike, options) => buildDateTimeChain(pdt.subtract(durationLike as any, options)),
    until: (other, options) => buildDurationChain(pdt.until(other, options as any)),
    since: (other, options) => buildDurationChain(pdt.since(other, options as any)),
    round: (options) => buildDateTimeChain(pdt.round(options as any)),
    equals: (other) => buildChain(pdt.equals(other)),
    isEqual: (other) => buildChain(Temporal.PlainDateTime.compare(pdt, other) === 0),
    isBefore: (other) => buildChain(Temporal.PlainDateTime.compare(pdt, other) < 0),
    isAfter: (other) => buildChain(Temporal.PlainDateTime.compare(pdt, other) > 0),
    isEqualOrBefore: (other) => buildChain(Temporal.PlainDateTime.compare(pdt, other) <= 0),
    isEqualOrAfter: (other) => buildChain(Temporal.PlainDateTime.compare(pdt, other) >= 0),
    toZonedDateTime: (timeZone, options) => buildZonedDateTimeChain(pdt.toZonedDateTime(timeZone, options)),
    toDate: () => buildDateChain(pdt.toPlainDate()),
    toYearMonth: () => buildYearMonthChain(pdt.toPlainDate().toPlainYearMonth()),
    toMonthDay: () => buildMonthDayChain(pdt.toPlainDate().toPlainMonthDay()),
    toTime: () => buildTimeChain(pdt.toPlainTime()),
    getFields: () => buildChain(slotsFromDateTime(pdt)),
    format: (formatString) => buildChain(format(slotsFromDateTime(pdt), formatString))
  }
}
