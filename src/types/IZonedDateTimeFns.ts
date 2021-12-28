import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IInstantChain } from './IInstantFns'
import { IDateChain } from './IDateFns'
import { ITimeChain } from './ITimeFns'
import { IYearMonthChain } from './IYearMonthFns'
import { IMonthDayChain } from './IMonthDayFns'
import { IDateTimeChain } from './IDateTimeFns'
import { IDurationChain } from './IDurationFns'

export interface IZonedDateTimeFns {
  /**
   * This method gets the current date, time, time zone, and time zone offset according to the system settings. Optionally a time zone can be given in which the time is computed, instead of the current system time zone.
   *
   * @param timeZone The time zone to get the current date and time in as a string. If not given, the current system time zone will be used.
   * @returns an `Iso.ZonedDateTime` string representing the current system date, time, time zone, and time zone offset.
   */
  now(timeZone?: string): Iso.ZonedDateTime
  /**
   * This method gets the current system time zone. This will usually be a named [IANA time zone](https://www.iana.org/time-zones), as that is how most people configure their computers.
   *
   * @returns a string representing the time zone according to the current system settings.
   */
  currentTimeZone(): string
  fromEpochMilliseconds(epochMilliseconds: number, timeZone: string): Iso.ZonedDateTime
  isValid(zonedDateTime: unknown): zonedDateTime is Iso.ZonedDateTime
  assertIsValid(zonedDateTime: unknown): asserts zonedDateTime is Iso.ZonedDateTime
  getTimeZone(zonedDateTime: Iso.ZonedDateTime): string
  getYear(zonedDateTime: Iso.ZonedDateTime): number
  getMonth(zonedDateTime: Iso.ZonedDateTime): number
  getDay(zonedDateTime: Iso.ZonedDateTime): number
  getHour(zonedDateTime: Iso.ZonedDateTime): number
  getMinute(zonedDateTime: Iso.ZonedDateTime): number
  getSecond(zonedDateTime: Iso.ZonedDateTime): number
  getMillisecond(zonedDateTime: Iso.ZonedDateTime): number
  getEpochSeconds(zonedDateTime: Iso.ZonedDateTime): number
  getEpochMilliseconds(zonedDateTime: Iso.ZonedDateTime): number
  getDayOfWeek(zonedDateTime: Iso.ZonedDateTime): number
  getDayOfYear(zonedDateTime: Iso.ZonedDateTime): number
  getWeekOfYear(zonedDateTime: Iso.ZonedDateTime): number
  getHoursInDay(zonedDateTime: Iso.ZonedDateTime): number
  getDaysInMonth(zonedDateTime: Iso.ZonedDateTime): number
  getDaysInYear(zonedDateTime: Iso.ZonedDateTime): number
  inLeapYear(zonedDateTime: Iso.ZonedDateTime): boolean
  getOffset(zonedDateTime: Iso.ZonedDateTime): string
  getOffsetMilliseconds(zonedDateTime: Iso.ZonedDateTime): number
  with(
    zonedDateTime: Iso.ZonedDateTime,
    zonedDateTimeLike: {
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
      disambiguation?: ES.TemporalDisambiguation
      offset?: ES.TemporalOffset
    }
  ): Iso.ZonedDateTime
  withDate(zonedDateTime: Iso.ZonedDateTime, date: Iso.Date | ES.DateSlots): Iso.ZonedDateTime
  withTime(zonedDateTime: Iso.ZonedDateTime, time: Iso.Time | Partial<ES.TimeSlots>): Iso.ZonedDateTime
  withTimeZone(zonedDateTime: Iso.ZonedDateTime, timeZone: string): Iso.ZonedDateTime
  add(
    zonedDateTime: Iso.ZonedDateTime,
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
  ): Iso.ZonedDateTime
  subtract(
    zonedDateTime: Iso.ZonedDateTime,
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
  ): Iso.ZonedDateTime
  until(
    zonedDateTime: Iso.ZonedDateTime,
    other: Iso.ZonedDateTime,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  since(
    zonedDateTime: Iso.ZonedDateTime,
    other: Iso.ZonedDateTime,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  round(
    zonedDateTime: Iso.ZonedDateTime,
    options: {
      smallestUnit: Exclude<ES.TemporalSingularUnit, 'year' | 'month' | 'week'>
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.ZonedDateTime
  equals(zonedDateTime: Iso.ZonedDateTime, other: Iso.ZonedDateTime): boolean
  startOfDay(zonedDateTime: Iso.ZonedDateTime): Iso.ZonedDateTime
  toInstant(zonedDateTime: Iso.ZonedDateTime): Iso.Instant
  toDate(zonedDateTime: Iso.ZonedDateTime): Iso.Date
  toTime(zonedDateTime: Iso.ZonedDateTime): Iso.Time
  toDateTime(zonedDateTime: Iso.ZonedDateTime): Iso.DateTime
  toYearMonth(zonedDateTime: Iso.ZonedDateTime): Iso.YearMonth
  toMonthDay(zonedDateTime: Iso.ZonedDateTime): Iso.MonthDay
  getFields(zonedDateTime: Iso.ZonedDateTime): {
    day: number
    hour: number
    millisecond: number
    minute: number
    month: number
    second: number
    year: number
    offset: string
    timeZone: string
  }
  from(
    item: any,
    options?: {
      overflow?: ES.TemporalOverflow
      disambiguation?: ES.TemporalDisambiguation
      offset?: ES.TemporalOffset
    }
  ): Iso.ZonedDateTime
  compare(one: Iso.ZonedDateTime, two: Iso.ZonedDateTime): number
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
   * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
   * |                                 | XX      | -0800, +0530, Z                   |       |
   * |                                 | XXX     | -08:00, +05:30, Z                 |       |
   * |                                 | XXXX    | -0800, +0530, Z, +123456          | 1     |
   * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
   * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
   * |                                 | xx      | -0800, +0530, +0000               |       |
   * |                                 | xxx     | -08:00, +05:30, +00:00            | 1     |
   * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
   * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
   * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
   * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 1     |
   * | Timezone (specific non-locat.)  | z...zzz | CST, CST, CST                     |       |
   * |                                 | zzzz    | Central Standard Time             | 1     |
   * | Long localized date             | P       | 04/29/1453                        | 5     |
   * |                                 | PP      | Apr 29, 1453                      | 5     |
   * |                                 | PPP     | April 29th, 1453                  | 5     |
   * |                                 | PPPP    | Friday, April 29th, 1453          | 1,5   |
   * | Long localized time             | p       | 12:00 AM                          | 5     |
   * |                                 | pp      | 12:00:00 AM                       | 5     |
   * |                                 | ppp     | 12:00:00 AM CDT                   | 5     |
   * |                                 | pppp    | 12:00:00 AM Central Daylight Time | 1,5   |
   * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 5     |
   * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 5     |
   * |                                 | PPPppp  | April 29th, 1453 at ...           | 5     |
   * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 1,5   |
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
   * @param {Iso.ZonedDateTime} zonedDateTime - the original date
   * @param {String} format - the string of tokens
   * @returns {string} the formatted date string
   *
   * @example
   * ```js
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format("2014-02-11T00:00:00+00:00[UTC]", 'MM/dd/yyyy')
   * //=> '02/11/2014'
   * ```
   */
  format(zonedDateTime: Iso.ZonedDateTime, format: string): string
  chain(zonedDateTime: Iso.ZonedDateTime): IZonedDateTimeChain
}

/**
 * @internal
 */
export interface IZonedDateTimeChain extends ES.Chain<Iso.ZonedDateTime> {
  getTimeZone(): ES.Chain<string>
  getYear(): ES.Chain<number>
  getMonth(): ES.Chain<number>
  getDay(): ES.Chain<number>
  getHour(): ES.Chain<number>
  getMinute(): ES.Chain<number>
  getSecond(): ES.Chain<number>
  getMillisecond(): ES.Chain<number>
  getEpochSeconds(): ES.Chain<number>
  getEpochMilliseconds(): ES.Chain<number>
  getDayOfWeek(): ES.Chain<number>
  getDayOfYear(): ES.Chain<number>
  getWeekOfYear(): ES.Chain<number>
  getHoursInDay(): ES.Chain<number>
  getDaysInMonth(): ES.Chain<number>
  getDaysInYear(): ES.Chain<number>
  inLeapYear(): ES.Chain<boolean>
  getOffset(): ES.Chain<string>
  getOffsetMilliseconds(): ES.Chain<number>
  with(
    zonedDateTimeLike: {
      day?: number
      hour?: number
      millisecond?: number
      minute?: number
      month?: number
      monthCode?: number
      second?: number
      year?: number
    },
    options?: {
      overflow?: ES.TemporalOverflow
      disambiguation?: ES.TemporalDisambiguation
      offset?: ES.TemporalOffset
    }
  ): IZonedDateTimeChain
  withDate(date: Iso.Date | ES.DateSlots): IZonedDateTimeChain
  withTime(time: Iso.Time | Partial<ES.TimeSlots>): IZonedDateTimeChain
  withTimeZone(timeZone: string): IZonedDateTimeChain
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
  ): IZonedDateTimeChain
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
  ): IZonedDateTimeChain
  until(
    other: Iso.ZonedDateTime,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  since(
    other: Iso.ZonedDateTime,
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
  }): IZonedDateTimeChain
  equals(other: Iso.ZonedDateTime): ES.Chain<boolean>
  startOfDay(): IZonedDateTimeChain
  toInstant(): IInstantChain
  toDate(): IDateChain
  toTime(): ITimeChain
  toDateTime(): IDateTimeChain
  toYearMonth(): IYearMonthChain
  toMonthDay(): IMonthDayChain
  getFields(): ES.Chain<{
    day: number
    hour: number
    millisecond: number
    minute: number
    month: number
    second: number
    year: number
    offset: string
    timeZone: string
  }>
  format(formatString: string): ES.Chain<string>
}
