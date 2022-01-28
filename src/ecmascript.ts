import { Iso } from './iso-types'
import * as PARSE from './regex'

export type TemporalRoundingMode = 'halfExpand' | 'ceil' | 'trunc' | 'floor'
export type TemporalDisambiguation = 'compatible' | 'earlier' | 'later' | 'reject'
export type TemporalOverflow = 'constrain' | 'reject'
export type TemporalOffset = 'prefer' | 'ignore' | 'reject' | 'use'
export type TemporalSingularUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
export type TemporalPluralUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'
type TimePrecision = 'auto' | 'minute' | 'second' | 'ms100' | 'ms10' | 'ms1'
export interface Chain<T> {
  value(): T
}

export function buildChain<T>(value: T) {
  return {
    value(): T {
      return value
    }
  }
}

type CalendarDate = Iso.Date | Iso.DateTime | Iso.ZonedDateTime | Iso.YearMonth | Iso.MonthDay
type Options = Record<string | number | symbol, unknown>

const IntlDateTimeFormat = globalThis.Intl.DateTimeFormat
const MathMin = Math.min
const MathMax = Math.max
const MathAbs = Math.abs
const MathFloor = Math.floor
const MathSign = Math.sign
const MathTrunc = Math.trunc
const NumberIsNaN = Number.isNaN
const NumberIsFinite = Number.isFinite
const NumberCtor = Number
const NumberMaxSafeInteger = Number.MAX_SAFE_INTEGER
const ObjectCreate = Object.create
const ObjectIs = Object.is
const ObjectKeys = Object.keys

const DAY_SECONDS = 86400
const DAY_MILLIS = DAY_SECONDS * 1e3
const MS_MIN = -DAY_SECONDS * 1e11
const MS_MAX = DAY_SECONDS * 1e11
const BEFORE_FIRST_DST = -388152 * 1e7 // 1847-01-01T00:00:00Z

const YEAR_MIN = -271821
const YEAR_MAX = 275760

function IsInteger(value: unknown): value is number {
  if (typeof value !== 'number' || !NumberIsFinite(value)) return false
  const abs = MathAbs(value)
  return MathFloor(abs) === abs
}

// For unknown values, this narrows the result to a Record. But for union types
// like `Temporal.DurationLike | string`, it'll strip the primitive types while
// leaving the object type(s) unchanged.
export function IsObject<T>(value: T): value is Exclude<T, string | null | undefined | number | bigint | symbol | boolean>
export function IsObject(value: unknown): value is Record<string | number | symbol, unknown> {
  return (typeof value === 'object' && value !== null) || typeof value === 'function'
}

export function ToNumber(value: unknown): number {
  if (typeof value === 'bigint') throw new TypeError('Cannot convert BigInt to number')
  return NumberCtor(value)
}

function ToInteger(value: unknown): number {
  const num = ToNumber(value)
  if (NumberIsNaN(num)) return 0
  const integer = MathTrunc(num)
  if (num === 0) return 0
  return integer
}

export function ToString(value: unknown): string {
  if (typeof value === 'symbol') {
    throw new TypeError('Cannot convert a Symbol value to a String')
  }
  return String(value)
}

export function ToIntegerThrowOnInfinity(value: unknown): number {
  const integer = ToInteger(value)
  if (!NumberIsFinite(integer)) {
    throw new RangeError('infinity is out of range')
  }
  return integer
}

export function ToPositiveInteger(valueParam: unknown, property?: string): number {
  const value = ToInteger(valueParam)
  if (!NumberIsFinite(value)) {
    throw new RangeError('infinity is out of range')
  }
  if (value < 1) {
    if (property !== undefined) {
      throw new RangeError(`property '${property}' cannot be a a number less than one`)
    }
    throw new RangeError('Cannot convert a number less than one to a positive integer')
  }
  return value
}

function ToIntegerNoFraction(valueParam: unknown): number {
  const value = ToNumber(valueParam)
  if (!IsInteger(value)) {
    throw new RangeError(`unsupported fractional value ${value}`)
  }
  return value
}

const BUILTIN_CASTS = new Map<string, (v: unknown) => number | string>([
  ['year', ToIntegerThrowOnInfinity],
  ['month', ToPositiveInteger],
  ['day', ToPositiveInteger],
  ['hour', ToIntegerThrowOnInfinity],
  ['minute', ToIntegerThrowOnInfinity],
  ['second', ToIntegerThrowOnInfinity],
  ['millisecond', ToIntegerThrowOnInfinity],
  ['years', ToIntegerNoFraction],
  ['months', ToIntegerNoFraction],
  ['weeks', ToIntegerNoFraction],
  ['days', ToIntegerNoFraction],
  ['hours', ToIntegerNoFraction],
  ['minutes', ToIntegerNoFraction],
  ['seconds', ToIntegerNoFraction],
  ['milliseconds', ToIntegerNoFraction],
  ['era', ToString],
  ['eraYear', ToInteger],
  ['offset', ToString]
])

const ALLOWED_UNITS: TemporalSingularUnit[] = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond']
const SINGULAR_PLURAL_UNITS: [TemporalPluralUnit, TemporalSingularUnit][] = [
  ['years', 'year'],
  ['months', 'month'],
  ['weeks', 'week'],
  ['days', 'day'],
  ['hours', 'hour'],
  ['minutes', 'minute'],
  ['seconds', 'second'],
  ['milliseconds', 'millisecond']
]

const IntlDateTimeFormatEnUsCache = new Map()

function getIntlDateTimeFormatEnUsForTimeZone(timeZoneIdentifier: any) {
  let instance = IntlDateTimeFormatEnUsCache.get(timeZoneIdentifier)
  if (instance === undefined) {
    instance = new IntlDateTimeFormat('en-us', {
      timeZone: String(timeZoneIdentifier),
      hour12: false,
      era: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    IntlDateTimeFormatEnUsCache.set(timeZoneIdentifier, instance)
  }
  return instance
}

const timeZoneAbbreviationCache = new Map()

export function GetTimeZoneAbbreviation(timeZone: string, epochMilliseconds: number) {
  let instance = timeZoneAbbreviationCache.get(timeZone)
  if (instance === undefined) {
    const fullFormat = new IntlDateTimeFormat('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: 'numeric',
      hour12: false,
      weekday: 'short',
      timeZoneName: 'short',
      timeZone: timeZone
    }).format(new Date(epochMilliseconds))
    const split = fullFormat.split(' ')
    instance = split[split.length - 1]
    timeZoneAbbreviationCache.set(timeZone, instance)
  }
  return instance
}

const timeZoneFullNameCache = new Map()
export function GetTimeZoneName(timeZone: string, epochMilliseconds: number) {
  let instance = timeZoneFullNameCache.get(timeZone)
  if (instance === undefined) {
    const fullFormat = new IntlDateTimeFormat('en-us', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: 'numeric',
      hour12: false,
      weekday: 'short',
      timeZoneName: 'long',
      timeZone: timeZone
    }).format(new Date(epochMilliseconds))
    const split = fullFormat.split(' ')
    instance = split.slice(3).join(' ')
    timeZoneFullNameCache.set(timeZone, instance)
  }
  return instance
}

export function IsTemporalInstant(item: unknown): item is Iso.Instant {
  try {
    const stringifiedMs1 = new Date(item as any).toISOString()
    const stringifiedMs10 = stringifiedMs1.replace('0Z', 'Z')
    const stringifiedMs100 = stringifiedMs1.replace('00Z', 'Z')
    const stringifiedS = stringifiedMs1.replace('.000Z', 'Z')
    const stringifiedM = stringifiedMs1.replace(':00.000Z', 'Z')

    return [stringifiedMs1, stringifiedMs10, stringifiedMs100, stringifiedS, stringifiedM].includes(item as string)
  } catch (e) {
    return false
  }
}

export function IsTemporalTimeZone(item: unknown): item is string {
  try {
    return GetCanonicalTimeZoneIdentifier(item) === item
  } catch {
    return false
  }
}

export function IsTemporalDuration(item: unknown): item is Iso.Duration {
  try {
    const slots = GetDurationSlots(item as Iso.Duration)
    const created = CreateTemporalDuration(
      slots.years,
      slots.months,
      slots.weeks,
      slots.days,
      slots.hours,
      slots.minutes,
      slots.seconds,
      slots.milliseconds
    )
    return created === item
  } catch (e) {
    return false
  }
}
export function AssertIsDuration(item: unknown): asserts item is Iso.Duration {
  if (!IsTemporalDuration(item)) throw new TypeError(`Invalid Duration: ${item} is not a duration`)
}
export function IsTemporalDate(item: unknown): item is Iso.Date {
  try {
    const slots = GetDateSlots(item as Iso.Date)
    return CreateTemporalDate(slots.year, slots.month, slots.day) === item
  } catch (e) {
    return false
  }
}

export function IsTemporalTime(item: unknown): item is Iso.Time {
  try {
    const slots = GetTimeSlots(item as Iso.Time)
    const precision = GetTimePrecision(item as Iso.Time)
    const created = CreateTemporalTime(slots.hour, slots.minute, slots.second, slots.millisecond, { precision })
    return created === item
  } catch (e) {
    return false
  }
}
export function IsTemporalDateTime(item: unknown): item is Iso.DateTime {
  try {
    const slots = GetDateTimeSlots(item as Iso.DateTime)
    const time = (item as string).split('T')[1] as Iso.Time
    const precision = GetTimePrecision(time)
    const created = CreateTemporalDateTime(
      slots.year,
      slots.month,
      slots.day,
      slots.hour,
      slots.minute,
      slots.second,
      slots.millisecond,
      { precision }
    )
    return created === item
  } catch (e) {
    return false
  }
}
export function IsTemporalYearMonth(item: unknown): item is Iso.YearMonth {
  try {
    const slots = GetYearMonthSlots(item as Iso.YearMonth)
    return CreateTemporalYearMonth(slots.year, slots.month) === item
  } catch (e) {
    return false
  }
}
export function IsTemporalMonthDay(item: unknown): item is Iso.MonthDay {
  try {
    const slots = GetMonthDaySlots(item as Iso.MonthDay)
    return CreateTemporalMonthDay(slots.month, slots.day) === item
  } catch (e) {
    return false
  }
}
export function IsTemporalZonedDateTime(item: unknown): item is Iso.ZonedDateTime {
  try {
    const rawNoDate = (item as string).split('T')[1]
    const rawTime = rawNoDate.includes('+') ? rawNoDate.split('+')[0] : rawNoDate.split('-')[0]
    const precision = GetTimePrecision(rawTime as Iso.Time)
    const slots = GetZonedDateTimeSlots(item as Iso.ZonedDateTime)
    const time = CreateTemporalTime(slots.hour, slots.minute, slots.second, slots.millisecond, { precision })

    const created = CreateTemporalZonedDateTime(slots.epochMilliseconds, slots.timeZone)
    const [dirtyDateTime, dirtyTimeZone] = created.split('[')
    const timeZone = dirtyTimeZone.replace(']', '')
    const offsetStr = dirtyDateTime.substring(dirtyDateTime.length - 6, dirtyDateTime.length)
    const dateTime = dirtyDateTime.substring(0, dirtyDateTime.length - 6)
    const [date] = dateTime.split('T')
    return `${date}T${time}${offsetStr}[${timeZone}]` === item
  } catch (e) {
    return false
  }
}

function TemporalTimeZoneFromString(stringIdent: string) {
  let { ianaName, offset, z } = ParseTemporalTimeZoneString(stringIdent)
  let identifier = ianaName
  if (!identifier && z) identifier = 'UTC'
  if (!identifier) identifier = offset
  const result = GetCanonicalTimeZoneIdentifier(identifier)
  if (offset && identifier !== offset) {
    const ns = ParseTemporalInstant(stringIdent)
    const offsetMs = GetIANATimeZoneOffsetMilliseconds(ns, result)
    if (FormatTimeZoneOffsetString(offsetMs) !== offset) {
      throw new RangeError(`invalid offset ${offset}[${ianaName}]`)
    }
  }
  return result
}

