import { Temporal } from 'temporal-polyfill'
import { Iso } from '../iso-types'
import { IZonedDateTimeFns, IZonedDateTimeChain } from '../types'
import {
  buildChain,
  isIsoZonedDateTime,
  slotsFromZonedDateTime,
  toIsoDate,
  toIsoDateTime,
  toIsoDuration,
  toIsoInstant,
  toIsoMonthDay,
  toIsoTime,
  toIsoYearMonth,
  toIsoZonedDateTime
} from '../temporal'
import { buildDurationChain } from './durationFns'
import { buildInstantChain } from './instantFns'
import { buildDateChain } from './dateFns'
import { buildTimeChain } from './timeFns'
import { buildDateTimeChain } from './dateTimeFns'
import { buildYearMonthChain } from './yearMonthFns'
import { buildMonthDayChain } from './monthDayFns'
import format from '../format'

function dateFromInput(date: Iso.Date | { year: number; month: number; day: number }): Temporal.PlainDate {
  if (typeof date === 'string') return Temporal.PlainDate.from(date)
  return new Temporal.PlainDate(date.year, date.month, date.day)
}

export const zonedDateTimeFns: IZonedDateTimeFns = {
  now(timeZone) {
    return toIsoZonedDateTime(Temporal.Now.zonedDateTimeISO(timeZone))
  },
  currentTimeZone() {
    return Temporal.Now.timeZoneId()
  },
  fromEpochMilliseconds(epochMilliseconds, timeZone) {
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochMilliseconds is required')
    }
    return toIsoZonedDateTime(Temporal.Instant.fromEpochMilliseconds(epochMilliseconds).toZonedDateTimeISO(timeZone))
  },
  isValid(zdt): zdt is Iso.ZonedDateTime {
    return isIsoZonedDateTime(zdt)
  },
  assertIsValid(zdt): asserts zdt is Iso.ZonedDateTime {
    if (!isIsoZonedDateTime(zdt)) throw new TypeError('invalid receiver')
  },
  getTimeZone: (zdt) => Temporal.ZonedDateTime.from(zdt).timeZoneId,
  getYear: (zdt) => Temporal.ZonedDateTime.from(zdt).year,
  getMonth: (zdt) => Temporal.ZonedDateTime.from(zdt).month,
  getDay: (zdt) => Temporal.ZonedDateTime.from(zdt).day,
  getHour: (zdt) => Temporal.ZonedDateTime.from(zdt).hour,
  getMinute: (zdt) => Temporal.ZonedDateTime.from(zdt).minute,
  getSecond: (zdt) => Temporal.ZonedDateTime.from(zdt).second,
  getMillisecond: (zdt) => Temporal.ZonedDateTime.from(zdt).millisecond,
  getEpochSeconds: (zdt) => Math.floor(Temporal.ZonedDateTime.from(zdt).epochMilliseconds / 1000),
  getEpochMilliseconds: (zdt) => Temporal.ZonedDateTime.from(zdt).epochMilliseconds,
  getDayOfWeek: (zdt) => Temporal.ZonedDateTime.from(zdt).dayOfWeek,
  getDayOfYear: (zdt) => Temporal.ZonedDateTime.from(zdt).dayOfYear,
  getWeekOfYear: (zdt) => Temporal.ZonedDateTime.from(zdt).weekOfYear as number,
  getHoursInDay: (zdt) => Temporal.ZonedDateTime.from(zdt).hoursInDay,
  getDaysInMonth: (zdt) => Temporal.ZonedDateTime.from(zdt).daysInMonth,
  getDaysInYear: (zdt) => Temporal.ZonedDateTime.from(zdt).daysInYear,
  inLeapYear: (zdt) => Temporal.ZonedDateTime.from(zdt).inLeapYear,
  getOffset: (zdt) => Temporal.ZonedDateTime.from(zdt).offset,
  getOffsetMilliseconds: (zdt) => Temporal.ZonedDateTime.from(zdt).offsetNanoseconds / 1_000_000,
  with: (zdt, zdtLike, options) => toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).with(zdtLike, options)),
  withDate: (zdt, date) => {
    const pd = dateFromInput(date)
    return toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).with({ year: pd.year, month: pd.month, day: pd.day }))
  },
  withTime: (zdt, time) => toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).withPlainTime(time as any)),
  withTimeZone: (zdt, timeZone) => toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).withTimeZone(timeZone)),
  add: (zdt, durationLike, options) =>
    toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).add(durationLike as any, options)),
  subtract: (zdt, durationLike, options) =>
    toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).subtract(durationLike as any, options)),
  until: (zdt, other, options) => toIsoDuration(Temporal.ZonedDateTime.from(zdt).until(other, options as any)),
  since: (zdt, other, options) => toIsoDuration(Temporal.ZonedDateTime.from(zdt).since(other, options as any)),
  round: (zdt, options) => toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).round(options as any)),
  equals: (zdt, other) => Temporal.ZonedDateTime.from(zdt).equals(other),
  startOfDay: (zdt) => toIsoZonedDateTime(Temporal.ZonedDateTime.from(zdt).startOfDay()),
  toInstant: (zdt) => toIsoInstant(Temporal.ZonedDateTime.from(zdt).toInstant()),
  toDate: (zdt) => toIsoDate(Temporal.ZonedDateTime.from(zdt).toPlainDate()),
  toTime: (zdt) => toIsoTime(Temporal.ZonedDateTime.from(zdt).toPlainTime()),
  toDateTime: (zdt) => toIsoDateTime(Temporal.ZonedDateTime.from(zdt).toPlainDateTime()),
  toYearMonth: (zdt) => toIsoYearMonth(Temporal.ZonedDateTime.from(zdt).toPlainDate().toPlainYearMonth()),
  toMonthDay: (zdt) => toIsoMonthDay(Temporal.ZonedDateTime.from(zdt).toPlainDate().toPlainMonthDay()),
  getFields: (zdt) => slotsFromZonedDateTime(Temporal.ZonedDateTime.from(zdt)),
  from: (item, options) => toIsoZonedDateTime(Temporal.ZonedDateTime.from(item, options)),
  compare: (one, two) => Temporal.ZonedDateTime.compare(one, two),
  format: (zdt, formatString) => format(slotsFromZonedDateTime(Temporal.ZonedDateTime.from(zdt)), formatString),
  chain: buildZonedDateTimeChain
}

