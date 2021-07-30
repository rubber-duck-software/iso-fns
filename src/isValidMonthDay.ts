import { IsoMonthDay } from 'iso-types'
import { IsoMonthDayToJsDate, JsDateToIsoMonthDay } from './utils/jsdateConversions'

export default function isValidMonthDay(monthDay: unknown): monthDay is IsoMonthDay {
  try {
    return monthDay === JsDateToIsoMonthDay(IsoMonthDayToJsDate(monthDay as IsoMonthDay))
  } catch (e) {
    return false
  }
}
