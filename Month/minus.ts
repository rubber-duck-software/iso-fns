import { Month } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { ordinal } from './ordinal'

export function minus(month: Month, months: number): Month {
  const oldOrdinal = ordinal(month)
  const newOrdinal = oldOrdinal - months
  return fromOrdinal(newOrdinal)
}
