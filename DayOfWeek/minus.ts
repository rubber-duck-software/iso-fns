import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'
import { ordinal } from './ordinal'

/**
 * Removes a given number of days from a day of the week.
 * (e.g. Friday - 5 = Sunday)
 * @param dayOfWeek
 * @param days
 * @returns
 */

export function minus(dayOfWeek: DayOfWeek, days: number): DayOfWeek {
  const oldOrdinal = ordinal(dayOfWeek)
  const newOrdinal = oldOrdinal - days
  return fromOrdinal(newOrdinal)
}
