import { Month } from '../iso-types'
import { April, August, December, February, January, July, June, March, May, November, October, September } from './values'

export function firstMonthOfQuarter(month: Month) {
  switch (month) {
    case January:
    case February:
    case March:
      return January
    case April:
    case May:
    case June:
      return April
    case July:
    case August:
    case September:
      return July
    case October:
    case November:
    case December:
      return October
    default:
      throw new Error(`Invalid Month: ${month} is not a valid Month`)
  }
}
