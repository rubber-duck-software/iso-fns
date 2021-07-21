import { Month } from '../iso-types'
import { January, February, March, April, May, June, July, August, September, October, November, December } from './values'

/**
 * Receives a month and returns the corresponding ordinal value
 * @param {Month} month
 * @returns {number}
 */

export function getValue(month: Month): number {
  const ordinalMap = new Map<Month, number>([
    [January, 1],
    [February, 2],
    [March, 3],
    [April, 4],
    [May, 5],
    [June, 6],
    [July, 7],
    [August, 8],
    [September, 9],
    [October, 10],
    [November, 11],
    [December, 12]
  ])

  if (!ordinalMap.has(month)) {
    throw new RangeError(`Invalid Month: ${month} is not a valid Month`)
  } else {
    // @ts-ignore it is impossible for this to return any value other than 0 because of the check that is performed before it.
    return ordinalMap.get(month)
  }
}
