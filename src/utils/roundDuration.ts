import { IsoDateTime } from './iso-types'
import isoDateTime from '../isoDateTime'
import { addTemporal } from './addTemporal'
import { BalanceDurationUnits } from './balanceDuration'
import { divmod } from './divmod'
import { getTotalDays } from './getTotalDays'
import { msPerTimeUnit } from './msPerTimeUnit'
import { roundNumberToIncrement } from './roundNumberToIncrement'

export function roundDuration(
  { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 },
  options: {
    largestUnit: 'auto' | 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    smallestUnit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement: number
    roundingMode: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
    relativeTo?: IsoDateTime
  }
) {
  const { smallestUnit, roundingIncrement, largestUnit, roundingMode, relativeTo } = options

  // First convert time units up to days, if rounding to days or higher units.
  // If rounding relative to a ZonedDateTime, then some days may not be 24h.
  if (smallestUnit === 'year' || smallestUnit === 'month' || smallestUnit === 'week' || smallestUnit === 'day') {
    const h = hours
    const m = h * 60 + minutes
    const s = m * 60 + seconds
    const ms = s * 1000 + milliseconds

    const { quotient: deltaDays, remainder: leftOverMs } = divmod(ms, msPerTimeUnit.day)
    days += deltaDays
    hours = 0
    minutes = 0
    seconds = 0
    milliseconds = leftOverMs
  }
  if (smallestUnit === 'year' && relativeTo) {
    const { totalMilliseconds, divisor } = getTotalMillisecondsForYears(
      { years, months, weeks, days, hours, minutes, seconds, milliseconds },
      isoDateTime(relativeTo)
    )
    const rounded = roundNumberToIncrement(totalMilliseconds, divisor * roundingIncrement, roundingMode)
    return BalanceDurationUnits({ years: rounded / Number(divisor) }, largestUnit, relativeTo)
  } else if (smallestUnit === 'year' && !relativeTo) {
    throw new Error('Rounding years or months requires a reference point, but none was provided')
  } else if (smallestUnit === 'month' && relativeTo) {
    const { totalMilliseconds, divisor } = getTotalMillisecondsForMonths(
      { years, months, weeks, days, hours, minutes, seconds, milliseconds },
      isoDateTime(relativeTo)
    )
    const rounded = roundNumberToIncrement(totalMilliseconds, divisor * roundingIncrement, roundingMode)
    return BalanceDurationUnits({ years, months: rounded / Number(divisor) }, largestUnit, relativeTo)
  } else if (smallestUnit === 'month' && !relativeTo) {
    throw new Error('Rounding years or months requires a reference point, but none was provided')
  } else if (smallestUnit === 'week') {
    const divisor = msPerTimeUnit.day * 7
    const totalMilliseconds =
      divisor * weeks +
      msPerTimeUnit.day * days +
      hours * msPerTimeUnit.hour +
      minutes * msPerTimeUnit.minute +
      seconds * msPerTimeUnit.second +
      milliseconds
    const rounded = roundNumberToIncrement(totalMilliseconds, divisor * roundingIncrement, roundingMode)
    return BalanceDurationUnits({ years, months, weeks: rounded / Number(divisor) }, largestUnit, relativeTo)
  } else if (smallestUnit === 'day') {
    const divisor = msPerTimeUnit.day
    const totalMilliseconds =
      divisor * days +
      hours * msPerTimeUnit.hour +
      minutes * msPerTimeUnit.minute +
      seconds * msPerTimeUnit.second +
      milliseconds
    const rounded = roundNumberToIncrement(totalMilliseconds, divisor * roundingIncrement, roundingMode)
    return BalanceDurationUnits({ years, months, weeks, days: rounded / Number(divisor) }, largestUnit, relativeTo)
  } else if (smallestUnit === 'hour') {
    const divisor = msPerTimeUnit.hour
    const totalMilliseconds =
      hours * msPerTimeUnit.hour + minutes * msPerTimeUnit.minute + seconds * msPerTimeUnit.second + milliseconds
    const rounded = roundNumberToIncrement(totalMilliseconds, divisor * roundingIncrement, roundingMode)
    return BalanceDurationUnits({ years, months, weeks, days, hours: rounded / Number(divisor) }, largestUnit, relativeTo)
  } else if (smallestUnit === 'minute') {
    const divisor = msPerTimeUnit.minute
    const totalMilliseconds = minutes * divisor + seconds * msPerTimeUnit.second + milliseconds
    const rounded = roundNumberToIncrement(totalMilliseconds, divisor * roundingIncrement, roundingMode)
    return BalanceDurationUnits(
      { years, months, weeks, days, hours, minutes: rounded / Number(divisor) },
      largestUnit,
      relativeTo
    )
  } else if (smallestUnit === 'second') {
    const divisor = msPerTimeUnit.second
    const totalMilliseconds = seconds * divisor + milliseconds
    const rounded = roundNumberToIncrement(totalMilliseconds, divisor * roundingIncrement, roundingMode)
    return BalanceDurationUnits(
      { years, months, weeks, days, hours, minutes, seconds: rounded / Number(divisor) },
      largestUnit,
      relativeTo
    )
  } else if (smallestUnit === 'millisecond') {
    const totalMilliseconds = milliseconds
    const rounded = roundNumberToIncrement(totalMilliseconds, roundingIncrement, roundingMode)
    return BalanceDurationUnits(
      { years, months, weeks, days, hours, minutes, seconds, milliseconds: rounded },
      largestUnit,
      relativeTo
    )
  } else {
    throw new Error('Unrecognized input')
  }
}

