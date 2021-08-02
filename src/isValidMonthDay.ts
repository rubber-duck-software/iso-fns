import { IsoMonthDay } from 'iso-types'
import { IsoMonthDayToJsDate, JsDateToIsoMonthDay } from './utils/jsdateConversions'

function isValidMonthDay(monthDay: unknown): monthDay is IsoMonthDay {
  try {
    return monthDay === JsDateToIsoMonthDay(IsoMonthDayToJsDate(monthDay as IsoMonthDay))
  } catch (e) {
    return false
  }
}

export default isValidMonthDay
