import getFields from './getFields'
import { IsoDateTime, IsoTime } from './iso-types'

function getSecond(dateTime: IsoDateTime): number
function getSecond(time: IsoTime): number

function getSecond(input: any): any {
  return getFields(input).second
}

export default getSecond
