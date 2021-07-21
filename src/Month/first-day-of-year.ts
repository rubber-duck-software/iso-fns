import { Month } from '../iso-types'
import { April, August, December, February, January, July, June, March, May, November, October, September } from './values'

export function firstDayOfYear(month: Month, leapYear: boolean) {
  const leap = leapYear ? 1 : 0
  switch (month) {
    case January:
      return 1
    case February:
      return 32
    case March:
      return 60 + leap
    case April:
      return 91 + leap
    case May:
      return 121 + leap
    case June:
      return 152 + leap
    case July:
      return 182 + leap
    case August:
      return 213 + leap
    case September:
      return 244 + leap
    case October:
      return 274 + leap
    case November:
      return 305 + leap
    case December:
      return 335 + leap
    default:
      throw new Error(`Invalid Month: ${month} is not a valid Month`)
  }
}
