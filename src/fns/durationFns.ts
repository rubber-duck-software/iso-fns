import { Temporal } from 'temporal-polyfill'
import { IDurationChain, IDurationFns } from '../types'
import { Iso } from '../iso-types'
import { buildChain, isIsoDuration, slotsFromDuration, toIsoDuration } from '../temporal'

type RelativeTo = Iso.Date | Iso.DateTime | Iso.ZonedDateTime | undefined

function toRelativePoint(relativeTo: RelativeTo): Temporal.ZonedDateTime | Temporal.PlainDateTime | undefined {
  if (relativeTo === undefined) return undefined
  if (relativeTo.includes('[')) return Temporal.ZonedDateTime.from(relativeTo)
  return Temporal.PlainDateTime.from(relativeTo)
}

export const durationFns: IDurationFns = {
  fromNumbers(years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
    return toIsoDuration(new Temporal.Duration(years, months, weeks, days, hours, minutes, seconds, milliseconds))
  },
  isValid(duration): duration is Iso.Duration {
    return isIsoDuration(duration)
  },
  assertIsValid(duration): asserts duration is Iso.Duration {
    if (!isIsoDuration(duration)) throw new TypeError('invalid receiver')
  },
  getYears: (duration) => Temporal.Duration.from(duration).years,
  getMonths: (duration) => Temporal.Duration.from(duration).months,
  getWeeks: (duration) => Temporal.Duration.from(duration).weeks,
  getDays: (duration) => Temporal.Duration.from(duration).days,
  getHours: (duration) => Temporal.Duration.from(duration).hours,
  getMinutes: (duration) => Temporal.Duration.from(duration).minutes,
  getSeconds: (duration) => Temporal.Duration.from(duration).seconds,
  getMilliseconds: (duration) => Temporal.Duration.from(duration).milliseconds,
  getSign: (duration) => Temporal.Duration.from(duration).sign,
  isBlank: (duration) => Temporal.Duration.from(duration).blank,
  with: (duration, durationLike) => toIsoDuration(Temporal.Duration.from(duration).with(durationLike)),
  negated: (duration) => toIsoDuration(Temporal.Duration.from(duration).negated()),
  abs: (duration) => toIsoDuration(Temporal.Duration.from(duration).abs()),
  add: (duration, other, options) => {
    const d1 = Temporal.Duration.from(duration)
    const d2 = Temporal.Duration.from(other as any)
    const rel = toRelativePoint(options?.relativeTo as RelativeTo)
    if (rel) return toIsoDuration(rel.until(rel.add(d1).add(d2), { largestUnit: 'year' }))
    return toIsoDuration(d1.add(d2))
  },
  subtract: (duration, other, options) => {
    const d1 = Temporal.Duration.from(duration)
    const d2 = Temporal.Duration.from(other as any)
    const rel = toRelativePoint(options?.relativeTo as RelativeTo)
    if (rel) return toIsoDuration(rel.until(rel.add(d1).subtract(d2), { largestUnit: 'year' }))
    return toIsoDuration(d1.subtract(d2))
  },
  round: (duration, options) => toIsoDuration(Temporal.Duration.from(duration).round(options as any)),
  total: (duration, options) => Temporal.Duration.from(duration).total(options as any),
  getFields: (duration) => slotsFromDuration(Temporal.Duration.from(duration)),
  from: (item) => toIsoDuration(Temporal.Duration.from(item)),
  compare: (one, two, options) => Temporal.Duration.compare(one, two, options as any),
  chain: buildDurationChain
}

export function buildDurationChain(input: Iso.Duration | Temporal.Duration): IDurationChain {
  const dur = typeof input === 'string' ? Temporal.Duration.from(input) : input
  return {
    value: () => toIsoDuration(dur),
    getYears: () => buildChain(dur.years),
    getMonths: () => buildChain(dur.months),
    getWeeks: () => buildChain(dur.weeks),
    getDays: () => buildChain(dur.days),
    getHours: () => buildChain(dur.hours),
    getMinutes: () => buildChain(dur.minutes),
    getSeconds: () => buildChain(dur.seconds),
    getMilliseconds: () => buildChain(dur.milliseconds),
    getSign: () => buildChain(dur.sign),
    isBlank: () => buildChain(dur.blank),
    with: (durationLike) => buildDurationChain(dur.with(durationLike)),
    negated: () => buildDurationChain(dur.negated()),
    abs: () => buildDurationChain(dur.abs()),
    add: (other) => buildDurationChain(dur.add(Temporal.Duration.from(other as any))),
    subtract: (other) => buildDurationChain(dur.subtract(Temporal.Duration.from(other as any))),
    round: (options) => buildDurationChain(dur.round(options as any)),
    total: (options) => buildChain(dur.total(options as any)),
    getFields: () => buildChain(slotsFromDuration(dur))
  }
}
