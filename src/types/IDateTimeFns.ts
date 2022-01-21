import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IDurationChain } from './IDurationFns'
import { IZonedDateTimeChain } from './IZonedDateTimeFns'
import { IDateChain } from './IDateFns'
import { IYearMonthChain } from './IYearMonthFns'
import { IMonthDayChain } from './IMonthDayFns'
import { ITimeChain } from './ITimeFns'

export interface IDateTimeFns {
  /**
   * This method gets the current calendar date and wall-clock time according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.
   *
   * @param timeZone The time zone to get the current date and time in, as a string. If not given, the current system time zone will be used.
   * @returns an `Iso.DateTime` string representing the date and time.
   */
  now(timeZone?: string): Iso.DateTime
  fromNumbers(
    year: number,
    month: number,
    day: number,
    hour?: number,
    minute?: number,
    second?: number,
    millisecond?: number
  ): Iso.DateTime
  isValid(dateTime: unknown): dateTime is Iso.DateTime
  assertIsValid(dateTime: unknown): asserts dateTime is Iso.DateTime
  getYear(dateTime: Iso.DateTime): number
  getMonth(dateTime: Iso.DateTime): number
  getDay(dateTime: Iso.DateTime): number
  getHour(dateTime: Iso.DateTime): number
  getMinute(dateTime: Iso.DateTime): number
  getSecond(dateTime: Iso.DateTime): number
  getMillisecond(dateTime: Iso.DateTime): number
  getDayOfWeek(dateTime: Iso.DateTime): number
  getDayOfYear(dateTime: Iso.DateTime): number
  getWeekOfYear(dateTime: Iso.DateTime): number
  getDaysInYear(dateTime: Iso.DateTime): number
  getDaysInMonth(dateTime: Iso.DateTime): number
  getInLeapYear(dateTime: Iso.DateTime): boolean
  with(
    dateTime: Iso.DateTime,
    temporalDateTimeLike: {
      day?: number
      hour?: number
      millisecond?: number
      minute?: number
      month?: number
      second?: number
      year?: number
    },
    options?: {
      overflow?: ES.TemporalOverflow
    }
  ): Iso.DateTime
  withTime(dateTime: Iso.DateTime, time?: Iso.Time | undefined): Iso.DateTime
  withDate(dateTime: Iso.DateTime, temporalDate: Iso.Date): Iso.DateTime
  add(
    dateTime: Iso.DateTime,
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
  ): Iso.DateTime
  subtract(
    dateTime: Iso.DateTime,
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
  ): Iso.DateTime
  until(
    from: Iso.DateTime,
    until: Iso.DateTime,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  since(
    dateTime: Iso.DateTime,
    other: Iso.DateTime,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  round(
    dateTime: Iso.DateTime,
    options: {
      smallestUnit: ES.TemporalPluralUnit | Exclude<ES.TemporalSingularUnit, 'year' | 'month' | 'week'>
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.DateTime
  equals(dateTime: Iso.DateTime, other: Iso.DateTime): boolean
  /**
   * alias for {@link IDateTimeFns.equals equals}
   */
  isEqual(dateTime: Iso.DateTime, other: Iso.DateTime): boolean
  isBefore(dateTime: Iso.DateTime, other: Iso.DateTime): boolean
  isAfter(dateTime: Iso.DateTime, other: Iso.DateTime): boolean
  isEqualOrBefore(dateTime: Iso.DateTime, other: Iso.DateTime): boolean
  isEqualOrAfter(dateTime: Iso.DateTime, other: Iso.DateTime): boolean
  toZonedDateTime(
    dateTime: Iso.DateTime,
    timeZone: string,
    options?: { disambiguation: ES.TemporalDisambiguation }
  ): Iso.ZonedDateTime
  toDate(dateTime: Iso.DateTime): Iso.Date
  toYearMonth(dateTime: Iso.DateTime): Iso.YearMonth
  toMonthDay(dateTime: Iso.DateTime): Iso.MonthDay
  toTime(dateTime: Iso.DateTime): Iso.Time
  getFields(dateTime: Iso.DateTime): ES.DateTimeSlots
  from(item: any, options?: { overflow: ES.TemporalOverflow }): Iso.DateTime
  compare(one: Iso.DateTime, two: Iso.DateTime): number
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
   * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 5     |
   * |                                 | hh      | 01, 02, ..., 11, 12               |       |
   * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
   * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 5     |
   * |                                 | HH      | 00, 01, 02, ..., 23               |       |
   * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
   * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 5     |
   * |                                 | KK      | 01, 02, ..., 11, 00               |       |
   * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
   * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 5     |
   * |                                 | kk      | 24, 01, 02, ..., 23               |       |
   * | Minute                          | m       | 0, 1, ..., 59                     |       |
   * |                                 | mo      | 0th, 1st, ..., 59th               | 5     |
   * |                                 | mm      | 00, 01, ..., 59                   |       |
   * | Second                          | s       | 0, 1, ..., 59                     |       |
   * |                                 | so      | 0th, 1st, ..., 59th               | 5     |
   * |                                 | ss      | 00, 01, ..., 59                   |       |
   * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
   * |                                 | SS      | 00, 01, ..., 99                   |       |
   * |                                 | SSS     | 000, 001, ..., 999                |       |
   * |                                 | SSSS    | ...                               | 2     |
   * | Long localized date             | P       | 04/29/1453                        | 5     |
   * |                                 | PP      | Apr 29, 1453                      | 5     |
   * |                                 | PPP     | April 29th, 1453                  | 5     |
   * |                                 | PPPP    | Friday, April 29th, 1453          | 1,5   |
   * | Long localized time             | p       | 12:00 AM                          | 5     |
   * |                                 | pp      | 12:00:00 AM                       | 5     |
   * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 5     |
   * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 5     |
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
   * @param dateTime - the original date
   * @param format - the string of tokens
   * @returns the formatted date string
   *
   * @example
   * ```js
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format("2014-02-11T00:00:00.000", 'MM/dd/yyyy')
   * //=> '02/11/2014'
   * ```
   *
   * @example
   * ```js
   * // Escape string by single quote characters:
   * var result = format("2014-02-11T15:00:00.000", "h 'o''clock'")
   * //=> "3 o'clock"
   * ```
   */
  format(dateTime: Iso.DateTime, formatString: string): string
  chain(dateTime: Iso.DateTime): IDateTimeChain
}

/**
 * @internal
 */
export interface IDateTimeChain extends ES.Chain<Iso.DateTime> {
  getYear(): ES.Chain<number>
  getMonth(): ES.Chain<number>
  getDay(): ES.Chain<number>
  getHour(): ES.Chain<number>
  getMinute(): ES.Chain<number>
  getSecond(): ES.Chain<number>
  getMillisecond(): ES.Chain<number>
  getDayOfWeek(): ES.Chain<number>
  getDayOfYear(): ES.Chain<number>
  getWeekOfYear(): ES.Chain<number>
  getDaysInYear(): ES.Chain<number>
  getDaysInMonth(): ES.Chain<number>
  getInLeapYear(): ES.Chain<boolean>
  with(
    temporalDateTimeLike: {
      day?: number
      hour?: number
      millisecond?: number
      minute?: number
      month?: number
      second?: number
      year?: number
    },
    options?: {
      overflow?: ES.TemporalOverflow
    }
  ): IDateTimeChain
  withTime(time?: Iso.Time | undefined): IDateTimeChain
  withDate(temporalDate: Iso.Date): IDateTimeChain
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
  ): IDateTimeChain
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
  ): IDateTimeChain
  until(
    until: Iso.DateTime,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  since(
    other: Iso.DateTime,
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
  }): IDateTimeChain
  equals(other: Iso.DateTime): ES.Chain<boolean>
  isEqual(other: Iso.DateTime): ES.Chain<boolean>
  isBefore(other: Iso.DateTime): ES.Chain<boolean>
  isAfter(other: Iso.DateTime): ES.Chain<boolean>
  isEqualOrBefore(other: Iso.DateTime): ES.Chain<boolean>
  isEqualOrAfter(other: Iso.DateTime): ES.Chain<boolean>
  toZonedDateTime(timeZone: string, options?: { disambiguation: ES.TemporalDisambiguation }): IZonedDateTimeChain
  toDate(): IDateChain
  toYearMonth(): IYearMonthChain
  toMonthDay(): IMonthDayChain
  toTime(): ITimeChain
  getFields(): ES.Chain<ES.DateTimeSlots>
  format(formatString: string): ES.Chain<string>
}
