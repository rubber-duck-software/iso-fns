import getFields from './getFields'
import { IsoDateTime, IsoTime } from './iso-types'
import isValidDateTime from './isValidDateTime'
import isValidTime from './isValidTime'
import { JsDateToIsoTime } from './utils/jsdateConversions'

function isoTime(): IsoTime
function isoTime(fields: { hour: number; minute?: number; second?: number; millisecond?: number }): IsoTime
function isoTime(dateTime: IsoDateTime): IsoTime
function isoTime(input: string): IsoTime

function isoTime(hour: number, minute?: number, second?: number, millisecond?: number): IsoTime

function isoTime(...args: any[]): any {
  if (args.length === 0) {
    return JsDateToIsoTime(new Date())
  } else if (args.length === 1) {
    const input = args[0]
    if (isValidTime(input)) {
      return input
    } else if (isValidDateTime(input)) {
      return isoTime(getFields(input))
    } else if (isTimeFields(input)) {
      const { hour, minute = 0, second = 0, millisecond = 0 } = input
      const date = new Date(0)
      date.setUTCHours(hour)
      date.setUTCMinutes(minute)
      date.setUTCSeconds(second)
      date.setUTCMilliseconds(millisecond)
      return JsDateToIsoTime(date)
    } else if (typeof input === 'number') {
      return isoTime({ hour: args[0] })
    } else {
      throw new Error(`Invalid input: ${input}`)
    }
  } else {
    const [hour = 0, minute = 0, second = 0, millisecond = 0] = args
    return isoTime({ hour, minute, second, millisecond })
  }
}

function isTimeFields(input: any): input is { hour: number; minute?: number; second?: number; millisecond?: number } {
  try {
    return (
      Object.keys(input).includes('hour') &&
      Number.isFinite(input.hour) &&
      (input.minute === undefined || Number.isFinite(input.minute)) &&
      (input.second === undefined || Number.isFinite(input.second)) &&
      (input.millisecond === undefined || Number.isFinite(input.millisecond))
    )
  } catch {
    return false
  }
}

export default isoTime
