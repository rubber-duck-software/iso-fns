import { Temporal } from 'temporal-polyfill'
import type { IInstantChain, IInstantFns } from '../types/index.ts'
import { type Iso } from '../iso-types.ts'
import { buildChain, isIsoInstant, toIsoDuration, toIsoInstant, toIsoZonedDateTime } from '../temporal.ts'
import { buildDurationChainFromTemporal } from './durationFns.ts'
import { buildZonedDateTimeChainFromTemporal } from './zonedDateTimeFns.ts'

function formatInstantISO9075(inst: Temporal.Instant): string {
  const zdt = inst.toZonedDateTimeISO('UTC')
  const pad = (n: number, w = 2) => n.toString().padStart(w, '0')
  // Signed years (BC) need the sign in front of zero padding: year -1 → "-0001".
  const padYear = (y: number) => (y < 0 ? '-' + pad(-y, 4) : pad(y, 4))
  // Always emit 3-digit milliseconds (v1 parity). v1 was Date-backed, so its
  // ISO9075 output always carried a millisecond fractional part (".000" for a
  // whole second). v2 dropped it, truncating DATETIME(6) round-trips.
  return `${padYear(zdt.year)}-${pad(zdt.month)}-${pad(zdt.day)} ${pad(zdt.hour)}:${pad(zdt.minute)}:${pad(zdt.second)}.${pad(zdt.millisecond, 3)}`
}

export const instantFns: IInstantFns = {
  now() {
    return toIsoInstant(Temporal.Now.instant())
  },
  fromEpochMilliseconds(epochMilliseconds) {
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochMilliseconds is required')
    }
    return toIsoInstant(Temporal.Instant.fromEpochMilliseconds(epochMilliseconds))
  },
  fromEpochSeconds(epochSeconds) {
    if (arguments.length < 1) {
      throw new TypeError('missing argument: epochSeconds is required')
    }
    return toIsoInstant(Temporal.Instant.fromEpochMilliseconds(Math.round(Number(epochSeconds) * 1000)))
  },
  isValid(instant): instant is Iso.Instant {
    return isIsoInstant(instant)
  },
  assertIsValid(instant): asserts instant is Iso.Instant {
    if (!isIsoInstant(instant)) throw new TypeError('invalid receiver')
  },
  // Unix-time convention: a moment at epoch ms -500 belongs to second -1, not 0.
  getEpochSeconds: (instant) => Math.floor(Temporal.Instant.from(instant).epochMilliseconds / 1000),
  getEpochMilliseconds: (instant) => Temporal.Instant.from(instant).epochMilliseconds,
  add: (instant, durationLike) => toIsoInstant(Temporal.Instant.from(instant).add(Temporal.Duration.from(durationLike))),
  subtract: (instant, durationLike) =>
    toIsoInstant(Temporal.Instant.from(instant).subtract(Temporal.Duration.from(durationLike))),
  until: (instant, other, options) => toIsoDuration(Temporal.Instant.from(instant).until(other, options)),
  since: (instant, other, options) => toIsoDuration(Temporal.Instant.from(instant).since(other, options)),
  round: (instant, options) => toIsoInstant(Temporal.Instant.from(instant).round(options)),
  equals: (instant, other) => Temporal.Instant.from(instant).equals(other),
  isEqual: (instant, other) => Temporal.Instant.from(instant).equals(other),
  isBefore: (instant, other) => Temporal.Instant.compare(instant, other) < 0,
  isAfter: (instant, other) => Temporal.Instant.compare(instant, other) > 0,
  isEqualOrBefore: (instant, other) => Temporal.Instant.compare(instant, other) <= 0,
  isEqualOrAfter: (instant, other) => Temporal.Instant.compare(instant, other) >= 0,
  toZonedDateTime: (instant, timeZone) => toIsoZonedDateTime(Temporal.Instant.from(instant).toZonedDateTimeISO(timeZone)),
  formatISO9075(instant) {
    if (!isIsoInstant(instant)) throw new TypeError('invalid receiver')
    return formatInstantISO9075(Temporal.Instant.from(instant))
  },
  toJsDate: (instant) => new Date(Temporal.Instant.from(instant).epochMilliseconds),
  from: (item) => toIsoInstant(Temporal.Instant.from(item)),
  compare: (one, two) => Temporal.Instant.compare(one, two),
  chain: buildInstantChain
}

export function buildInstantChain(input: Iso.Instant): IInstantChain {
  return buildInstantChainFromTemporal(Temporal.Instant.from(input))
}

export function buildInstantChainFromTemporal(inst: Temporal.Instant): IInstantChain {
  return {
    value: () => toIsoInstant(inst),
    getEpochSeconds: () => buildChain(Math.floor(inst.epochMilliseconds / 1000)),
    getEpochMilliseconds: () => buildChain(inst.epochMilliseconds),
    add: (durationLike) => buildInstantChainFromTemporal(inst.add(Temporal.Duration.from(durationLike))),
    subtract: (durationLike) => buildInstantChainFromTemporal(inst.subtract(Temporal.Duration.from(durationLike))),
    until: (other, options) => buildDurationChainFromTemporal(inst.until(other, options)),
    since: (other, options) => buildDurationChainFromTemporal(inst.since(other, options)),
    round: (options) => buildInstantChainFromTemporal(inst.round(options)),
    equals: (other) => buildChain(inst.equals(other)),
    isEqual: (other) => buildChain(inst.equals(other)),
    isBefore: (other) => buildChain(Temporal.Instant.compare(inst, other) < 0),
    isAfter: (other) => buildChain(Temporal.Instant.compare(inst, other) > 0),
    isEqualOrBefore: (other) => buildChain(Temporal.Instant.compare(inst, other) <= 0),
    isEqualOrAfter: (other) => buildChain(Temporal.Instant.compare(inst, other) >= 0),
    toZonedDateTime: (timeZone) => buildZonedDateTimeChainFromTemporal(inst.toZonedDateTimeISO(timeZone)),
    toJsDate: () => buildChain(new Date(inst.epochMilliseconds)),
    formatISO9075: () => buildChain(formatInstantISO9075(inst))
  }
}
