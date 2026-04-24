import { type Iso } from '../iso-types'
import { type Temporal } from 'temporal-polyfill'
import { type Chain } from '../temporal'
import { type IDurationChain } from './IDurationFns'
import { type IZonedDateTimeChain } from './IZonedDateTimeFns'

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
    instant: Iso.Instant,
    other: Iso.Instant,
    options?: {
      largestUnit?: Temporal.LargestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      smallestUnit?: Temporal.SmallestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      roundingIncrement?: number
      roundingMode?: Temporal.RoundingMode
    }
  ): Iso.Duration
  since(
    instant: Iso.Instant,
    other: Iso.Instant,
    options?: {
      largestUnit?: Temporal.LargestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      smallestUnit?: Temporal.SmallestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      roundingIncrement?: number
      roundingMode?: Temporal.RoundingMode
    }
  ): Iso.Duration
  round(
    instant: Iso.Instant,
    options: {
      smallestUnit: Temporal.SmallestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      roundingIncrement?: number
      roundingMode?: Temporal.RoundingMode
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
  from(item: string): Iso.Instant
  compare(one: Iso.Instant, two: Iso.Instant): number
  chain(instant: Iso.Instant): IInstantChain
}

/**
 * @internal
 */
export interface IInstantChain extends Chain<Iso.Instant> {
  getEpochSeconds(): Chain<number>
  getEpochMilliseconds(): Chain<number>
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
    other: Iso.Instant,
    options?: {
      largestUnit?: Temporal.LargestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      smallestUnit?: Temporal.SmallestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      roundingIncrement?: number
      roundingMode?: Temporal.RoundingMode
    }
  ): IDurationChain
  since(
    other: Iso.Instant,
    options?: {
      largestUnit?: Temporal.LargestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      smallestUnit?: Temporal.SmallestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
      roundingIncrement?: number
      roundingMode?: Temporal.RoundingMode
    }
  ): IDurationChain
  round(options: {
    smallestUnit: Temporal.SmallestUnit<Exclude<Temporal.DateTimeUnit, 'year' | 'month' | 'week' | 'day'>>
    roundingIncrement?: number
    roundingMode?: Temporal.RoundingMode
  }): IInstantChain
  equals(other: Iso.Instant): Chain<boolean>
  isEqual(other: Iso.Instant): Chain<boolean>
  isBefore(other: Iso.Instant): Chain<boolean>
  isAfter(other: Iso.Instant): Chain<boolean>
  isEqualOrBefore(other: Iso.Instant): Chain<boolean>
  isEqualOrAfter(other: Iso.Instant): Chain<boolean>
  toZonedDateTime(timeZone: string): IZonedDateTimeChain
  toJsDate(): Chain<Date>
  formatISO9075(): Chain<string>
}
