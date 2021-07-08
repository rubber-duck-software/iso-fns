import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { ordinal } from './ordinal'

/**
 * Adds a given number of days to a give day of the week
 * (e.g. Tuesday + 3 = Friday)
 * @param dayOfWeek
 * @param days
 * @returns
 */

export function plus(dayOfWeek: DayOfWeek, days: number): DayOfWeek {
  const oldOrdinal = ordinal(dayOfWeek)
  const newOrdinal = oldOrdinal + days
  return fromOrdinal(newOrdinal)
}
