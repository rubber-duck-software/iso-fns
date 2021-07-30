import { IsoInstant } from 'iso-types'
import { IsoInstantToJsDate } from './utils/jsdateConversions'

export default function getEpochMilliseconds(instant: IsoInstant): number {
  return IsoInstantToJsDate(instant).getTime()
}
