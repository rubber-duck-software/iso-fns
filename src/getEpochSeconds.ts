import getEpochMilliseconds from './getEpochMilliseconds'
import { IsoInstant } from 'iso-types'

export default function getEpochSeconds(instant: IsoInstant): number {
  return Math.trunc(getEpochMilliseconds(instant) / 1000)
}
