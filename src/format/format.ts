import { Temporal } from 'temporal-polyfill'
import {
  slotsFromDate,
  slotsFromDateTime,
  slotsFromMonthDay,
  slotsFromTime,
  slotsFromYearMonth,
  slotsFromZonedDateTime
} from '../temporal'
import { getDefaultLocale, getLocale } from './locale'
import type { Day, FormatLong, Locale, LocaleDayPeriod, Localize, Month, Quarter } from './types'

type FormatContext = { localize: Localize; code: string }

export interface FormatOptions {
  locale?: Locale | string
}

// Instant is intentionally excluded: it has no wall-clock or zone context, so
// every token would need an implicit UTC assumption. Callers must convert to
// a ZonedDateTime first.
export type FormatInput =
  | Temporal.PlainDate
  | Temporal.PlainTime
  | Temporal.PlainDateTime
  | Temporal.ZonedDateTime
  | Temporal.PlainYearMonth
  | Temporal.PlainMonthDay

export default function format(input: FormatInput, formatStr: string, options?: FormatOptions): string {
  if (arguments.length < 2) {
    throw new TypeError('format requires 2 arguments')
  }
  formatStr = String(formatStr)

  const slots = slotsFromTemporal(input)
  const locale = resolveLocale(options?.locale)

  const longResult = (formatStr.match(longFormattingTokensRegExp) ?? [])
    .map((substring) => {
      const firstCharacter = substring[0]
      if (firstCharacter === 'p' || firstCharacter === 'P') {
        assertSlotsAvailable(firstCharacter, slots)
        return longFormatters[firstCharacter](substring, locale.formatLong)
      }
      return substring
    })
    .join('')

  return (longResult.match(formattingTokensRegExp) ?? [])
    .map((substring) => {
      if (substring === "''") return "'"

      const firstCharacter = substring[0]
      if (firstCharacter === "'") {
        return cleanEscapedString(substring)
      }

      if (firstCharacter in formatterSlotRequirements) {
        assertSlotsAvailable(firstCharacter, slots)
        const formatter = formatters[firstCharacter]
        if (formatter) {
          return formatter(slots, substring, { localize: locale.localize, code: locale.code })
        }
      }

      if (unescapedLatinCharacterRegExp.test(firstCharacter)) {
        throw new RangeError(`Format string contains an unescaped latin alphabet character \`${firstCharacter}\``)
      }

      return substring
    })
    .join('')
}

type SlotKey =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'offset'
  | 'timeZone'
  | 'epochMilliseconds'

type Slots = {
  year?: number
  month?: number
  day?: number
  hour?: number
  minute?: number
  second?: number
  millisecond?: number
  offset?: string
  timeZone?: string
  epochMilliseconds?: number
}

type Formatter = (slots: Slots, token: string, ctx: FormatContext) => string
type LongFormatter = (token: string, formatLong: FormatLong) => string

// Dispatch on the concrete Temporal class. Each temporal type exposes a
// different subset of fields (year/month/day/time/offset/epoch), and the
// formatter allow-list downstream is driven by which slot keys are present.
function slotsFromTemporal(input: FormatInput): Slots {
  if (input instanceof Temporal.PlainDate) return slotsFromDate(input)
  if (input instanceof Temporal.PlainTime) return slotsFromTime(input)
  if (input instanceof Temporal.PlainDateTime) return slotsFromDateTime(input)
  if (input instanceof Temporal.ZonedDateTime) return slotsFromZonedDateTime(input)
  if (input instanceof Temporal.PlainYearMonth) return slotsFromYearMonth(input)
  if (input instanceof Temporal.PlainMonthDay) return slotsFromMonthDay(input)
  // Runtime-only guard: `Instant` is excluded from `FormatInput` at the type
  // level, but callers using `as any` or loose JS can still pass one in.
  if ((input as unknown) instanceof Temporal.Instant) {
    throw new TypeError('format cannot operate on an Instant; convert to a ZonedDateTime first')
  }
  throw new TypeError('format requires a Temporal instance')
}

