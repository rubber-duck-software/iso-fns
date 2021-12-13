import { Iso } from '../iso-types'
import * as ES from '../ecmascript'
import { IDateChain } from './IDateFns'

export interface IMonthDayFns {
  fromNumbers(month: number, day: number): Iso.MonthDay
  getDay(monthDay: Iso.MonthDay): number
  getMonth(monthDay: Iso.MonthDay): number
  with(
    monthDay: Iso.MonthDay,
    monthDayLike: {
      month: number
      day: number
    },
    options?: { overflow: ES.TemporalOverflow }
  ): Iso.MonthDay
  equals(monthDay: Iso.MonthDay, other: Iso.MonthDay): boolean
  toDate(monthDay: Iso.MonthDay, year: number): Iso.Date
  getFields(monthDay: Iso.MonthDay): {
    month: number
    day: number
  }
  from(item: any, options?: { overflow: ES.TemporalOverflow }): Iso.MonthDay
  compare(one: Iso.MonthDay, two: Iso.MonthDay): number
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
   * | Quarter                         | Q       | 1, 2, 3, 4                        |       |
   * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 3     |
   * |                                 | QQ      | 01, 02, 03, 04                    |       |
   * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 1     |
   * |                                 | QQQQQ   | 1, 2, 3, 4                        | 2     |
   * | Month                           | M       | 1, 2, ..., 12                     |       |
   * |                                 | Mo      | 1st, 2nd, ..., 12th               | 3     |
   * |                                 | MM      | 01, 02, ..., 12                   |       |
   * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
   * |                                 | MMMM    | January, February, ..., December  | 1     |
   * |                                 | MMMMM   | J, F, ..., D                      |       |
   * | Day of month                    | d       | 1, 2, ..., 31                     |       |
   * |                                 | do      | 1st, 2nd, ..., 31st               | 3    |
   * |                                 | dd      | 01, 02, ..., 31                   |       |
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
   * 2. `QQQQQ` could be not strictly numerical in some locales.
   *    These tokens represent the shortest form of the quarter.
   *
   *
   * 3. These patterns are not in the Unicode Technical Standard #35:
   *    - `o`: ordinal number modifier
   *
   * - Characters are escaped using single quote symbols (`'`).
   *
   * @param monthDay - the original date
   * @param format - the string of tokens
   * @returns the formatted date string
   *
   * @example
   * ```js
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format("--02-11", 'MM/dd')
   * //=> '02/11'
   * ```
   */
  format(monthDay: Iso.MonthDay, format: string): string
  chain(monthDay: Iso.MonthDay): IMonthDayChain
}

/**
 * @internal
 */
export interface IMonthDayChain extends ES.Chain<Iso.MonthDay> {
  getDay(): ES.Chain<number>
  getMonth(): ES.Chain<number>
  with(
    monthDayLike: {
      month: number
      day: number
    },
    options?: { overflow: ES.TemporalOverflow }
  ): IMonthDayChain
  equals(other: Iso.MonthDay): ES.Chain<boolean>
  toDate(year: number): IDateChain
  getFields(): ES.Chain<{
    month: number
    day: number
  }>
  format(formatString: string): ES.Chain<string>
}
