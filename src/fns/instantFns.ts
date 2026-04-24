import { Temporal } from 'temporal-polyfill'
import { IInstantChain, IInstantFns } from '../types'
import { Iso } from '../iso-types'
import { buildChain, isIsoInstant, toIsoDuration, toIsoInstant, toIsoZonedDateTime } from '../temporal'
import { buildDurationChainFromTemporal } from './durationFns'
import { buildZonedDateTimeChainFromTemporal } from './zonedDateTimeFns'

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
  getEpochSeconds: (instant) => Temporal.Instant.from(instant).epochMilliseconds / 1000,
  getEpochMilliseconds: (instant) => Temporal.Instant.from(instant).epochMilliseconds,
  add: (instant, durationLike) =>
    toIsoInstant(Temporal.Instant.from(instant).add(Temporal.Duration.from(durationLike))),
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
    return instant.slice(0, -1).replace('T', ' ')
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
    getEpochSeconds: () => buildChain(inst.epochMilliseconds / 1000),
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
    toJsDate: () => buildChain(new Date(inst.epochMilliseconds))
  }
}
