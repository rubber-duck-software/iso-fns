import { IsoTime } from './iso-types'
import { IsoTimeToJsDate, JsDateToIsoTime } from './utils/jsdateConversions'

function isValidTime(time: unknown): time is IsoTime {
  try {
    const timeFormatOptions = [`${time}:00.000`, `${time}.000`, time]
    return timeFormatOptions.includes(JsDateToIsoTime(IsoTimeToJsDate(time as IsoTime)))
  } catch (e) {
    return false
  }
}

export default isValidTime
