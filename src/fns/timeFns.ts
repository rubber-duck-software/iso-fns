import { Temporal } from 'temporal-polyfill'
import { ITimeChain, ITimeFns } from '../types'
import { Iso } from '../iso-types'
import {
  buildChain,
  isIsoTime,
  slotsFromTime,
  toIsoDateTime,
  toIsoDuration,
  toIsoTime,
  toIsoZonedDateTime
} from '../temporal'
import { buildDurationChain } from './durationFns'
import { buildDateTimeChain } from './dateTimeFns'
import { buildZonedDateTimeChain } from './zonedDateTimeFns'
import format from '../format'

export const timeFns: ITimeFns = {
  now(timeZone) {
    return toIsoTime(Temporal.Now.plainTimeISO(timeZone))
  },
  fromNumbers(hour = 0, minute = 0, second = 0, millisecond = 0) {
    return toIsoTime(new Temporal.PlainTime(hour, minute, second, millisecond))
  },
  isValid(time): time is Iso.Time {
    return isIsoTime(time)
  },
  assertIsValid(time): asserts time is Iso.Time {
    if (!isIsoTime(time)) throw new TypeError('invalid receiver')
  },
  getHour: (time) => Temporal.PlainTime.from(time).hour,
  getMinute: (time) => Temporal.PlainTime.from(time).minute,
  getSecond: (time) => Temporal.PlainTime.from(time).second,
  getMillisecond: (time) => Temporal.PlainTime.from(time).millisecond,
  with: (time, timeLike, options) => toIsoTime(Temporal.PlainTime.from(time).with(timeLike, options)),
  add: (time, durationLike) => toIsoTime(Temporal.PlainTime.from(time).add(Temporal.Duration.from(durationLike as any))),
  subtract: (time, durationLike) =>
    toIsoTime(Temporal.PlainTime.from(time).subtract(Temporal.Duration.from(durationLike as any))),
  until: (time, other, options) => toIsoDuration(Temporal.PlainTime.from(time).until(other, options as any)),
  since: (time, other, options) => toIsoDuration(Temporal.PlainTime.from(time).since(other, options as any)),
  round: (time, options) => toIsoTime(Temporal.PlainTime.from(time).round(options as any)),
  equals: (time, other) => Temporal.PlainTime.from(time).equals(other),
  toDateTime: (time, date) => toIsoDateTime(Temporal.PlainDate.from(date).toPlainDateTime(time)),
  toZonedDateTime: (time, item) => {
    if (typeof item !== 'object' || item === null) throw new TypeError('invalid argument')
    if (item.date === undefined) throw new TypeError('missing date property')
    if (item.timeZone === undefined) throw new TypeError('missing timeZone property')
    return toIsoZonedDateTime(
      Temporal.PlainDate.from(item.date).toZonedDateTime({ timeZone: item.timeZone, plainTime: time })
    )
  },
  getFields: (time) => slotsFromTime(Temporal.PlainTime.from(time)),
  from: (item, options) => toIsoTime(Temporal.PlainTime.from(item, options)),
  compare: (one, two) => Temporal.PlainTime.compare(one, two),
  format: (time, formatString) => format(slotsFromTime(Temporal.PlainTime.from(time)), formatString),
  chain: buildTimeChain
}

export function buildTimeChain(input: Iso.Time | Temporal.PlainTime): ITimeChain {
  const pt = typeof input === 'string' ? Temporal.PlainTime.from(input) : input
  return {
    value: () => toIsoTime(pt),
    getHour: () => buildChain(pt.hour),
    getMinute: () => buildChain(pt.minute),
    getSecond: () => buildChain(pt.second),
    getMillisecond: () => buildChain(pt.millisecond),
    with: (timeLike, options) => buildTimeChain(pt.with(timeLike, options)),
    add: (durationLike) => buildTimeChain(pt.add(Temporal.Duration.from(durationLike as any))),
    subtract: (durationLike) => buildTimeChain(pt.subtract(Temporal.Duration.from(durationLike as any))),
    until: (other, options) => buildDurationChain(pt.until(other, options as any)),
    since: (other, options) => buildDurationChain(pt.since(other, options as any)),
    round: (options) => buildTimeChain(pt.round(options as any)),
    equals: (other) => buildChain(pt.equals(other)),
    toDateTime: (date) => buildDateTimeChain(Temporal.PlainDate.from(date).toPlainDateTime(pt)),
    toZonedDateTime: (item) =>
      buildZonedDateTimeChain(
        Temporal.PlainDate.from(item.date).toZonedDateTime({ timeZone: item.timeZone, plainTime: pt })
      ),
    getFields: () => buildChain(slotsFromTime(pt)),
    format: (formatString) => buildChain(format(slotsFromTime(pt), formatString))
  }
}
