import { IsoDateTime } from './iso-types'
import isoDateTime from '../isoDateTime'
import { addTemporal } from './addTemporal'
import { divmod } from './divmod'
import { msPerTimeUnit } from './msPerTimeUnit'
import { getTotalDays } from './getTotalDays'

export function BalanceDurationUnits(
  { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 },
  largestUnit: 'auto' | 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond',
  relativeTo?: IsoDateTime
): {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
} {
  const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'] as const

  if (largestUnit === 'auto') {
    const unitIndex = [years, months, weeks, days, hours, minutes, seconds, milliseconds].findIndex((u) => u)
    largestUnit = units[unitIndex === -1 ? 6 : unitIndex]
  }

  if ((years || months || largestUnit === 'year' || largestUnit === 'month') && !relativeTo) {
    throw new Error('Balancing years or months requires a reference point, but none was provided')
  } else {
    const {
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalMilliseconds,
      balancedHours,
      balancedMinutes,
      balancedSeconds,
      balancedMilliseconds
    } = getBalancedTimes(
      {
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
        milliseconds
      },
      relativeTo
    )

    if (largestUnit === 'millisecond') {
      return {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: totalMilliseconds
      }
    } else if (largestUnit === 'second') {
      return {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: totalSeconds,
        milliseconds: balancedMilliseconds
      }
    } else if (largestUnit === 'minute') {
      return {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: totalMinutes,
        seconds: balancedSeconds,
        milliseconds: balancedMilliseconds
      }
    } else if (largestUnit === 'hour') {
      return {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: totalHours,
        minutes: balancedMinutes,
        seconds: balancedSeconds,
        milliseconds: balancedMilliseconds
      }
    } else if (largestUnit === 'day') {
      return {
        years: 0,
        months: 0,
        weeks: 0,
        days: totalDays,
        hours: balancedHours,
        minutes: balancedMinutes,
        seconds: balancedSeconds,
        milliseconds: balancedMilliseconds
      }
    } else if (largestUnit === 'week') {
      const { quotient: totalWeeks, remainder: balancedDays } = divmod(totalDays, 7)
      return {
        years: 0,
        months: 0,
        weeks: totalWeeks,
        days: balancedDays,
        hours: balancedHours,
        minutes: balancedMinutes,
        seconds: balancedSeconds,
        milliseconds: balancedMilliseconds
      }
    } else if (largestUnit === 'month' && relativeTo) {
      const { totalMonths, balancedDays } = getTotalMonths({ years, months, weeks, days }, relativeTo)
      return {
        years: 0,
        months: totalMonths,
        weeks: 0,
        days: balancedDays,
        hours: balancedHours,
        minutes: balancedMinutes,
        seconds: balancedSeconds,
        milliseconds: balancedMilliseconds
      }
    } else if (largestUnit === 'year' && relativeTo) {
      const { totalYears, balancedMonths, balancedDays } = getTotalYears({ years, months, weeks, days }, relativeTo)
      return {
        years: totalYears,
        months: balancedMonths,
        weeks: 0,
        days: balancedDays,
        hours: balancedHours,
        minutes: balancedMinutes,
        seconds: balancedSeconds,
        milliseconds: balancedMilliseconds
      }
    } else {
      throw new Error('Unrecognized input')
    }
  }
}

function getBalancedTimes(
  {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  }: {
    years: number
    months: number
    weeks: number
    days: number
    hours: number
    minutes: number
    seconds: number
    milliseconds: number
  },
  relativeTo: IsoDateTime | undefined
) {
  const totalMilliseconds =
    msPerTimeUnit.day * getTotalDays({ years, months, weeks, days }, relativeTo) +
    msPerTimeUnit.hour * hours +
    msPerTimeUnit.minute * minutes +
    msPerTimeUnit.second * seconds +
    milliseconds

  const { quotient: totalSeconds, remainder: balancedMilliseconds } = divmod(totalMilliseconds, 1000)
  const { quotient: totalMinutes, remainder: balancedSeconds } = divmod(totalSeconds, 60)
  const { quotient: totalHours, remainder: balancedMinutes } = divmod(totalMinutes, 60)
  const { quotient: totalDays, remainder: balancedHours } = divmod(totalHours, 24)
  return {
    totalMilliseconds,
    totalSeconds,
    totalMinutes,
    totalHours,
    totalDays,
    balancedMilliseconds,
    balancedSeconds,
    balancedMinutes,
    balancedHours
  }
}

function getTotalYears(
  fields: {
    years: number
    months: number
    weeks: number
    days: number
  },
  relativeTo: IsoDateTime
): { totalYears: number; balancedMonths: number; balancedDays: number } {
  let relativeDateTime = isoDateTime(relativeTo)
  let balancedDays = getTotalDays(fields, relativeTo)
  let sign = balancedDays < 0 ? -1 : 1
  let totalYears = 0
  let oneYearDays = getTotalDays({ years: sign, months: 0, weeks: 0, days: 0 }, relativeDateTime)

  while (Math.abs(balancedDays) >= Math.abs(oneYearDays)) {
    balancedDays -= oneYearDays
    totalYears += sign
    sign = balancedDays < 0 ? -1 : 1
    relativeDateTime = addTemporal(relativeDateTime, { years: sign })
    oneYearDays = getTotalDays({ years: sign, months: 0, weeks: 0, days: 0 }, relativeDateTime)
  }

  const { balancedDays: monthBalancedDays, totalMonths: balancedMonths } = getTotalMonths(
    { years: 0, months: 0, weeks: 0, days: balancedDays },
    relativeDateTime
  )

  return { totalYears, balancedMonths, balancedDays: monthBalancedDays }
}

function getTotalMonths(
  fields: {
    years: number
    months: number
    weeks: number
    days: number
  },
  relativeTo: IsoDateTime
): { totalMonths: number; balancedDays: number } {
  let relativeDateTime = isoDateTime(relativeTo)
  let balancedDays = getTotalDays(fields, relativeTo)
  let sign = balancedDays < 0 ? -1 : 1
  let totalMonths = 0
  let oneMonthDays = getTotalDays({ years: 0, months: sign, weeks: 0, days: 0 }, relativeDateTime)

  while (Math.abs(balancedDays) >= Math.abs(oneMonthDays)) {
    balancedDays -= oneMonthDays
    totalMonths += sign
    sign = balancedDays < 0 ? -1 : 1
    relativeDateTime = addTemporal(relativeDateTime, { months: sign })
    oneMonthDays = getTotalDays({ years: 0, months: sign, weeks: 0, days: 0 }, relativeDateTime)
  }
  return { totalMonths, balancedDays }
}
