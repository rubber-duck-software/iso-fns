import {
  LocalizeUnitValuesIndex,
  LocalePatternWidth,
  LocaleUnit,
  LocalizeFn,
  LocalizeUnitIndex,
  LocalizeUnitValues
} from './types'

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

export default function buildLocalizeFn<
  Result extends LocaleUnit,
  ArgCallback extends BuildLocalizeFnArgCallback<Result> | undefined
>(args: BuildLocalizeFnArgs<Result, ArgCallback>): LocalizeFn<Result, ArgCallback> {
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
    // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index]
  }
}
