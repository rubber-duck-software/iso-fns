import { IsoDate, IsoDateTime, IsoInstant, IsoMonthDay, IsoTime, IsoYearMonth } from './iso-types'

export function IsoDateTimeToJsDate(dateTime: IsoDateTime) {
  return new Date(`${dateTime}Z`)
}

export function JsDateToIsoDateTime(jsDate: Date): IsoDateTime {
  return jsDate.toISOString().replace('Z', '') as IsoDateTime
}

export function IsoDateToJsDate(date: IsoDate): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

export function JsDateToIsoDate(jsDate: Date): IsoDate {
  return jsDate.toISOString().substr(0, 10) as IsoDate
}

export function IsoInstantToJsDate(instant: IsoInstant): Date {
  return new Date(instant)
}

export function JsDateToIsoInstant(jsDate: Date): IsoInstant {
  return jsDate.toISOString() as IsoInstant
}

export function IsoMonthDayToJsDate(monthDay: IsoMonthDay): Date {
  return new Date(`2000-${monthDay.toString().substr(2)}T00:00:00.000Z`)
}

export function JsDateToIsoMonthDay(jsDate: Date): IsoMonthDay {
  return `--${jsDate.toISOString().substr(5, 5)}` as IsoMonthDay
}

export function IsoTimeToJsDate(time: IsoTime): Date {
  return new Date(`1970-01-01T${time}Z`)
}

export function JsDateToIsoTime(jsDate: Date): IsoTime {
  const dateClone = new Date(jsDate.getTime())
  dateClone.setUTCFullYear(1970)
  dateClone.setUTCMonth(0)
  dateClone.setUTCDate(0)
  return dateClone.toISOString().substr(11, 12) as IsoTime
}

export function IsoYearMonthToJsDate(yearMonth: IsoYearMonth): Date {
  return new Date(`${yearMonth.toString()}-01T00:00:00.000Z`)
}

export function JsDateToIsoYearMonth(jsDate: Date): IsoYearMonth {
  return jsDate.toISOString().substr(0, 7) as IsoYearMonth
}
