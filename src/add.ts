import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoDuration, IsoInstant, IsoTime, IsoYearMonth } from 'iso-types'
import isoDuration from './isoDuration'
import isValidDuration from './isValidDuration'
import { BalanceDurationUnits } from './utils/balanceDuration'
import { addTemporal } from './utils/addTemporal'

function add(
  instant: IsoInstant,
  duration: {
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }
): IsoInstant

function add(instant: IsoInstant, duration: IsoDuration): IsoInstant

function add(
  dateTime: IsoDateTime,
  duration: {
    years?: number
    months?: number
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDateTime

function add(dateTime: IsoDateTime, duration: IsoDuration, options?: { overflow?: 'constrain' | 'reject' }): IsoDateTime

function add(
  date: IsoDate,
  duration: {
    years?: number
    months?: number
    weeks?: number
    days?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDate

function add(date: IsoDate, duration: IsoDuration, options?: { overflow?: 'constrain' | 'reject' }): IsoDate

function add(
  time: IsoTime,
  duration: {
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }
): IsoTime

function add(time: IsoTime, duration: IsoDuration): IsoTime

function add(
  yearMonth: IsoYearMonth,
  duration: {
    years?: number
    months?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoYearMonth

function add(yearMonth: IsoYearMonth, duration: IsoDuration, options?: { overflow?: 'constrain' | 'reject' }): IsoYearMonth

function add(duration1: IsoDuration, duration2: IsoDuration, options?: { relativeTo?: IsoDateTime | IsoDate }): IsoDuration

function add(input: any, duration: any, options = {}): any {
  if (isValidDuration(input)) {
    return addDurations(input, duration, options)
  } else {
    return addTemporal(input, duration, options)
  }
}

function addDurations(duration1: any, duration2: any, options: any): any {
  const {
    years: years1,
    months: months1,
    weeks: weeks1,
    days: days1,
    hours: hours1,
    minutes: minutes1,
    seconds: seconds1,
    milliseconds: milliseconds1
  } = getFields(isoDuration(duration1))
  const {
    years: years2,
    months: months2,
    weeks: weeks2,
    days: days2,
    hours: hours2,
    minutes: minutes2,
    seconds: seconds2,
    milliseconds: milliseconds2
  } = getFields(isoDuration(duration2))

  return isoDuration(
    BalanceDurationUnits(
      {
        years: years1 + years2,
        months: months1 + months2,
        weeks: weeks1 + weeks2,
        days: days1 + days2,
        hours: hours1 + hours2,
        minutes: minutes1 + minutes2,
        seconds: seconds1 + seconds2,
        milliseconds: milliseconds1 + milliseconds2
      },
      'auto',
      options.relativeTo
    )
  )
}

export default add
