import { IsoInstant } from 'iso-types'
import { JsDateToIsoInstant } from './utils/jsdateConversions'

export default function fromEpochMilliseconds(epochMilliseconds: number): IsoInstant {
  return JsDateToIsoInstant(new Date(epochMilliseconds))
}
