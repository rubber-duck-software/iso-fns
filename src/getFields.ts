import { IsoDate, IsoDateTime, IsoDuration, IsoMonthDay, IsoTime, IsoYearMonth } from 'iso-types'
import { IsoSplitter } from './utils/isoFlexFunction'
import {
  IsoDateTimeToJsDate,
  IsoDateToJsDate,
  IsoMonthDayToJsDate,
  IsoTimeToJsDate,
  IsoYearMonthToJsDate
} from './utils/jsdateConversions'

export default function getFields(dateTime: IsoDateTime): {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}

export default function getFields(date: IsoDate): {
  year: number
  month: number
  day: number
}

export default function getFields(time: IsoTime): {
  hour: number
  minute: number
  second: number
  millisecond: number
}

export default function getFields(yearMonth: IsoYearMonth): {
  year: number
  month: number
}

export default function getFields(monthDay: IsoMonthDay): {
  month: number
  day: number
}

export default function getFields(duration: IsoDuration): {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export default function getFields(input: any) {
  return IsoSplitter(input, {
    DateTime(input) {
      const parsed = IsoDateTimeToJsDate(input)
      return {
        year: parsed.getUTCFullYear(),
        month: parsed.getUTCMonth() + 1,
        day: parsed.getUTCDate(),
        hour: parsed.getUTCHours(),
        minute: parsed.getUTCMinutes(),
        second: parsed.getUTCSeconds(),
        millisecond: parsed.getUTCMilliseconds()
      }
    },
    Date(input) {
      const parsed = IsoDateToJsDate(input)
      return {
        year: parsed.getUTCFullYear(),
        month: parsed.getUTCMonth() + 1,
        day: parsed.getUTCDate()
      }
    },
    Time(input) {
      const parsed = IsoTimeToJsDate(input)
      return {
        hour: parsed.getUTCHours(),
        minute: parsed.getUTCMinutes(),
        second: parsed.getUTCSeconds(),
        millisecond: parsed.getUTCMilliseconds()
      }
    },
    YearMonth(input) {
      const parsed = IsoYearMonthToJsDate(input)
      return {
        year: parsed.getUTCFullYear(),
        month: parsed.getUTCMonth() + 1
      }
    },
    MonthDay(input) {
      const parsed = IsoMonthDayToJsDate(input)
      return {
        month: parsed.getUTCMonth() + 1,
        day: parsed.getUTCDate()
      }
    },
    Duration(input) {
      const parsed = parseDuration(input)
      return parsed
    }
  })
}

function parseDuration(duration: IsoDuration): {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
} {
  if (duration.startsWith('-')) {
    const parsed = parsePositiveDuration(duration.substr(1) as IsoDuration)
    return Object.keys(parsed).reduce((acc, key) => {
      return {
        ...acc,
        [key]: parsed[key] * -1
      }
    }, {}) as any
  } else {
    const parsed = parsePositiveDuration(duration)
    return parsed as any
  }
}

function parsePositiveDuration(duration: IsoDuration): Record<string, number> {
  const durationStr = duration.replace('P', '')
  const defaultDuration = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
  if (durationStr.includes('T')) {
    const [dateSegment, timeSegment] = durationStr.split('T')
    return {
      ...defaultDuration,
      ...parseDateSegment(dateSegment),
      ...parseTimeSegment(timeSegment)
    }
  } else {
    return {
      ...defaultDuration,
      ...parseDateSegment(durationStr)
    }
  }
}

function parseDateSegment(duration: string): Record<string, number> {
  return parseDurationSegments(duration, [
    { character: 'Y', key: 'years' },
    { character: 'M', key: 'months' },
    { character: 'W', key: 'weeks' },
    { character: 'D', key: 'days' }
  ])
}

function parseTimeSegment(duration: string): Record<string, number> {
  return parseDurationSegments(duration, [
    { character: 'H', key: 'hours' },
    { character: 'M', key: 'minutes' },
    { character: 'S', key: 'seconds' }
  ])
}

function parseDurationSegments(duration: string, segments: { character: string; key: string }[]): Record<string, number> {
  const values: Record<string, number> = {}
  segments.reduce((d, segment) => {
    const { character, key } = segment
    if (d.includes(character)) {
      const index = d.indexOf(character)
      const value = d.substring(0, index)
      if (character === 'S' && value.includes('.')) {
        const [s, ms] = value.split('.')
        values[key] = Number(s)
        values['milliseconds'] = Number(`.${ms}`) * 1000
        return d.substring(index + 1)
      } else {
        values[key] = Number(value)
        return d.substring(index + 1)
      }
    } else {
      values[key] = 0
      return d
    }
  }, duration)
  return values
}
