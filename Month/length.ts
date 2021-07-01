import { Month } from '../iso-types'
import { April, August, December, February, January, July, June, March, May, November, October, September } from './values'

export function length(month: Month, leapYear: boolean) {
  switch (month) {
    case February:
      return leapYear ? 29 : 28
    case April:
    case June:
    case September:
    case November:
      return 30
    case January:
    case March:
    case May:
    case July:
    case August:
    case October:
    case December:
      return 31
    default:
      throw new Error(`Invalid Month: ${month} is not a valid Month`)
  }
}
