import { YearMonth } from '../iso-types'
import { length as yearLength } from '../Year/length'
import { getYear } from './get-year'

export function lengthOfYear(yearMonth: YearMonth): number {
  const yearValue = getYear(yearMonth)
  return yearLength(yearValue)
}