function resolveLocale(option: Locale | string | undefined): Locale {
  if (option === undefined) return getDefaultLocale()
  if (typeof option === 'string') return getLocale(option)
  return option
}

function assertSlotsAvailable(token: string, slots: Slots): void {
  const required = formatterSlotRequirements[token]
  if (!required) return
  const missing = required.find((key) => slots[key] === undefined)
  if (missing !== undefined) {
    throw new RangeError(`Cannot format this type with formatter '${token}'. Missing required field '${missing}'`)
  }
}

function cleanEscapedString(input: string): string {
  const match = input.match(escapedStringRegExp)
  if (!match) return input
  return match[1].replace(doubleQuoteRegExp, "'")
}

// [yQMIdihHKkms]o matches ordinal tokens (letter followed by `o`).
// (\w)\1* matches sequences of the same letter.
// '' matches two quote characters in a row.
// '(''|[^'])+('|$) matches text surrounded by single quotes (escaped literal).
// . matches any remaining single character.
const formattingTokensRegExp = /[yQMIdihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g

const escapedStringRegExp = /^'([^]*?)'?$/
const doubleQuoteRegExp = /''/g
const unescapedLatinCharacterRegExp = /[a-zA-Z]/

const formatterSlotRequirements: Record<string, readonly SlotKey[]> = {
  a: ['hour'],
  b: ['hour'],
  B: ['hour'],
  d: ['day'],
  E: ['year', 'month', 'day'],
  G: ['year'],
  h: ['hour'],
  H: ['hour'],
  i: ['year', 'month', 'day'],
  I: ['year', 'month', 'day'],
  k: ['hour'],
  K: ['hour'],
  m: ['minute'],
  M: ['month'],
  O: ['offset'],
  p: ['hour', 'minute', 'second', 'millisecond'],
  P: ['year', 'month', 'day'],
  Q: ['month'],
  s: ['second'],
  S: ['millisecond'],
  u: ['year'],
  x: ['offset'],
  X: ['offset'],
  y: ['year'],
  z: ['timeZone', 'epochMilliseconds']
}

// P/p expand localized long tokens (e.g. 'PP' → 'MMM d, y') before the main
// token pass; the result is then tokenized and formatted as normal.
function dateLongFormatter(pattern: string, formatLong: FormatLong): string {
  switch (pattern) {
    case 'P':
      return formatLong.date({ width: 'short' })
    case 'PP':
      return formatLong.date({ width: 'medium' })
    case 'PPP':
      return formatLong.date({ width: 'long' })
    case 'PPPP':
    default:
      return formatLong.date({ width: 'full' })
  }
}

function timeLongFormatter(pattern: string, formatLong: FormatLong): string {
  switch (pattern) {
    case 'p':
      return formatLong.time({ width: 'short' })
    case 'pp':
      return formatLong.time({ width: 'medium' })
    case 'ppp':
      return formatLong.time({ width: 'long' })
    case 'pppp':
    default:
      return formatLong.time({ width: 'full' })
  }
}

function dateTimeLongFormatter(pattern: string, formatLong: FormatLong): string {
  const matchResult = pattern.match(/(P+)(p+)?/) || []
  const datePattern = matchResult[1]
  const timePattern = matchResult[2]

  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong)
  }

  let dateTimeFormat: string
  switch (datePattern) {
    case 'P':
      dateTimeFormat = formatLong.dateTime({ width: 'short' })
      break
    case 'PP':
      dateTimeFormat = formatLong.dateTime({ width: 'medium' })
      break
    case 'PPP':
      dateTimeFormat = formatLong.dateTime({ width: 'long' })
      break
    case 'PPPP':
    default:
      dateTimeFormat = formatLong.dateTime({ width: 'full' })
      break
  }

  return dateTimeFormat
    .replace('{{date}}', dateLongFormatter(datePattern, formatLong))
    .replace('{{time}}', timeLongFormatter(timePattern, formatLong))
}

const longFormattersTyped = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
}

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  |                                |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |     |                                |
 * |  e  |                                |  E  |                                |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  |                                |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  |                                |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |     |                                |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! |                                |  T! |                                |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  |                                |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |     |                                |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */
