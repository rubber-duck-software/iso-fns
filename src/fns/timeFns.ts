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
import { buildDurationChainFromTemporal } from './durationFns'
import { buildDateTimeChainFromTemporal } from './dateTimeFns'
import { buildZonedDateTimeChainFromTemporal } from './zonedDateTimeFns'
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
  add: (time, durationLike) => toIsoTime(Temporal.PlainTime.from(time).add(Temporal.Duration.from(durationLike))),
  subtract: (time, durationLike) => toIsoTime(Temporal.PlainTime.from(time).subtract(Temporal.Duration.from(durationLike))),
  until: (time, other, options) => toIsoDuration(Temporal.PlainTime.from(time).until(other, options)),
  since: (time, other, options) => toIsoDuration(Temporal.PlainTime.from(time).since(other, options)),
  round: (time, options) => toIsoTime(Temporal.PlainTime.from(time).round(options)),
  equals: (time, other) => Temporal.PlainTime.from(time).equals(other),
  isEqual: (time, other) => Temporal.PlainTime.from(time).equals(other),
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
  format: (time, formatString, options) => format(Temporal.PlainTime.from(time), formatString, options),
  chain: buildTimeChain
}

export function buildTimeChain(input: Iso.Time): ITimeChain {
  return buildTimeChainFromTemporal(Temporal.PlainTime.from(input))
}

export function buildTimeChainFromTemporal(pt: Temporal.PlainTime): ITimeChain {
  return {
    value: () => toIsoTime(pt),
    getHour: () => buildChain(pt.hour),
    getMinute: () => buildChain(pt.minute),
    getSecond: () => buildChain(pt.second),
    getMillisecond: () => buildChain(pt.millisecond),
    with: (timeLike, options) => buildTimeChainFromTemporal(pt.with(timeLike, options)),
    add: (durationLike) => buildTimeChainFromTemporal(pt.add(Temporal.Duration.from(durationLike))),
    subtract: (durationLike) => buildTimeChainFromTemporal(pt.subtract(Temporal.Duration.from(durationLike))),
    until: (other, options) => buildDurationChainFromTemporal(pt.until(other, options)),
    since: (other, options) => buildDurationChainFromTemporal(pt.since(other, options)),
    round: (options) => buildTimeChainFromTemporal(pt.round(options)),
    equals: (other) => buildChain(pt.equals(other)),
    isEqual: (other) => buildChain(pt.equals(other)),
    toDateTime: (date) => buildDateTimeChainFromTemporal(Temporal.PlainDate.from(date).toPlainDateTime(pt)),
    toZonedDateTime: (item) => {
      if (typeof item !== 'object' || item === null) throw new TypeError('invalid argument')
      if (item.date === undefined) throw new TypeError('missing date property')
      if (item.timeZone === undefined) throw new TypeError('missing timeZone property')
      return buildZonedDateTimeChainFromTemporal(
        Temporal.PlainDate.from(item.date).toZonedDateTime({ timeZone: item.timeZone, plainTime: pt })
      )
    },
    getFields: () => buildChain(slotsFromTime(pt)),
    format: (formatString, options) => buildChain(format(pt, formatString, options))
  }
}
