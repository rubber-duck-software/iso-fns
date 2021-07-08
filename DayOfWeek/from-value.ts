import { DayOfWeek } from '../iso-types'
import { fromOrdinal } from './from-ordinal'

/**
 * This seems to try to convert a "dirty" value to a way-of-week month. However, if it is adding 1 to the dirty month day-of-week, it will not return an accurate day.
 *    (e.g. if a user passes 1 with the intention of having it converted to Sunday, which is ordinal 0, they would instead receive Tuesday.)
 * @param dirtyValue
 * @returns
 */

export function fromValue(dirtyValue: number): DayOfWeek {
  return fromOrdinal(dirtyValue + 1)
}
