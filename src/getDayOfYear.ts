import { IsoDate, IsoDateTime } from 'iso-types'
import { IsoSplitter } from './utils/isoFlexFunction'
import { IsoDateTimeToJsDate, IsoDateToJsDate } from './utils/jsdateConversions'

function getDayOfYear(date: IsoDate): number
function getDayOfYear(dateTime: IsoDateTime): number

function getDayOfYear(input: any): number {
  return IsoSplitter(input, {
    Date(input) {
      const jsDate = IsoDateToJsDate(input)
      const yearStart = new Date(Date.UTC(jsDate.getUTCFullYear(), 0, 0))
      return Math.floor((jsDate.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000))
    },
    DateTime(input) {
      const jsDate = IsoDateTimeToJsDate(input)
      const yearStart = new Date(Date.UTC(jsDate.getUTCFullYear(), 0, 0))
      return Math.floor((jsDate.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000))
    }
  })
}

export default getDayOfYear
