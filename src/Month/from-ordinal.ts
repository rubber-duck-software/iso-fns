import { Month } from '../iso-types'
import { January, February, March, April, May, June, July, August, September, October, November, December } from './values'

export function fromOrdinal(dirtyOrdinal: number): Month {
  const ordinal = dirtyOrdinal < 0 ? (dirtyOrdinal % 12) + 12 : dirtyOrdinal % 12
  switch (ordinal) {
    case 0:
      return January
    case 1:
      return February
    case 2:
      return March
    case 3:
      return April
    case 4:
      return May
    case 5:
      return June
    case 6:
      return July
    case 7:
      return August
    case 8:
      return September
    case 9:
      return October
    case 10:
      return November
    case 11:
      return December
    default:
      throw new Error(`Invalid Month ordinal: ${dirtyOrdinal} is not a valid Month ordinal`)
  }
}