const formattersTyped = {
  // Era
  G(date: { year: number }, token: string, { localize }: FormatContext) {
    const era = date.year > 0 ? 1 : 0
    switch (token) {
      // AD, BC
      case 'G':
      case 'GG':
      case 'GGG':
        return localize.era(era, { width: 'abbreviated' })
      // A, B
      case 'GGGGG':
        return localize.era(era, { width: 'narrow' })
      // Anno Domini, Before Christ
      case 'GGGG':
      default:
        return localize.era(era, { width: 'wide' })
    }
  },
  // Year
  y(date: { year: number }, token: string, { localize }: FormatContext) {
    if (token === 'yo') {
      const signedYear = date.year
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      const year = signedYear > 0 ? signedYear : 1 - signedYear
      return localize.ordinalNumber(year, { unit: 'year' })
    }
    return lightFormatters.y(date, token)
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u(date: { year: number }, token: string) {
    return addLeadingZeros(date.year, token.length)
  },
  // Quarter
  Q(date: { month: number }, token: string, { localize }: FormatContext) {
    const quarter = Math.ceil(date.month / 3) as Quarter
    switch (token) {
      case 'Q':
        return String(quarter)
      case 'QQ':
        return addLeadingZeros(quarter, 2)
      case 'Qo':
        return localize.ordinalNumber(quarter, { unit: 'quarter' })
      case 'QQQ':
        return localize.quarter(quarter, { width: 'abbreviated', context: 'formatting' })
      case 'QQQQQ':
        return localize.quarter(quarter, { width: 'narrow', context: 'formatting' })
      case 'QQQQ':
      default:
        return localize.quarter(quarter, { width: 'wide', context: 'formatting' })
    }
  },
  // Month
  M(date: { month: number }, token: string, { localize }: FormatContext) {
    const month = (date.month - 1) as Month
    switch (token) {
      case 'M':
      case 'MM':
        return lightFormatters.M(date, token)
      case 'Mo':
        return localize.ordinalNumber(month + 1, { unit: 'month' })
      case 'MMM':
        return localize.month(month, { width: 'abbreviated', context: 'formatting' })
      case 'MMMMM':
        return localize.month(month, { width: 'narrow', context: 'formatting' })
      case 'MMMM':
      default:
        return localize.month(month, { width: 'wide', context: 'formatting' })
    }
  },
  // ISO week of year
  I(date: { year: number; month: number; day: number }, token: string, { localize }: FormatContext) {
    const isoWeek = new Temporal.PlainDate(date.year, date.month, date.day).weekOfYear as number
    if (token === 'Io') {
      return localize.ordinalNumber(isoWeek, { unit: 'week' })
    }
    return addLeadingZeros(isoWeek, token.length)
  },
  // Day of the month
  d(date: { day: number }, token: string, { localize }: FormatContext) {
    if (token === 'do') {
      return localize.ordinalNumber(date.day, { unit: 'date' })
    }
    return lightFormatters.d(date, token)
  },
  // Day of week
  E(date: { year: number; month: number; day: number }, token: string, { localize }: FormatContext) {
    const dayOfWeek = new Temporal.PlainDate(date.year, date.month, date.day).dayOfWeek as Day
    switch (token) {
      case 'E':
      case 'EE':
      case 'EEE':
        return localize.day(dayOfWeek, { width: 'abbreviated', context: 'formatting' })
      case 'EEEEE':
        return localize.day(dayOfWeek, { width: 'narrow', context: 'formatting' })
      case 'EEEEEE':
        return localize.day(dayOfWeek, { width: 'short', context: 'formatting' })
      case 'EEEE':
      default:
        return localize.day(dayOfWeek, { width: 'wide', context: 'formatting' })
    }
  },
  // ISO day of week
  i(date: { year: number; month: number; day: number }, token: string, { localize }: FormatContext) {
    const dayOfWeek = new Temporal.PlainDate(date.year, date.month, date.day).dayOfWeek as Day

    switch (token) {
      case 'i':
        return String(dayOfWeek)
      case 'ii':
        return addLeadingZeros(dayOfWeek, token.length)
      case 'io':
        return localize.ordinalNumber(dayOfWeek, { unit: 'day' })
      case 'iii':
        return localize.day(dayOfWeek, { width: 'abbreviated', context: 'formatting' })
      case 'iiiii':
        return localize.day(dayOfWeek, { width: 'narrow', context: 'formatting' })
      case 'iiiiii':
        return localize.day(dayOfWeek, { width: 'short', context: 'formatting' })
      case 'iiii':
      default:
        return localize.day(dayOfWeek, { width: 'wide', context: 'formatting' })
    }
  },
  // AM or PM
  a(date: { hour: number }, token: string, { localize }: FormatContext) {
    const dayPeriodEnumValue: LocaleDayPeriod = date.hour >= 12 ? 'pm' : 'am'

    switch (token) {
      case 'a':
      case 'aa':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'abbreviated', context: 'formatting' })
      case 'aaa':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'abbreviated', context: 'formatting' }).toLowerCase()
      case 'aaaaa':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'narrow', context: 'formatting' })
      case 'aaaa':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'wide', context: 'formatting' })
    }
  },
  // AM, PM, midnight, noon
  b(date: { hour: number }, token: string, { localize }: FormatContext) {
    const hours = date.hour
    const dayPeriodEnumValue: LocaleDayPeriod =
      hours === 12 ? 'noon' : hours === 0 ? 'midnight' : hours >= 12 ? 'pm' : 'am'

    switch (token) {
      case 'b':
      case 'bb':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'abbreviated', context: 'formatting' })
      case 'bbb':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'abbreviated', context: 'formatting' }).toLowerCase()
      case 'bbbbb':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'narrow', context: 'formatting' })
      case 'bbbb':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'wide', context: 'formatting' })
    }
  },
  // noon, midnight, in the morning, in the afternoon, in the evening, at night
  B(date: { hour: number }, token: string, { localize }: FormatContext) {
    const hours = date.hour
    let dayPeriodEnumValue: LocaleDayPeriod
    if (hours === 12) {
      dayPeriodEnumValue = 'noon'
    } else if (hours === 0) {
      dayPeriodEnumValue = 'midnight'
    } else if (hours >= 17) {
      dayPeriodEnumValue = 'evening'
    } else if (hours >= 12) {
      dayPeriodEnumValue = 'afternoon'
    } else if (hours >= 4) {
      dayPeriodEnumValue = 'morning'
    } else {
      dayPeriodEnumValue = 'night'
    }

    switch (token) {
      case 'B':
      case 'BB':
      case 'BBB':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'abbreviated', context: 'formatting' })
      case 'BBBBB':
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'narrow', context: 'formatting' })
      case 'BBBB':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, { width: 'wide', context: 'formatting' })
    }
  },
  // Hour [1-12]
  h(date: { hour: number }, token: string, { localize }: FormatContext) {
    if (token === 'ho') {
      let hours = date.hour % 12
      if (hours === 0) hours = 12
      return localize.ordinalNumber(hours, { unit: 'hour' })
    }
    return lightFormatters.h(date, token)
  },
  // Hour [0-23]
  H(date: { hour: number }, token: string, { localize }: FormatContext) {
    if (token === 'Ho') {
      return localize.ordinalNumber(date.hour, { unit: 'hour' })
    }
    return lightFormatters.H(date, token)
  },
  // Hour [0-11]
  K(date: { hour: number }, token: string, { localize }: FormatContext) {
    const hours = date.hour % 12
    if (token === 'Ko') {
      return localize.ordinalNumber(hours, { unit: 'hour' })
    }
    return addLeadingZeros(hours, token.length)
  },
  // Hour [1-24]
  k(date: { hour: number }, token: string, { localize }: FormatContext) {
    let hours = date.hour
    if (hours === 0) hours = 24
    if (token === 'ko') {
      return localize.ordinalNumber(hours, { unit: 'hour' })
    }
    return addLeadingZeros(hours, token.length)
  },
  // Minute
  m(date: { minute: number }, token: string, { localize }: FormatContext) {
    if (token === 'mo') {
      return localize.ordinalNumber(date.minute, { unit: 'minute' })
    }
    return lightFormatters.m(date, token)
  },
  // Second
  s(date: { second: number }, token: string, { localize }: FormatContext) {
    if (token === 'so') {
      return localize.ordinalNumber(date.second, { unit: 'second' })
    }
    return lightFormatters.s(date, token)
  },
  // Fraction of second
  S(date: { millisecond: number }, token: string) {
    return lightFormatters.S(date, token)
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X(date: { offset: string }, token: string) {
    const timezoneOffset = parseOffsetString(date.offset)
    if (timezoneOffset === null) {
      throw new Error('Invalid timezone offset supplied')
    }
    if (timezoneOffset === 0) {
      return 'Z'
    }

    switch (token) {
      case 'X':
        return formatTimezoneWithOptionalMinutes(timezoneOffset)
      // Neither ISO-8601 nor JavaScript supports seconds in timezone offsets,
      // so 'XXXX' is the same as 'XX' and 'XXXXX' is the same as 'XXX'.
      case 'XXXX':
      case 'XX':
        return formatTimezone(timezoneOffset)
      case 'XXXXX':
      case 'XXX':
      default:
        return formatTimezone(timezoneOffset, ':')
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x(date: { offset: string }, token: string) {
    const timezoneOffset = parseOffsetString(date.offset)
    if (timezoneOffset === null) {
      throw new Error('Invalid timezone offset supplied')
    }

    switch (token) {
      case 'x':
        return formatTimezoneWithOptionalMinutes(timezoneOffset)
      case 'xxxx':
      case 'xx':
        return formatTimezone(timezoneOffset)
      case 'xxxxx':
      case 'xxx':
      default:
        return formatTimezone(timezoneOffset, ':')
    }
  },
  // Timezone (GMT)
  O(date: { offset: string }, token: string) {
    const timezoneOffset = parseOffsetString(date.offset)
    if (timezoneOffset === null) {
      throw new Error('Invalid timezone offset supplied')
    }
    switch (token) {
      case 'O':
      case 'OO':
      case 'OOO':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
      case 'OOOO':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':')
    }
  },
  // Timezone (specific non-location)
  z(date: { timeZone: string; epochMilliseconds: number }, token: string, { code }: FormatContext) {
    switch (token) {
      case 'z':
      case 'zz':
      case 'zzz':
        return getTimeZoneName(code, date.timeZone, date.epochMilliseconds, 'short')
      case 'zzzz':
      default:
        return getTimeZoneName(code, date.timeZone, date.epochMilliseconds, 'long')
    }
  }
}

/*
 * Light formatters: the pure number-to-string logic shared by the main
 * formatters above. They're called directly for tokens that don't need
 * localization or ordinals (e.g. `yyyy`, `MM`, `dd`).
 *
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* |                                |
 * |  d  | Day of month                   |  D  |                                |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  m  | Minute                         |  M  | Month                          |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  y  | Year (abs)                     |  Y  |                                |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 */
const lightFormatters = {
  // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
  // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
  // |----------|-------|----|-------|-------|-------|
  // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
  // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
  // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
  // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
  // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
  y(date: { year: number }, token: string): string {
    const signedYear = date.year
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    const year = signedYear > 0 ? signedYear : 1 - signedYear
    return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length)
  },
  M(date: { month: number }, token: string): string {
    const month = date.month
    return token === 'M' ? String(month) : addLeadingZeros(month, 2)
  },
  d(date: { day: number }, token: string): string {
    return addLeadingZeros(date.day, token.length)
  },
  a(date: { hour: number }, token: string): string {
    const dayPeriodEnumValue = date.hour >= 12 ? 'pm' : 'am'
    switch (token) {
      case 'a':
      case 'aa':
        return dayPeriodEnumValue.toUpperCase()
      case 'aaa':
        return dayPeriodEnumValue
      case 'aaaaa':
        return dayPeriodEnumValue[0]
      case 'aaaa':
      default:
        return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.'
    }
  },
  h(date: { hour: number }, token: string): string {
    return addLeadingZeros(date.hour % 12 || 12, token.length)
  },
  H(date: { hour: number }, token: string): string {
    return addLeadingZeros(date.hour, token.length)
  },
  m(date: { minute: number }, token: string): string {
    return addLeadingZeros(date.minute, token.length)
  },
  s(date: { second: number }, token: string): string {
    return addLeadingZeros(date.second, token.length)
  },
  S(date: { millisecond: number }, token: string): string {
    const numberOfDigits = token.length
    const fractionalSeconds = Math.floor(date.millisecond * Math.pow(10, numberOfDigits - 3))
    return addLeadingZeros(fractionalSeconds, token.length)
  }
}