function ParseISODateTime(isoString: string, { zoneRequired }: { zoneRequired: boolean }) {
  const regex = zoneRequired ? PARSE.instant : PARSE.datetime
  const match = regex.exec(isoString)
  if (!match) throw new RangeError(`invalid ISO 8601 string: ${isoString}`)
  let yearString = match[1]
  if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`
  const year = ToInteger(yearString)
  const month = ToInteger(match[2] || match[4])
  const day = ToInteger(match[3] || match[5])
  const hour = ToInteger(match[6])
  const minute = ToInteger(match[7] || match[10])
  let second = ToInteger(match[8] || match[11])
  if (second === 60) second = 59
  const fraction = (match[9] || match[12]) + '000000000'
  const millisecond = ToInteger(fraction.slice(0, 3))
  let offset
  let z = false
  if (match[13]) {
    offset = undefined
    z = true
  } else if (match[14] && match[15]) {
    const offsetSign = match[14] === '-' || match[14] === '\u2212' ? '-' : '+'
    const offsetHours = match[15] || '00'
    const offsetMinutes = match[16] || '00'
    const offsetSeconds = match[17] || '00'
    let offsetFraction = match[18] || '0'
    offset = `${offsetSign}${offsetHours}:${offsetMinutes}`
    if (+offsetFraction) {
      while (offsetFraction.endsWith('0')) offsetFraction = offsetFraction.slice(0, -1)
      offset += `:${offsetSeconds}.${offsetFraction}`
    } else if (+offsetSeconds) {
      offset += `:${offsetSeconds}`
    }
    if (offset === '-00:00') offset = '+00:00'
  }
  let ianaName = match[19]
  if (ianaName) {
    try {
      // Canonicalize name if it is an IANA link name or is capitalized wrong
      ianaName = GetCanonicalTimeZoneIdentifier(ianaName).toString()
    } catch {
      // Not an IANA name, may be a custom ID, pass through unchanged
    }
  }
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    ianaName,
    offset,
    z
  }
}

function ParseTemporalInstantString(isoString: string) {
  return ParseISODateTime(isoString, { zoneRequired: true })
}

export function ParseTemporalZonedDateTimeString(isoString: string) {
  return ParseISODateTime(isoString, { zoneRequired: true })
}

export function ParseTemporalDateTimeString(isoString: string) {
  return ParseISODateTime(isoString, { zoneRequired: false })
}

export function ParseTemporalDateString(isoString: string) {
  return ParseISODateTime(isoString, { zoneRequired: false })
}

export function ParseTemporalTimeString(isoString: string) {
  const match = PARSE.time.exec(isoString)
  let hour, minute, second, millisecond
  if (match) {
    hour = ToInteger(match[1])
    minute = ToInteger(match[2] || match[5])
    second = ToInteger(match[3] || match[6])
    if (second === 60) second = 59
    const fraction = (match[4] || match[7]) + '000000000'
    millisecond = ToInteger(fraction.slice(0, 3))
  } else {
    ;({ hour, minute, second, millisecond } = ParseISODateTime(isoString, {
      zoneRequired: false
    }))
  }
  return { hour, minute, second, millisecond }
}

export function ParseTemporalYearMonthString(isoString: string) {
  const match = PARSE.yearmonth.exec(isoString)
  let year, month, referenceISODay
  if (match) {
    let yearString = match[1]
    if (yearString[0] === '\u2212') yearString = `-${yearString.slice(1)}`
    year = ToInteger(yearString)
    month = ToInteger(match[2])
  } else {
    ;({ year, month, day: referenceISODay } = ParseISODateTime(isoString, { zoneRequired: false }))
  }
  return { year, month, referenceISODay }
}

export function ParseTemporalMonthDayString(isoString: string) {
  const match = PARSE.monthday.exec(isoString)
  let month, day, referenceISOYear
  if (match) {
    month = ToInteger(match[1])
    day = ToInteger(match[2])
  } else {
    ;({ month, day, year: referenceISOYear } = ParseISODateTime(isoString, { zoneRequired: false }))
  }
  return { month, day, referenceISOYear }
}

function ParseTemporalTimeZoneString(stringIdent: string): {
  ianaName?: string | undefined
  offset?: string | undefined
  z?: boolean | undefined
} {
  try {
    let canonicalIdent = GetCanonicalTimeZoneIdentifier(stringIdent)
    if (canonicalIdent) {
      canonicalIdent = canonicalIdent.toString()
      if (ParseOffsetString(canonicalIdent) !== null) return { offset: canonicalIdent }
      return { ianaName: canonicalIdent }
    }
  } catch {
    // fall through
  }
  try {
    // Try parsing ISO string instead
    return ParseISODateTime(stringIdent, { zoneRequired: true })
  } catch {
    throw new RangeError(`Invalid time zone: ${stringIdent}`)
  }
}

export function ParseTemporalDurationString(isoString: string) {
  const match = PARSE.duration.exec(isoString)
  if (!match) throw new RangeError(`invalid duration: ${isoString}`)
  if (match.slice(2).every((element) => element === undefined)) {
    throw new RangeError(`invalid duration: ${isoString}`)
  }
  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : 1
  const years = ToInteger(match[2]) * sign
  const months = ToInteger(match[3]) * sign
  const weeks = ToInteger(match[4]) * sign
  const days = ToInteger(match[5]) * sign
  const hours = ToInteger(match[6]) * sign
  let fHours: number | string = match[7]
  let minutes = ToInteger(match[8]) * sign
  let fMinutes: number | string = match[9]
  let seconds = ToInteger(match[10]) * sign
  const fSeconds = match[11] + '000000000'
  let milliseconds = ToInteger(fSeconds.slice(0, 3)) * sign

  fHours = fHours ? (sign * ToInteger(fHours)) / 10 ** fHours.length : 0
  fMinutes = fMinutes ? (sign * ToInteger(fMinutes)) / 10 ** fMinutes.length : 0
  ;({ minutes, seconds, milliseconds } = DurationHandleFractions(fHours, minutes, fMinutes, seconds, milliseconds))
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds }
}

export function ParseTemporalInstant(isoString: string) {
  const { year, month, day, hour, minute, second, millisecond, offset, z } = ParseTemporalInstantString(isoString)

  const epochMs = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond)
  if (epochMs === null) throw new RangeError('DateTime outside of supported range')
  if (!z && !offset) throw new RangeError('Temporal.Instant requires a time zone offset')
  const offsetMs = z ? 0 : ParseOffsetString(offset as string)
  return epochMs - (offsetMs as number)
}

export function RegulateISODate(year: number, month: number, day: number, overflow: TemporalOverflow) {
  switch (overflow) {
    case 'reject':
      RejectISODate(year, month, day)
      break
    case 'constrain':
      ;({ year, month, day } = ConstrainISODate(year, month, day))
      break
  }
  return { year, month, day }
}

export function RegulateTime(hour: number, minute: number, second: number, millisecond: number, overflow: TemporalOverflow) {
  switch (overflow) {
    case 'reject':
      RejectTime(hour, minute, second, millisecond)
      break
    case 'constrain':
      ;({ hour, minute, second, millisecond } = ConstrainTime(hour, minute, second, millisecond))
      break
  }
  return { hour, minute, second, millisecond }
}

export function RegulateISOYearMonth(year: number, month: number, overflow: TemporalOverflow) {
  const referenceISODay = 1
  switch (overflow) {
    case 'reject':
      RejectISODate(year, month, referenceISODay)
      break
    case 'constrain':
      ;({ year, month } = ConstrainISODate(year, month))
      break
  }
  return { year, month }
}

function DurationHandleFractions(
  fHours: number,
  minutes: number,
  fMinutes: number,
  seconds: number,
  milliseconds: number
): {
  minutes: number
  seconds: number
  milliseconds: number
} {
  if (fHours !== 0) {
    ;[minutes, fMinutes, seconds, milliseconds].forEach((val) => {
      if (val !== 0) throw new RangeError('only the smallest unit can be fractional')
    })
    const mins = fHours * 60
    minutes = MathTrunc(mins)
    fMinutes = mins % 1
  }

  if (fMinutes !== 0) {
    ;[seconds, milliseconds].forEach((val) => {
      if (val !== 0) throw new RangeError('only the smallest unit can be fractional')
    })
    const secs = fMinutes * 60
    seconds = MathTrunc(secs)
    const fSeconds = secs % 1

    if (fSeconds !== 0) {
      const mils = fSeconds * 1000
      milliseconds = MathTrunc(mils)
      const fMilliseconds = mils % 1
    }
  }

  return { minutes, seconds, milliseconds }
}

function ToTemporalDurationRecord(item: Iso.Duration | Record<string, any>) {
  if (IsTemporalDuration(item)) {
    return GetDurationSlots(item)
  }
  const props = ToPartialRecord(item, ['days', 'hours', 'milliseconds', 'minutes', 'months', 'seconds', 'weeks', 'years'])
  if (!props) throw new TypeError('invalid duration-like')
  const { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = props
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds }
}

export function ToLimitedTemporalDuration(
  item: Iso.Duration | Partial<DurationSlots>,
  disallowedProperties: TemporalPluralUnit[] = []
): DurationSlots {
  let record
  if (IsObject(item)) {
    record = ToTemporalDurationRecord(item)
  } else {
    const str = ToString(item)
    record = ParseTemporalDurationString(str)
  }
  const { years, months, weeks, days, hours, minutes, seconds, milliseconds } = record
  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  for (const property of disallowedProperties) {
    if (record[property] !== 0) {
      throw new RangeError(
        `Duration field ${property} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`
      )
    }
  }
  return record
}

export function ToTemporalOverflow(options: Options) {
  return GetOption(options, 'overflow', ['constrain', 'reject'], 'constrain')
}

export function ToTemporalDisambiguation(options: Options) {
  return GetOption(options, 'disambiguation', ['compatible', 'earlier', 'later', 'reject'], 'compatible')
}

export function ToTemporalRoundingMode(options: Options, fallback: TemporalRoundingMode) {
  return GetOption(options, 'roundingMode', ['ceil', 'floor', 'trunc', 'halfExpand'], fallback)
}

export function NegateTemporalRoundingMode(roundingMode: TemporalRoundingMode) {
  switch (roundingMode) {
    case 'ceil':
      return 'floor'
    case 'floor':
      return 'ceil'
    default:
      return roundingMode
  }
}

export function ToTemporalOffset(options: Options, fallback: TemporalOffset) {
  return GetOption(options, 'offset', ['prefer', 'use', 'ignore', 'reject'], fallback)
}

export function ToShowTimeZoneNameOption(options: Options) {
  return GetOption(options, 'timeZoneName', ['auto', 'never'], 'auto')
}

export function ToShowOffsetOption(options: Options) {
  return GetOption(options, 'offset', ['auto', 'never'], 'auto')
}

export function ToTemporalRoundingIncrement(options: Options, dividend: number | undefined, inclusive: boolean) {
  let maximum = Infinity
  if (dividend !== undefined) maximum = dividend
  if (!inclusive && dividend !== undefined) maximum = dividend > 1 ? dividend - 1 : 1
  const increment = GetNumberOption(options, 'roundingIncrement', 1, maximum, 1)
  if (dividend !== undefined && dividend % increment !== 0) {
    throw new RangeError(`Rounding increment must divide evenly into ${dividend}`)
  }
  return increment
}

export function ToTemporalDateTimeRoundingIncrement(options: Options, smallestUnit: TemporalSingularUnit) {
  const maximumIncrements = {
    year: undefined,
    month: undefined,
    week: undefined,
    day: undefined,
    hour: 24,
    minute: 60,
    second: 60,
    millisecond: 1000
  }
  return ToTemporalRoundingIncrement(options, maximumIncrements[smallestUnit], false)
}

export function ToSecondsStringPrecision(options: Options): {
  precision: 0 | 1 | 2 | 3 | 'auto' | 'minute'
  unit: string
  increment: number
} {
  const smallestUnit = ToSmallestTemporalUnit(options, undefined, ['year', 'month', 'week', 'day', 'hour'])
  switch (smallestUnit) {
    case 'minute':
      return { precision: 'minute', unit: 'minute', increment: 1 }
    case 'second':
      return { precision: 0, unit: 'second', increment: 1 }
    case 'millisecond':
      return { precision: 3, unit: 'millisecond', increment: 1 }
    default: // fall through if option not given
  }
  let digits = options.fractionalSecondDigits
  if (digits === undefined) digits = 'auto'
  if (typeof digits !== 'number') {
    digits = ToString(digits)
    if (digits === 'auto') return { precision: 'auto', unit: 'millisecond', increment: 1 }
    throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digits}`)
  }
  if (NumberIsNaN(digits) || digits < 0 || digits > 9) {
    throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digits}`)
  }
  const precision = MathFloor(digits)
  switch (precision) {
    case 0:
      return { precision, unit: 'second', increment: 1 }
    case 1:
    case 2:
    case 3:
      return { precision, unit: 'millisecond', increment: 10 ** (3 - precision) }
    default:
      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${digits}`)
  }
}

export function ToLargestTemporalUnit(
  options: Options,
  fallback: TemporalSingularUnit | TemporalPluralUnit | 'auto' | undefined,
  disallowedStrings: TemporalSingularUnit[] = [],
  autoValue?: any
): TemporalSingularUnit | 'auto' {
  const singular = new Map(SINGULAR_PLURAL_UNITS.filter(([, sing]) => !disallowedStrings.includes(sing)))
  const allowed = new Set(ALLOWED_UNITS)
  for (const s of disallowedStrings) {
    allowed.delete(s)
  }
  const retval = GetOption(options, 'largestUnit', ['auto', ...allowed, ...singular.keys()], fallback)
  if (retval === 'auto' && autoValue !== undefined) return autoValue
  if (singular.has(retval as TemporalPluralUnit)) return singular.get(retval as TemporalPluralUnit) as TemporalSingularUnit
  return retval as TemporalSingularUnit
}

export function ToSmallestTemporalUnit(
  options: Options,
  fallback: TemporalSingularUnit | TemporalPluralUnit | undefined,
  disallowedStrings: TemporalSingularUnit[] = []
): TemporalSingularUnit {
  const singular = new Map(SINGULAR_PLURAL_UNITS.filter(([, sing]) => !disallowedStrings.includes(sing)))
  const allowed = new Set(ALLOWED_UNITS)
  for (const s of disallowedStrings) {
    allowed.delete(s)
  }
  const value = GetOption(options, 'smallestUnit', [...allowed, ...singular.keys()], fallback)
  if (singular.has(value as TemporalPluralUnit)) return singular.get(value as TemporalPluralUnit) as TemporalSingularUnit
  return value as TemporalSingularUnit
}

export function ToTemporalDurationTotalUnit(options: Options) {
  // This AO is identical to ToSmallestTemporalUnit, except:
  // - default is always `undefined` (caller will throw if omitted)
  // - option is named `unit` (not `smallestUnit`)
  // - all units are valid (no `disallowedStrings`)
  const singular = new Map(SINGULAR_PLURAL_UNITS)
  const value = GetOption(options, 'unit', [...singular.values(), ...singular.keys()], undefined)
  if (singular.has(value as TemporalPluralUnit)) return singular.get(value as TemporalPluralUnit) as TemporalSingularUnit
  return value as TemporalSingularUnit
}

export function ToRelativeTemporalObject(options: Options) {
  const relativeTo = options.relativeTo
  if (relativeTo === undefined) return relativeTo

  let offsetBehaviour = 'option'
  let year, month, day, hour, minute, second, millisecond, timeZone, offset
  if (IsTemporalZonedDateTime(relativeTo) || IsTemporalDateTime(relativeTo)) return relativeTo
  if (IsTemporalDate(relativeTo)) {
    const { year: ISO_YEAR, month: ISO_MONTH, day: ISO_DAY } = GetDateSlots(relativeTo)
    return CreateTemporalDateTime(ISO_YEAR, ISO_MONTH, ISO_DAY, 0, 0, 0, 0)
  }
  if (IsObject(relativeTo)) {
    const fields = ToTemporalDateTimeFields(relativeTo as any)
    const dateOptions = ObjectCreate(null)
    dateOptions.overflow = 'constrain'
    ;({ year, month, day, hour, minute, second, millisecond } = InterpretTemporalDateTimeFields(fields, dateOptions))
    offset = (relativeTo as Record<string | number | symbol, unknown>).offset
    if (offset === undefined) offsetBehaviour = 'wall'
    timeZone = (relativeTo as Record<string | number | symbol, unknown>).timeZone
  } else {
    let ianaName, z
    ;({ year, month, day, hour, minute, second, millisecond, ianaName, offset, z } = ParseISODateTime(ToString(relativeTo), {
      zoneRequired: false
    }))
    if (ianaName) timeZone = ianaName
    if (z) {
      offsetBehaviour = 'exact'
    } else if (!offset) {
      offsetBehaviour = 'wall'
    }
  }
  if (timeZone) {
    timeZone = ToTemporalTimeZone(timeZone as any)
    let offsetMs = 0
    if (offsetBehaviour === 'option') offsetMs = ParseOffsetString(ToString(offset)) as number
    const epochMilliseconds = InterpretISODateTimeOffset(
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      offsetBehaviour,
      offsetMs,
      timeZone,
      'compatible',
      'reject'
    )
    return CreateTemporalZonedDateTime(epochMilliseconds, timeZone)
  }
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
}

export function ValidateTemporalUnitRange(largestUnit: TemporalSingularUnit, smallestUnit: TemporalSingularUnit) {
  if (ALLOWED_UNITS.indexOf(largestUnit) > ALLOWED_UNITS.indexOf(smallestUnit)) {
    throw new RangeError(`largestUnit ${largestUnit} cannot be smaller than smallestUnit ${smallestUnit}`)
  }
}

export function DefaultTemporalLargestUnit(
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
): TemporalSingularUnit {
  const singular = new Map(SINGULAR_PLURAL_UNITS)
  for (const [prop, v] of [
    ['years', years],
    ['months', months],
    ['weeks', weeks],
    ['days', days],
    ['hours', hours],
    ['minutes', minutes],
    ['seconds', seconds],
    ['milliseconds', milliseconds]
  ]) {
    if (v !== 0) return singular.get(prop as any) as TemporalSingularUnit
  }
  return 'millisecond'
}

export function LargerOfTwoTemporalUnits(unit1: TemporalSingularUnit, unit2: TemporalSingularUnit) {
  if (ALLOWED_UNITS.indexOf(unit1) > ALLOWED_UNITS.indexOf(unit2)) return unit2
  return unit1
}

export function ToPartialRecord(
  bag: { [key: string]: any },
  fields: string[],
  callerCast?: (value: unknown) => unknown
): Record<string, any> | false {
  if (!IsObject(bag)) return false
  let any: Record<string, any> | undefined
  for (const property of fields) {
    const value = bag[property]
    if (value !== undefined) {
      any = any || {}
      if (callerCast === undefined && BUILTIN_CASTS.has(property)) {
        const caster = BUILTIN_CASTS.get(property)
        any[property] = caster && caster(value)
      } else if (callerCast !== undefined) {
        any[property] = callerCast(value)
      } else {
        any[property] = value
      }
    }
  }
  return any ? any : false
}

export function PrepareTemporalFields(
  bag: { [key: string]: any },
  fields: [string, (number | undefined)?][]
): { [key: string]: any } {
  if (!IsObject(bag)) throw new TypeError()
  const result: Record<string, number | string> = {}
  let any = false
  for (const fieldRecord of fields) {
    const [property, defaultValue] = fieldRecord
    let value = bag[property]
    if (value === undefined) {
      if (fieldRecord.length === 1) {
        throw new TypeError(`required property '${property}' missing or undefined`)
      }
      value = defaultValue
    } else {
      any = true
      if (BUILTIN_CASTS.has(property)) {
        const caster = BUILTIN_CASTS.get(property)
        value = caster && caster(value)
      }
    }
    result[property] = value as number | string
  }
  if (!any) {
    throw new TypeError('no supported properties found')
  }
  if ((result['era'] === undefined) !== (result['eraYear'] === undefined)) {
    throw new RangeError("properties 'era' and 'eraYear' must be provided together")
  }
  return result
}

// field access in the following operations is intentionally alphabetical
export function ToTemporalDateFields(bag: { [key: string]: any }): DateSlots {
  return PrepareTemporalFields(bag, [
    ['day', undefined],
    ['month', undefined],
    ['year', undefined]
  ]) as unknown as DateSlots
}

export function ToTemporalDateTimeFields(bag: { [key: string]: any }): {
  day: number
  hour: number
  millisecond: number
  minute: number
  month: number
  second: number
  year: number
} {
  return PrepareTemporalFields(bag, [
    ['day', undefined],
    ['hour', 0],
    ['millisecond', 0],
    ['minute', 0],
    ['month', undefined],
    ['second', 0],
    ['year', undefined]
  ]) as any
}

