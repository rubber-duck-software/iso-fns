import { IsoInstant } from 'iso-types'
import { IsoInstantToJsDate, JsDateToIsoInstant } from './utils/jsdateConversions'

function isValidInstant(instant: unknown): instant is IsoInstant {
  try {
    return instant === JsDateToIsoInstant(IsoInstantToJsDate(instant as IsoInstant))
  } catch (e) {
    return false
  }
}

export default isValidInstant
