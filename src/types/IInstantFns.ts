import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IDurationChain } from './IDurationFns'
import { IZonedDateTimeChain } from './IZonedDateTimeFns'

export interface IInstantFns {
  /**
   *
   * This method gets the current exact system time, without regard to time zone. This is a good way to get a timestamp for an event, for example. It works like the old-style JavaScript Date.now().
   *
   * @returns an `Iso.Instant` string representing the current system time.
   */
  now(): Iso.Instant
  fromEpochMilliseconds(epochMilliseconds: number): Iso.Instant
  isValid(instant: unknown): instant is Iso.Instant
  assertIsValid(instant: unknown): asserts instant is Iso.Instant
  getEpochSeconds(instant: Iso.Instant): number
  getEpochMilliseconds(instant: Iso.Instant): number
  /**
   * Here is a comment!
   * @param instant
   * @param temporalDurationLike
   */
  add(
    instant: Iso.Instant,
    temporalDurationLike:
      | Iso.Duration
      | {
          years?: number
          months?: number
          weeks?: number
          days?: number
          hours?: number
          minutes?: number
          seconds?: number
          milliseconds?: number
        }
  ): Iso.Instant
  subtract(
    instant: Iso.Instant,
    temporalDurationLike:
      | Iso.Duration
      | {
          years?: number
          months?: number
          weeks?: number
          days?: number
          hours?: number
          minutes?: number
          seconds?: number
          milliseconds?: number
        }
  ): Iso.Instant
  until(
    from: Iso.Instant,
    until: Iso.Instant,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  since(
    to: Iso.Instant,
    since: Iso.Instant,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  round(
    instant: Iso.Instant,
    options: {
      smallestUnit?: ES.TemporalSingularUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Instant
  equals(instant: Iso.Instant, other: Iso.Instant): boolean
  /**
   * alias for {@link IInstantFns.equals equals}
   */
  isEqual(instant: Iso.Instant, other: Iso.Instant): boolean
  isBefore(instant: Iso.Instant, other: Iso.Instant): boolean
  isAfter(instant: Iso.Instant, other: Iso.Instant): boolean
  isEqualOrBefore(instant: Iso.Instant, other: Iso.Instant): boolean
  isEqualOrAfter(instant: Iso.Instant, other: Iso.Instant): boolean
  toZonedDateTime(instant: Iso.Instant, timeZone: string): Iso.ZonedDateTime
  formatISO9075(instant: Iso.Instant): string
  toJsDate(instant: Iso.Instant): Date
  fromEpochSeconds(epochSeconds: number): Iso.Instant
  from(item: any): Iso.Instant
  compare(one: Iso.Instant, two: Iso.Instant): number
  chain(instant: Iso.Instant): IInstantChain
}

/**
 * @internal
 */
export interface IInstantChain extends ES.Chain<Iso.Instant> {
  getEpochSeconds(): ES.Chain<number>
  getEpochMilliseconds(): ES.Chain<number>
  add(
    temporalDurationLike:
      | Iso.Duration
      | {
          years?: number
          months?: number
          weeks?: number
          days?: number
          hours?: number
          minutes?: number
          seconds?: number
          milliseconds?: number
        }
  ): IInstantChain
  subtract(
    temporalDurationLike:
      | Iso.Duration
      | {
          years?: number
          months?: number
          weeks?: number
          days?: number
          hours?: number
          minutes?: number
          seconds?: number
          milliseconds?: number
        }
  ): IInstantChain
  until(
    until: Iso.Instant,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  since(
    since: Iso.Instant,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  round(options: {
    smallestUnit?: ES.TemporalSingularUnit
    roundingIncrement?: number
    roundingMode?: ES.TemporalRoundingMode
  }): IInstantChain
  equals(other: Iso.Instant): ES.Chain<boolean>
  isEqual(other: Iso.Instant): ES.Chain<boolean>
  isBefore(other: Iso.Instant): ES.Chain<boolean>
  isAfter(other: Iso.Instant): ES.Chain<boolean>
  isEqualOrBefore(other: Iso.Instant): ES.Chain<boolean>
  isEqualOrAfter(other: Iso.Instant): ES.Chain<boolean>
  toZonedDateTime(timeZone: string): IZonedDateTimeChain
  toJsDate(): ES.Chain<Date>
}
