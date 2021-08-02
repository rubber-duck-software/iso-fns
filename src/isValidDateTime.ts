import { IsoDateTime } from 'iso-types'
import { IsoDateTimeToJsDate, JsDateToIsoDateTime } from './utils/jsdateConversions'

function isValidDateTime(dateTime: unknown): dateTime is IsoDateTime {
  try {
    const dateTimeFormatOptions = [`${dateTime}:00.000`, `${dateTime}.000`, dateTime]
    return dateTimeFormatOptions.includes(JsDateToIsoDateTime(IsoDateTimeToJsDate(dateTime as IsoDateTime)))
  } catch (e) {
    return false
  }
}

export default isValidDateTime
