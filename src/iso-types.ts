type DateFormat = `${number}-${number}-${number}`
type TimeFormat = `${number}:${number}` | `${number}:${number}:${number}` | `${number}:${number}:${number}.${number}`
type InstantFormat = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`
type DateTimeFormat = `${DateFormat}T${TimeFormat}`

type YearMonthFormat = `${number}-${number}`
type MonthDayFormat = `--${number}-${number}`

type DurationFormat = `${'' | '-'}P${string}`

interface Format {
  'YYYY-MM-DD': DateFormat
  'hh:mm:ss.sss': TimeFormat
  'YYYY-MM-DDThh:mm-ss.sssZ': InstantFormat
  'YYYY-MM-DDThh:mm-ss.sss': DateTimeFormat
  'YYYY-MM': YearMonthFormat
  '--MM-DD': MonthDayFormat
  'P(n)Y(n)M(n)DT(n)H(n)M(n)S': DurationFormat
}

export type IsoInstant = Format['YYYY-MM-DDThh:mm-ss.sssZ'] & string

export type IsoDate = Format['YYYY-MM-DD'] & string

export type IsoTime = Format['hh:mm:ss.sss'] & string

export type IsoDateTime = Format['YYYY-MM-DDThh:mm-ss.sss'] & string

export type IsoYearMonth = Format['YYYY-MM'] & string

export type IsoMonthDay = Format['--MM-DD'] & string

export type IsoDuration = Format['P(n)Y(n)M(n)DT(n)H(n)M(n)S'] & string
