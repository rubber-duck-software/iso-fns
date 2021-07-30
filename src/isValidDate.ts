import { IsoDate } from 'iso-types'
import { IsoDateToJsDate, JsDateToIsoDate } from './utils/jsdateConversions'

export default function isValidDate(date: unknown): date is IsoDate {
  try {
    return date === JsDateToIsoDate(IsoDateToJsDate(date as IsoDate))
  } catch (e) {
    return false
  }
}
