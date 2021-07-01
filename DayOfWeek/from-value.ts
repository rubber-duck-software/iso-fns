import { Month } from '../iso-types'
import { fromOrdinal } from './from-ordinal'

export function fromValue(dirtyValue: number): Month {
  return fromOrdinal(dirtyValue + 1)
}
