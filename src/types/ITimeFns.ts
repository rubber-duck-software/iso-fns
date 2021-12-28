import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IDurationChain } from './IDurationFns'
import { IZonedDateTimeChain } from './IZonedDateTimeFns'
import { IDateTimeChain } from './IDateTimeFns'

export interface ITimeFns {
  /**
   * This method gets the current wall-clock time according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.
   *
   * @param timeZone The time zone to get the current date and time in as a string. If not given, the current system time zone will be used.
   * @returns an `Iso.Time` string representing the current system time.
   */
  now(timeZone?: string): Iso.Time
  fromNumbers(hour?: number, minute?: number, second?: number, millisecond?: number): Iso.Time
  isValid(time: unknown): time is Iso.Time
  assertIsValid(time: unknown): asserts time is Iso.Time
  getHour(time: Iso.Time): number
  getMinute(time: Iso.Time): number
  getSecond(time: Iso.Time): number
  getMillisecond(time: Iso.Time): number
  with(
    time: Iso.Time,
    timeLike: {
      hour?: number
      minute?: number
      second?: number
      millisecond?: number
    },
    options?: {
      overflow: ES.TemporalOverflow
    }
  ): Iso.Time
  add(
    time: Iso.Time,
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
        },
    options?: { overflow?: ES.TemporalOverflow }
  ): Iso.Time
  subtract(
    time: Iso.Time,
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
        },
    options?: { overflow?: ES.TemporalOverflow }
  ): Iso.Time
  until(
    time: Iso.Time,
    other: Iso.Time,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  since(
    time: Iso.Time,
    other: Iso.Time,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  round(
    time: Iso.Time,
    options: {
      smallestUnit: Exclude<ES.TemporalSingularUnit, 'year' | 'month' | 'week'>
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Time
  equals(time: Iso.Time, other: Iso.Time): boolean
  toDateTime(time: Iso.Time, date: Iso.Date): Iso.DateTime
  toZonedDateTime(
    time: Iso.Time,
    item: {
      date: Iso.Date
      timeZone: string
    }
  ): Iso.ZonedDateTime
  getFields(time: Iso.Time): ES.TimeSlots
  from(item: any, options?: { overflow: ES.TemporalOverflow }): Iso.Time
  compare(one: Iso.Time, two: Iso.Time): number
  /**
   * @summary Format the ZonedDateTime.
   *
   * @description
   * Return the formatted ZonedDateTime string in the given format.
   *
   * The characters wrapped between two single quotes characters (') are escaped.
   * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
   * (see the last example)
   *
   * Format of the string is based on Unicode Technical Standard #35:
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   * with a few additions (see note 7 below the table).
   *
   * Accepted patterns:
   *
   * | Unit                            | Pattern | Result examples                   | Notes |
   * |:------------------------------  |:------  |:--------------------------------  |:----  |
   * | AM, PM                          | a..aa   | AM, PM                            |       |
   * |                                 | aaa     | am, pm                            |       |
   * |                                 | aaaa    | a.m., p.m.                        | 1     |
   * |                                 | aaaaa   | a, p                              |       |
   * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
   * |                                 | bbb     | am, pm, noon, midnight            |       |
   * |                                 | bbbb    | a.m., p.m., noon, midnight        | 1     |
   * |                                 | bbbbb   | a, p, n, mi                       |       |
   * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
   * |                                 | BBBB    | at night, in the morning, ...     | 1     |
   * |                                 | BBBBB   | at night, in the morning, ...     |       |
   * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
   * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 3     |
   * |                                 | hh      | 01, 02, ..., 11, 12               |       |
   * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
   * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 3     |
   * |                                 | HH      | 00, 01, 02, ..., 23               |       |
   * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
   * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 3     |
   * |                                 | KK      | 01, 02, ..., 11, 00               |       |
   * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
   * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 3     |
   * |                                 | kk      | 24, 01, 02, ..., 23               |       |
   * | Minute                          | m       | 0, 1, ..., 59                     |       |
   * |                                 | mo      | 0th, 1st, ..., 59th               | 3     |
   * |                                 | mm      | 00, 01, ..., 59                   |       |
   * | Second                          | s       | 0, 1, ..., 59                     |       |
   * |                                 | so      | 0th, 1st, ..., 59th               | 3     |
   * |                                 | ss      | 00, 01, ..., 59                   |       |
   * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
   * |                                 | SS      | 00, 01, ..., 99                   |       |
   * |                                 | SSS     | 000, 001, ..., 999                |       |
   * |                                 | SSSS    | ...                               | 2     |
   * | Long localized time             | p       | 12:00 AM                          | 3     |
   * |                                 | pp      | 12:00:00 AM                       | 3     |
   * Notes:
   * 1. Any sequence of the identical letters is a pattern, unless it is escaped by
   *    the single quote characters (see below).
   *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
   *    the output will be the same as default pattern for this unit, usually
   *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
   *    are marked with "2" in the last column of the table.
   *
   *    `format("2017-11-06", 'MMM') //=> 'Nov'`
   *
   *    `format("2017-11-06", 'MMMM') //=> 'November'`
   *
   *    `format("2017-11-06", 'MMMMM') //=> 'N'`
   *
   *    `format("2017-11-06", 'MMMMMM') //=> 'November'`
   *
   *    `format("2017-11-06", 'MMMMMMM') //=> 'November'`
   *
   * 2. Some patterns could be unlimited length (such as `yyyyyyyy`).
   *    The output will be padded with zeros to match the length of the pattern.
   *
   *    `format("2017-11-06", 'yyyyyyyy') //=> '00002017'`
   *
   * 3. These patterns are not in the Unicode Technical Standard #35:
   *    - `o`: ordinal number modifier
   *    - `p`: long localized time
   *
   * - Characters are escaped using single quote symbols (`'`).
   *
   * @param time - the original date
   * @param format - the string of tokens
   * @returns the formatted date string
   *
   * @example
   * ```js
   * // Escape string by single quote characters:
   * var result = format("15:00:00.000", "h 'o''clock'")
   * //=> "3 o'clock"
   * ```
   */
  format(time: Iso.Time, format: string): string
  chain(time: Iso.Time): ITimeChain
}

/**
 * @internal
 */
export interface ITimeChain extends ES.Chain<Iso.Time> {
  getHour(): ES.Chain<number>
  getMinute(): ES.Chain<number>
  getSecond(): ES.Chain<number>
  getMillisecond(): ES.Chain<number>
  with(
    timeLike: {
      hour?: number
      minute?: number
      second?: number
      millisecond?: number
    },
    options?: {
      overflow: ES.TemporalOverflow
    }
  ): ITimeChain
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
        },
    options?: { overflow?: ES.TemporalOverflow }
  ): ITimeChain
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
        },
    options?: { overflow?: ES.TemporalOverflow }
  ): ITimeChain
  until(
    other: Iso.Time,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  since(
    other: Iso.Time,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  round(options: {
    smallestUnit: Exclude<ES.TemporalSingularUnit, 'year' | 'month' | 'week'>
    roundingIncrement?: number
    roundingMode?: ES.TemporalRoundingMode
  }): ITimeChain
  equals(other: Iso.Time): ES.Chain<boolean>
  toDateTime(date: Iso.Date): IDateTimeChain
  toZonedDateTime(item: { date: Iso.Date; timeZone: string }): IZonedDateTimeChain
  getFields(): ES.Chain<ES.TimeSlots>
  format(formatString: string): ES.Chain<string>
}
