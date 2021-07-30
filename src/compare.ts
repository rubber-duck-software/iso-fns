import { IsoInstant, IsoTime, IsoDate, IsoYearMonth, IsoMonthDay, IsoDuration, IsoDateTime } from 'iso-types'
import isValidDate from './isValidDate'
import isValidDateTime from './isValidDateTime'
import isValidDuration from './isValidDuration'
import isValidInstant from './isValidInstant'
import isValidMonthDay from './isValidMonthDay'
import isValidTime from './isValidTime'
import isValidYearMonth from './isValidYearMonth'
import total from './total'

export default function compare(instantLeft: IsoInstant, instantRight: IsoInstant): number
export default function compare(dateTimeLeft: IsoDateTime, dateTimeRight: IsoDateTime): number
export default function compare(dateLeft: IsoDate, dateRight: IsoDate): number
export default function compare(timeLeft: IsoTime, dateRight: IsoTime): number
export default function compare(yearMonthLeft: IsoYearMonth, yearMonthRight: IsoYearMonth): number
export default function compare(monthDayLeft: IsoMonthDay, monthDayRight: IsoMonthDay): number
export default function compare(
  durationLeft: IsoDuration,
  durationRight: IsoDuration,
  options?: {
    relativeTo?: IsoDateTime | IsoDate
  }
): number

export default function compare(left: string, right: string, options: any = {}) {
  const temporalValidationFunctions = [
    isValidInstant,
    isValidDateTime,
    isValidDate,
    isValidTime,
    isValidYearMonth,
    isValidMonthDay
  ]
  if (temporalValidationFunctions.some((V) => V(left) && V(right))) {
    if (left < right) {
      return -1
    } else if (left > right) {
      return 1
    } else {
      return 0
    }
  } else if (isValidDuration(left) && isValidDuration(right)) {
    const leftTotal = total(left, { unit: 'milliseconds', relativeTo: options['relativeTo'] })
    const rightTotal = total(right, { unit: 'milliseconds', relativeTo: options['relativeTo'] })
    if (leftTotal < rightTotal) {
      return -1
    } else if (leftTotal > rightTotal) {
      return 1
    } else {
      return 0
    }
  } else {
    throw new Error(`Invalid inputs: ${left}, ${right}`)
  }
}
