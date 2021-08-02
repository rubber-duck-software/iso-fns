import getEpochMilliseconds from './getEpochMilliseconds'
import { IsoInstant } from './iso-types'

function getEpochSeconds(instant: IsoInstant): number {
  return Math.trunc(getEpochMilliseconds(instant) / 1000)
}

export default getEpochSeconds
