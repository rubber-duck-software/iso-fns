type Era = 0 | 1

type Quarter = 1 | 2 | 3 | 4

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

type LocaleOrdinalUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | 'date' | 'dayOfYear'

export type LocalePatternWidth = 'narrow' | 'short' | 'abbreviated' | 'wide' | 'any'

export type LocaleDayPeriod = 'am' | 'pm' | 'midnight' | 'noon' | 'morning' | 'afternoon' | 'evening' | 'night'

export type LocaleUnit = Era | Quarter | Month | Day | LocaleDayPeriod

export type LocalizeFn<
  Result extends LocaleUnit | number,
  ArgCallback extends BuildLocalizeFnArgCallback<Result> | undefined
> = (
  value: ArgCallback extends undefined ? Result : LocalizeUnitIndex<Result>,
  options?: {
    width?: LocalePatternWidth
    context?: 'formatting' | 'standalone'
    unit?: LocaleOrdinalUnit
  }
) => string

type LocalizeEraValues = readonly [string, string]

type LocalizeQuarterValues = readonly [string, string, string, string]

type LocalizeDayValues = readonly [string, string, string, string, string, string, string]

type LocalizeMonthValues = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
]

export type LocalizeUnitValuesIndex<Values extends LocalizeUnitValues<any>> = Values extends Record<LocaleDayPeriod, string>
  ? string
  : Values extends LocalizeEraValues
  ? Era
  : Values extends LocalizeQuarterValues
  ? QuarterIndex
  : Values extends LocalizeDayValues
  ? Day
  : Values extends LocalizeMonthValues
  ? Month
  : never

export type LocalizeUnitValues<Unit extends LocaleUnit> = Unit extends LocaleDayPeriod
  ? Record<LocaleDayPeriod, string>
  : Unit extends Era
  ? LocalizeEraValues
  : Unit extends Quarter
  ? LocalizeQuarterValues
  : Unit extends Day
  ? LocalizeDayValues
  : Unit extends Month
  ? LocalizeMonthValues
  : never

export type LocalizeUnitIndex<Unit extends LocaleUnit | number> = Unit extends LocaleUnit
  ? LocalizeUnitValuesIndex<LocalizeUnitValues<Unit>>
  : number

export type QuarterIndex = 0 | 1 | 2 | 3

type BuildLocalizeFnArgCallback<Result extends LocaleUnit | number> = (value: Result) => LocalizeUnitIndex<Result>

export interface Localize {
  ordinalNumber: LocalizeFn<number, BuildLocalizeFnArgCallback<number> | undefined>
  era: LocalizeFn<Era, undefined>
  quarter: LocalizeFn<Quarter, BuildLocalizeFnArgCallback<Quarter>>
  month: LocalizeFn<Month, undefined>
  day: LocalizeFn<Day, undefined>
  dayPeriod: LocalizeFn<LocaleDayPeriod, undefined>
}

export type FormatLongWidth = 'full' | 'long' | 'medium' | 'short'

interface FormatLongFnOptions {
  width?: FormatLongWidth
}

export type FormatLongFn = (options: FormatLongFnOptions) => string

export interface FormatLong {
  date: FormatLongFn
  time: FormatLongFn
  dateTime: FormatLongFn
}
