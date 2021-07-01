import { Year, YearMonth } from '../iso-types'
import { getMonth } from './get-month'
import { ofYearAndMonth } from './of-year-and-month'

export function withYear(yearMonth: YearMonth, year: Year) {
  const month = getMonth(yearMonth)
  return ofYearAndMonth(year, month)
}