export function ToTemporalMonthDayFields(bag: { [key: string]: any }): {
  day: number
  month: number
  year: number
} {
  return PrepareTemporalFields(bag, [
    ['day', undefined],
    ['month', undefined],
    ['year', undefined]
  ]) as any
}

export function ToTemporalTimeRecord(bag: { [key: string]: any }): TimeSlots {
  return PrepareTemporalFields(bag, [
    ['hour', 0],
    ['millisecond', 0],
    ['minute', 0],
    ['second', 0]
  ]) as any
}

export function ToTemporalYearMonthFields(bag: { [key: string]: any }): {
  month: number
  year: number
} {
  return PrepareTemporalFields(bag, [
    ['month', undefined],
    ['year', undefined]
  ]) as any
}

export function ToTemporalZonedDateTimeFields(bag: { [key: string]: any }): {
  day: number
  hour: number
  millisecond: number
  minute: number
  month: number
  second: number
  year: number
  offset: string
  timeZone: string
} {
  return PrepareTemporalFields(bag, [
    ['day', undefined],
    ['hour', 0],
    ['millisecond', 0],
    ['minute', 0],
    ['month', undefined],
    ['second', 0],
    ['year', undefined],
    ['offset', undefined],
    ['timeZone']
  ]) as any
}

export function ToTemporalDate(item: any, options = ObjectCreate(null)): Iso.Date {
  if (IsTemporalDate(item)) return item
  if (IsTemporalZonedDateTime(item)) {
    const { epochMilliseconds, timeZone } = GetZonedDateTimeSlots(item)
    item = BuiltinTimeZoneGetPlainDateTimeFor(timeZone, epochMilliseconds)
  }
  if (IsTemporalDateTime(item)) {
    const { year, month, day } = GetDateTimeSlots(item)
    return CreateTemporalDate(year, month, day)
  }
  if (IsObject(item)) {
    const fields = ToTemporalDateFields(item)
    return DateFromFields(fields, options)
  }
  ToTemporalOverflow(options) // validate and ignore
  const { year, month, day } = ParseTemporalDateString(ToString(item))
  return CreateTemporalDate(year, month, day) // include validation
}

export function InterpretTemporalDateTimeFields(fields: DateTimeSlots, options: Options) {
  let { hour, minute, second, millisecond } = ToTemporalTimeRecord(fields) as any
  const overflow = ToTemporalOverflow(options)
  const date = DateFromFields(fields, options)
  const { year, month, day } = GetSlots(date)
  ;({ hour, minute, second, millisecond } = RegulateTime(hour, minute, second, millisecond, overflow))
  return { year, month, day, hour, minute, second, millisecond }
}

export function ToTemporalDateTime(item: any, options = ObjectCreate(null)) {
  let year, month, day, hour, minute, second, millisecond
  if (IsTemporalDateTime(item)) return item
  if (IsTemporalZonedDateTime(item)) {
    const { timeZone, epochMilliseconds } = GetZonedDateTimeSlots(item)
    return BuiltinTimeZoneGetPlainDateTimeFor(timeZone, epochMilliseconds)
  }
  if (IsTemporalDate(item)) {
    const slots = GetDateSlots(item)
    return CreateTemporalDateTime(slots.year, slots.month, slots.day, 0, 0, 0, 0)
  }
  if (IsObject(item)) {
    const fields = ToTemporalDateTimeFields(item)
    ;({ year, month, day, hour, minute, second, millisecond } = InterpretTemporalDateTimeFields(fields, options))
  } else {
    ToTemporalOverflow(options) // validate and ignore
    ;({ year, month, day, hour, minute, second, millisecond } = ParseTemporalDateTimeString(ToString(item)))
    RejectDateTime(year, month, day, hour, minute, second, millisecond)
  }
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
}

export function ToTemporalDuration(item: any): Iso.Duration {
  let years, months, weeks, days, hours, minutes, seconds, milliseconds
  if (IsTemporalDuration(item)) return item
  if (IsObject(item)) {
    ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ToTemporalDurationRecord(item))
  } else {
    ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = ParseTemporalDurationString(ToString(item)))
  }
  return CreateTemporalDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
}

export function ToTemporalInstant(item: string) {
  if (IsTemporalInstant(item)) return item
  if (IsTemporalZonedDateTime(item)) {
    const { epochMilliseconds } = GetZonedDateTimeSlots(item)
    return CreateTemporalInstant(epochMilliseconds)
  }
  const ms = ParseTemporalInstant(ToString(item))
  return CreateTemporalInstant(ms)
}

export function ToTemporalMonthDay(item: any, options = ObjectCreate(null)) {
  if (IsTemporalMonthDay(item)) return item

  if (IsObject(item)) {
    const fields = ToTemporalMonthDayFields(item) as any
    // Callers who omit the calendar are not writing calendar-independent
    // code. In that case, `monthCode`/`year` can be omitted; `month` and
    // `day` are sufficient. Add a `year` to satisfy calendar validation.
    if (fields.month !== undefined && fields.year === undefined) {
      fields.year = 1972
    }
    return MonthDayFromFields(fields, options)
  }

  ToTemporalOverflow(options) // validate and ignore
  let { month, day, referenceISOYear } = ParseTemporalMonthDayString(ToString(item))

  if (referenceISOYear === undefined) {
    RejectISODate(1972, month, day)
    return CreateTemporalMonthDay(month, day)
  }
  return CreateTemporalMonthDay(month, day, referenceISOYear)
}

export function ToTemporalTime(item: any, overflow: TemporalOverflow = 'constrain') {
  let hour, minute, second, millisecond
  if (IsTemporalTime(item)) return item
  if (IsTemporalZonedDateTime(item)) {
    const { timeZone, epochMilliseconds } = GetZonedDateTimeSlots(item)
    item = BuiltinTimeZoneGetPlainDateTimeFor(timeZone, epochMilliseconds)
  }
  if (IsTemporalDateTime(item)) {
    const slots = GetDateTimeSlots(item)
    return CreateTemporalTime(slots.hour, slots.minute, slots.second, slots.millisecond)
  }
  if (IsObject(item)) {
    ;({ hour, minute, second, millisecond } = ToTemporalTimeRecord(item) as any)
    ;({ hour, minute, second, millisecond } = RegulateTime(hour, minute, second, millisecond, overflow))
  } else {
    ;({ hour, minute, second, millisecond } = ParseTemporalTimeString(ToString(item)))
    RejectTime(hour, minute, second, millisecond)
  }
  return CreateTemporalTime(hour, minute, second, millisecond)
}

export function ToTemporalYearMonth(item: any, options = ObjectCreate(null)) {
  if (IsTemporalYearMonth(item)) return item
  if (IsObject(item)) {
    const fields = ToTemporalYearMonthFields(item)
    return YearMonthFromFields(fields, options)
  }

  ToTemporalOverflow(options) // validate and ignore
  let { year, month, referenceISODay } = ParseTemporalYearMonthString(ToString(item))

  if (referenceISODay === undefined) {
    RejectISODate(year, month, 1)
    return CreateTemporalYearMonth(year, month)
  }
  return CreateTemporalYearMonth(year, month, referenceISODay)
}

export function InterpretISODateTimeOffset(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  offsetBehaviour: string,
  offsetMs: number,
  timeZone: string,
  disambiguation: TemporalDisambiguation,
  offsetOpt: TemporalOffset
): number {
  const dt = CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)

  if (offsetBehaviour === 'wall' || offsetOpt === 'ignore') {
    // Simple case: ISO string without a TZ offset (or caller wants to ignore
    // the offset), so just convert DateTime to Instant in the given time zone
    const offsetMs = BuiltinTimeZoneGetInstantFor(timeZone, dt, disambiguation)
    return offsetMs
  }

  // The caller wants the offset to always win ('use') OR the caller is OK
  // with the offset winning ('prefer' or 'reject') as long as it's valid
  // for this timezone and date/time.
  if (offsetBehaviour === 'exact' || offsetOpt === 'use') {
    // Calculate the instant for the input's date/time and offset
    const epochMs = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond)
    if (epochMs === null) throw new RangeError('ZonedDateTime outside of supported range')
    return epochMs - offsetMs
  }

  // "prefer" or "reject"
  const possibleInstants = GetPossibleInstantsFor(timeZone, dt)
  for (const candidate of possibleInstants) {
    const candidateOffset = GetOffsetMillisecondsFor(timeZone, candidate)
    if (candidateOffset === offsetMs) return candidate
  }

  // the user-provided offset doesn't match any instants for this time
  // zone and date/time.
  if (offsetOpt === 'reject') {
    const offsetStr = FormatTimeZoneOffsetString(offsetMs)
    // The tsc emit for this line rewrites to invoke the PlainDateTime's valueOf method, NOT
    // toString (which is invoked by Node when using template literals directly).
    // See https://github.com/microsoft/TypeScript/issues/39744 for the proposed fix in tsc emit
    throw new RangeError(`Offset ${offsetStr} is invalid for ${dt.toString()} in ${timeZone}`)
  }
  // fall through: offsetOpt === 'prefer', but the offset doesn't match
  // so fall back to use the time zone instead.
  const epochMilliseconds = DisambiguatePossibleInstants(possibleInstants, timeZone, dt, disambiguation)
  return epochMilliseconds
}

export function ToTemporalZonedDateTime(item: any, options = ObjectCreate(null)) {
  let year, month, day, hour, minute, second, millisecond, timeZone, offset
  let offsetBehaviour = 'option'
  if (IsTemporalZonedDateTime(item)) return item
  if (IsObject(item)) {
    const fields = ToTemporalZonedDateTimeFields(item) as any
    ;({ year, month, day, hour, minute, second, millisecond } = InterpretTemporalDateTimeFields(fields, options))
    timeZone = ToTemporalTimeZone(fields.timeZone)
    offset = fields.offset
    if (offset === undefined) {
      offsetBehaviour = 'wall'
    } else {
      offset = ToString(offset)
    }
  } else {
    ToTemporalOverflow(options) // validate and ignore
    let ianaName, z
    ;({ year, month, day, hour, minute, second, millisecond, ianaName, offset, z } = ParseTemporalZonedDateTimeString(
      ToString(item)
    ))
    if (!ianaName) throw new RangeError('time zone ID required in brackets')
    if (z) {
      offsetBehaviour = 'exact'
    } else if (!offset) {
      offsetBehaviour = 'wall'
    }
    timeZone = ianaName
  }
  let offsetMs = 0
  if (offsetBehaviour === 'option') offsetMs = ParseOffsetString(offset) as number
  const disambiguation = ToTemporalDisambiguation(options)
  const offsetOpt = ToTemporalOffset(options, 'reject')
  const epochMilliseconds = InterpretISODateTimeOffset(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    offsetBehaviour,
    offsetMs,
    timeZone,
    disambiguation,
    offsetOpt
  )
  return CreateTemporalZonedDateTime(epochMilliseconds, timeZone)
}

export function CreateTemporalInstant(epochMilliseconds: number): Iso.Instant {
  ValidateEpochMilliseconds(epochMilliseconds)
  return new Date(epochMilliseconds).toISOString() as Iso.Instant
}

const BigMath = {
  abs(x: bigint) {
    return x < BigInt(0) ? -x : x
  }
}

export function CreateTemporalDuration(
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
): Iso.Duration {
  years = ToIntegerThrowOnInfinity(years)
  months = ToIntegerThrowOnInfinity(months)
  weeks = ToIntegerThrowOnInfinity(weeks)
  days = ToIntegerThrowOnInfinity(days)
  hours = ToIntegerThrowOnInfinity(hours)
  minutes = ToIntegerThrowOnInfinity(minutes)
  seconds = ToIntegerThrowOnInfinity(seconds)
  milliseconds = ToIntegerThrowOnInfinity(milliseconds)

  const sign = DurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  for (const prop of [years, months, weeks, days, hours, minutes, seconds, milliseconds]) {
    if (!Number.isFinite(prop)) throw new RangeError('infinite values not allowed as duration fields')
    const propSign = Math.sign(prop)
    if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields')
  }

  function formatNumber(num: number | bigint) {
    if (num <= NumberMaxSafeInteger) return num.toString(10)
    return BigInt(num).toString()
  }

  const dateParts = []
  if (years) dateParts.push(`${formatNumber(MathAbs(years))}Y`)
  if (months) dateParts.push(`${formatNumber(MathAbs(months))}M`)
  if (weeks) dateParts.push(`${formatNumber(MathAbs(weeks))}W`)
  if (days) dateParts.push(`${formatNumber(MathAbs(days))}D`)

  const timeParts = []
  if (hours) timeParts.push(`${formatNumber(MathAbs(hours))}H`)
  if (minutes) timeParts.push(`${formatNumber(MathAbs(minutes))}M`)

  const secondParts = []
  let total = TotalDurationMillisecondsBigInt(0, 0, 0, seconds, milliseconds, 0)
  const bigSeconds = total / BigInt(1000)
  milliseconds = Number(total % BigInt(1000))
  const fraction = MathAbs(milliseconds)
  let decimalPart = `${fraction}`.padStart(3, '0')
  while (decimalPart[decimalPart.length - 1] === '0') {
    decimalPart = decimalPart.slice(0, -1)
  }
  if (decimalPart) secondParts.unshift('.', decimalPart)
  if (bigSeconds !== BigInt(0) || secondParts.length) secondParts.unshift(formatNumber(BigMath.abs(bigSeconds)))
  if (secondParts.length) timeParts.push(`${secondParts.join('')}S`)
  if (timeParts.length) timeParts.unshift('T')
  if (!dateParts.length && !timeParts.length) return 'PT0S'
  return `${sign < 0 ? '-' : ''}P${dateParts.join('')}${timeParts.join('')}` as Iso.Duration
}

export function CreateTemporalDate(year: number, month: number, day: number) {
  RejectISODate(year, month, day)
  RejectDateRange(year, month, day)
  return `${ISOYearString(year)}-${ISODateTimePartString(month)}-${ISODateTimePartString(day)}` as Iso.Date
}

export function CreateTemporalTime(
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  options?: { precision?: TimePrecision }
): Iso.Time {
  RejectTime(hour, minute, second, millisecond)
  const seconds = FormatSecondsStringPart(second, millisecond, options)
  return `${ISODateTimePartString(hour)}:${ISODateTimePartString(minute)}${seconds}` as Iso.Time
}

export function CreateTemporalDateTime(
  year: number,
  month: number,
  day: number,
  h: number,
  min: number,
  s: number,
  ms: number,
  options?: { precision?: TimePrecision }
): Iso.DateTime {
  RejectDateTime(year, month, day, h, min, s, ms)
  RejectDateTimeRange(year, month, day, h, min, s, ms)

  const seconds = FormatSecondsStringPart(s, ms, options)
  return `${ISOYearString(year)}-${ISODateTimePartString(month)}-${ISODateTimePartString(day)}T${ISODateTimePartString(
    h
  )}:${ISODateTimePartString(min)}${seconds}` as Iso.DateTime
}

export function CreateTemporalMonthDay(month: number, day: number, referenceISOYear = 1972): Iso.MonthDay {
  RejectISODate(referenceISOYear, month, day)
  RejectDateRange(referenceISOYear, month, day)

  return `--${ISODateTimePartString(month)}-${ISODateTimePartString(day)}` as Iso.MonthDay
}

export function CreateTemporalYearMonth(year: number, month: number, referenceISODay = 1): Iso.YearMonth {
  RejectISODate(year, month, referenceISODay)
  RejectYearMonthRange(year, month)
  return `${year}-${ISODateTimePartString(month)}` as Iso.YearMonth
}

export function CreateTemporalZonedDateTime(
  epochMilliseconds: number,
  timeZone: string,
  options?: { precision?: TimePrecision }
): Iso.ZonedDateTime {
  ValidateEpochMilliseconds(epochMilliseconds)
  if (!IsTemporalTimeZone(timeZone)) throw new TypeError(`${timeZone} is not a valid timeZone`)
  const dateTime = BuiltinTimeZoneGetPlainDateTimeFor(timeZone, epochMilliseconds)
  const slots = GetDateTimeSlots(dateTime)

  const year = ISOYearString(slots.year)
  const month = ISODateTimePartString(slots.month)
  const day = ISODateTimePartString(slots.day)
  const hour = ISODateTimePartString(slots.hour)
  const minute = ISODateTimePartString(slots.minute)
  const seconds = FormatSecondsStringPart(slots.second, slots.millisecond, options)
  let result = `${year}-${month}-${day}T${hour}:${minute}${seconds}`
  result += BuiltinTimeZoneGetOffsetStringFor(timeZone, epochMilliseconds)
  result += `[${timeZone}]`
  return result as Iso.ZonedDateTime
}

