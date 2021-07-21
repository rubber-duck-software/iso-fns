import { Month, YearMonth } from '../iso-types'
import { getYear } from './get-year'
import { ofYearAndMonth } from './of-year-and-month'

export function withMonth(yearMonth: YearMonth, month: Month) {
  const year = getYear(yearMonth)
  return ofYearAndMonth(year, month)
}
