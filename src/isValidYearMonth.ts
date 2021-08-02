import { IsoYearMonth } from 'iso-types'
import { IsoYearMonthToJsDate, JsDateToIsoYearMonth } from './utils/jsdateConversions'

function isValidYearMonth(yearMonth: unknown): yearMonth is IsoYearMonth {
  try {
    return yearMonth === JsDateToIsoYearMonth(IsoYearMonthToJsDate(yearMonth as IsoYearMonth))
  } catch (e) {
    return false
  }
}

export default isValidYearMonth
