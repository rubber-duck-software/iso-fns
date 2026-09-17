import { Temporal } from 'temporal-polyfill'
import { type Iso } from './iso-types.ts'
import type {
  DateSlots,
  DateTimeSlots,
  DurationSlots,
  InstantSlots,
  MonthDaySlots,
  TimeSlots,
  YearMonthSlots,
  ZonedDateTimeSlots
} from './slots.ts'

export interface Chain<T> {
  value(): T
}

export function buildChain<T>(value: T): Chain<T> {
  return {
    value() {
      return value
    }
  }
}

// iso-fns has always serialized times in compact form: drop ":SS" when seconds
// and any fractional part are zero, and drop trailing fractional zeros.
// Temporal's toString() always emits ":SS[.sss]" — these helpers massage the
// tail portion to match iso-fns's historical output.
function compactDateTimePortion(iso: string): string {
  return iso.replace(/T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?/, (_, h, m, s, frac) => {
    const trimmed = frac ? frac.replace(/0+$/, '') : ''
    if (s === '00' && !trimmed) return `T${h}:${m}`
    return trimmed ? `T${h}:${m}:${s}.${trimmed}` : `T${h}:${m}:${s}`
  })
}

function compactTimeOnly(iso: string): string {
  return iso.replace(/^(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/, (_, h, m, s, frac) => {
    const trimmed = frac ? frac.replace(/0+$/, '') : ''
    if (s === '00' && !trimmed) return `${h}:${m}`
    return trimmed ? `${h}:${m}:${s}.${trimmed}` : `${h}:${m}:${s}`
  })
}

export function toIsoDate(pd: Temporal.PlainDate): Iso.Date {
  return pd.toString() as Iso.Date
}
export function toIsoTime(pt: Temporal.PlainTime): Iso.Time {
  return compactTimeOnly(pt.toString()) as Iso.Time
}
export function toIsoDateTime(pdt: Temporal.PlainDateTime): Iso.DateTime {
  return compactDateTimePortion(pdt.toString()) as Iso.DateTime
}
export function toIsoZonedDateTime(zdt: Temporal.ZonedDateTime): Iso.ZonedDateTime {
  return compactDateTimePortion(zdt.toString()) as Iso.ZonedDateTime
}
export function toIsoInstant(inst: Temporal.Instant): Iso.Instant {
  // Instants always render with fixed 3-digit milliseconds and seconds present,
  // matching RFC 3339 / `Date.prototype.toISOString()` / iso-fns v1. (The default
  // `toString()` trims trailing-zero fractional digits, which made DB round-trips
  // that compare against `Date.toISOString()` output mismatch intermittently.)
  return inst.toString({ fractionalSecondDigits: 3 }) as Iso.Instant
}
export function toIsoYearMonth(pym: Temporal.PlainYearMonth): Iso.YearMonth {
  return pym.toString() as Iso.YearMonth
}
// ISO 8601 prescribes `--MM-DD` for month-day. temporal-polyfill emits `MM-DD`
// without the leading `--`; normalize every iso-fns output to the spec form.
export function toIsoMonthDay(pmd: Temporal.PlainMonthDay): Iso.MonthDay {
  const s = pmd.toString()
  return (s.startsWith('--') ? s : `--${s}`) as Iso.MonthDay
}
export function toIsoDuration(dur: Temporal.Duration): Iso.Duration {
  return dur.toString() as Iso.Duration
}

export function isIsoDate(item: unknown): item is Iso.Date {
  if (typeof item !== 'string') return false
  const match = DATE_PATTERN.exec(item)
  return match !== null && isCanonicalDate(match[1], match[2], match[3])
}
export function isIsoTime(item: unknown): item is Iso.Time {
  if (typeof item !== 'string') return false
  const match = TIME_PATTERN.exec(item)
  return match !== null && isCanonicalTime(match[1], match[2], match[3])
}
export function isIsoDateTime(item: unknown): item is Iso.DateTime {
  if (typeof item !== 'string') return false
  const match = DATE_TIME_PATTERN.exec(item)
  return match !== null && isCanonicalDateTime(match)
}
export function isIsoZonedDateTime(item: unknown): item is Iso.ZonedDateTime {
  if (typeof item !== 'string') return false
  try {
    return compactDateTimePortion(Temporal.ZonedDateTime.from(item).toString()) === compactDateTimePortion(item)
  } catch {
    return false
  }
}
export function isIsoInstant(item: unknown): item is Iso.Instant {
  if (typeof item !== 'string') return false
  const match = INSTANT_PATTERN.exec(item)
  return match !== null && isCanonicalDateTime(match) && !Number.isNaN(epochMillisecondsFromMatch(match))
}
export function isIsoYearMonth(item: unknown): item is Iso.YearMonth {
  if (typeof item !== 'string') return false
  const match = YEAR_MONTH_PATTERN.exec(item)
  return (
    match !== null &&
    isCanonicalYear(match[1]) &&
    isValidMonth(match[2]) &&
    isYearMonthWithinTemporalLimits(+match[1], match[2])
  )
}
export function isIsoMonthDay(item: unknown): item is Iso.MonthDay {
  if (typeof item !== 'string') return false
  const match = MONTH_DAY_PATTERN.exec(item)
  return match !== null && isValidMonth(match[1]) && isValidDay(LEAP_REFERENCE_YEAR, +match[1], match[2])
}
export function isIsoDuration(item: unknown): item is Iso.Duration {
  if (typeof item !== 'string') return false
  try {
    return Temporal.Duration.from(item).toString() === item
  } catch {
    return false
  }
}

export function slotsFromDate(pd: Temporal.PlainDate): DateSlots {
  return { year: pd.year, month: pd.month, day: pd.day }
}
export function slotsFromTime(pt: Temporal.PlainTime): TimeSlots {
  return { hour: pt.hour, minute: pt.minute, second: pt.second, millisecond: pt.millisecond }
}
export function slotsFromDateTime(pdt: Temporal.PlainDateTime): DateTimeSlots {
  return {
    year: pdt.year,
    month: pdt.month,
    day: pdt.day,
    hour: pdt.hour,
    minute: pdt.minute,
    second: pdt.second,
    millisecond: pdt.millisecond
  }
}
export function slotsFromZonedDateTime(zdt: Temporal.ZonedDateTime): ZonedDateTimeSlots {
  return {
    year: zdt.year,
    month: zdt.month,
    day: zdt.day,
    hour: zdt.hour,
    minute: zdt.minute,
    second: zdt.second,
    millisecond: zdt.millisecond,
    epochMilliseconds: zdt.epochMilliseconds,
    timeZone: zdt.timeZoneId,
    offset: zdt.offset
  }
}
export function slotsFromInstant(inst: Temporal.Instant): InstantSlots {
  return { epochMilliseconds: inst.epochMilliseconds }
}
export function slotsFromYearMonth(pym: Temporal.PlainYearMonth): YearMonthSlots {
  return { year: pym.year, month: pym.month }
}
export function slotsFromMonthDay(pmd: Temporal.PlainMonthDay): MonthDaySlots {
  const ref = pmd.toPlainDate({ year: 1972 })
  return { month: ref.month, day: pmd.day }
}
export function slotsFromDuration(dur: Temporal.Duration): DurationSlots {
  return {
    years: dur.years,
    months: dur.months,
    weeks: dur.weeks,
    days: dur.days,
    hours: dur.hours,
    minutes: dur.minutes,
    seconds: dur.seconds,
    milliseconds: dur.milliseconds
  }
}

// Grammar below mirrors what Temporal's toString() emits, so a string passes
// only when it is already in iso-fns canonical form. Validating structurally
// avoids a Temporal parse + re-serialize round-trip on every call. ZonedDateTime
// and Duration still round-trip through Temporal: the former needs the time
// zone database, the latter Temporal's own normalization rules.
const YEAR = '(\\d{4}|[+-]\\d{6})'
const TWO_DIGITS = '(\\d{2})'
const TIME = `${TWO_DIGITS}:${TWO_DIGITS}(?::${TWO_DIGITS}(?:\\.(\\d{1,9}))?)?`
const DATE = `${YEAR}-${TWO_DIGITS}-${TWO_DIGITS}`

const DATE_PATTERN = new RegExp(`^${DATE}$`)
const TIME_PATTERN = new RegExp(`^${TIME}$`)
const DATE_TIME_PATTERN = new RegExp(`^${DATE}T${TIME}$`)
const INSTANT_PATTERN = new RegExp(`^${DATE}T${TIME}Z$`)
const YEAR_MONTH_PATTERN = new RegExp(`^${YEAR}-${TWO_DIGITS}$`)
const MONTH_DAY_PATTERN = new RegExp(`^--${TWO_DIGITS}-${TWO_DIGITS}$`)

const LEAP_REFERENCE_YEAR = 1972
const TEMPORAL_MIN_YEAR = -271821
const TEMPORAL_MAX_YEAR = 275760
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isCanonicalDateTime(match: RegExpExecArray): boolean {
  return isCanonicalDate(match[1], match[2], match[3]) && isCanonicalTime(match[4], match[5], match[6])
}

function isCanonicalDate(year: string, month: string, day: string): boolean {
  return (
    isCanonicalYear(year) &&
    isValidMonth(month) &&
    isValidDay(+year, +month, day) &&
    isDateWithinTemporalLimits(+year, `${month}-${day}`)
  )
}

// Temporal writes years 0000-9999 as four digits and everything else as a
// signed six-digit year, so a signed year inside that range is non-canonical.
function isCanonicalYear(year: string): boolean {
  if (year.length === 4) return true
  const magnitude = +year.slice(1)
  return year[0] === '-' ? magnitude > 0 : magnitude > 9999
}

// Temporal's representable range: -271821-04-19 through +275760-09-13.
function isDateWithinTemporalLimits(year: number, monthDay: string): boolean {
  if (year === TEMPORAL_MIN_YEAR) return monthDay >= '04-19'
  if (year === TEMPORAL_MAX_YEAR) return monthDay <= '09-13'
  return year > TEMPORAL_MIN_YEAR && year < TEMPORAL_MAX_YEAR
}

function isYearMonthWithinTemporalLimits(year: number, month: string): boolean {
  if (year === TEMPORAL_MIN_YEAR) return month >= '04'
  if (year === TEMPORAL_MAX_YEAR) return month <= '09'
  return year > TEMPORAL_MIN_YEAR && year < TEMPORAL_MAX_YEAR
}

function isValidMonth(month: string): boolean {
  return month >= '01' && month <= '12'
}

function isValidDay(year: number, month: number, day: string): boolean {
  if (day < '01') return false
  const daysInMonth = month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1]
  return +day <= daysInMonth
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function isCanonicalTime(hour: string, minute: string, second: string | undefined): boolean {
  return hour <= '23' && minute <= '59' && (second === undefined || second <= '59')
}

function epochMillisecondsFromMatch(match: RegExpExecArray): number {
  const date = new Date(0)
  date.setUTCFullYear(+match[1], +match[2] - 1, +match[3])
  date.setUTCHours(+match[4], +match[5], +(match[6] ?? 0), +(match[7] ?? '').padEnd(3, '0').slice(0, 3))
  return date.getTime()
}
