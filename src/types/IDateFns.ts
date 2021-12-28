import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IDurationChain } from './IDurationFns'
import { IDateTimeChain } from './IDateTimeFns'
import { IZonedDateTimeChain } from './IZonedDateTimeFns'
import { IYearMonthChain } from './IYearMonthFns'
import { IMonthDayChain } from './IMonthDayFns'

export interface IDateFns {
  /**
   * This method gets the current calendar date according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.
   *
   * @param timeZone The time zone to get the current date and time in, as a string. If not given, the current system time zone will be used.
   * @returns an `Iso.Date` string representing the date.
   */
  now(timeZone?: string): Iso.Date
  fromNumbers(year: number, month: number, day: number): Iso.Date
  isValid(date: unknown): date is Iso.Date
  assertIsValid(date: unknown): asserts date is Iso.Date
  getYear(date: Iso.Date): number
  getMonth(date: Iso.Date): number
  getDay(date: Iso.Date): number
  getDayOfWeek(date: Iso.Date): number
  getDayOfYear(date: Iso.Date): number
  getWeekOfYear(date: Iso.Date): number
  getDaysInMonth(date: Iso.Date): number
  getDaysInYear(date: Iso.Date): number
  inLeapYear(date: Iso.Date): boolean
  with(
    dateTime: Iso.Date,
    temporalDateLike: {
      day?: number
      month?: number
      year?: number
    },
    options?: {
      overflow?: ES.TemporalOverflow
    }
  ): Iso.Date
  add(
    date: Iso.Date,
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
  ): Iso.Date
  subtract(
    date: Iso.Date,
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
  ): Iso.Date
  until(
    date: Iso.Date,
    other: Iso.Date,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  since(
    date: Iso.Date,
    other: Iso.Date,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  equals(date: Iso.Date, other: Iso.Date): boolean
  isBefore(date: Iso.Date, other: Iso.Date): boolean
  isAfter(date: Iso.Date, other: Iso.Date): boolean
  toDateTime(date: Iso.Date, time?: Iso.Time): Iso.DateTime
  toZonedDateTime(date: Iso.Date, item: { timeZone: string; time?: Iso.Time } | string): Iso.ZonedDateTime
  toYearMonth(date: Iso.Date): Iso.YearMonth
  toMonthDay(date: Iso.Date): Iso.MonthDay
  getFields(date: Iso.Date): ES.DateSlots
  from(item: any, options?: { overflow: ES.TemporalOverflow }): Iso.Date
  compare(one: Iso.Date, two: Iso.Date): number
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
   * | Era                             | G..GGG  | AD, BC                            |       |
   * |                                 | GGGG    | Anno Domini, Before Christ        | 1     |
   * |                                 | GGGGG   | A, B                              |       |
   * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 4     |
   * |                                 | yo      | 44th, 1st, 0th, 17th              | 4,5   |
   * |                                 | yy      | 44, 01, 00, 17                    | 4     |
   * |                                 | yyy     | 044, 001, 1900, 2017              | 4     |
   * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 4     |
   * |                                 | yyyyy   | ...                               | 2,4   |
   * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 4     |
   * |                                 | uu      | -43, 01, 1900, 2017               | 4     |
   * |                                 | uuu     | -043, 001, 1900, 2017             | 4     |
   * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 4     |
   * |                                 | uuuuu   | ...                               | 2,4   |
   * | Quarter                         | Q       | 1, 2, 3, 4                        |       |
   * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 5     |
   * |                                 | QQ      | 01, 02, 03, 04                    |       |
   * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 1     |
   * |                                 | QQQQQ   | 1, 2, 3, 4                        | 3     |
   * | Month                           | M       | 1, 2, ..., 12                     |       |
   * |                                 | Mo      | 1st, 2nd, ..., 12th               | 5     |
   * |                                 | MM      | 01, 02, ..., 12                   |       |
   * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
   * |                                 | MMMM    | January, February, ..., December  | 1     |
   * |                                 | MMMMM   | J, F, ..., D                      |       |
   * | ISO week of year                | I       | 1, 2, ..., 53                     | 5     |
   * |                                 | Io      | 1st, 2nd, ..., 53th               | 5     |
   * |                                 | II      | 01, 02, ..., 53                   | 5     |
   * | Day of month                    | d       | 1, 2, ..., 31                     |       |
   * |                                 | do      | 1st, 2nd, ..., 31st               | 5     |
   * |                                 | dd      | 01, 02, ..., 31                   |       |
   * | ISO day of week                 | i       | 1, 2, 3, ..., 7                   | 5     |
   * |                                 | io      | 1st, 2nd, ..., 7th                | 5     |
   * |                                 | ii      | 01, 02, ..., 07                   | 5     |
   * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 5     |
   * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 1,5   |
   * |                                 | iiiii   | M, T, W, T, F, S, S               | 5     |
   * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 5     |
   * | Long localized date             | P       | 04/29/1453                        | 5     |
   * |                                 | PP      | Apr 29, 1453                      | 5     |
   * |                                 | PPP     | April 29th, 1453                  | 5     |
   * |                                 | PPPP    | Friday, April 29th, 1453          | 1,5   |
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
   * 3. `QQQQQ` could be not strictly numerical in some locales.
   *    These tokens represent the shortest form of the quarter.
   *
   * 4. The main difference between `y` and `u` patterns are B.C. years:
   *
   *    | Year | `y` | `u` |
   *    |------|-----|-----|
   *    | AC 1 |   1 |   1 |
   *    | BC 1 |   1 |   0 |
   *    | BC 2 |   2 |  -1 |
   *
   *    Also `yy` always returns the last two digits of a year,
   *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
   *
   *    | Year | `yy` | `uu` |
   *    |------|------|------|
   *    | 1    |   01 |   01 |
   *    | 14   |   14 |   14 |
   *    | 376  |   76 |  376 |
   *    | 1453 |   53 | 1453 |
   *
   * 5. These patterns are not in the Unicode Technical Standard #35:
   *    - `i`: ISO day of week
   *    - `I`: ISO week of year
   *    - `o`: ordinal number modifier
   *    - `P`: long localized date
   *    - `p`: long localized time
   *
   * - Characters are escaped using single quote symbols (`'`).
   *
   * @param date - the original date
   * @param format - the string of tokens
   * @returns the formatted date string
   *
   * @example
   * ```js
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format("2014-02-11", 'MM/dd/yyyy')
   * //=> '02/11/2014'
   * ```
   *
   */
  format(date: Iso.Date, format: string): string
  chain(date: Iso.Date): IDateChain
}

/**
 * @internal
 */
export interface IDateChain extends ES.Chain<Iso.Date> {
  getYear(): ES.Chain<number>
  getMonth(): ES.Chain<number>
  getDay(): ES.Chain<number>
  getDayOfWeek(): ES.Chain<number>
  getDayOfYear(): ES.Chain<number>
  getWeekOfYear(): ES.Chain<number>
  getDaysInMonth(): ES.Chain<number>
  getDaysInYear(): ES.Chain<number>
  inLeapYear(): ES.Chain<boolean>
  with(
    temporalDateLike: {
      day?: number
      month?: number
      year?: number
    },
    options?: {
      overflow?: ES.TemporalOverflow
    }
  ): IDateChain
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
  ): IDateChain
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
  ): IDateChain
  until(
    other: Iso.Date,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  since(
    other: Iso.Date,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  equals(other: Iso.Date): ES.Chain<boolean>
  isBefore(other: Iso.Date): ES.Chain<boolean>
  isAfter(other: Iso.Date): ES.Chain<boolean>
  toDateTime(time?: Iso.Time): IDateTimeChain
  toZonedDateTime(item: { timeZone: string; time?: Iso.Time }): IZonedDateTimeChain
  toYearMonth(): IYearMonthChain
  toMonthDay(): IMonthDayChain
  getFields(): ES.Chain<ES.DateSlots>
  format(formatString: string): ES.Chain<string>
}
