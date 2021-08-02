import { IsoDate, IsoDateTime, IsoDuration, IsoInstant, IsoMonthDay, IsoTime, IsoYearMonth } from '../iso-types'
import isValidInstant from '../isValidInstant'
import isValidDate from '../isValidDate'
import isValidDateTime from '../isValidDateTime'
import isValidDuration from '../isValidDuration'
import isValidMonthDay from '../isValidMonthDay'
import isValidTime from '../isValidTime'
import isValidYearMonth from '../isValidYearMonth'

interface IsoSplitterInput {
  Instant?(input: IsoInstant): any
  DateTime?(dateTime: IsoDateTime): any
  Date?(date: IsoDate): any
  Time?(time: IsoTime): any
  YearMonth?(yearMonth: IsoYearMonth): any
  MonthDay?(monthDay: IsoMonthDay): any
  Duration?(duration: IsoDuration): any
}

export function IsoSplitter(input: any, splitter: IsoSplitterInput): any {
  if (isValidInstant(input) && typeof splitter.Instant === 'function') {
    return splitter.Instant(input)
  } else if (isValidDateTime(input) && typeof splitter.DateTime === 'function') {
    return splitter.DateTime(input)
  } else if (isValidDate(input) && typeof splitter.Date === 'function') {
    return splitter.Date(input)
  } else if (isValidTime(input) && typeof splitter.Time === 'function') {
    return splitter.Time(input)
  } else if (isValidYearMonth(input) && typeof splitter.YearMonth === 'function') {
    return splitter.YearMonth(input)
  } else if (isValidMonthDay(input) && typeof splitter.MonthDay === 'function') {
    return splitter.MonthDay(input)
  } else if (isValidDuration(input) && typeof splitter.Duration === 'function') {
    return splitter.Duration(input)
  } else {
    throw new Error(`Invalid input: ${input}`)
  }
}
