import getFields from './getFields'
import { IsoDateTime, IsoTime } from './iso-types'

function getMinute(dateTime: IsoDateTime): number
function getMinute(time: IsoTime): number

function getMinute(input: any): any {
  return getFields(input).minute
}

export default getMinute
