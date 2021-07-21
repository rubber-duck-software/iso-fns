import { YearMonth } from '../iso-types'
import { getMonth } from './get-month'
import { getYear } from './get-year'
import { ofYearAndMonth } from './of-year-and-month'

export function minusYears(yearMonth: YearMonth, yearsToSubtract: number): YearMonth {
  const year = getYear(yearMonth)
  const month = getMonth(yearMonth)
  const newYear = year - yearsToSubtract
  return ofYearAndMonth(newYear, month)
}
