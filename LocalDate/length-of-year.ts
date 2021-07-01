import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { length as yearLength } from '../Year/length'

export function lengthOfYear(localDate: LocalDate): number {
  const year = getYear(localDate)
  return yearLength(year)
}
