import { YearMonth } from '../iso-types'
import { length as monthLength } from '../Month/length'
import { isLeap } from '../Year/is-leap'
import { getMonth } from './get-month'
import { getYear } from './get-year'

export function lengthOfMonth(yearMonth: YearMonth): number {
  const yearValue = getYear(yearMonth)
  const monthValue = getMonth(yearMonth)
  const leap = isLeap(yearValue)
  return monthLength(monthValue, leap)
}
