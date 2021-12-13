import lightFormatters from './lightFormatters'
import * as ES from '../ecmascript'
import addLeadingZeros from './addLeadingZeros'
import { Localize, QuarterIndex, Month, Day, LocaleDayPeriod } from './types'

const dayPeriodEnum = {
  am: 'am',
  pm: 'pm',
  midnight: 'midnight',
  noon: 'noon',
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night'
} as const

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

var formatters = {
  // Era
  G(date: { year: number }, token: string, localize: Localize) {
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
  y(date: { year: number }, token: string, localize: Localize) {
    // Ordinal number
    if (token === 'yo') {
      var signedYear = date.year
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      var year = signedYear > 0 ? signedYear : 1 - signedYear
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
  Q(date: { month: number }, token: string, localize: Localize) {
    const quarter = Math.ceil(date.month / 3) as QuarterIndex
    switch (token) {
      // 1, 2, 3, 4
      case 'Q':
        return String(quarter)
      // 01, 02, 03, 04
      case 'QQ':
        return addLeadingZeros(quarter, 2)
      // 1st, 2nd, 3rd, 4th
      case 'Qo':
        return localize.ordinalNumber(quarter, { unit: 'quarter' })
      // Q1, Q2, Q3, Q4
      case 'QQQ':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'formatting'
        })
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case 'QQQQQ':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'formatting'
        })
      // 1st quarter, 2nd quarter, ...
      case 'QQQQ':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'formatting'
        })
    }
  },
  // Month
  M(date: { month: number }, token: string, localize: Localize) {
    const month = (date.month - 1) as Month
    switch (token) {
      case 'M':
      case 'MM':
        return lightFormatters.M(date, token)
      // 1st, 2nd, ..., 12th
      case 'Mo':
        return localize.ordinalNumber(month + 1, { unit: 'month' })
      // Jan, Feb, ..., Dec
      case 'MMM':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'formatting'
        })
      // J, F, ..., D
      case 'MMMMM':
        return localize.month(month, { width: 'narrow', context: 'formatting' })
      // January, February, ..., December
      case 'MMMM':
      default:
        return localize.month(month, { width: 'wide', context: 'formatting' })
    }
  },
  // ISO week of year
  I(date: { year: number; month: number; day: number }, token: string, localize: Localize) {
    const isoWeek = ES.WeekOfYear(date.year, date.month, date.day)

    if (token === 'Io') {
      return localize.ordinalNumber(isoWeek, { unit: 'week' })
    }

    return addLeadingZeros(isoWeek, token.length)
  },

  // Day of the month
  d(date: { day: number }, token: string, localize: Localize) {
    if (token === 'do') {
      return localize.ordinalNumber(date.day, { unit: 'date' })
    }

    return lightFormatters.d(date, token)
  },
  // Day of week
  E(date: { year: number; month: number; day: number }, token: string, localize: Localize) {
    const dayOfWeek = ES.DayOfWeek(date.year, date.month, date.day) as Day
    switch (token) {
      // Tue
      case 'E':
      case 'EE':
      case 'EEE':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        })
      // T
      case 'EEEEE':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        })
      // Tu
      case 'EEEEEE':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        })
      // Tuesday
      case 'EEEE':
      default:
        return localize.day(dayOfWeek, { width: 'wide', context: 'formatting' })
    }
  },
  // ISO day of week
  i(date: { year: number; month: number; day: number }, token: string, localize: Localize) {
    const dayOfWeek = ES.DayOfWeek(date.year, date.month, date.day) as Day
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek
    switch (token) {
      // 2
      case 'i':
        return String(isoDayOfWeek)
      // 02
      case 'ii':
        return addLeadingZeros(isoDayOfWeek, token.length)
      // 2nd
      case 'io':
        return localize.ordinalNumber(isoDayOfWeek, { unit: 'day' })
      // Tue
      case 'iii':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        })
      // T
      case 'iiiii':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        })
      // Tu
      case 'iiiiii':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        })
      // Tuesday
      case 'iiii':
      default:
        return localize.day(dayOfWeek, { width: 'wide', context: 'formatting' })
    }
  },
  // AM or PM
  a(date: { hour: number }, token: string, localize: Localize) {
    const hours = date.hour
    const dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am'

    switch (token) {
      case 'a':
      case 'aa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        })
      case 'aaa':
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          })
          .toLowerCase()
      case 'aaaaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        })
      case 'aaaa':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        })
    }
  },
  // AM, PM, midnight, noon
  b(date: { hour: number }, token: string, localize: Localize) {
    const hours = date.hour
    const dayPeriodEnumValue: LocaleDayPeriod =
      hours === 12 ? dayPeriodEnum.noon : hours === 0 ? dayPeriodEnum.midnight : hours / 12 >= 1 ? 'pm' : 'am'

    switch (token) {
      case 'b':
      case 'bb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        })
      case 'bbb':
        return localize
          .dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          })
          .toLowerCase()
      case 'bbbbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        })
      case 'bbbb':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        })
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B(date: { hour: number }, token: string, localize: Localize) {
    const hours = date.hour
    var dayPeriodEnumValue: LocaleDayPeriod
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night
    }

    switch (token) {
      case 'B':
      case 'BB':
      case 'BBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        })
      case 'BBBBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        })
      case 'BBBB':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        })
    }
  },
  // Hour [1-12]
  h(date: { hour: number }, token: string, localize: Localize) {
    if (token === 'ho') {
      var hours = date.hour % 12
      if (hours === 0) hours = 12
      return localize.ordinalNumber(hours, { unit: 'hour' })
    }

    return lightFormatters.h(date, token)
  },
  // Hour [0-23]
  H(date: { hour: number }, token: string, localize: Localize) {
    if (token === 'Ho') {
      return localize.ordinalNumber(date.hour, { unit: 'hour' })
    }

    return lightFormatters.H(date, token)
  },
  // Hour [0-11]
  K(date: { hour: number }, token: string, localize: Localize) {
    var hours = date.hour % 12

    if (token === 'Ko') {
      return localize.ordinalNumber(hours, { unit: 'hour' })
    }

    return addLeadingZeros(hours, token.length)
  },
  // Hour [1-24]
  k(date: { hour: number }, token: string, localize: Localize) {
    var hours = date.hour
    if (hours === 0) hours = 24

    if (token === 'ko') {
      return localize.ordinalNumber(hours, { unit: 'hour' })
    }

    return addLeadingZeros(hours, token.length)
  },
  // Minute
  m(date: { minute: number }, token: string, localize: Localize) {
    if (token === 'mo') {
      return localize.ordinalNumber(date.minute, { unit: 'minute' })
    }

    return lightFormatters.m(date, token)
  },
  // Second
  s(date: { second: number }, token: string, localize: Localize) {
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
    const timezoneOffset = ES.ParseOffsetString(date.offset)

    if (timezoneOffset === null) {
      throw new Error('Invalid timezone offset supplied')
    }

    if (timezoneOffset === 0) {
      return 'Z'
    }

    switch (token) {
      // Hours and optional minutes
      case 'X':
        return formatTimezoneWithOptionalMinutes(timezoneOffset)

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case 'XXXX':
      case 'XX': // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset)

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case 'XXXXX':
      case 'XXX': // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ':')
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x(date: { offset: string }, token: string) {
    const timezoneOffset = ES.ParseOffsetString(date.offset)

    if (timezoneOffset === null) {
      throw new Error('Invalid timezone offset supplied')
    }

    switch (token) {
      // Hours and optional minutes
      case 'x':
        return formatTimezoneWithOptionalMinutes(timezoneOffset)

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case 'xxxx':
      case 'xx': // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset)

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case 'xxxxx':
      case 'xxx': // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ':')
    }
  },
  // Timezone (GMT)
  O(date: { offset: string }, token: string) {
    const timezoneOffset = ES.ParseOffsetString(date.offset)

    if (timezoneOffset === null) {
      throw new Error('Invalid timezone offset supplied')
    }
    switch (token) {
      // Short
      case 'O':
      case 'OO':
      case 'OOO':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
      // Long
      case 'OOOO':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':')
    }
  },
  // Timezone (specific non-location)
  z(date: { timeZone: string; epochMilliseconds: number }, token: string) {
    switch (token) {
      // Short
      case 'z':
      case 'zz':
      case 'zzz':
        return ES.GetTimeZoneAbbreviation(date.timeZone, date.epochMilliseconds)
      // Long
      case 'zzzz':
      default:
        return ES.GetTimeZoneName(date.timeZone, date.epochMilliseconds)
    }
  }
}

