import { IsoDate, IsoDateTime } from './iso-types'
import { msPerTimeUnit } from './utils/msPerTimeUnit'
import { IsoSplitter } from './utils/isoFlexFunction'
import { IsoDateTimeToJsDate, IsoDateToJsDate } from './utils/jsdateConversions'

function getWeekOfYear(date: IsoDate): number
function getWeekOfYear(dateTime: IsoDateTime): number

function getWeekOfYear(input: any): number {
  return IsoSplitter(input, {
    Date(input) {
      return ISO8601_week_no(IsoDateToJsDate(input))
    },
    DateTime(input) {
      return ISO8601_week_no(IsoDateTimeToJsDate(input))
    }
  })
}
const MILLISECONDS_IN_WEEK = 604800000

function ISO8601_week_no(date: Date): number {
  const startOfWeek = startOfISOWeek(date)
  const startOfWeekYear = startOfISOWeekYear(date)
  const diff = startOfWeek.getTime() - startOfWeekYear.getTime()

  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1
}

function startOfISOWeek(date: Date): Date {
  const myDate = new Date(date)
  const weekStartsOn = 1
  const day = myDate.getUTCDay()
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn

  myDate.setUTCDate(myDate.getUTCDate() - diff)
  myDate.setUTCHours(0, 0, 0, 0)
  return myDate
}

function startOfISOWeekYear(date: Date): Date {
  const myDate = new Date(date)
  const year = getISOWeekYear(myDate)
  const fourthOfJanuary = new Date(0)
  fourthOfJanuary.setUTCFullYear(year, 0, 4)
  fourthOfJanuary.setUTCHours(0, 0, 0, 0)

  return startOfISOWeek(fourthOfJanuary)
}

function getISOWeekYear(dirtyDate: Date): number {
  const date = new Date(dirtyDate)
  const year = date.getUTCFullYear()

  const fourthOfJanuaryOfNextYear = new Date(0)
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4)
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0)
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear)

  const fourthOfJanuaryOfThisYear = new Date(0)
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4)
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0)
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear)

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year
  } else {
    return year - 1
  }
}

export default getWeekOfYear
