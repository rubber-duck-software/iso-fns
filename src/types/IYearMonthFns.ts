import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IDurationChain } from './IDurationFns'
import { IDateChain } from './IDateFns'

export interface IYearMonthFns {
  fromNumbers(year: number, month: number): Iso.YearMonth
  isValid(yearMonth: unknown): yearMonth is Iso.YearMonth
  assertIsValid(yearMonth: unknown): asserts yearMonth is Iso.YearMonth
  getYear(yearMonth: Iso.YearMonth): number
  getMonth(yearMonth: Iso.YearMonth): number
  getDaysInMonth(yearMonth: Iso.YearMonth): number
  getDaysInYear(yearMonth: Iso.YearMonth): number
  inLeapYear(yearMonth: Iso.YearMonth): boolean
  with(
    yearMonth: Iso.YearMonth,
    yearMonthLike: { year?: number; month?: number },
    options?: { overflow: ES.TemporalOverflow }
  ): Iso.YearMonth
  add(
    yearMonth: Iso.YearMonth,
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
  ): Iso.YearMonth
  subtract(
    yearMonth: Iso.YearMonth,
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
  ): Iso.YearMonth
  until(
    yearMonth: Iso.YearMonth,
    other: Iso.YearMonth,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  since(
    yearMonth: Iso.YearMonth,
    other: Iso.YearMonth,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): Iso.Duration
  equals(yearMonth: Iso.YearMonth, other: Iso.YearMonth): boolean
  /**
   * alias for {@link IYearMonthFns.equals equals}
   */
  isEqual(yearMonth: Iso.YearMonth, other: Iso.YearMonth): boolean
  isBefore(yearMonth: Iso.YearMonth, other: Iso.YearMonth): boolean
  isAfter(yearMonth: Iso.YearMonth, other: Iso.YearMonth): boolean
  isEqualOrBefore(yearMonth: Iso.YearMonth, other: Iso.YearMonth): boolean
  isEqualOrAfter(yearMonth: Iso.YearMonth, other: Iso.YearMonth): boolean
  toDate(yearMonth: Iso.YearMonth, day: number): Iso.Date
  getFields(yearMonth: Iso.YearMonth): ES.YearMonthSlots
  from(item: any, options?: { overflow: ES.TemporalOverflow }): Iso.YearMonth
  compare(one: Iso.YearMonth, two: Iso.YearMonth): number
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
   *    - `o`: ordinal number modifier
   *
   * - Characters are escaped using single quote symbols (`'`).
   *
   * @param yearMonth - the original date
   * @param format - the string of tokens
   * @returns the formatted date string
   *
   * @example
   * ```js
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format("2014-02", 'MM/yyyy')
   * //=> '02/2014'
   * ```
   */
  format(yearMonth: Iso.YearMonth, format: string): string
  chain(yearMonth: Iso.YearMonth): IYearMonthChain
}

/**
 * @internal
 */
export interface IYearMonthChain extends ES.Chain<Iso.YearMonth> {
  getYear(): ES.Chain<number>
  getMonth(): ES.Chain<number>
  getDaysInMonth(): ES.Chain<number>
  getDaysInYear(): ES.Chain<number>
  inLeapYear(): ES.Chain<boolean>
  with(yearMonthLike: { year?: number; month?: number }, options?: { overflow: ES.TemporalOverflow }): IYearMonthChain
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
  ): IYearMonthChain
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
  ): IYearMonthChain
  until(
    other: Iso.YearMonth,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  since(
    other: Iso.YearMonth,
    options?: {
      largestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit | 'auto'
      smallestUnit?: ES.TemporalSingularUnit | ES.TemporalPluralUnit
      roundingIncrement?: number
      roundingMode?: ES.TemporalRoundingMode
    }
  ): IDurationChain
  equals(other: Iso.YearMonth): ES.Chain<boolean>
  isEqual(other: Iso.YearMonth): ES.Chain<boolean>
  isBefore(other: Iso.YearMonth): ES.Chain<boolean>
  isAfter(other: Iso.YearMonth): ES.Chain<boolean>
  isEqualOrBefore(other: Iso.YearMonth): ES.Chain<boolean>
  isEqualOrAfter(other: Iso.YearMonth): ES.Chain<boolean>
  toDate(day: number): IDateChain
  getFields(): ES.Chain<ES.YearMonthSlots>
  format(formatString: string): ES.Chain<string>
}
