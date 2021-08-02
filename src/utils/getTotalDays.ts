import getFields from '../getFields'
import { IsoDateTime, IsoDate } from '../iso-types'
import isoDate from '../isoDate'
import { getDaysInMonthByNumber } from './getDaysInMonthByNumber'
import { getIsLeapByYearNumber } from './getIsLeapByYearNumber'
import { IsoDateToJsDate } from './jsdateConversions'

export function getTotalDays(
  fields: {
    years: number
    months: number
    weeks: number
    days: number
  },
  relativeTo: IsoDateTime | IsoDate | undefined
): number {
  const { years, months, weeks, days } = fields

  if ((years || months) && !relativeTo) {
    throw new Error('Totalling years or months requires a reference point, but none was provided')
  } else if ((years || months) && relativeTo) {
    const relativeToDate = isoDate(relativeTo)
    let { year, month, day } = getFields(relativeToDate)
    const jsDate1 = IsoDateToJsDate(relativeToDate)
    const jsDate2 = IsoDateToJsDate(relativeToDate)
    jsDate2.setUTCDate(1)
    jsDate2.setUTCFullYear(year + years)
    jsDate2.setUTCMonth(month + months - 1)

    const maxDays = getDaysInMonthByNumber(jsDate2.getUTCMonth() + 1, getIsLeapByYearNumber(jsDate2.getUTCFullYear()))
    if (day > maxDays) {
      day = maxDays
    }

    jsDate2.setUTCDate(day + weeks * 7 + days)

    const Difference_In_Time = jsDate2.getTime() - jsDate1.getTime()
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)
    return Difference_In_Days
  } else {
    return fields.days + fields.weeks * 7
  }
}
