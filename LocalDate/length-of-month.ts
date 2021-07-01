import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { isLeap as isYearLeap } from '../Year/is-leap'
import { getMonth } from './get-month'
import { length as monthLength } from '../Month/length'

export function lengthOfMonth(localDate: LocalDate): number {
  const month = getMonth(localDate)
  const year = getYear(localDate)
  const leap = isYearLeap(year)
  return monthLength(month, leap)
}
