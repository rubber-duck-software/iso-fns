import fromEpochMilliseconds from './fromEpochMilliseconds'
import { IsoInstant } from 'iso-types'

export default function fromEpochSeconds(epochSeconds: number): IsoInstant {
  return fromEpochMilliseconds(epochSeconds * 1000)
}