export function CalendarMergeFields(
  fields: { [key: string]: any },
  additionalFields: { [key: string]: any }
): { [key: string]: any } {
  const merged: { [key: string]: any } = {}
  for (const nextKey of ObjectKeys(fields)) {
    merged[nextKey] = fields[nextKey]
  }
  const newKeys = ObjectKeys(additionalFields)
  for (const nextKey of newKeys) {
    merged[nextKey] = additionalFields[nextKey]
  }
  return merged
}

export function CalendarDateAdd(
  date: CalendarDate | undefined,
  duration: Iso.Duration | Partial<DurationSlots>,
  options: Options | undefined
): Iso.Date {
  options = GetOptionsObject(options)
  const overflow = ToTemporalOverflow(options)
  const durationSlots = GetDurationSlots(ToTemporalDuration(duration))
  const dateSlots = GetDateSlots(ToTemporalDate(date))
  const { days } = BalanceDuration(
    durationSlots.days,
    durationSlots.hours,
    durationSlots.minutes,
    durationSlots.seconds,
    durationSlots.milliseconds,
    'day'
  )
  const { year, month, day } = AddISODate(
    dateSlots.year,
    dateSlots.month,
    dateSlots.day,
    durationSlots.years,
    durationSlots.months,
    durationSlots.weeks,
    days,
    overflow
  )
  const result = CreateTemporalDate(year, month, day)
  return result
}

export function CalendarDateUntil(date: CalendarDate | undefined, otherDate: CalendarDate, options: Options): Iso.Duration {
  const one = ToTemporalDate(date)
  const two = ToTemporalDate(otherDate)
  options = GetOptionsObject(options)
  const largestUnit = ToLargestTemporalUnit(options, 'auto', ['hour', 'minute', 'second', 'millisecond'], 'day')
  const oneSlots = GetDateSlots(one)
  const twoSlots = GetDateSlots(two)

  const { years, months, weeks, days } = DifferenceISODate(
    oneSlots.year,
    oneSlots.month,
    oneSlots.day,
    twoSlots.year,
    twoSlots.month,
    twoSlots.day,
    largestUnit as any
  )
  return CreateTemporalDuration(years, months, weeks, days, 0, 0, 0, 0)
}

export function CalendarYear(dateLike: CalendarDate) {
  if (!IsTemporalYearMonth(dateLike)) dateLike = ToTemporalDate(dateLike)
  const result = GetSlots(dateLike as Iso.Date).year
  if (result === undefined) {
    throw new RangeError('calendar year result must be an integer')
  }
  return ToIntegerThrowOnInfinity(result)
}

export function CalendarMonth(dateLike: CalendarDate) {
  if (!IsTemporalYearMonth(dateLike)) dateLike = ToTemporalDate(dateLike)
  const result = GetSlots(dateLike as Iso.Date).month
  if (result === undefined) {
    throw new RangeError('calendar month result must be a positive integer')
  }
  return ToPositiveInteger(result)
}

export function CalendarDay(dateLike: CalendarDate) {
  if (!IsTemporalMonthDay(dateLike)) dateLike = ToTemporalDate(dateLike)
  const slots = GetSlots(dateLike as Iso.Date)
  const result = slots.day
  if (result === undefined) {
    throw new RangeError('calendar day result must be a positive integer')
  }
  return ToPositiveInteger(result)
}

export function CalendarDayOfWeek(dateLike: CalendarDate) {
  const date = ToTemporalDate(dateLike)
  const slots = GetDateSlots(date)
  return DayOfWeek(slots.year, slots.month, slots.day)
}

export function CalendarDayOfYear(dateLike: CalendarDate) {
  const date = ToTemporalDate(dateLike)
  const slots = GetDateSlots(date)
  return DayOfYear(slots.year, slots.month, slots.day)
}

export function CalendarWeekOfYear(dateLike: CalendarDate) {
  const date = ToTemporalDate(dateLike)
  const slots = GetDateSlots(date)
  return WeekOfYear(slots.year, slots.month, slots.day)
}

export function CalendarDaysInWeek(dateLike: CalendarDate) {
  return 7
}

export function CalendarDaysInMonth(dateLike: CalendarDate) {
  if (!IsTemporalYearMonth(dateLike)) dateLike = ToTemporalDate(dateLike)
  const slots = GetSlots(dateLike as Iso.Date)
  return ISODaysInMonth(slots.year, slots.month)
}

export function CalendarDaysInYear(dateLike: CalendarDate) {
  if (!IsTemporalYearMonth(dateLike)) dateLike = ToTemporalDate(dateLike)
  const slots = GetSlots(dateLike as Iso.Date)
  return LeapYear(slots.year) ? 366 : 365
}

export function CalendarMonthsInYear() {
  return 12
}

export function CalendarInLeapYear(dateLike: CalendarDate) {
  if (!IsTemporalYearMonth(dateLike)) dateLike = ToTemporalDate(dateLike)
  const slots = GetSlots(dateLike as Iso.Date)
  return LeapYear(slots.year)
}

export function DateFromFields(fields: DateSlots, options?: any) {
  if (typeof fields !== 'object') throw new TypeError('invalid fields')
  options = GetOptionsObject(options)
  const overflow = ToTemporalOverflow(options)
  const preparedFields = PrepareTemporalFields(fields, [['day'], ['month'], ['year']]) as DateSlots
  let { year, month, day } = preparedFields
  ;({ year, month, day } = RegulateISODate(year, month, day, overflow))
  return CreateTemporalDate(year, month, day)
}

export function YearMonthFromFields(fields: YearMonthSlots, options?: any) {
  if (typeof fields !== 'object') throw new TypeError('invalid fields')
  options = GetOptionsObject(options)
  const overflow = ToTemporalOverflow(options)
  fields = PrepareTemporalFields(fields, [['month'], ['year']]) as YearMonthSlots
  let { year, month } = fields
  ;({ year, month } = RegulateISOYearMonth(year, month, overflow))
  return CreateTemporalYearMonth(year, month, /* referenceISODay = */ 1)
}

export function MonthDayFromFields(fields: MonthDaySlots, options?: any) {
  if (typeof fields !== 'object') throw new TypeError('invalid fields')
  options = GetOptionsObject(options)
  const overflow = ToTemporalOverflow(options)
  fields = PrepareTemporalFields(fields, [['day'], ['month']]) as MonthDaySlots
  const referenceISOYear = 1972
  let { month, day } = fields
  ;({ month, day } = RegulateISODate(referenceISOYear, month, day, overflow))
  return CreateTemporalMonthDay(month, day, referenceISOYear)
}

export function ToTemporalTimeZone(temporalTimeZoneLike: string): string {
  if (IsTemporalZonedDateTime(temporalTimeZoneLike)) return GetZonedDateTimeSlots(temporalTimeZoneLike).timeZone
  const identifier = ToString(temporalTimeZoneLike)
  const timeZone = TemporalTimeZoneFromString(identifier)
  return timeZone
}

export function TimeZoneEquals(one: string, two: string): boolean {
  if (one === two) return true
  const tz1 = ToString(one)
  const tz2 = ToString(two)
  return tz1 === tz2
}

export function TemporalDateTimeToDate(dateTime: Iso.DateTime): Iso.Date {
  const slots = GetDateTimeSlots(dateTime)
  return CreateTemporalDate(slots.year, slots.month, slots.day)
}

export function TemporalDateTimeToTime(dateTime: Iso.DateTime): Iso.Time {
  const slots = GetDateTimeSlots(dateTime)
  return CreateTemporalTime(slots.hour, slots.minute, slots.second, slots.millisecond)
}

export function GetOffsetMillisecondsFor(timeZone: string, epochMilliseconds: number): number {
  if (!IsTemporalTimeZone(timeZone)) throw new TypeError('invalid receiver')
  ValidateEpochMilliseconds(epochMilliseconds)
  let offsetMs = ParseOffsetString(timeZone)
  if (offsetMs !== null) return offsetMs
  offsetMs = GetIANATimeZoneOffsetMilliseconds(epochMilliseconds, timeZone)
  if (typeof offsetMs !== 'number') {
    throw new TypeError('bad return from GetOffsetMillisecondsFor')
  }
  if (!IsInteger(offsetMs) || MathAbs(offsetMs) > 86400e3) {
    throw new RangeError('out-of-range return from GetOffsetMillisecondsFor')
  }
  return offsetMs
}

export function BuiltinTimeZoneGetOffsetStringFor(timeZone: string, epochMilliseconds: number): string {
  const offsetMs = GetOffsetMillisecondsFor(timeZone, epochMilliseconds)
  return FormatTimeZoneOffsetString(offsetMs)
}

export function BuiltinTimeZoneGetPlainDateTimeFor(timeZone: string, epochMilliseconds: number): Iso.DateTime {
  const offsetMs = GetOffsetMillisecondsFor(timeZone, epochMilliseconds)
  let { year, month, day, hour, minute, second, millisecond } = GetISOPartsFromEpoch(epochMilliseconds)
  ;({ year, month, day, hour, minute, second, millisecond } = BalanceISODateTime(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond + offsetMs
  ))
  return CreateTemporalDateTime(year, month, day, hour, minute, second, millisecond)
}

export function BuiltinTimeZoneGetInstantFor(
  timeZone: string,
  dateTime: Iso.DateTime,
  disambiguation: TemporalDisambiguation
): number {
  const possibleInstants = GetPossibleInstantsFor(timeZone, dateTime)
  return DisambiguatePossibleInstants(possibleInstants, timeZone, dateTime, disambiguation)
}

function DisambiguatePossibleInstants(
  possibleInstants: number[],
  timeZone: string,
  dateTime: Iso.DateTime,
  disambiguation: TemporalDisambiguation
) {
  const numInstants = possibleInstants.length

  if (numInstants === 1) return possibleInstants[0]
  if (numInstants) {
    switch (disambiguation) {
      case 'compatible':
      // fall through because 'compatible' means 'earlier' for "fall back" transitions
      case 'earlier':
        return possibleInstants[0]
      case 'later':
        return possibleInstants[numInstants - 1]
      case 'reject': {
        throw new RangeError('multiple instants found')
      }
    }
  }

  const slots = GetSlots(dateTime)

  const utcms = GetEpochFromISOParts(
    slots.year,
    slots.month,
    slots.day,
    slots.hour,
    slots.minute,
    slots.second,
    slots.millisecond
  )
  if (utcms === null) throw new RangeError('DateTime outside of supported range')
  const dayBefore = utcms - 86400e3
  const dayAfter = utcms + 86400e3
  const offsetBefore = GetOffsetMillisecondsFor(timeZone, dayBefore)
  const offsetAfter = GetOffsetMillisecondsFor(timeZone, dayAfter)
  const milliseconds = offsetAfter - offsetBefore
  switch (disambiguation) {
    case 'earlier': {
      const earlier = AddDateTime(
        slots.year,
        slots.month,
        slots.day,
        slots.hour,
        slots.minute,
        slots.second,
        slots.millisecond,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -milliseconds,
        undefined
      )
      const earlierPlainDateTime = CreateTemporalDateTime(
        earlier.year,
        earlier.month,
        earlier.day,
        earlier.hour,
        earlier.minute,
        earlier.second,
        earlier.millisecond
      )
      return GetPossibleInstantsFor(timeZone, earlierPlainDateTime)[0]
    }
    case 'compatible':
    // fall through because 'compatible' means 'later' for "spring forward" transitions
    case 'later': {
      const later = AddDateTime(
        slots.year,
        slots.month,
        slots.day,
        slots.hour,
        slots.minute,
        slots.second,
        slots.millisecond,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        milliseconds,
        undefined
      )
      const laterPlainDateTime = CreateTemporalDateTime(
        later.year,
        later.month,
        later.day,
        later.hour,
        later.minute,
        later.second,
        later.millisecond
      )
      const possible = GetPossibleInstantsFor(timeZone, laterPlainDateTime)
      return possible[possible.length - 1]
    }
    case 'reject': {
      throw new RangeError('no such instant found')
    }
  }
}

export function ISOYearString(year: number): string {
  let yearString
  if (year < 1000 || year > 9999) {
    const sign = year < 0 ? '-' : '+'
    const yearNumber = MathAbs(year)
    yearString = sign + `000000${yearNumber}`.slice(-6)
  } else {
    yearString = `${year}`
  }
  return yearString
}

export function ISODateTimePartString(part: number): string {
  return `00${part}`.slice(-2)
}

function GetTimePrecision(time: Iso.Time): TimePrecision {
  if (time.length === 5) return 'minute'
  else if (time.length === 8) return 'second'
  else if (time.length === 10) return 'ms100'
  else if (time.length === 11) return 'ms10'
  else if (time.length === 12) return 'ms1'
  else return 'auto'
}

export function FormatSecondsStringPart(second: number, millisecond: number, options?: { precision?: TimePrecision }) {
  function maxPrecision(precision1: TimePrecision, precision2: TimePrecision) {
    const precisions: TimePrecision[] = ['auto', 'minute', 'second', 'ms100', 'ms10', 'ms1']
    return precisions.indexOf(precision1) > precisions.indexOf(precision2) ? precision1 : precision2
  }
  function inferPrecision() {
    if (millisecond % 10 !== 0) return 'ms1'
    else if (millisecond % 100 !== 0) return 'ms10'
    else if (millisecond !== 0) return 'ms100'
    else if (second !== 0) return 'second'
    else return 'minute'
  }
  const precision = maxPrecision(options?.precision || 'auto', inferPrecision())
  const secs = `:${ISODateTimePartString(second)}`
  if (precision === 'minute') {
    return ''
  } else if (precision === 'second') {
    return secs
  } else {
    const fractionLength = precision === 'ms1' ? 3 : precision === 'ms10' ? 2 : precision === 'ms100' ? 1 : 0
    const fraction = `${millisecond}`.padStart(3, '0').slice(0, fractionLength)
    return `${secs}.${fraction}`
  }
}

export function ParseOffsetString(string: string): number | null {
  const match = OFFSET.exec(String(string))
  if (!match) return null
  const sign = match[1] === '-' || match[1] === '\u2212' ? -1 : +1
  const hours = +match[2]
  const minutes = +(match[3] || 0)
  const seconds = +(match[4] || 0)
  const milliseconds = +((match[5] || 0) + '000').slice(0, 3)
  return sign * (((hours * 60 + minutes) * 60 + seconds) * 1e3 + milliseconds)
}

export function GetCanonicalTimeZoneIdentifier(timeZoneIdentifier: any): string {
  const offsetMs = ParseOffsetString(timeZoneIdentifier)
  if (offsetMs !== null) return FormatTimeZoneOffsetString(offsetMs)
  const formatter = getIntlDateTimeFormatEnUsForTimeZone(String(timeZoneIdentifier))
  return formatter.resolvedOptions().timeZone
}

export function GetIANATimeZoneOffsetMilliseconds(epochMilliseconds: number, timeZone: string): number {
  const { year, month, day, hour, minute, second, millisecond } = GetIANATimeZoneDateTimeParts(epochMilliseconds, timeZone)
  const utc = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond)
  if (utc === null) throw new RangeError('Date outside of supported range')
  return +utc - epochMilliseconds
}

function FormatTimeZoneOffsetString(offsetMilliseconds: number): string {
  const sign = offsetMilliseconds < 0 ? '-' : '+'
  offsetMilliseconds = MathAbs(offsetMilliseconds)
  const milliseconds = offsetMilliseconds % 1000
  const seconds = MathFloor(offsetMilliseconds / 1e3) % 60
  const minutes = MathFloor(offsetMilliseconds / 60e3) % 60
  const hours = MathFloor(offsetMilliseconds / 3600e3)

  const hourString = ISODateTimePartString(hours)
  const minuteString = ISODateTimePartString(minutes)
  const secondString = ISODateTimePartString(seconds)
  let post = ''
  if (milliseconds) {
    let fraction = `${milliseconds}`.padStart(3, '0')
    while (fraction[fraction.length - 1] === '0') fraction = fraction.slice(0, -1)
    post = `:${secondString}.${fraction}`
  } else if (seconds) {
    post = `:${secondString}`
  }
  return `${sign}${hourString}:${minuteString}${post}`
}

