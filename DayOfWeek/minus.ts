import { DayOfWeek, Month } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { ordinal } from './ordinal'

export function minus(dayOfWeek: DayOfWeek, days: number): DayOfWeek {
  const oldOrdinal = ordinal(dayOfWeek)
  const newOrdinal = oldOrdinal - days
  return fromOrdinal(newOrdinal)
}
