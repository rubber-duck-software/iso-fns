import { type Iso } from '../iso-types'
import { type Temporal } from 'temporal-polyfill'
import { type Chain } from '../temporal'
import { type DurationSlots } from '../slots'

export interface IDurationFns {
  fromNumbers(
    years?: number,
    months?: number,
    weeks?: number,
    days?: number,
    hours?: number,
    minute?: number,
    seconds?: number,
    milliseconds?: number
  ): Iso.Duration
  isValid(duration: unknown): duration is Iso.Duration
  assertIsValid(duration: unknown): asserts duration is Iso.Duration
  getYears(duration: Iso.Duration): number
  getMonths(duration: Iso.Duration): number
  getWeeks(duration: Iso.Duration): number
  getDays(duration: Iso.Duration): number
  getHours(duration: Iso.Duration): number
  getMinutes(duration: Iso.Duration): number
  getSeconds(duration: Iso.Duration): number
  getMilliseconds(duration: Iso.Duration): number
  getSign(duration: Iso.Duration): number
  isBlank(duration: Iso.Duration): boolean
  with(
    duration: Iso.Duration,
    durationLike: {
      years?: number
      months?: number
      weeks?: number
      days?: number
      hours?: number
      minutes?: number
      seconds?: number
      milliseconds?: number
    }
  ): Iso.Duration
  negated(duration: Iso.Duration): Iso.Duration
  abs(duration: Iso.Duration): Iso.Duration
  add(
    duration: Iso.Duration,
    other:
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
        },
    options?: {
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
      largestUnit?: Temporal.LargestUnit<Temporal.DateTimeUnit>
    }
  ): Iso.Duration
  subtract(
    duration: Iso.Duration,
    other:
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
        },
    options?: {
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
      largestUnit?: Temporal.LargestUnit<Temporal.DateTimeUnit>
    }
  ): Iso.Duration
  round(
    duration: Iso.Duration,
    options: {
      largestUnit?: Temporal.LargestUnit<Temporal.DateTimeUnit>
      smallestUnit?: Temporal.SmallestUnit<Temporal.DateTimeUnit>
      roundingIncrement?: number
      roundingMode?: Temporal.RoundingMode
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
    }
  ): Iso.Duration
  total(
    duration: Iso.Duration,
    options: {
      unit: Temporal.SmallestUnit<Temporal.DateTimeUnit>
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
    }
  ): number
  getFields(duration: Iso.Duration): DurationSlots
  from(item: string | Partial<DurationSlots>): Iso.Duration
  compare(
    one: Iso.Duration,
    two: Iso.Duration,
    options?: { relativeTo: Iso.DateTime | Iso.ZonedDateTime | Iso.Date }
  ): number
  chain(duration: Iso.Duration): IDurationChain
}

/**
 * @internal
 */
export interface IDurationChain extends Chain<Iso.Duration> {
  getYears(): Chain<number>
  getMonths(): Chain<number>
  getWeeks(): Chain<number>
  getDays(): Chain<number>
  getHours(): Chain<number>
  getMinutes(): Chain<number>
  getSeconds(): Chain<number>
  getMilliseconds(): Chain<number>
  getSign(): Chain<number>
  isBlank(): Chain<boolean>
  with(durationLike: {
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }): IDurationChain
  negated(): IDurationChain
  abs(): IDurationChain
  add(
    other:
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
        },
    options?: {
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
      largestUnit?: Temporal.LargestUnit<Temporal.DateTimeUnit>
    }
  ): IDurationChain
  subtract(
    other:
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
        },
    options?: {
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
      largestUnit?: Temporal.LargestUnit<Temporal.DateTimeUnit>
    }
  ): IDurationChain
  round(options: {
    largestUnit?: Temporal.LargestUnit<Temporal.DateTimeUnit>
    smallestUnit?: Temporal.DateTimeUnit
    roundingIncrement?: number
    roundingMode?: Temporal.RoundingMode
    relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
  }): IDurationChain
  total(options: { unit: Temporal.DateTimeUnit; relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date }): Chain<number>
  getFields(): Chain<DurationSlots>
}