export function GetEpochFromISOParts(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number
): number | null {
  // Note: Date.UTC() interprets one and two-digit years as being in the
  // 20th century, so don't use it
  const legacyDate = new Date()
  legacyDate.setUTCHours(hour, minute, second, millisecond)
  legacyDate.setUTCFullYear(year, month - 1, day)
  const ms = legacyDate.getTime()
  if (NumberIsNaN(ms)) return null
  if (ms < MS_MIN || ms > MS_MAX) return null
  return ms
}

function GetISOPartsFromEpoch(epochMilliseconds: number) {
  const item = new Date(epochMilliseconds)
  const year = item.getUTCFullYear()
  const month = item.getUTCMonth() + 1
  const day = item.getUTCDate()
  const hour = item.getUTCHours()
  const minute = item.getUTCMinutes()
  const second = item.getUTCSeconds()
  const millisecond = item.getUTCMilliseconds()

  return { epochMilliseconds, year, month, day, hour, minute, second, millisecond }
}

// ts-prune-ignore-next TODO: remove this after tests are converted to TS
export function GetIANATimeZoneDateTimeParts(epochMilliseconds: number, timeZone: string): DateTimeSlots {
  const { millisecond } = GetISOPartsFromEpoch(epochMilliseconds)
  const { year, month, day, hour, minute, second } = GetFormatterParts(timeZone, epochMilliseconds)
  return BalanceISODateTime(year, month, day, hour, minute, second, millisecond)
}

export function GetIANATimeZoneNextTransition(epochMilliseconds: number, timeZone: string) {
  const uppercap = SystemUTCEpochMilliSeconds() + DAY_MILLIS * 366
  let leftMillis = epochMilliseconds
  const leftOffsetMs = GetIANATimeZoneOffsetMilliseconds(leftMillis, timeZone)
  let rightMillis = leftMillis
  let rightOffsetMs = leftOffsetMs
  while (leftOffsetMs === rightOffsetMs && leftMillis < uppercap) {
    leftMillis = leftMillis + DAY_MILLIS * 2 * 7
    rightOffsetMs = GetIANATimeZoneOffsetMilliseconds(rightMillis, timeZone)
    if (leftOffsetMs === rightOffsetMs) {
      leftMillis = rightMillis
    }
  }
  if (leftOffsetMs === rightOffsetMs) return null
  const result = bisect(
    (epochMs: number) => GetIANATimeZoneOffsetMilliseconds(epochMs, timeZone),
    leftMillis,
    rightMillis,
    leftOffsetMs,
    rightOffsetMs
  )
  return result
}

export function GetIANATimeZonePreviousTransition(epochMilliseconds: number, timeZone: string): number | null {
  const lowercap = BEFORE_FIRST_DST // 1847-01-01T00:00:00Z
  let rightMillis = epochMilliseconds - 1
  const rightOffsetMs = GetIANATimeZoneOffsetMilliseconds(rightMillis, timeZone)
  let leftMillis = rightMillis
  let leftOffsetMs = rightOffsetMs
  while (rightOffsetMs === leftOffsetMs && rightMillis > lowercap) {
    leftMillis = rightMillis - DAY_MILLIS * 2 * 7
    leftOffsetMs = GetIANATimeZoneOffsetMilliseconds(leftMillis, timeZone)
    if (rightOffsetMs === leftOffsetMs) {
      rightMillis = leftMillis
    }
  }
  if (rightOffsetMs === leftOffsetMs) return null
  const result = bisect(
    (epochMs: number) => GetIANATimeZoneOffsetMilliseconds(epochMs, timeZone),
    leftMillis,
    rightMillis,
    leftOffsetMs,
    rightOffsetMs
  )
  return result
}

// ts-prune-ignore-next TODO: remove this after tests are converted to TS
export function GetFormatterParts(timeZone: string, epochMilliseconds: number) {
  const formatter = getIntlDateTimeFormatEnUsForTimeZone(timeZone)
  const datetime = formatter.format(new Date(epochMilliseconds))
  const [month, day, year, era, hour, minute, second] = datetime.split(/[^\w]+/)
  return {
    year: era.toUpperCase().startsWith('B') ? -year + 1 : +year,
    month: +month,
    day: +day,
    hour: hour === '24' ? 0 : +hour, // bugs.chromium.org/p/chromium/issues/detail?id=1045791
    minute: +minute,
    second: +second
  }
}

export function GetIANATimeZoneEpochValue(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number
): number[] {
  const ms = GetEpochFromISOParts(year, month, day, hour, minute, second, millisecond)
  if (ms === null) throw new RangeError('DateTime outside of supported range')
  let msEarlier = ms - DAY_MILLIS
  if (msEarlier < MS_MIN) msEarlier = ms
  let msLater = ms + DAY_MILLIS
  if (msLater > MS_MAX) msLater = ms
  const earliest = GetIANATimeZoneOffsetMilliseconds(msEarlier, timeZone)
  const latest = GetIANATimeZoneOffsetMilliseconds(msLater, timeZone)
  const found = earliest === latest ? [earliest] : [earliest, latest]
  return found
    .map((offsetMilliseconds) => {
      const epochMilliseconds = ms - offsetMilliseconds
      const parts = GetIANATimeZoneDateTimeParts(epochMilliseconds, timeZone)
      if (
        year !== parts.year ||
        month !== parts.month ||
        day !== parts.day ||
        hour !== parts.hour ||
        minute !== parts.minute ||
        second !== parts.second ||
        millisecond !== parts.millisecond
      ) {
        return undefined
      }
      return epochMilliseconds
    })
    .filter((x) => x !== undefined) as number[]
}

export function LeapYear(year: number): boolean {
  if (undefined === year) return false
  const isDiv4 = year % 4 === 0
  const isDiv100 = year % 100 === 0
  const isDiv400 = year % 400 === 0
  return isDiv4 && (!isDiv100 || isDiv400)
}

export function ISODaysInMonth(year: number, month: number): number {
  const DoM = {
    standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  }
  return DoM[LeapYear(year) ? 'leapyear' : 'standard'][month - 1]
}

export function DayOfWeek(year: number, month: number, day: number): number {
  const m = month + (month < 3 ? 10 : -2)
  const Y = year - (month < 3 ? 1 : 0)

  const c = MathFloor(Y / 100)
  const y = Y - c * 100
  const d = day

  const pD = d
  const pM = MathFloor(2.6 * m - 0.2)
  const pY = y + MathFloor(y / 4)
  const pC = MathFloor(c / 4) - 2 * c

  const dow = (pD + pM + pY + pC) % 7

  return dow + (dow <= 0 ? 7 : 0)
}

export function DayOfYear(year: number, month: number, day: number): number {
  let days = day
  for (let m = month - 1; m > 0; m--) {
    days += ISODaysInMonth(year, m)
  }
  return days
}

export function WeekOfYear(year: number, month: number, day: number): number {
  const doy = DayOfYear(year, month, day)
  const dow = DayOfWeek(year, month, day) || 7
  const doj = DayOfWeek(year, 1, 1)

  const week = MathFloor((doy - dow + 10) / 7)

  if (week < 1) {
    if (doj === 5 || (doj === 6 && LeapYear(year - 1))) {
      return 53
    } else {
      return 52
    }
  }
  if (week === 53) {
    if ((LeapYear(year) ? 366 : 365) - doy < 4 - dow) {
      return 1
    }
  }

  return week
}

export function DurationSign(
  y: number,
  mon: number,
  w: number,
  d: number,
  h: number,
  min: number,
  s: number,
  ms: number
): number {
  for (const prop of [y, mon, w, d, h, min, s, ms]) {
    if (prop !== 0) return prop < 0 ? -1 : 1
  }
  return 0
}

function BalanceISOYearMonth(year: number, month: number): YearMonthSlots {
  if (!NumberIsFinite(year) || !NumberIsFinite(month)) throw new RangeError('infinity is out of range')
  month -= 1
  year += MathFloor(month / 12)
  month %= 12
  if (month < 0) month += 12
  month += 1
  return { year, month }
}

function BalanceISODate(year: number, month: number, day: number): DateSlots {
  if (!NumberIsFinite(day)) throw new RangeError('infinity is out of range')
  ;({ year, month } = BalanceISOYearMonth(year, month))
  let daysInYear = 0
  let testYear = month > 2 ? year : year - 1
  while (((daysInYear = LeapYear(testYear) ? 366 : 365), day < -daysInYear)) {
    year -= 1
    testYear -= 1
    day += daysInYear
  }
  testYear += 1
  while (((daysInYear = LeapYear(testYear) ? 366 : 365), day > daysInYear)) {
    year += 1
    testYear += 1
    day -= daysInYear
  }

  while (day < 1) {
    ;({ year, month } = BalanceISOYearMonth(year, month - 1))
    day += ISODaysInMonth(year, month)
  }
  while (day > ISODaysInMonth(year, month)) {
    day -= ISODaysInMonth(year, month)
    ;({ year, month } = BalanceISOYearMonth(year, month + 1))
  }

  return { year, month, day }
}

function BalanceISODateTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number
): DateTimeSlots {
  let deltaDays
  ;({ deltaDays, hour, minute, second, millisecond } = BalanceTime(hour, minute, second, millisecond))
  ;({ year, month, day } = BalanceISODate(year, month, day + deltaDays))
  return { year, month, day, hour, minute, second, millisecond }
}

function BalanceTime(hour: number, minute: number, second: number, millisecond: number) {
  if (!NumberIsFinite(hour) || !NumberIsFinite(minute) || !NumberIsFinite(second) || !NumberIsFinite(millisecond)) {
    throw new RangeError('infinity is out of range')
  }

  second += MathFloor(millisecond / 1000)
  millisecond = NonNegativeModulo(millisecond, 1000)

  minute += MathFloor(second / 60)
  second = NonNegativeModulo(second, 60)

  hour += MathFloor(minute / 60)
  minute = NonNegativeModulo(minute, 60)

  const deltaDays = MathFloor(hour / 24)
  hour = NonNegativeModulo(hour, 24)

  return { deltaDays, hour, minute, second, millisecond }
}

export function TotalDurationMilliseconds(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  offsetShift: number
): number {
  if (days !== 0) milliseconds = milliseconds - offsetShift
  hours = hours + days * 24
  minutes = minutes + hours * 60
  seconds = seconds + minutes * 60
  milliseconds = milliseconds + seconds * 1000
  return milliseconds
}

function TotalDurationMillisecondsBigInt(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  offsetShift: number
): bigint {
  if (days !== 0) milliseconds = milliseconds - offsetShift
  const bigHours = BigInt(hours) + BigInt(days) * BigInt(24)
  const bigMinutes = BigInt(minutes) + BigInt(bigHours) * BigInt(60)
  const bigSeconds = BigInt(seconds) + BigInt(bigMinutes) * BigInt(60)
  return BigInt(milliseconds) + BigInt(bigSeconds) * BigInt(1000)
}

function MillisecondsToDays(milliseconds: number, relativeTo: CalendarDate | undefined) {
  const sign = MathSign(milliseconds)
  let dayLengthMs = 86400e3
  if (sign === 0) return { days: 0, milliseconds: 0, dayLengthMs }
  if (!IsTemporalZonedDateTime(relativeTo)) {
    const days = divmod(milliseconds, dayLengthMs).quotient
    milliseconds = milliseconds % dayLengthMs
    return { days, milliseconds, dayLengthMs }
  } else {
    const slots = GetSlots(relativeTo)
    const startMs = slots.epochMilliseconds
    const endMs = startMs + milliseconds
    const timeZone = slots.timeZone

    // Find the difference in days only.
    const dtStart = GetDateTimeSlots(BuiltinTimeZoneGetPlainDateTimeFor(timeZone, startMs))
    const dtEnd = GetDateTimeSlots(BuiltinTimeZoneGetPlainDateTimeFor(timeZone, endMs))
    let { days } = DifferenceISODateTime(
      dtStart.year,
      dtStart.month,
      dtStart.day,
      dtStart.hour,
      dtStart.minute,
      dtStart.second,
      dtStart.millisecond,
      dtEnd.year,
      dtEnd.month,
      dtEnd.day,
      dtEnd.hour,
      dtEnd.minute,
      dtEnd.second,
      dtEnd.millisecond,
      'day'
    )
    let intermediateMs = AddZonedDateTime(startMs, timeZone, 0, 0, 0, days, 0, 0, 0, 0)
    // may disambiguate

    // If clock time after addition was in the middle of a skipped period, the
    // endpoint was disambiguated to a later clock time. So it's possible that
    // the resulting disambiguated result is later than endNs. If so, then back
    // up one day and try again. Repeat if necessary (some transitions are
    // > 24 hours) until either there's zero days left or the date duration is
    // back inside the period where it belongs. Note that this case only can
    // happen for positive durations because the only direction that
    // `disambiguation: 'compatible'` can change clock time is forwards.
    if (sign === 1) {
      while (days > 0 && intermediateMs > endMs) {
        --days
        intermediateMs = AddZonedDateTime(startMs, timeZone, 0, 0, 0, days, 0, 0, 0, 0)
        // may do disambiguation
      }
    }
    milliseconds = endMs - intermediateMs

    let isOverflow = false
    let relativeInstant = CreateTemporalInstant(intermediateMs)
    do {
      // calculate length of the next day (day that contains the time remainder)
      const oneDayFartherMs = AddZonedDateTime(intermediateMs, timeZone, 0, 0, 0, sign, 0, 0, 0, 0)
      const relativeMs = intermediateMs
      dayLengthMs = oneDayFartherMs - relativeMs
      isOverflow = (milliseconds - dayLengthMs) * sign >= 0
      if (isOverflow) {
        milliseconds = milliseconds - dayLengthMs
        relativeInstant = CreateTemporalInstant(oneDayFartherMs)
        days += sign
      }
    } while (isOverflow)
    return { days, milliseconds, dayLengthMs: MathAbs(dayLengthMs) }
  }
}

export function BalanceDuration(
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  largestUnit: TemporalSingularUnit,
  relativeTo: CalendarDate | undefined = undefined
) {
  if (IsTemporalZonedDateTime(relativeTo)) {
    const slots = GetZonedDateTimeSlots(relativeTo)
    const endMs = AddZonedDateTime(
      slots.epochMilliseconds,
      slots.timeZone,
      0,
      0,
      0,
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    )
    const startMs = slots.epochMilliseconds
    milliseconds = endMs - startMs
  } else {
    milliseconds = TotalDurationMilliseconds(days, hours, minutes, seconds, milliseconds, 0)
  }
  if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week' || largestUnit === 'day') {
    ;({ days, milliseconds } = MillisecondsToDays(milliseconds, relativeTo))
  } else {
    days = 0
  }

  const sign = milliseconds < 0 ? -1 : 1
  milliseconds = MathAbs(milliseconds)

  switch (largestUnit) {
    case 'year':
    case 'month':
    case 'week':
    case 'day':
    case 'hour':
      ;({ quotient: seconds, remainder: milliseconds } = divmod(milliseconds, 1000))
      ;({ quotient: minutes, remainder: seconds } = divmod(seconds, 60))
      ;({ quotient: hours, remainder: minutes } = divmod(minutes, 60))
      break
    case 'minute':
      ;({ quotient: seconds, remainder: milliseconds } = divmod(milliseconds, 1000))
      ;({ quotient: minutes, remainder: seconds } = divmod(seconds, 60))
      break
    case 'second':
      ;({ quotient: seconds, remainder: milliseconds } = divmod(milliseconds, 1000))
      break
    case 'millisecond':
      break
    default:
      throw new Error('assert not reached')
  }

  hours = hours * sign
  minutes = minutes * sign
  seconds = seconds * sign
  milliseconds = milliseconds * sign
  return { days, hours, minutes, seconds, milliseconds }
}

