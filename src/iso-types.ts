type d = number

type YYYY = `${d}${d}${d}${d}`
type MM = `${d}${d}`
type DD = `${d}${d}`
type hh = `${d}${d}`
type mm = `${d}${d}`
type ss = `${d}${d}`
type ssss = `${d}${d}${d}`

type DateFormat = `${YYYY}-${MM}-${DD}`
type TimeFormat = `${hh}:${mm}` | `${hh}:${mm}:${ss}` | `${hh}:${mm}:${ss}.${ssss}`
type InstantFormat = `${DateFormat}T${hh}:${mm}:${ss}.${ssss}Z`
type DateTimeFormat = `${DateFormat}T${TimeFormat}`
type YearMonthFormat = `${YYYY}-${MM}`
type MonthDayFormat = `--${MM}-${DD}`

type DurationYear = `${d}Y` | ''
type DurationMonth = `${d}M` | ''
type DurationWeek = `${d}W` | ''
type DurationDay = `${d}D` | ''
type DurationHour = `${d}H` | ''
type DurationMinute = `${d}M` | ''
type DurationSecond = `${d}S` | `${d}.${d}S` | ''

type DurationDateFormat = `${DurationYear}${DurationMonth}${DurationWeek}${DurationDay}` | ''
type DurationTimeFormat = `T${DurationHour}${DurationMinute}${DurationSecond}` | ''

type DurationFormat = `${'' | '-'}P${DurationDateFormat}${DurationTimeFormat}`

interface Brand extends String {}

export type IsoInstant = InstantFormat & Brand

export type IsoDate = DateFormat & Brand

export type IsoTime = TimeFormat & Brand

export type IsoDateTime = DateTimeFormat & Brand

export type IsoYearMonth = YearMonthFormat & Brand

export type IsoMonthDay = MonthDayFormat & Brand

export type IsoDuration = DurationFormat & Brand
