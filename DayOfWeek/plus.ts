import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { ordinal } from './ordinal'

export function plus(dayOfWeek: DayOfWeek, days: number): DayOfWeek {
  const oldOrdinal = ordinal(dayOfWeek)
  const newOrdinal = oldOrdinal + days
  return fromOrdinal(newOrdinal)
}
