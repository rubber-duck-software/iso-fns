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
  if (COMMON_DATE_PATTERN.test(item)) return true
  const match = DATE_PATTERN.exec(item)
  return match !== null && isCanonicalYear(match[1]) && isValidDay(match) && isDateWithinTemporalLimits(match)
}
export function isIsoTime(item: unknown): item is Iso.Time {
  return typeof item === 'string' && TIME_PATTERN.test(item)
}
export function isIsoDateTime(item: unknown): item is Iso.DateTime {
  if (typeof item !== 'string') return false
  if (COMMON_DATE_TIME_PATTERN.test(item)) return true
  const match = DATE_TIME_PATTERN.exec(item)
  return match !== null && isCanonicalYear(match[1]) && isValidDay(match) && isDateTimeWithinTemporalLimits(match)
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
  if (COMMON_INSTANT_PATTERN.test(item)) return true
  const match = INSTANT_PATTERN.exec(item)
  return match !== null && isCanonicalYear(match[1]) && isValidDay(match) && isInstantWithinTemporalLimits(match)
}
export function isIsoYearMonth(item: unknown): item is Iso.YearMonth {
  if (typeof item !== 'string') return false
  if (COMMON_YEAR_MONTH_PATTERN.test(item)) return true
  const match = YEAR_MONTH_PATTERN.exec(item)
  return match !== null && isCanonicalYear(match[1]) && isYearMonthWithinTemporalLimits(+match[1], match[2])
}
export function isIsoMonthDay(item: unknown): item is Iso.MonthDay {
  if (typeof item !== 'string') return false
  if (COMMON_MONTH_DAY_PATTERN.test(item)) return true
  const match = MONTH_DAY_PATTERN.exec(item)
  return match !== null && +match[2] <= daysInMonth(LEAP_REFERENCE_YEAR, +match[1])
}
export function isIsoDuration(item: unknown): item is Iso.Duration {
  if (typeof item !== 'string') return false
  if (item === 'PT0S') return true
  const match = DURATION_PATTERN.exec(item)
  if (match === null) return false
  let sawComponent = false
  for (let i = 1; i <= 7; i++) {
    const component = match[i]
    if (component === undefined) continue
    sawComponent = true
    // Temporal serializes zero components away; a lone "0" survives only as the
    // integer part of fractional seconds ("PT0.5S").
    if (component === '0' && !(i === 7 && match[8] !== undefined)) return false
  }
  return sawComponent
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
// still round-trips through Temporal because it needs the time zone database.
//
// Each type has two patterns. The COMMON_* pattern is a strict subset of valid
// input (four-digit year, day already known to fit its month, February capped at
// 28) checked with .test() so the common case allocates nothing. Anything it
// misses, including leap days and signed years, falls through to the full
// capturing grammar plus range checks. Because the common pattern can only say
// yes, a mismatch between the two can cost speed but never correctness.
const YEAR = '(\\d{4}|[+-]\\d{6})'
const MONTH = '(0[1-9]|1[0-2])'
const DAY = '(0[1-9]|[12]\\d|3[01])'
const TIME = '((?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d{1,9})?)?)'
const DATE = `${YEAR}-${MONTH}-${DAY}`

const DATE_PATTERN = new RegExp(`^${DATE}$`)
const TIME_PATTERN = new RegExp(`^${TIME}$`)
const DATE_TIME_PATTERN = new RegExp(`^${DATE}T${TIME}$`)
const INSTANT_PATTERN = new RegExp(`^${DATE}T${TIME}Z$`)
const YEAR_MONTH_PATTERN = new RegExp(`^${YEAR}-${MONTH}$`)
const MONTH_DAY_PATTERN = new RegExp(`^--${MONTH}-${DAY}$`)

const MONTH_DAY_IN_31_DAY_MONTH = '(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])'
const MONTH_DAY_IN_30_DAY_MONTH = '(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)'
const MONTH_DAY_IN_FEBRUARY = '02-(?:0[1-9]|1\\d|2[0-8])'
const COMMON_MONTH_DAY = `(?:${MONTH_DAY_IN_31_DAY_MONTH}|${MONTH_DAY_IN_30_DAY_MONTH}|${MONTH_DAY_IN_FEBRUARY})`
const COMMON_DATE = `\\d{4}-${COMMON_MONTH_DAY}`

const COMMON_DATE_PATTERN = new RegExp(`^${COMMON_DATE}$`)
const COMMON_DATE_TIME_PATTERN = new RegExp(`^${COMMON_DATE}T${TIME}$`)
const COMMON_INSTANT_PATTERN = new RegExp(`^${COMMON_DATE}T${TIME}Z$`)
const COMMON_YEAR_MONTH_PATTERN = new RegExp(`^\\d{4}-${MONTH}$`)
const COMMON_MONTH_DAY_PATTERN = new RegExp(`^--${COMMON_MONTH_DAY}$`)

const CANONICAL_INTEGER = '(0|[1-9]\\d*)'
const CANONICAL_FRACTION = '(\\d{0,8}[1-9])'
const DURATION_PATTERN = new RegExp(
  `^-?P(?:${CANONICAL_INTEGER}Y)?(?:${CANONICAL_INTEGER}M)?(?:${CANONICAL_INTEGER}W)?(?:${CANONICAL_INTEGER}D)?` +
    `(?:T(?=\\d)(?:${CANONICAL_INTEGER}H)?(?:${CANONICAL_INTEGER}M)?(?:${CANONICAL_INTEGER}(?:\\.${CANONICAL_FRACTION})?S)?)?$`
)

const MIDNIGHT_PATTERN = /^[0:.]+$/
const LEAP_REFERENCE_YEAR = 1972
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// Temporal writes years 0000-9999 as four digits and everything else as a
// signed six-digit year, so a signed year inside that range is non-canonical.
function isCanonicalYear(year: string): boolean {
  if (year.length === 4) return true
  const magnitude = +year.slice(1)
  return year[0] === '-' ? magnitude > 0 : magnitude > 9999
}

// Match groups: 1 year, 2 month, 3 day, 4 time (when the pattern has one).
function isValidDay(match: RegExpExecArray): boolean {
  return +match[3] <= daysInMonth(+match[1], +match[2])
}

function daysInMonth(year: number, month: number): number {
  return month === 2 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month - 1]
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

// Temporal's representable range. Dates span -271821-04-19 through
// +275760-09-13; date-times extend to (but exclude) midnight at each end;
// instants are one day narrower: -271821-04-20T00:00Z through
// +275760-09-13T00:00Z inclusive.
const TEMPORAL_MIN_YEAR = -271821
const TEMPORAL_MAX_YEAR = 275760

function isDateWithinTemporalLimits(match: RegExpExecArray): boolean {
  const year = +match[1]
  if (year === TEMPORAL_MIN_YEAR) return monthDayOf(match) >= '04-19'
  if (year === TEMPORAL_MAX_YEAR) return monthDayOf(match) <= '09-13'
  return year > TEMPORAL_MIN_YEAR && year < TEMPORAL_MAX_YEAR
}

function isDateTimeWithinTemporalLimits(match: RegExpExecArray): boolean {
  const year = +match[1]
  if (year === TEMPORAL_MIN_YEAR) {
    const monthDay = monthDayOf(match)
    return monthDay > '04-19' || (monthDay === '04-19' && !MIDNIGHT_PATTERN.test(match[4]))
  }
  if (year === TEMPORAL_MAX_YEAR) return monthDayOf(match) <= '09-13'
  return year > TEMPORAL_MIN_YEAR && year < TEMPORAL_MAX_YEAR
}

function isInstantWithinTemporalLimits(match: RegExpExecArray): boolean {
  const year = +match[1]
  if (year === TEMPORAL_MIN_YEAR) return monthDayOf(match) >= '04-20'
  if (year === TEMPORAL_MAX_YEAR) {
    const monthDay = monthDayOf(match)
    return monthDay < '09-13' || (monthDay === '09-13' && MIDNIGHT_PATTERN.test(match[4]))
  }
  return year > TEMPORAL_MIN_YEAR && year < TEMPORAL_MAX_YEAR
}

function isYearMonthWithinTemporalLimits(year: number, month: string): boolean {
  if (year === TEMPORAL_MIN_YEAR) return month >= '04'
  if (year === TEMPORAL_MAX_YEAR) return month <= '09'
  return year > TEMPORAL_MIN_YEAR && year < TEMPORAL_MAX_YEAR
}

function monthDayOf(match: RegExpExecArray): string {
  return `${match[2]}-${match[3]}`
}
