import type {
  DayIndex,
  FormatLong,
  FormatLongFn,
  FormatLongWidth,
  Locale,
  LocalePatternWidth,
  LocaleUnit,
  Localize,
  LocalizeFn,
  LocalizeUnitIndex,
  LocalizeUnitValues,
  LocalizeUnitValuesIndex,
  QuarterIndex
} from './types'

const registry = new Map<string, Locale>()

export function registerLocale(locale: Locale): void {
  registry.set(locale.code, locale)
}

export function getLocale(code: string): Locale {
  const found = registry.get(code)
  if (!found) throw new RangeError(`Unknown locale: ${code}. Register it with registerLocale() first.`)
  return found
}

export function getDefaultLocale(): Locale {
  return enUS
}

// ---------------------------------------------------------------------------
// en-US locale
// ---------------------------------------------------------------------------

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true
// for the language you're working on. Generally, formatted dates should look
// like they are in the middle of a sentence, e.g. in Spanish the weekdays and
// months should be lowercase.

const ERA_VALUES = {
  narrow: ['B', 'A'] as const,
  abbreviated: ['BC', 'AD'] as const,
  wide: ['Before Christ', 'Anno Domini'] as const
}

const QUARTER_VALUES = {
  narrow: ['1', '2', '3', '4'] as const,
  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'] as const,
  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'] as const
}

const MONTH_VALUES = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const,
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const,
  wide: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ] as const
}

// Monday-first, so `DAY_VALUES[width][dayOfWeek - 1]` resolves a Temporal
// dayOfWeek (1 = Mon … 7 = Sun) to its localized name.
const DAY_VALUES = {
  narrow: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const,
  short: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const,
  abbreviated: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const,
  wide: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
}

const DAY_PERIOD_VALUES = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  }
}

const FORMATTING_DAY_PERIOD_VALUES = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  }
}

const ordinalNumber: LocalizeFn<number, undefined> = (dirtyNumber) => {
  const number = Number(dirtyNumber)
  const rem100 = number % 100
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st'
      case 2:
        return number + 'nd'
      case 3:
        return number + 'rd'
    }
  }
  return number + 'th'
}

const localize: Localize = {
  ordinalNumber,
  era: buildLocalizeFn({ values: ERA_VALUES, defaultWidth: 'wide' }),
  quarter: buildLocalizeFn({
    values: QUARTER_VALUES,
    defaultWidth: 'wide',
    argumentCallback: (quarter) => (quarter - 1) as QuarterIndex
  }),
  month: buildLocalizeFn({ values: MONTH_VALUES, defaultWidth: 'wide' }),
  day: buildLocalizeFn({
    values: DAY_VALUES,
    defaultWidth: 'wide',
    argumentCallback: (day) => (day - 1) as DayIndex
  }),
  dayPeriod: buildLocalizeFn({
    values: DAY_PERIOD_VALUES,
    defaultWidth: 'wide',
    formattingValues: FORMATTING_DAY_PERIOD_VALUES,
    defaultFormattingWidth: 'wide'
  })
}

const DATE_FORMATS = {
  full: 'iiii, MMMM do, y',
  long: 'MMMM do, y',
  medium: 'MMM d, y',
  short: 'MM/dd/yyyy'
}

const TIME_FORMATS = {
  full: 'h:mm:ss a zzzz',
  long: 'h:mm:ss a z',
  medium: 'h:mm:ss a',
  short: 'h:mm a'
}

const DATE_TIME_FORMATS = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}'
}

const formatLong: FormatLong = {
  date: buildFormatLongFn({ formats: DATE_FORMATS, defaultWidth: 'full' }),
  time: buildFormatLongFn({ formats: TIME_FORMATS, defaultWidth: 'full' }),
  dateTime: buildFormatLongFn({ formats: DATE_TIME_FORMATS, defaultWidth: 'full' })
}

export const enUS: Locale = {
  formatLong,
  code: 'en-US',
  localize,
  options: {
    weekStartsOn: 7 /* Sunday, in Temporal's Mon=1…Sun=7 numbering */,
    firstWeekContainsDate: 1
  }
}

registry.set(enUS.code, enUS)

// ---------------------------------------------------------------------------
// Locale construction helpers
// ---------------------------------------------------------------------------

type LocalizePeriodValuesMap<Unit extends LocaleUnit> = {
  [pattern in LocalePatternWidth]?: LocalizeUnitValues<Unit>
}

type BuildLocalizeFnArgCallback<Result extends LocaleUnit | number> = (value: Result) => LocalizeUnitIndex<Result>

type BuildLocalizeFnArgs<Result extends LocaleUnit, ArgCallback extends BuildLocalizeFnArgCallback<Result> | undefined> = {
  values: LocalizePeriodValuesMap<Result>
  defaultWidth: LocalePatternWidth
  formattingValues?: LocalizePeriodValuesMap<Result>
  defaultFormattingWidth?: LocalePatternWidth
} & (ArgCallback extends undefined
  ? { argumentCallback?: undefined }
  : { argumentCallback: BuildLocalizeFnArgCallback<Result> })

function buildLocalizeFn<Result extends LocaleUnit, ArgCallback extends BuildLocalizeFnArgCallback<Result> | undefined>(
  args: BuildLocalizeFnArgs<Result, ArgCallback>
): LocalizeFn<Result, ArgCallback> {
  return (dirtyIndex, dirtyOptions) => {
    const options = dirtyOptions || {}
    const context = options.context ? String(options.context) : 'standalone'

    let valuesArray: LocalizeUnitValues<Result>
    if (context === 'formatting' && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth
      const width = (options.width ? String(options.width) : defaultWidth) as LocalePatternWidth
      valuesArray = (args.formattingValues[width] || args.formattingValues[defaultWidth]) as LocalizeUnitValues<Result>
    } else {
      const defaultWidth = args.defaultWidth
      const width = (options.width ? String(options.width) : args.defaultWidth) as LocalePatternWidth
      valuesArray = (args.values[width] || args.values[defaultWidth]) as LocalizeUnitValues<Result>
    }
    const index = (
      args.argumentCallback
        ? args.argumentCallback(dirtyIndex as Result)
        : (dirtyIndex as LocalizeUnitIndex<Result> as unknown)
    ) as LocalizeUnitValuesIndex<typeof valuesArray>
    // @ts-ignore: TypeScript can't match this, no matter how hard we try.
    return valuesArray[index]
  }
}

interface BuildFormatLongFnArgs {
  formats: { [format in FormatLongWidth]: string }
  defaultWidth: FormatLongWidth
}

function buildFormatLongFn(args: BuildFormatLongFnArgs): FormatLongFn {
  return (options = {}) => {
    const width = options.width ? (String(options.width) as FormatLongWidth) : args.defaultWidth
    const format = args.formats[width] || args.formats[args.defaultWidth]
    return format
  }
}