function formatTimezoneShort(offset: number, delimiter: string) {
  var sign = offset < 0 ? '-' : '+'
  var absOffset = Math.abs(offset)
  var offsetMinutes = Math.floor(absOffset / 60000)
  var hours = Math.floor(offsetMinutes / 60)
  var minutes = offsetMinutes % 60
  if (minutes === 0) {
    return sign + String(hours)
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2)
}

function formatTimezoneWithOptionalMinutes(offset: number, dirtyDelimiter?: string) {
  var offsetMinutes = Math.floor(offset / 60000)
  if (offsetMinutes % 60 === 0) {
    var sign = offsetMinutes < 0 ? '-' : '+'
    return sign + addLeadingZeros(Math.abs(offsetMinutes) / 60, 2)
  }
  return formatTimezone(offset, dirtyDelimiter)
}

function formatTimezone(offset: number, dirtyDelimiter?: string) {
  var delimiter = dirtyDelimiter || ''
  var sign = offset < 0 ? '-' : '+'
  var absOffset = Math.abs(offset)
  var offsetMinutes = Math.floor(absOffset / 60000)
  var hours = addLeadingZeros(Math.floor(offsetMinutes / 60), 2)
  var minutes = addLeadingZeros(offsetMinutes % 60, 2)
  return sign + hours + delimiter + minutes
}

export default formatters
