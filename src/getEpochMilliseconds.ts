import { IsoInstant } from 'iso-types'
import { IsoInstantToJsDate } from './utils/jsdateConversions'

function getEpochMilliseconds(instant: IsoInstant): number {
  return IsoInstantToJsDate(instant).getTime()
}

export default getEpochMilliseconds
