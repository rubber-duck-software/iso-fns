import { Month } from '../iso-types'
import { January, February, March, April, May, June, July, August, September, October, November, December } from './values'

export function getValue(month: Month): number {
  switch (month) {
    case January:
      return 1
    case February:
      return 2
    case March:
      return 3
    case April:
      return 4
    case May:
      return 5
    case June:
      return 6
    case July:
      return 7
    case August:
      return 8
    case September:
      return 9
    case October:
      return 10
    case November:
      return 11
    case December:
      return 12
    default:
      throw new Error(`Invalid Month: ${month} is not a valid Month`)
  }
}
