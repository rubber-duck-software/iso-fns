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
  return compactDateTimePortion(inst.toString()) as Iso.Instant
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
  try {
    return Temporal.PlainDate.from(item).toString() === item
  } catch {
    return false
  }
}
export function isIsoTime(item: unknown): item is Iso.Time {
  if (typeof item !== 'string') return false
  try {
    return compactTimeOnly(Temporal.PlainTime.from(item).toString()) === compactTimeOnly(item)
  } catch {
    return false
  }
}
export function isIsoDateTime(item: unknown): item is Iso.DateTime {
  if (typeof item !== 'string') return false
  try {
    return compactDateTimePortion(Temporal.PlainDateTime.from(item).toString()) === compactDateTimePortion(item)
  } catch {
    return false
  }
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
  try {
    return compactDateTimePortion(Temporal.Instant.from(item).toString()) === compactDateTimePortion(item)
  } catch {
    return false
  }
}
export function isIsoYearMonth(item: unknown): item is Iso.YearMonth {
  if (typeof item !== 'string') return false
  try {
    return Temporal.PlainYearMonth.from(item).toString() === item
  } catch {
    return false
  }
}
export function isIsoMonthDay(item: unknown): item is Iso.MonthDay {
  if (typeof item !== 'string') return false
  if (!item.startsWith('--')) return false
  try {
    return toIsoMonthDay(Temporal.PlainMonthDay.from(item)) === item
  } catch {
    return false
  }
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