// Each entry in `formattersTyped` / `longFormattersTyped` is typed against its
// specific slot requirements; the dispatch above checks those requirements at
// runtime, so widening to a uniform signature here is sound.
const formatters = formattersTyped as unknown as Record<string, Formatter | undefined>
const longFormatters = longFormattersTyped as unknown as Record<'p' | 'P', LongFormatter>

function parseOffsetString(offset: string): number | null {
  if (offset === 'Z' || offset === '+00:00' || offset === '-00:00') return 0
  const match = /^([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(offset)
  if (!match) return null
  const sign = match[1] === '-' ? -1 : 1
  const hours = parseInt(match[2], 10)
  const minutes = parseInt(match[3], 10)
  const seconds = match[4] ? parseInt(match[4], 10) : 0
  return sign * (hours * 3600 + minutes * 60 + seconds) * 1000
}

function formatTimezoneShort(offset: number, delimiter: string): string {
  const sign = offset < 0 ? '-' : '+'
  const absOffset = Math.abs(offset)
  const offsetMinutes = Math.floor(absOffset / 60000)
  const hours = Math.floor(offsetMinutes / 60)
  const minutes = offsetMinutes % 60
  if (minutes === 0) {
    return sign + String(hours)
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2)
}

function formatTimezoneWithOptionalMinutes(offset: number, dirtyDelimiter?: string): string {
  const offsetMinutes = Math.floor(offset / 60000)
  if (offsetMinutes % 60 === 0) {
    const sign = offsetMinutes < 0 ? '-' : '+'
    return sign + addLeadingZeros(Math.abs(offsetMinutes) / 60, 2)
  }
  return formatTimezone(offset, dirtyDelimiter)
}

function formatTimezone(offset: number, dirtyDelimiter?: string): string {
  const delimiter = dirtyDelimiter || ''
  const sign = offset < 0 ? '-' : '+'
  const absOffset = Math.abs(offset)
  const offsetMinutes = Math.floor(absOffset / 60000)
  const hours = addLeadingZeros(Math.floor(offsetMinutes / 60), 2)
  const minutes = addLeadingZeros(offsetMinutes % 60, 2)
  return sign + hours + delimiter + minutes
}

type TimeZoneNamePart = { type: string; value: string }
type DateTimeFormatWithParts = {
  formatToParts(date: Date): TimeZoneNamePart[]
}

// The zone's short/long name changes with DST (e.g. EST ↔ EDT in
// America/New_York), so the resolved name cannot be cached by zone alone.
// We cache the Intl.DateTimeFormat instance — which is the expensive part
// to construct — and call formatToParts against each instant.
const timeZoneFormatterCache = new Map<string, DateTimeFormatWithParts>()
function getTimeZoneName(
  localeCode: string,
  timeZone: string,
  epochMilliseconds: number,
  width: 'short' | 'long'
): string {
  const key = `${localeCode}:${width}:${timeZone}`
  let formatter = timeZoneFormatterCache.get(key)
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(localeCode, {
      timeZone,
      timeZoneName: width
    }) as unknown as DateTimeFormatWithParts
    timeZoneFormatterCache.set(key, formatter)
  }
  const parts = formatter.formatToParts(new Date(epochMilliseconds))
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? timeZone
}

function addLeadingZeros(value: number, targetLength: number): string {
  const sign = value < 0 ? '-' : ''
  let output = Math.abs(value).toString()
  while (output.length < targetLength) {
    output = '0' + output
  }
  return sign + output
}
