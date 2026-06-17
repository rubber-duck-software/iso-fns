/**
 * Type-level tests. These use `@ts-expect-error` assertions that fail the
 * compile if the surrounding code does NOT produce a type error. No runtime
 * assertions — tsc --noEmit is the verification.
 *
 * Wire-up: included in the top-level tsconfig so `pnpm lint` / tsc will catch
 * regressions. There is no runtime test runner for this file.
 */

import {
  type Iso,
  dateFns,
  dateTimeFns,
  durationFns,
  instantFns,
  monthDayFns,
  timeFns,
  yearMonthFns,
  zonedDateTimeFns
} from '../src/index.ts'

declare const date: Iso.Date
declare const dateTime: Iso.DateTime
declare const time: Iso.Time
declare const zdt: Iso.ZonedDateTime
declare const instant: Iso.Instant
declare const yearMonth: Iso.YearMonth
declare const monthDay: Iso.MonthDay
declare const duration: Iso.Duration

// ---------------------------------------------------------------------------
// Branded types do not mix across namespaces
// ---------------------------------------------------------------------------
{
  // @ts-expect-error - Date is not a DateTime
  dateTimeFns.getYear(date)
  // @ts-expect-error - DateTime is not a Date
  dateFns.getYear(dateTime)
  // @ts-expect-error - ZonedDateTime is not a DateTime
  dateTimeFns.getYear(zdt)
  // @ts-expect-error - Time is not a Date
  dateFns.getYear(time)
  // @ts-expect-error - YearMonth is not a Date
  dateFns.getYear(yearMonth)
  // @ts-expect-error - MonthDay is not a Date
  dateFns.getYear(monthDay)
  // @ts-expect-error - Duration is not a Date
  dateFns.getYear(duration)
  // @ts-expect-error - Instant is not a ZonedDateTime (missing timezone annotation)
  zonedDateTimeFns.getYear(instant)
  // @ts-expect-error - Date is not a Time
  timeFns.getHour(date)
}

// ---------------------------------------------------------------------------
// Return types preserve the correct branded type
// ---------------------------------------------------------------------------
{
  const d: Iso.Date = dateFns.from(date)
  const dt: Iso.DateTime = dateTimeFns.from(dateTime)
  const t: Iso.Time = timeFns.from(time)
  const z: Iso.ZonedDateTime = zonedDateTimeFns.from(zdt)
  const i: Iso.Instant = instantFns.from(instant)
  const ym: Iso.YearMonth = yearMonthFns.from(yearMonth)
  const md: Iso.MonthDay = monthDayFns.from(monthDay)
  const dur: Iso.Duration = durationFns.from(duration)
  void d
  void dt
  void t
  void z
  void i
  void ym
  void md
  void dur

  // @ts-expect-error - dateFns.from does not return DateTime
  const wrong1: Iso.DateTime = dateFns.from(date)
  void wrong1
  // @ts-expect-error - dateFns.getYear returns number, not string
  const wrong2: string = dateFns.getYear(date)
  void wrong2
}

// ---------------------------------------------------------------------------
// isValid narrows unknown to the branded type
// ---------------------------------------------------------------------------
{
  const maybe: unknown = '2020-01-01'
  if (dateFns.isValid(maybe)) {
    // maybe is Iso.Date inside this branch
    const y: number = dateFns.getYear(maybe)
    void y
  }

  const maybeDt: unknown = '2020-01-01T12:00'
  if (dateTimeFns.isValid(maybeDt)) {
    const y: number = dateTimeFns.getYear(maybeDt)
    void y
  }

  const maybeZdt: unknown = '2020-01-01T12:00+00:00[UTC]'
  if (zonedDateTimeFns.isValid(maybeZdt)) {
    const y: number = zonedDateTimeFns.getYear(maybeZdt)
    void y
  }

  const maybeInstant: unknown = '2020-01-01T12:00:00Z'
  if (instantFns.isValid(maybeInstant)) {
    const ms: number = instantFns.getEpochMilliseconds(maybeInstant)
    void ms
  }
}

// ---------------------------------------------------------------------------
// from() rejects primitive non-string inputs
// ---------------------------------------------------------------------------
{
  // @ts-expect-error - number is not a valid input
  dateFns.from(42)
  // @ts-expect-error - boolean is not a valid input
  dateFns.from(true)
  // @ts-expect-error - null is not a valid input
  dateFns.from(null)
  // @ts-expect-error - date-slot typo
  dateFns.from({ year: 2020, months: 1, day: 1 })
  // @ts-expect-error - duration-slot typo
  durationFns.from({ month: 1 })
}

// ---------------------------------------------------------------------------
// Format accepts a locale option
// ---------------------------------------------------------------------------
{
  const s1: string = dateFns.format(date, 'yyyy-MM-dd')
  const s2: string = dateFns.format(date, 'yyyy-MM-dd', { locale: 'en-US' })
  void s1
  void s2
}

// ---------------------------------------------------------------------------
// Chain builders accept only Iso strings, not Temporal objects
// ---------------------------------------------------------------------------
{
  dateFns.chain(date).value()
  // @ts-expect-error - chain must not accept Temporal.PlainDate
  dateFns.chain({ year: 2020, month: 1, day: 1 })
  // @ts-expect-error - chain must not accept arbitrary objects
  zonedDateTimeFns.chain({})
}
