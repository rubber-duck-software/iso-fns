import { YearMonth } from '../iso-types'
import { ordinal as ordinal } from '../Month/ordinal'
import { getMonth } from './get-month'

export function monthOrdinal(yearMonth: YearMonth): number {
  const month = getMonth(yearMonth)
  return ordinal(month)
}