export function UnbalanceDurationRelative(
  years: number,
  months: number,
  weeks: number,
  days: number,
  largestUnit: TemporalSingularUnit,
  relativeTo: CalendarDate | undefined
) {
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0)

  if (relativeTo) {
    relativeTo = ToTemporalDateTime(relativeTo)
  }

  const oneYear = CreateTemporalDuration(sign, 0, 0, 0, 0, 0, 0, 0)
  const oneMonth = CreateTemporalDuration(0, sign, 0, 0, 0, 0, 0, 0)
  const oneWeek = CreateTemporalDuration(0, 0, sign, 0, 0, 0, 0, 0)

  switch (largestUnit) {
    case 'year':
      // no-op
      break
    case 'month':
      {
        // balance years down to months
        while (MathAbs(years) > 0) {
          const addOptions = ObjectCreate(null)
          const newRelativeTo = CalendarDateAdd(relativeTo, oneYear, addOptions)
          const untilOptions = ObjectCreate(null)
          untilOptions.largestUnit = 'month'
          const untilResult = CalendarDateUntil(relativeTo, newRelativeTo, untilOptions)
          const oneYearMonths = GetSlots(untilResult).months
          relativeTo = newRelativeTo
          months += oneYearMonths
          years -= sign
        }
      }
      break
    case 'week':
      // balance years down to days
      while (MathAbs(years) > 0) {
        let oneYearDays
        ;({ relativeTo, days: oneYearDays } = MoveRelativeDate(relativeTo, oneYear))
        days += oneYearDays
        years -= sign
      }

      // balance months down to days
      while (MathAbs(months) > 0) {
        let oneMonthDays
        ;({ relativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
        days += oneMonthDays
        months -= sign
      }
      break
    default:
      // balance years down to days
      while (MathAbs(years) > 0) {
        let oneYearDays
        ;({ relativeTo, days: oneYearDays } = MoveRelativeDate(relativeTo, oneYear))
        days += oneYearDays
        years -= sign
      }

      // balance months down to days
      while (MathAbs(months) > 0) {
        let oneMonthDays
        ;({ relativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
        days += oneMonthDays
        months -= sign
      }

      // balance weeks down to days
      while (MathAbs(weeks) > 0) {
        let oneWeekDays
        ;({ relativeTo, days: oneWeekDays } = MoveRelativeDate(relativeTo, oneWeek))
        days += oneWeekDays
        weeks -= sign
      }
      break
  }

  return { years, months, weeks, days }
}

export function BalanceDurationRelative(
  years: number,
  months: number,
  weeks: number,
  days: number,
  largestUnit: TemporalSingularUnit,
  relativeTo: CalendarDate | undefined
) {
  const sign = DurationSign(years, months, weeks, days, 0, 0, 0, 0)
  if (sign === 0) return { years, months, weeks, days }

  if (relativeTo) {
    relativeTo = ToTemporalDateTime(relativeTo)
  }

  const oneYear = CreateTemporalDuration(sign, 0, 0, 0, 0, 0, 0, 0)
  const oneMonth = CreateTemporalDuration(0, sign, 0, 0, 0, 0, 0, 0)
  const oneWeek = CreateTemporalDuration(0, 0, sign, 0, 0, 0, 0, 0)

  switch (largestUnit) {
    case 'year': {
      // balance days up to years
      let newRelativeTo, oneYearDays
      ;({ relativeTo: newRelativeTo, days: oneYearDays } = MoveRelativeDate(relativeTo, oneYear))
      while (MathAbs(days) >= MathAbs(oneYearDays)) {
        days -= oneYearDays
        years += sign
        relativeTo = newRelativeTo
        ;({ relativeTo: newRelativeTo, days: oneYearDays } = MoveRelativeDate(relativeTo, oneYear))
      }

      // balance days up to months
      let oneMonthDays
      ;({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
      while (MathAbs(days) >= MathAbs(oneMonthDays)) {
        days -= oneMonthDays
        months += sign
        relativeTo = newRelativeTo
        ;({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
      }

      // balance months up to years
      const addOptions = ObjectCreate(null)
      newRelativeTo = CalendarDateAdd(relativeTo, oneYear, addOptions)
      const untilOptions = ObjectCreate(null)
      untilOptions.largestUnit = 'month'
      let untilResult = CalendarDateUntil(relativeTo, newRelativeTo, untilOptions)
      let oneYearMonths = GetSlots(untilResult).months
      while (MathAbs(months) >= MathAbs(oneYearMonths)) {
        months -= oneYearMonths
        years += sign
        relativeTo = newRelativeTo
        const addOptions = ObjectCreate(null)
        newRelativeTo = CalendarDateAdd(relativeTo, oneYear, addOptions)
        const untilOptions = ObjectCreate(null)
        untilOptions.largestUnit = 'month'
        untilResult = CalendarDateUntil(relativeTo, newRelativeTo, untilOptions)
        oneYearMonths = GetSlots(untilResult).months
      }
      break
    }
    case 'month': {
      // balance days up to months
      let newRelativeTo, oneMonthDays
      ;({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
      while (MathAbs(days) >= MathAbs(oneMonthDays)) {
        days -= oneMonthDays
        months += sign
        relativeTo = newRelativeTo
        ;({ relativeTo: newRelativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
      }
      break
    }
    case 'week': {
      // balance days up to weeks
      let newRelativeTo, oneWeekDays
      ;({ relativeTo: newRelativeTo, days: oneWeekDays } = MoveRelativeDate(relativeTo, oneWeek))
      while (MathAbs(days) >= MathAbs(oneWeekDays)) {
        days -= oneWeekDays
        weeks += sign
        relativeTo = newRelativeTo
        ;({ relativeTo: newRelativeTo, days: oneWeekDays } = MoveRelativeDate(relativeTo, oneWeek))
      }
      break
    }
    default:
      // no-op
      break
  }

  return { years, months, weeks, days }
}

export function CalculateOffsetShift(
  relativeTo: CalendarDate | undefined,
  y: number,
  mon: number,
  w: number,
  d: number,
  h: number,
  min: number,
  s: number,
  ms: number
) {
  if (IsTemporalZonedDateTime(relativeTo)) {
    const { epochMilliseconds, timeZone } = GetZonedDateTimeSlots(relativeTo)
    const offsetBefore = GetOffsetMillisecondsFor(timeZone, epochMilliseconds)
    const after = AddZonedDateTime(epochMilliseconds, timeZone, y, mon, w, d, h, min, s, ms)
    const offsetAfter = GetOffsetMillisecondsFor(timeZone, after)
    return offsetAfter - offsetBefore
  }
  return 0
}

export function CreateNegatedTemporalDuration(duration: Iso.Duration) {
  const slots = GetDurationSlots(duration)
  return CreateTemporalDuration(
    -slots.years,
    -slots.months,
    -slots.weeks,
    -slots.days,
    -slots.hours,
    -slots.minutes,
    -slots.seconds,
    -slots.milliseconds
  )
}

export function ConstrainToRange(value: number, min: number, max: number): number {
  return MathMin(max, MathMax(min, value))
}
function ConstrainISODate(year: number, month: number, day?: any): DateSlots {
  month = ConstrainToRange(month, 1, 12)
  day = ConstrainToRange(day, 1, ISODaysInMonth(year, month))
  return { year, month, day }
}

function ConstrainTime(hour: number, minute: number, second: number, millisecond: number): TimeSlots {
  hour = ConstrainToRange(hour, 0, 23)
  minute = ConstrainToRange(minute, 0, 59)
  second = ConstrainToRange(second, 0, 59)
  millisecond = ConstrainToRange(millisecond, 0, 999)
  return { hour, minute, second, millisecond }
}

export function RejectToRange(value: number, min: number, max: number): void {
  if (value < min || value > max) throw new RangeError(`value out of range: ${min} <= ${value} <= ${max}`)
}

function RejectISODate(year: number, month: number, day: number) {
  RejectToRange(month, 1, 12)
  RejectToRange(day, 1, ISODaysInMonth(year, month))
}

function RejectDateRange(year: number, month: number, day: number) {
  // Noon avoids trouble at edges of DateTime range (excludes midnight)
  RejectDateTimeRange(year, month, day, 12, 0, 0, 0)
}

export function RejectTime(hour: number, minute: number, second: number, millisecond: number): void {
  RejectToRange(hour, 0, 23)
  RejectToRange(minute, 0, 59)
  RejectToRange(second, 0, 59)
  RejectToRange(millisecond, 0, 999)
}

function RejectDateTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number
): void {
  RejectISODate(year, month, day)
  RejectTime(hour, minute, second, millisecond)
}

function RejectDateTimeRange(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number
): void {
  RejectToRange(year, YEAR_MIN, YEAR_MAX)
  // Reject any DateTime 24 hours or more outside the Instant range
  if (
    (year === YEAR_MIN && null == GetEpochFromISOParts(year, month, day + 1, hour, minute, second, millisecond - 1)) ||
    (year === YEAR_MAX && null == GetEpochFromISOParts(year, month, day - 1, hour, minute, second, millisecond + 1))
  ) {
    throw new RangeError('DateTime outside of supported range')
  }
}

export function ValidateEpochMilliseconds(epochMilliseconds: number): void {
  if (epochMilliseconds < MS_MIN || epochMilliseconds > MS_MAX) {
    throw new RangeError('Instant outside of supported range')
  }
}

function RejectYearMonthRange(year: number, month: number): void {
  RejectToRange(year, YEAR_MIN, YEAR_MAX)
  if (year === YEAR_MIN) {
    RejectToRange(month, 4, 12)
  } else if (year === YEAR_MAX) {
    RejectToRange(month, 1, 9)
  }
}

function RejectDuration(y: number, mon: number, w: number, d: number, h: number, min: number, s: number, ms: number): void {
  const sign = DurationSign(y, mon, w, d, h, min, s, ms)
  for (const prop of [y, mon, w, d, h, min, s, ms]) {
    if (!NumberIsFinite(prop)) throw new RangeError('infinite values not allowed as duration fields')
    const propSign = MathSign(prop)
    if (propSign !== 0 && propSign !== sign) throw new RangeError('mixed-sign values not allowed as duration fields')
  }
}

export function DifferenceISODate(
  y1: number,
  m1: number,
  d1: number,
  y2: number,
  m2: number,
  d2: number,
  largestUnit: 'year' | 'month' | 'week' | 'day' = 'day'
) {
  switch (largestUnit) {
    case 'year':
    case 'month': {
      const sign = -CompareISODate(y1, m1, d1, y2, m2, d2)
      if (sign === 0) return { years: 0, months: 0, weeks: 0, days: 0 }

      const start = { year: y1, month: m1, day: d1 }
      const end = { year: y2, month: m2, day: d2 }

      let years = end.year - start.year
      let mid = AddISODate(y1, m1, d1, years, 0, 0, 0, 'constrain')
      let midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2)
      if (midSign === 0) {
        return largestUnit === 'year'
          ? { years, months: 0, weeks: 0, days: 0 }
          : { years: 0, months: years * 12, weeks: 0, days: 0 }
      }
      let months = end.month - start.month
      if (midSign !== sign) {
        years -= sign
        months += sign * 12
      }
      mid = AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain')
      midSign = -CompareISODate(mid.year, mid.month, mid.day, y2, m2, d2)
      if (midSign === 0) {
        return largestUnit === 'year'
          ? { years, months, weeks: 0, days: 0 }
          : { years: 0, months: months + years * 12, weeks: 0, days: 0 }
      }
      if (midSign !== sign) {
        // The end date is later in the month than mid date (or earlier for
        // negative durations). Back up one month.
        months -= sign
        if (months === -sign) {
          years -= sign
          months = 11 * sign
        }
        mid = AddISODate(y1, m1, d1, years, months, 0, 0, 'constrain')
        midSign = -CompareISODate(y1, m1, d1, mid.year, mid.month, mid.day)
      }

      let days = 0
      // If we get here, months and years are correct (no overflow), and `mid`
      // is within the range from `start` to `end`. To count the days between
      // `mid` and `end`, there are 3 cases:
      // 1) same month: use simple subtraction
      // 2) end is previous month from intermediate (negative duration)
      // 3) end is next month from intermediate (positive duration)
      if (mid.month === end.month) {
        // 1) same month: use simple subtraction
        days = end.day - mid.day
      } else if (sign < 0) {
        // 2) end is previous month from intermediate (negative duration)
        // Example: intermediate: Feb 1, end: Jan 30, DaysInMonth = 31, days = -2
        days = -mid.day - (ISODaysInMonth(end.year, end.month) - end.day)
      } else {
        // 3) end is next month from intermediate (positive duration)
        // Example: intermediate: Jan 29, end: Feb 1, DaysInMonth = 31, days = 3
        days = end.day + (ISODaysInMonth(mid.year, mid.month) - mid.day)
      }

      if (largestUnit === 'month') {
        months += years * 12
        years = 0
      }
      return { years, months, weeks: 0, days }
    }
    case 'week':
    case 'day': {
      let larger, smaller, sign
      if (CompareISODate(y1, m1, d1, y2, m2, d2) < 0) {
        smaller = { year: y1, month: m1, day: d1 }
        larger = { year: y2, month: m2, day: d2 }
        sign = 1
      } else {
        smaller = { year: y2, month: m2, day: d2 }
        larger = { year: y1, month: m1, day: d1 }
        sign = -1
      }
      let days = DayOfYear(larger.year, larger.month, larger.day) - DayOfYear(smaller.year, smaller.month, smaller.day)
      for (let year = smaller.year; year < larger.year; ++year) {
        days += LeapYear(year) ? 366 : 365
      }
      let weeks = 0
      if (largestUnit === 'week') {
        weeks = MathFloor(days / 7)
        days %= 7
      }
      weeks *= sign
      days *= sign
      return { years: 0, months: 0, weeks, days }
    }
    default:
      throw new Error('assert not reached')
  }
}

export function DifferenceTime(
  h1: number,
  min1: number,
  s1: number,
  ms1: number,
  h2: number,
  min2: number,
  s2: number,
  ms2: number
) {
  let hours = h2 - h1
  let minutes = min2 - min1
  let seconds = s2 - s1
  let milliseconds = ms2 - ms1

  const sign = DurationSign(0, 0, 0, 0, hours, minutes, seconds, milliseconds)
  hours *= sign
  minutes *= sign
  seconds *= sign
  milliseconds *= sign

  let deltaDays = 0
  ;({
    deltaDays,
    hour: hours,
    minute: minutes,
    second: seconds,
    millisecond: milliseconds
  } = BalanceTime(hours, minutes, seconds, milliseconds))

  deltaDays *= sign
  hours *= sign
  minutes *= sign
  seconds *= sign
  milliseconds *= sign

  return { deltaDays, hours, minutes, seconds, milliseconds }
}

export function DifferenceInstant(
  ms1: number,
  ms2: number,
  increment: number,
  unit: 'hour' | 'minute' | 'second' | 'millisecond',
  roundingMode: TemporalRoundingMode
) {
  const diff = ms2 - ms1

  const remainder = diff % 86400e3
  const wholeDays = diff - remainder
  const roundedRemainder = RoundNumberToIncrement(remainder, msPerTimeUnit[unit] * increment, roundingMode)
  const roundedDiff = wholeDays + roundedRemainder
  const milliseconds = +roundedDiff % 1e3
  const seconds = +MathTrunc(roundedDiff / 1e3)
  return { seconds, milliseconds }
}

export function DifferenceISODateTime(
  y1: number,
  mon1: number,
  d1: number,
  h1: number,
  min1: number,
  s1: number,
  ms1: number,
  y2: number,
  mon2: number,
  d2: number,
  h2: number,
  min2: number,
  s2: number,
  ms2: number,
  largestUnit: TemporalSingularUnit,
  options = ObjectCreate(null)
): DurationSlots {
  let { deltaDays, hours, minutes, seconds, milliseconds } = DifferenceTime(h1, min1, s1, ms1, h2, min2, s2, ms2)

  const timeSign = DurationSign(0, 0, 0, deltaDays, hours, minutes, seconds, milliseconds)
  ;({ year: y1, month: mon1, day: d1 } = BalanceISODate(y1, mon1, d1 + deltaDays))
  const dateSign = CompareISODate(y2, mon2, d2, y1, mon1, d1)
  if (dateSign === -timeSign) {
    ;({ year: y1, month: mon1, day: d1 } = BalanceISODate(y1, mon1, d1 - timeSign))
    ;({ hours, minutes, seconds, milliseconds } = BalanceDuration(
      -timeSign,
      hours,
      minutes,
      seconds,
      milliseconds,
      largestUnit
    ))
  }

  const date1 = CreateTemporalDate(y1, mon1, d1)
  const date2 = CreateTemporalDate(y2, mon2, d2)
  const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit)
  const untilOptions = { ...options, largestUnit: dateLargestUnit }
  let { years, months, weeks, days } = GetDurationSlots(CalendarDateUntil(date1, date2, untilOptions))
  // Signs of date part and time part may not agree; balance them together
  ;({ days, hours, minutes, seconds, milliseconds } = BalanceDuration(
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    largestUnit
  ))
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds }
}

export function DifferenceZonedDateTime(
  ms1: number,
  ms2: number,
  timeZone: string,
  largestUnit: TemporalSingularUnit,
  options?: any
): DurationSlots {
  const nsDiff = ms2 - ms1
  if (nsDiff === 0) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    }
  }

  const dtStart = GetDateTimeSlots(BuiltinTimeZoneGetPlainDateTimeFor(timeZone, ms1))
  const dtEnd = GetDateTimeSlots(BuiltinTimeZoneGetPlainDateTimeFor(timeZone, ms2))
  let { years, months, weeks, days } = DifferenceISODateTime(
    dtStart.year,
    dtStart.month,
    dtStart.day,
    dtStart.hour,
    dtStart.minute,
    dtStart.second,
    dtStart.millisecond,
    dtEnd.year,
    dtEnd.month,
    dtEnd.day,
    dtEnd.hour,
    dtEnd.minute,
    dtEnd.second,
    dtEnd.millisecond,
    largestUnit,
    options
  )
  const intermediateMs = AddZonedDateTime(ms1, timeZone, years, months, weeks, 0, 0, 0, 0, 0)
  // may disambiguate
  let timeRemainderMs = ms2 - intermediateMs
  const intermediate = CreateTemporalZonedDateTime(intermediateMs, timeZone)
  ;({ milliseconds: timeRemainderMs, days } = MillisecondsToDays(timeRemainderMs, intermediate))

  // Finally, merge the date and time durations and return the merged result.
  const { hours, minutes, seconds, milliseconds } = BalanceDuration(0, 0, 0, 0, timeRemainderMs, 'hour')
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds }
}

export function AddISODate(
  year: number,
  month: number,
  day: number,
  years: number,
  months: number,
  weeks: number,
  days: number,
  overflow: TemporalOverflow
) {
  year += years
  month += months
  ;({ year, month } = BalanceISOYearMonth(year, month))
  ;({ year, month, day } = RegulateISODate(year, month, day, overflow))
  days += 7 * weeks
  day += days
  ;({ year, month, day } = BalanceISODate(year, month, day))
  return { year, month, day }
}

export function AddTime(
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number
) {
  hour += hours
  minute += minutes
  second += seconds
  millisecond += milliseconds
  let deltaDays = 0
  ;({ deltaDays, hour, minute, second, millisecond } = BalanceTime(hour, minute, second, millisecond))
  return { deltaDays, hour, minute, second, millisecond }
}

export function AddDuration(
  y1: number,
  mon1: number,
  w1: number,
  d1: number,
  h1: number,
  min1: number,
  s1: number,
  ms1: number,
  y2: number,
  mon2: number,
  w2: number,
  d2: number,
  h2: number,
  min2: number,
  s2: number,
  ms2: number,
  relativeTo: Iso.DateTime | Iso.ZonedDateTime | undefined
) {
  const largestUnit1 = DefaultTemporalLargestUnit(y1, mon1, w1, d1, h1, min1, s1, ms1)
  const largestUnit2 = DefaultTemporalLargestUnit(y2, mon2, w2, d2, h2, min2, s2, ms2)
  const largestUnit = LargerOfTwoTemporalUnits(largestUnit1, largestUnit2)

  let years, months, weeks, days, hours, minutes, seconds, milliseconds
  if (!relativeTo) {
    if (largestUnit === 'year' || largestUnit === 'month' || largestUnit === 'week') {
      throw new RangeError('relativeTo is required for years, months, or weeks arithmetic')
    }
    years = months = weeks = 0
    ;({ days, hours, minutes, seconds, milliseconds } = BalanceDuration(
      d1 + d2,
      h1 + h2,
      min1 + min2,
      s1 + s2,
      ms1 + ms2,
      largestUnit
    ))
  } else if (IsTemporalDateTime(relativeTo)) {
    const slots = GetDateTimeSlots(relativeTo)
    const datePart = CreateTemporalDate(slots.year, slots.month, slots.day)
    const dateDuration1 = CreateTemporalDuration(y1, mon1, w1, d1, 0, 0, 0, 0)
    const dateDuration2 = CreateTemporalDuration(y2, mon2, w2, d2, 0, 0, 0, 0)
    const firstAddOptions = ObjectCreate(null)
    const intermediate = CalendarDateAdd(datePart, dateDuration1, firstAddOptions)
    const secondAddOptions = ObjectCreate(null)
    const end = CalendarDateAdd(intermediate, dateDuration2, secondAddOptions)

    const dateLargestUnit = LargerOfTwoTemporalUnits('day', largestUnit)
    const differenceOptions = ObjectCreate(null)
    differenceOptions.largestUnit = dateLargestUnit
    ;({ years, months, weeks, days } = GetDurationSlots(CalendarDateUntil(datePart, end, differenceOptions)))
    // Signs of date part and time part may not agree; balance them together
    ;({ days, hours, minutes, seconds, milliseconds } = BalanceDuration(
      days,
      h1 + h2,
      min1 + min2,
      s1 + s2,
      ms1 + ms2,
      largestUnit
    ))
  } else {
    // relativeTo is a ZonedDateTime
    const { timeZone, epochMilliseconds } = GetZonedDateTimeSlots(relativeTo)
    const intermediateMs = AddZonedDateTime(epochMilliseconds, timeZone, y1, mon1, w1, d1, h1, min1, s1, ms1)
    const endMs = AddZonedDateTime(intermediateMs, timeZone, y2, mon2, w2, d2, h2, min2, s2, ms2)
    if (largestUnit !== 'year' && largestUnit !== 'month' && largestUnit !== 'week' && largestUnit !== 'day') {
      // The user is only asking for a time difference, so return difference of instants.
      years = 0
      months = 0
      weeks = 0
      days = 0
      ;({ seconds, milliseconds } = DifferenceInstant(epochMilliseconds, endMs, 1, 'millisecond', 'halfExpand'))
      ;({ hours, minutes, seconds, milliseconds } = BalanceDuration(
        0,
        0,
        0,
        seconds,
        milliseconds,

        largestUnit
      ))
    } else {
      ;({ years, months, weeks, days, hours, minutes, seconds, milliseconds } = DifferenceZonedDateTime(
        epochMilliseconds,
        endMs,
        timeZone,
        largestUnit
      ))
    }
  }

  RejectDuration(years, months, weeks, days, hours, minutes, seconds, milliseconds)
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds }
}

export function AddInstant(epochMilliseconds: number, h: number, min: number, s: number, ms: number): number {
  let sum = 0
  sum = sum + ms * 1e6
  sum = sum + s * 1e3
  sum = sum + min * 60 * 1e3
  sum = sum + h * 60 * 60 * 1e3

  const result = epochMilliseconds + sum
  ValidateEpochMilliseconds(result)
  return result
}

export function AddDateTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  options: Options | undefined
) {
  // Add the time part
  let deltaDays = 0
  ;({ deltaDays, hour, minute, second, millisecond } = AddTime(
    hour,
    minute,
    second,
    millisecond,
    hours,
    minutes,
    seconds,
    milliseconds
  ))
  days += deltaDays

  const datePart = CreateTemporalDate(year, month, day)
  const dateDuration = CreateTemporalDuration(years, months, weeks, days, 0, 0, 0, 0)
  const addedDate = CalendarDateAdd(datePart, dateDuration, options)
  const dateSlots = GetDateSlots(addedDate)

  return {
    year: dateSlots.year,
    month: dateSlots.month,
    day: dateSlots.day,
    hour,
    minute,
    second,
    millisecond
  }
}

export function AddZonedDateTime(
  epochMilliseconds: number,
  timeZone: string,
  years: number,
  months: number,
  weeks: number,
  days: number,
  h: number,
  min: number,
  s: number,
  ms: number,
  options?: any
): number {
  // If only time is to be added, then use Instant math. It's not OK to fall
  // through to the date/time code below because compatible disambiguation in
  // the PlainDateTime=>Instant conversion will change the offset of any
  // ZonedDateTime in the repeated clock time after a backwards transition.
  // When adding/subtracting time units and not dates, this disambiguation is
  // not expected and so is avoided below via a fast path for time-only
  // arithmetic.
  // BTW, this behavior is similar in spirit to offset: 'prefer' in `with`.
  if (DurationSign(years, months, weeks, days, 0, 0, 0, 0) === 0) {
    return AddInstant(epochMilliseconds, h, min, s, ms)
  }

  // RFC 5545 requires the date portion to be added in calendar days and the
  // time portion to be added in exact time.
  const dt = GetDateTimeSlots(BuiltinTimeZoneGetPlainDateTimeFor(timeZone, epochMilliseconds))
  const datePart = CreateTemporalDate(dt.year, dt.month, dt.day)
  const dateDuration = CreateTemporalDuration(years, months, weeks, days, 0, 0, 0, 0)
  const addedDate = CalendarDateAdd(datePart, dateDuration, options)
  const dateSlots = GetDateSlots(addedDate)
  const dtIntermediate = CreateTemporalDateTime(
    dateSlots.year,
    dateSlots.month,
    dateSlots.day,
    dt.hour,
    dt.minute,
    dt.second,
    dt.millisecond
  )

  // Note that 'compatible' is used below because this disambiguation behavior
  // is required by RFC 5545.
  const instantIntermediate = BuiltinTimeZoneGetInstantFor(timeZone, dtIntermediate, 'compatible')
  return AddInstant(instantIntermediate, h, min, s, ms)
}

function RoundNumberToIncrement(quantity: number, increment: number, mode: TemporalRoundingMode): number {
  if (increment === 1) return quantity
  let quotient = MathTrunc(quantity / increment)
  let remainder = quantity % increment
  if (remainder === 0) return quantity
  const sign = remainder < 0 ? -1 : 1
  switch (mode) {
    case 'ceil':
      if (sign > 0) quotient = quotient + sign
      break
    case 'floor':
      if (sign < 0) quotient = quotient + sign
      break
    case 'trunc':
      // no change needed, because divmod is a truncation
      break
    case 'halfExpand':
      // "half up away from zero"
      if (MathAbs(remainder * 2) >= increment) quotient = quotient + sign
      break
  }
  return quotient * increment
}

export function RoundInstant(
  epochMs: number,
  increment: number,
  unit: 'hour' | 'minute' | 'second' | 'millisecond',
  roundingMode: TemporalRoundingMode
) {
  // Note: NonNegativeModulo, but with BigInt
  let remainder = epochMs % 86400e3
  if (remainder < 0) remainder = remainder + 86400e3
  const wholeDays = epochMs - remainder
  const roundedRemainder = RoundNumberToIncrement(remainder, msPerTimeUnit[unit] * increment, roundingMode)
  return wholeDays + roundedRemainder
}

export function RoundISODateTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  increment: number,
  unit: 'day' | 'hour' | 'minute' | 'second' | 'millisecond',
  roundingMode: TemporalRoundingMode,
  dayLengthMs = 86400e3
): DateTimeSlots {
  let deltaDays = 0
  ;({ deltaDays, hour, minute, second, millisecond } = RoundTime(
    hour,
    minute,
    second,
    millisecond,
    increment,
    unit,
    roundingMode,
    dayLengthMs
  ))
  ;({ year, month, day } = BalanceISODate(year, month, day + deltaDays))
  return { year, month, day, hour, minute, second, millisecond }
}

export function RoundTime(
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
  increment: number,
  unit: 'day' | 'hour' | 'minute' | 'second' | 'millisecond',
  roundingMode: TemporalRoundingMode,
  dayLengthMs = 86400e3
) {
  let quantity = 0
  switch (unit) {
    case 'day':
    case 'hour':
      quantity = hour
    // fall through
    case 'minute':
      quantity = quantity * 60 + minute
    // fall through
    case 'second':
      quantity = quantity * 60 + second
    // fall through
    case 'millisecond':
      quantity = quantity * 1000 + millisecond
  }
  const msPerUnit = unit === 'day' ? dayLengthMs : msPerTimeUnit[unit]
  const rounded = RoundNumberToIncrement(quantity, msPerUnit * increment, roundingMode)
  const result = MathTrunc(rounded / msPerUnit)
  switch (unit) {
    case 'day':
      return { deltaDays: result, hour: 0, minute: 0, second: 0, millisecond: 0 }
    case 'hour':
      return BalanceTime(result, 0, 0, 0)
    case 'minute':
      return BalanceTime(hour, result, 0, 0)
    case 'second':
      return BalanceTime(hour, minute, result, 0)
    case 'millisecond':
      return BalanceTime(hour, minute, second, result)
    default:
      throw new Error(`Invalid unit ${unit}`)
  }
}

function DaysUntil(earlier: CalendarDate | undefined, later: CalendarDate) {
  const earlierSlots = GetSlots(earlier as Iso.Date)
  const laterSlots = GetSlots(later as Iso.Date)

  return DifferenceISODate(
    earlierSlots.year,
    earlierSlots.month,
    earlierSlots.day,
    laterSlots.year,
    laterSlots.month,
    laterSlots.day,
    'day'
  ).days
}

function MoveRelativeDate(relativeTo: CalendarDate | undefined, duration: Iso.Duration) {
  const options = ObjectCreate(null)
  const later = CalendarDateAdd(relativeTo, duration, options)
  const days = DaysUntil(relativeTo, later)
  const laterSlots = GetDateSlots(later)
  const relativeSlots = GetSlots(relativeTo as Iso.DateTime)

  relativeTo = CreateTemporalDateTime(
    laterSlots.year,
    laterSlots.month,
    laterSlots.day,
    relativeSlots['hour'] || 0,
    relativeSlots['minute'] || 0,
    relativeSlots['second'] || 0,
    relativeSlots['millisecond'] || 0
  )
  return { relativeTo, days }
}

export function MoveRelativeZonedDateTime(
  relativeTo: Iso.ZonedDateTime,
  years: number,
  months: number,
  weeks: number,
  days: number
) {
  const { timeZone, epochMilliseconds } = GetZonedDateTimeSlots(relativeTo)
  const intermediateMs = AddZonedDateTime(epochMilliseconds, timeZone, years, months, weeks, days, 0, 0, 0, 0)
  return CreateTemporalZonedDateTime(intermediateMs, timeZone)
}

export function AdjustRoundedDurationDays(
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  increment: number,
  unit: TemporalSingularUnit,
  roundingMode: TemporalRoundingMode,
  relativeTo?: CalendarDate
) {
  if (
    !IsTemporalZonedDateTime(relativeTo) ||
    unit === 'year' ||
    unit === 'month' ||
    unit === 'week' ||
    unit === 'day' ||
    (unit === 'millisecond' && increment === 1)
  ) {
    return { years, months, weeks, days, hours, minutes, seconds, milliseconds }
  }

  // There's one more round of rounding possible: if relativeTo is a
  // ZonedDateTime, the time units could have rounded up into enough hours
  // to exceed the day length. If this happens, grow the date part by a
  // single day and re-run exact time rounding on the smaller remainder. DO
  // NOT RECURSE, because once the extra hours are sucked up into the date
  // duration, there's no way for another full day to come from the next
  // round of rounding. And if it were possible (e.g. contrived calendar
  // with 30-minute-long "days") then it'd risk an infinite loop.
  let timeRemainderMs = TotalDurationMilliseconds(0, hours, minutes, seconds, milliseconds, 0)
  const direction = MathSign(timeRemainderMs)

  const { timeZone, epochMilliseconds } = GetZonedDateTimeSlots(relativeTo)
  const dayStart = AddZonedDateTime(epochMilliseconds, timeZone, years, months, weeks, days, 0, 0, 0, 0)
  const dayEnd = AddZonedDateTime(dayStart, timeZone, 0, 0, 0, direction, 0, 0, 0, 0)
  const dayLengthMs = dayEnd - dayStart

  if ((timeRemainderMs - dayLengthMs) * direction >= 0) {
    ;({ years, months, weeks, days } = AddDuration(
      years,
      months,
      weeks,
      days,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      direction,
      0,
      0,
      0,
      0,
      relativeTo
    ))
    timeRemainderMs = RoundInstant(
      timeRemainderMs - dayLengthMs,
      increment,
      unit as 'hour' | 'minute' | 'second' | 'millisecond',
      roundingMode
    )
    ;({ hours, minutes, seconds, milliseconds } = BalanceDuration(0, 0, 0, 0, timeRemainderMs, 'hour'))
  }
  return { years, months, weeks, days, hours, minutes, seconds, milliseconds }
}

export function RoundDuration(
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
  increment: number,
  unit: TemporalSingularUnit | undefined,
  roundingMode: TemporalRoundingMode,
  relativeTo: CalendarDate | undefined = undefined
) {
  let zdtRelative
  if (relativeTo) {
    if (IsTemporalZonedDateTime(relativeTo)) {
      zdtRelative = relativeTo
      const { epochMilliseconds, timeZone } = GetZonedDateTimeSlots(relativeTo)
      relativeTo = BuiltinTimeZoneGetPlainDateTimeFor(timeZone, epochMilliseconds)
    } else if (!IsTemporalDateTime(relativeTo)) {
      throw new TypeError('starting point must be PlainDateTime or ZonedDateTime')
    }
  }

  // First convert time units up to days, if rounding to days or higher units.
  // If rounding relative to a ZonedDateTime, then some days may not be 24h.
  let dayLengthMs
  if (unit === 'year' || unit === 'month' || unit === 'week' || unit === 'day') {
    milliseconds = TotalDurationMilliseconds(0, hours, minutes, seconds, milliseconds, 0)
    let intermediate
    if (zdtRelative) {
      intermediate = MoveRelativeZonedDateTime(zdtRelative, years, months, weeks, days)
    }
    let deltaDays
    ;({ days: deltaDays, milliseconds, dayLengthMs } = MillisecondsToDays(milliseconds, intermediate))
    days += deltaDays
    hours = minutes = seconds = 0
  }

  let total: number
  switch (unit) {
    case 'year': {
      // convert months and weeks to days by calculating difference(
      // relativeTo + years, relativeTo + { years, months, weeks })
      const yearsDuration = CreateTemporalDuration(years, 0, 0, 0, 0, 0, 0, 0)
      const firstAddOptions = ObjectCreate(null)
      const yearsLater = CalendarDateAdd(relativeTo, yearsDuration, firstAddOptions)
      const yearsMonthsWeeks = CreateTemporalDuration(years, months, weeks, 0, 0, 0, 0, 0)
      const secondAddOptions = ObjectCreate(null)
      const yearsMonthsWeeksLater = CalendarDateAdd(relativeTo, yearsMonthsWeeks, secondAddOptions)
      const monthsWeeksInDays = DaysUntil(yearsLater, yearsMonthsWeeksLater)
      relativeTo = yearsLater
      days += monthsWeeksInDays

      const thirdAddOptions = ObjectCreate(null)
      const daysLater = CalendarDateAdd(relativeTo, { days }, thirdAddOptions)
      const untilOptions = ObjectCreate(null)
      untilOptions.largestUnit = 'year'
      const yearsPassed = GetDurationSlots(CalendarDateUntil(relativeTo, daysLater, untilOptions)).years
      years += yearsPassed
      const oldRelativeTo = relativeTo
      const fourthAddOptions = ObjectCreate(null)
      relativeTo = CalendarDateAdd(relativeTo, { years: yearsPassed }, fourthAddOptions)
      const daysPassed = DaysUntil(oldRelativeTo, relativeTo)
      days -= daysPassed
      const oneYear = CreateTemporalDuration(days < 0 ? -1 : 1, 0, 0, 0, 0, 0, 0, 0)
      let { days: oneYearDays } = MoveRelativeDate(relativeTo, oneYear)

      oneYearDays = MathAbs(oneYearDays)
      const divisor = oneYearDays * (dayLengthMs as number)
      milliseconds = divisor * years + days * (dayLengthMs as number) + milliseconds
      const rounded = RoundNumberToIncrement(milliseconds, divisor * increment, roundingMode)
      total = milliseconds / divisor
      years = Math.trunc(rounded / divisor)
      milliseconds = months = weeks = days = 0
      break
    }
    case 'month': {
      // convert weeks to days by calculating difference(relativeTo +
      //   { years, months }, relativeTo + { years, months, weeks })
      const yearsMonths = CreateTemporalDuration(years, months, 0, 0, 0, 0, 0, 0)
      const firstAddOptions = ObjectCreate(null)
      const yearsMonthsLater = CalendarDateAdd(relativeTo, yearsMonths, firstAddOptions)
      const yearsMonthsWeeks = CreateTemporalDuration(years, months, weeks, 0, 0, 0, 0, 0)
      const secondAddOptions = ObjectCreate(null)
      const yearsMonthsWeeksLater = CalendarDateAdd(relativeTo, yearsMonthsWeeks, secondAddOptions)
      const weeksInDays = DaysUntil(yearsMonthsLater, yearsMonthsWeeksLater)
      relativeTo = yearsMonthsLater
      days += weeksInDays

      // Months may be different lengths of days depending on the calendar,
      // convert days to months in a loop as described above under 'years'.
      const sign = MathSign(days)
      const oneMonth = CreateTemporalDuration(0, days < 0 ? -1 : 1, 0, 0, 0, 0, 0, 0)
      let oneMonthDays
      ;({ relativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
      while (MathAbs(days) >= MathAbs(oneMonthDays)) {
        months += sign
        days -= oneMonthDays
        ;({ relativeTo, days: oneMonthDays } = MoveRelativeDate(relativeTo, oneMonth))
      }
      oneMonthDays = MathAbs(oneMonthDays)
      const divisor = oneMonthDays * (dayLengthMs as number)
      milliseconds = divisor * months + days * (dayLengthMs as number) + milliseconds
      const rounded = RoundNumberToIncrement(milliseconds, divisor * increment, roundingMode)
      total = milliseconds / divisor
      months = MathTrunc(rounded / divisor)
      milliseconds = weeks = days = 0
      break
    }
    case 'week': {
      // Weeks may be different lengths of days depending on the calendar,
      // convert days to weeks in a loop as described above under 'years'.
      const sign = MathSign(days)
      const oneWeek = CreateTemporalDuration(0, 0, days < 0 ? -1 : 1, 0, 0, 0, 0, 0)
      let oneWeekDays
      ;({ relativeTo, days: oneWeekDays } = MoveRelativeDate(relativeTo, oneWeek))
      while (MathAbs(days) >= MathAbs(oneWeekDays)) {
        weeks += sign
        days -= oneWeekDays
        ;({ relativeTo, days: oneWeekDays } = MoveRelativeDate(relativeTo, oneWeek))
      }
      oneWeekDays = MathAbs(oneWeekDays)
      const divisor = oneWeekDays * (dayLengthMs as number)
      milliseconds = divisor * weeks + days * (dayLengthMs as number) + milliseconds
      const rounded = RoundNumberToIncrement(milliseconds, divisor * increment, roundingMode)
      total = milliseconds / divisor
      weeks = MathTrunc(rounded / divisor)
      milliseconds = days = 0
      break
    }
    case 'day': {
      const divisor = dayLengthMs as number
      milliseconds = divisor * days + milliseconds
      const rounded = RoundNumberToIncrement(milliseconds, divisor * increment, roundingMode)
      total = milliseconds / divisor
      days = Math.trunc(rounded / divisor)
      milliseconds = 0
      break
    }
    case 'hour': {
      const divisor = 3600e3
      milliseconds = hours * 3600e3 + minutes * 60e3 + seconds * 1e3 + milliseconds
      total = milliseconds / divisor
      const rounded = RoundNumberToIncrement(milliseconds, divisor * increment, roundingMode)
      hours = Math.trunc(rounded / divisor)
      minutes = seconds = milliseconds = 0
      break
    }
    case 'minute': {
      const divisor = 60e3
      milliseconds = minutes * 60e3 + seconds * 1e3 + milliseconds
      total = milliseconds / divisor
      const rounded = RoundNumberToIncrement(milliseconds, divisor * increment, roundingMode)
      minutes = Math.trunc(rounded / divisor)
      seconds = milliseconds = 0
      break
    }
    case 'second': {
      const divisor = 1e3
      milliseconds = seconds * 1e3 + milliseconds
      total = milliseconds / divisor
      const rounded = RoundNumberToIncrement(milliseconds, divisor * increment, roundingMode)
      seconds = MathTrunc(rounded / divisor)
      milliseconds = 0
      break
    }
    case 'millisecond': {
      total = milliseconds
      milliseconds = RoundNumberToIncrement(milliseconds, increment, roundingMode)
      break
    }
  }
  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    // @ts-ignore
    total: total
  }
}

export function CompareISODate(y1: number, m1: number, d1: number, y2: number, m2: number, d2: number): number {
  for (const [x, y] of [
    [y1, y2],
    [m1, m2],
    [d1, d2]
  ]) {
    if (x !== y) return ComparisonResult(x - y)
  }
  return 0
}

function NonNegativeModulo(x: number, y: number) {
  let result = x % y
  if (ObjectIs(result, -0)) return 0
  if (result < 0) result += y
  return result
}

export function SystemUTCEpochMilliSeconds(): number {
  return Date.now()
}

export function SystemTimeZone(): string {
  const fmt = new IntlDateTimeFormat('en-us')
  return TemporalTimeZoneFromString(fmt.resolvedOptions().timeZone)
}

export function ComparisonResult(value: number): number {
  return value < 0 ? -1 : value > 0 ? 1 : value
}
export function GetOptionsObject<T>(options: T | undefined): T {
  if (options === undefined) return ObjectCreate(null)
  if (IsObject(options)) return options
  throw new TypeError(`Options parameter must be an object, not ${options === null ? 'null' : `a ${typeof options}`}`)
}

function GetOption<T extends string>(options: Options, property: string, allowedValues: T[], fallback: T | undefined): T {
  let value = options[property]
  if (value !== undefined) {
    value = ToString(value)
    if (!allowedValues.includes(value as T)) {
      throw new RangeError(`${property} must be one of ${allowedValues.join(', ')}, not ${value}`)
    }
    return value as T
  }
  return fallback as T
}

function GetNumberOption(options: Options, property: string, minimum: number, maximum: number, fallback: number): number {
  let value = options[property] as number
  if (value === undefined) return fallback
  value = ToNumber(value)
  if (NumberIsNaN(value) || value < minimum || value > maximum) {
    throw new RangeError(`${property} must be between ${minimum} and ${maximum}, not ${value}`)
  }
  return MathFloor(value)
}

const OFFSET = new RegExp(`^${PARSE.offset.source}$`)

function bisect(
  getState: (middle: number) => number,
  left: number,
  right: number,
  lstate = getState(left),
  rstate = getState(right)
): number {
  while (right - left > 1) {
    const middle = Math.trunc((left + right) / 2)
    const mstate = getState(middle)
    if (mstate === lstate) {
      left = middle
      lstate = mstate
    } else if (mstate === rstate) {
      right = middle
      rstate = mstate
    } else {
      throw new Error(`invalid state in bisection ${lstate} - ${mstate} - ${rstate}`)
    }
  }
  return right
}

function GetPossibleInstantsFor(timeZone: string, dateTime: Iso.DateTime): number[] {
  if (!IsTemporalTimeZone(timeZone)) throw new TypeError('invalid receiver')
  dateTime = ToTemporalDateTime(dateTime)
  const slots = GetDateTimeSlots(dateTime)

  const offsetMs = ParseOffsetString(timeZone)
  if (offsetMs !== null) {
    const epochMs = GetEpochFromISOParts(
      slots.year,
      slots.month,
      slots.day,
      slots.hour,
      slots.minute,
      slots.second,
      slots.millisecond
    )
    if (epochMs === null) throw new RangeError('DateTime outside of supported range')
    return [epochMs - offsetMs]
  }

  const possibleEpochMs = GetIANATimeZoneEpochValue(
    timeZone,
    slots.year,
    slots.month,
    slots.day,
    slots.hour,
    slots.minute,
    slots.second,
    slots.millisecond
  )
  return possibleEpochMs
}

const msPerTimeUnit = {
  hour: 3600e3,
  minute: 60e3,
  second: 1e3,
  millisecond: 1
}

export interface InstantSlots {
  epochMilliseconds: number
}
export interface ZonedDateTimeSlots {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
  offset: string
  epochMilliseconds: number
  timeZone: string
}
export interface DateTimeSlots {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}
export interface DateSlots {
  year: number
  month: number
  day: number
}
export interface TimeSlots {
  hour: number
  minute: number
  second: number
  millisecond: number
}
export interface YearMonthSlots {
  year: number
  month: number
}
export interface MonthDaySlots {
  month: number
  day: number
}
export interface DurationSlots {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export function GetSlots(instant: Iso.Instant): InstantSlots
export function GetSlots(zonedDateTime: Iso.ZonedDateTime): ZonedDateTimeSlots
export function GetSlots(dateTime: Iso.DateTime): DateTimeSlots
export function GetSlots(date: Iso.Date): DateSlots
export function GetSlots(time: Iso.Time): TimeSlots
export function GetSlots(yearMonth: Iso.YearMonth): YearMonthSlots
export function GetSlots(monthDay: Iso.MonthDay): MonthDaySlots
export function GetSlots(duration: Iso.Duration): DurationSlots

export function GetSlots(input: any) {
  if (IsTemporalInstant(input)) {
    return GetInstantSlots(input)
  } else if (IsTemporalZonedDateTime(input)) {
    return GetZonedDateTimeSlots(input)
  } else if (IsTemporalDateTime(input)) {
    return GetDateTimeSlots(input)
  } else if (IsTemporalDate(input)) {
    return GetDateSlots(input)
  } else if (IsTemporalTime(input)) {
    return GetTimeSlots(input)
  } else if (IsTemporalYearMonth(input)) {
    return GetYearMonthSlots(input)
  } else if (IsTemporalMonthDay(input)) {
    return GetMonthDaySlots(input)
  } else if (IsTemporalDuration(input)) {
    return GetDurationSlots(input)
  } else {
    throw new Error()
  }
}

export function GetInstantSlots(input: Iso.Instant): InstantSlots {
  return {
    epochMilliseconds: new Date(input).getTime()
  }
}

export function GetZonedDateTimeSlots(input: Iso.ZonedDateTime): ZonedDateTimeSlots {
  const [dirtyDateTime, dirtyTimeZone] = input.split('[')
  const timeZone = dirtyTimeZone.replace(']', '')
  const offset = dirtyDateTime.substring(dirtyDateTime.length - 6, dirtyDateTime.length)
  const dateTime = dirtyDateTime.substring(0, dirtyDateTime.length - 6) as Iso.DateTime
  const parsed = ParseTemporalDateTimeString(dateTime)
  return {
    year: parsed.year,
    month: parsed.month,
    day: parsed.day,
    hour: parsed.hour,
    minute: parsed.minute,
    second: parsed.second,
    millisecond: parsed.millisecond,
    epochMilliseconds: new Date(`${dateTime}${offset}`).getTime(),
    timeZone,
    offset
  }
}

export function GetDateTimeSlots(input: Iso.DateTime): DateTimeSlots {
  const parsed = ParseTemporalDateTimeString(input)
  return {
    year: parsed.year,
    month: parsed.month,
    day: parsed.day,
    hour: parsed.hour,
    minute: parsed.minute,
    second: parsed.second,
    millisecond: parsed.millisecond
  }
}

export function GetDateSlots(input: Iso.Date): DateSlots {
  const parsed = ParseTemporalDateString(input)
  return {
    year: parsed.year,
    month: parsed.month,
    day: parsed.day
  }
}

export function GetTimeSlots(input: Iso.Time): TimeSlots {
  const parsed = ParseTemporalTimeString(input)
  return {
    hour: parsed.hour,
    minute: parsed.minute,
    second: parsed.second,
    millisecond: parsed.millisecond
  }
}

export function GetYearMonthSlots(input: Iso.YearMonth): YearMonthSlots {
  const parsed = ParseTemporalYearMonthString(input)
  return {
    year: parsed.year,
    month: parsed.month
  }
}

export function GetMonthDaySlots(input: Iso.MonthDay): MonthDaySlots {
  const parsed = ParseTemporalMonthDayString(input)
  return {
    month: parsed.month,
    day: parsed.day
  }
}

export function GetDurationSlots(input: Iso.Duration): DurationSlots {
  const parsed = ParseTemporalDurationString(input)
  return parsed
}

function divmod(x: number, divisor: number) {
  return {
    quotient: Math.trunc(x / divisor),
    remainder: x % divisor
  }
}
