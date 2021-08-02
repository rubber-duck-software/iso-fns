import { IsoDateTime, IsoTime } from 'iso-types'
import getFields from './getFields'

function getHour(dateTime: IsoDateTime): number
function getHour(time: IsoTime): number

function getHour(input: any): any {
  return getFields(input).hour
}

export default getHour
