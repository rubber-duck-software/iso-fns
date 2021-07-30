import add from './add'
import { IsoDate, IsoDateTime, IsoDuration, IsoInstant, IsoTime, IsoYearMonth } from 'iso-types'
import isoDuration from './isoDuration'
import negate from './negate'

export default function subtract(
  instant: IsoInstant,
  duration: {
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }
): IsoInstant
export default function subtract(instant: IsoInstant, duration: IsoDuration): IsoInstant

export default function subtract(
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
export default function subtract(
  dateTime: IsoDateTime,
  duration: IsoDuration,
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDateTime

export default function subtract(
  date: IsoDate,
  duration: {
    years?: number
    months?: number
    weeks?: number
    days?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDate
export default function subtract(
  date: IsoDate,
  duration: IsoDuration,
  options?: { overflow?: 'constrain' | 'reject' }
): IsoDate

export default function subtract(
  time: IsoTime,
  duration: {
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
  }
): IsoTime
export default function subtract(time: IsoTime, duration: IsoDuration): IsoTime

export default function subtract(
  yearMonth: IsoYearMonth,
  duration: {
    years?: number
    months?: number
  },
  options?: { overflow?: 'constrain' | 'reject' }
): IsoYearMonth
export default function subtract(
  yearMonth: IsoYearMonth,
  duration: IsoDuration,
  options?: { overflow?: 'constrain' | 'reject' }
): IsoYearMonth

export default function subtract(
  duration1: IsoDuration,
  duration2: IsoDuration,
  options?: { relativeTo?: IsoDateTime | IsoDate }
): IsoDuration

export default function subtract(input: any, duration: any, options: any = undefined): any {
  return add(input, negate(isoDuration(duration)), options)
}
