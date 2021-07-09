import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'

/**
 * Receives an ordinal value and converts it to a day-of-the-week value assuming 1-indexing.
 * @param dayOfWeek
 * @returns
 */

export function fromOrdinal_1(dayOfWeek: number): DayOfWeek {
  return fromOrdinal(dayOfWeek - 1)
}
