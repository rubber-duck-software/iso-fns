import { IsoDate, IsoDateTime } from 'iso-types'

declare function getYear(date: IsoDate): number
declare function getYear(dateTime: IsoDateTime): number
declare function getYear(yearMonth: IsoYearMonth): number

declare function getMonth(date: IsoDate): number
declare function getMonth(monthDay: IsoMonthDay): number
declare function getMonth(yearMonth: IsoYearMonth): number

declare function getDay(date: IsoDate): number
declare function getDay(dateTime: IsoDateTime): number
declare function getDay(monthDay: IsoMonthDay): number

declare function getHour(dateTime: IsoDateTime): number
declare function getHour(time: IsoTime): number

declare function getMinute(dateTime: IsoDateTime): number
declare function getMinute(time: IsoTime): number

declare function getSecond(dateTime: IsoDateTime): number
declare function getSecond(time: IsoTime): number

declare function getMillisecond(dateTime: IsoDateTime): number
declare function getMillisecond(time: IsoTime): number

declare function getDayOfWeek(date: IsoDate): number
declare function getDayOfWeek(dateTime: IsoDateTime): number

declare function getDayOfYear(date: IsoDate): number
declare function getDayOfYear(dateTime: IsoDateTime): number

declare function getWeekOfYear(date: IsoDate): number
declare function getWeekOfYear(dateTime: IsoDateTime): number

declare function withDate(dateTime: IsoDateTime, date: IsoDate): IsoDateTime

declare function withTime(dateTime: IsoDateTime, time: IsoTime): IsoDateTime

declare function withYearMonth(dateTime: IsoDateTime, yearMonth: IsoYearMonth): IsoDateTime
declare function withYearMonth(date: IsoDate, yearMonth: IsoYearMonth): IsoDate

declare function withMonthDay(date: IsoDate, monthDay: IsoMonthDay): IsoDate
declare function withMonthDay(dateTime: IsoDateTime, monthDay: IsoMonthDay): IsoDateTime

declare function getYears(duration: IsoDuration): number
declare function getMonths(duration: IsoDuration): number
declare function getWeeks(duration: IsoDuration): number
declare function getDays(duration: IsoDuration): number
declare function getHours(duration: IsoDuration): number
declare function getMinutes(duration: IsoDuration): number
declare function getSeconds(duration: IsoDuration): number
declare function getMilliseconds(duration: IsoDuration): number
