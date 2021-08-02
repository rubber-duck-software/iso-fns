import fromEpochMilliseconds from './fromEpochMilliseconds'
import { IsoInstant } from 'iso-types'

function fromEpochSeconds(epochSeconds: number): IsoInstant {
  return fromEpochMilliseconds(epochSeconds * 1000)
}

export default fromEpochSeconds
