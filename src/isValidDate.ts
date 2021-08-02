import { IsoDate } from 'iso-types'
import { IsoDateToJsDate, JsDateToIsoDate } from './utils/jsdateConversions'

function isValidDate(date: unknown): date is IsoDate {
  try {
    return date === JsDateToIsoDate(IsoDateToJsDate(date as IsoDate))
  } catch (e) {
    return false
  }
}

export default isValidDate
