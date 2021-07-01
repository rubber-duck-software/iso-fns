import { YearMonth } from '../iso-types'
import { getYear } from './get-year'
import { isLeap as isYearLeap } from '../Year/is-leap'

export function isLeap(yearMonth: YearMonth): boolean {
  return isYearLeap(getYear(yearMonth))
}
