import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoDuration } from 'iso-types'
import { IsoDateTimeToJsDate } from './utils/jsdateConversions'
import getDaysInMonth from './getDaysInMonth'
import isoDateTime from './isoDateTime'
import withFields from './withFields'
import getDaysInYear from './getDaysInYear'
import { msPerTimeUnit } from './utils/msPerTimeUnit'
import { getTotalDays } from './utils/getTotalDays'

function total(
  duration: IsoDuration,
  {
    unit,
    relativeTo
  }: {
    unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'
    relativeTo?: IsoDateTime | IsoDate
  }
): number {
  const fields = getFields(duration)

  const days = getTotalDays(fields, relativeTo)

  const totalMilliseconds =
    msPerTimeUnit.day * days +
    msPerTimeUnit.hour * fields.hours +
    msPerTimeUnit.minute * fields.minutes +
    msPerTimeUnit.second * fields.seconds +
    fields.milliseconds
  return millisecondsToUnits(totalMilliseconds, unit, relativeTo)
}

function millisecondsToUnits(
  milliseconds: number,
  unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds',
  relativeTo?: IsoDateTime | IsoDate
): number {
  if (['years', 'months'].includes(unit) && !relativeTo) {
    throw new Error('Totalling years or months requires a reference point, but none was provided')
  } else if (unit === 'milliseconds') {
    return Number(milliseconds)
  } else if (unit === 'seconds') {
    return Number(milliseconds) / 1000
  } else if (unit === 'minutes') {
    return Number(milliseconds) / (1000 * 60)
  } else if (unit === 'hours') {
    return Number(milliseconds) / (1000 * 60 * 60)
  } else if (unit === 'days') {
    return Number(milliseconds) / (1000 * 60 * 60 * 24)
  } else if (unit === 'weeks' && relativeTo) {
    const weeks = Number(milliseconds) / (1000 * 60 * 60 * 24 * 7)
    return weeks
  } else if (unit === 'months' && relativeTo) {
    const sign = milliseconds > 0 ? 1 : -1
    let relative = isoDateTime(relativeTo)
    let absMilliseconds = milliseconds * sign
    let totalInMonths = 0
    while (absMilliseconds > 0) {
      const { month } = getFields(relative)
      const totalDaysInMonth = getDaysInMonth(relative)
      const millisecondsInMonth = totalDaysInMonth * 1000 * 60 * 60 * 24
      const endOfMonth = withFields(relative, {
        month: month + sign,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      const jsDate1 = IsoDateTimeToJsDate(relative)
      const jsDate2 = IsoDateTimeToJsDate(endOfMonth)
      const millisecondsToEnd = jsDate2.getTime() - jsDate1.getTime()
      totalInMonths += absMilliseconds > millisecondsInMonth ? 1 : Number(absMilliseconds) / Number(millisecondsInMonth)
      absMilliseconds -= millisecondsToEnd
      relative = endOfMonth
    }
    return totalInMonths * sign
  } else if (unit === 'years' && relativeTo) {
    const sign = milliseconds > 0 ? 1 : -1
    let relative = isoDateTime(relativeTo)
    let absMilliseconds = milliseconds * sign
    let totalInYears = 0
    while (absMilliseconds > 0) {
      const { year } = getFields(relative)
      const totalDaysInYear = getDaysInYear(relative)
      const millisecondsInYear = totalDaysInYear * 1000 * 60 * 60 * 24
      const endOfYear = withFields(relative, {
        year: year + sign,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
      })
      const jsDate1 = IsoDateTimeToJsDate(relative)
      const jsDate2 = IsoDateTimeToJsDate(endOfYear)
      const millisecondsToEnd = jsDate2.getTime() - jsDate1.getTime()
      totalInYears += absMilliseconds > millisecondsInYear ? 1 : Number(absMilliseconds) / Number(millisecondsInYear)
      absMilliseconds -= millisecondsToEnd
      relative = endOfYear
    }
    return totalInYears * sign
  } else {
    throw new Error(`Unrecognized Unit: ${unit}`)
  }
}

export default total
