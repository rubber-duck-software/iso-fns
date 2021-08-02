import getFields from './getFields'
import { IsoDateTime, IsoTime } from 'iso-types'

function getMillisecond(dateTime: IsoDateTime): number
function getMillisecond(time: IsoTime): number

function getMillisecond(input: any): any {
  return getFields(input).millisecond
}

export default getMillisecond
