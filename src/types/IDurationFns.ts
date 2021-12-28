import { Iso } from '../iso-types'
import * as ES from '../ecmascript'

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
    options?: { relativeTo: Iso.DateTime | Iso.ZonedDateTime }
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
    options?: { relativeTo: Iso.DateTime | Iso.ZonedDateTime | Iso.Date }
  ): Iso.Duration
  round(
    duration: Iso.Duration,
    options: {
      largestUnit?: ES.TemporalSingularUnit | 'auto'
      smallestUnit: ES.TemporalSingularUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
    }
  ): Iso.Duration
  total(
    duration: Iso.Duration,
    options: {
      unit: ES.TemporalSingularUnit
      relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
    }
  ): number
  getFields(duration: Iso.Duration): ES.DurationSlots
  from(item: any): Iso.Duration
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
export interface IDurationChain extends ES.Chain<Iso.Duration> {
  getYears(): ES.Chain<number>
  getMonths(): ES.Chain<number>
  getWeeks(): ES.Chain<number>
  getDays(): ES.Chain<number>
  getHours(): ES.Chain<number>
  getMinutes(): ES.Chain<number>
  getSeconds(): ES.Chain<number>
  getMilliseconds(): ES.Chain<number>
  getSign(): ES.Chain<number>
  isBlank(): ES.Chain<boolean>
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
    options?: { relativeTo: Iso.DateTime | Iso.ZonedDateTime }
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
    options?: { relativeTo: Iso.DateTime | Iso.ZonedDateTime | Iso.Date }
  ): IDurationChain
  round(options: {
    largestUnit?: ES.TemporalSingularUnit | 'auto'
    smallestUnit: ES.TemporalSingularUnit
    roundingIncrement?: number
    roundingMode?: ES.TemporalRoundingMode
    relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
  }): IDurationChain
  total(options: {
    unit: ES.TemporalSingularUnit
    relativeTo?: Iso.DateTime | Iso.ZonedDateTime | Iso.Date
  }): ES.Chain<number>
  getFields(): ES.Chain<ES.DurationSlots>
}