export function buildZonedDateTimeChain(input: Iso.ZonedDateTime | Temporal.ZonedDateTime): IZonedDateTimeChain {
  const zdt = typeof input === 'string' ? Temporal.ZonedDateTime.from(input) : input
  return {
    value: () => toIsoZonedDateTime(zdt),
    getTimeZone: () => buildChain(zdt.timeZoneId),
    getYear: () => buildChain(zdt.year),
    getMonth: () => buildChain(zdt.month),
    getDay: () => buildChain(zdt.day),
    getHour: () => buildChain(zdt.hour),
    getMinute: () => buildChain(zdt.minute),
    getSecond: () => buildChain(zdt.second),
    getMillisecond: () => buildChain(zdt.millisecond),
    getEpochSeconds: () => buildChain(Math.floor(zdt.epochMilliseconds / 1000)),
    getEpochMilliseconds: () => buildChain(zdt.epochMilliseconds),
    getDayOfWeek: () => buildChain(zdt.dayOfWeek),
    getDayOfYear: () => buildChain(zdt.dayOfYear),
    getWeekOfYear: () => buildChain(zdt.weekOfYear as number),
    getHoursInDay: () => buildChain(zdt.hoursInDay),
    getDaysInMonth: () => buildChain(zdt.daysInMonth),
    getDaysInYear: () => buildChain(zdt.daysInYear),
    inLeapYear: () => buildChain(zdt.inLeapYear),
    getOffset: () => buildChain(zdt.offset),
    getOffsetMilliseconds: () => buildChain(zdt.offsetNanoseconds / 1_000_000),
    with: (zdtLike, options) => buildZonedDateTimeChain(zdt.with(zdtLike, options)),
    withDate: (date) => {
      const pd = dateFromInput(date)
      return buildZonedDateTimeChain(zdt.with({ year: pd.year, month: pd.month, day: pd.day }))
    },
    withTime: (time) => buildZonedDateTimeChain(zdt.withPlainTime(time as any)),
    withTimeZone: (timeZone) => buildZonedDateTimeChain(zdt.withTimeZone(timeZone)),
    add: (durationLike, options) => buildZonedDateTimeChain(zdt.add(durationLike as any, options)),
    subtract: (durationLike, options) => buildZonedDateTimeChain(zdt.subtract(durationLike as any, options)),
    until: (other, options) => buildDurationChain(zdt.until(other, options as any)),
    since: (other, options) => buildDurationChain(zdt.since(other, options as any)),
    round: (options) => buildZonedDateTimeChain(zdt.round(options as any)),
    equals: (other) => buildChain(zdt.equals(other)),
    startOfDay: () => buildZonedDateTimeChain(zdt.startOfDay()),
    toInstant: () => buildInstantChain(zdt.toInstant()),
    toDate: () => buildDateChain(zdt.toPlainDate()),
    toTime: () => buildTimeChain(zdt.toPlainTime()),
    toDateTime: () => buildDateTimeChain(zdt.toPlainDateTime()),
    toYearMonth: () => buildYearMonthChain(zdt.toPlainDate().toPlainYearMonth()),
    toMonthDay: () => buildMonthDayChain(zdt.toPlainDate().toPlainMonthDay()),
    getFields: () => buildChain(slotsFromZonedDateTime(zdt)),
    format: (formatString) => buildChain(format(slotsFromZonedDateTime(zdt), formatString))
  }
}
