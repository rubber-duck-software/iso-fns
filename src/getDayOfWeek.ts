import { IsoDate, IsoDateTime } from './iso-types'
import { IsoSplitter } from './utils/isoFlexFunction'
import { IsoDateTimeToJsDate, IsoDateToJsDate } from './utils/jsdateConversions'

function getDayOfWeek(date: IsoDate): number
function getDayOfWeek(dateTime: IsoDateTime): number

function getDayOfWeek(input: string): number {
  return IsoSplitter(input, {
    Date(input) {
      const jsDate = IsoDateToJsDate(input)
      return jsDate.getUTCDay() === 0 ? 7 : jsDate.getUTCDay()
    },
    DateTime(input) {
      const jsDate = IsoDateTimeToJsDate(input)
      return jsDate.getUTCDay() === 0 ? 7 : jsDate.getUTCDay()
    }
  })
}

export default getDayOfWeek