interface DurationFields {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

function getTotalMillisecondsForYears(
  { years, months, weeks, days, hours, minutes, seconds, milliseconds }: DurationFields,
  relativeDateTime: IsoDateTime
) {
  let balancedDays = getTotalDays({ years, months, weeks, days }, relativeDateTime)
  let sign = balancedDays < 0 ? -1 : 1
  let totalYears = 0
  let oneYearDays = Math.abs(getTotalDays({ years: sign, months: 0, weeks: 0, days: 0 }, relativeDateTime))

  while (Math.abs(balancedDays) >= Math.abs(oneYearDays)) {
    balancedDays -= oneYearDays
    totalYears += sign
    sign = balancedDays < 0 ? -1 : 1
    relativeDateTime = addTemporal(relativeDateTime, { years: sign })
    oneYearDays = Math.abs(getTotalDays({ years: sign, months: 0, weeks: 0, days: 0 }, relativeDateTime))
  }
  const divisor = oneYearDays * msPerTimeUnit.day
  const totalMilliseconds =
    divisor * totalYears +
    balancedDays * msPerTimeUnit.day +
    hours * msPerTimeUnit.hour +
    minutes * msPerTimeUnit.minute +
    seconds * msPerTimeUnit.second +
    milliseconds
  return { divisor, totalMilliseconds }
}

function getTotalMillisecondsForMonths(
  { years, months, weeks, days, hours, minutes, seconds, milliseconds }: DurationFields,
  relativeDateTime: IsoDateTime
) {
  let balancedDays = getTotalDays({ years: 0, months, weeks, days }, relativeDateTime)
  let sign = balancedDays < 0 ? -1 : 1
  let totalMonths = 0
  let oneMonthDays = Math.abs(getTotalDays({ years: 0, months: sign, weeks: 0, days: 0 }, relativeDateTime))

  while (Math.abs(balancedDays) >= Math.abs(oneMonthDays)) {
    balancedDays -= oneMonthDays
    totalMonths += sign
    sign = balancedDays < 0 ? -1 : 1
    relativeDateTime = addTemporal(relativeDateTime, { months: sign })
    oneMonthDays = Math.abs(getTotalDays({ years: 0, months: sign, weeks: 0, days: 0 }, relativeDateTime))
  }

  const divisor = oneMonthDays * msPerTimeUnit.day
  const totalMilliseconds =
    divisor * totalMonths +
    balancedDays * msPerTimeUnit.day +
    hours * msPerTimeUnit.hour +
    minutes * msPerTimeUnit.minute +
    seconds * msPerTimeUnit.second +
    milliseconds
  return { divisor, totalMilliseconds }
}
