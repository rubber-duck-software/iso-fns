import { IsoInstant } from './iso-types'
import { JsDateToIsoInstant } from './utils/jsdateConversions'

function fromEpochMilliseconds(epochMilliseconds: number): IsoInstant {
  return JsDateToIsoInstant(new Date(epochMilliseconds))
}

export default fromEpochMilliseconds
