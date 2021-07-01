import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { isLeap as isYearLeap } from '../Year/is-leap'

export function isLeap(yearMonth: LocalDate): boolean {
  return isYearLeap(getYear(yearMonth))
}
