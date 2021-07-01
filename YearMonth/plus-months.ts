import { YearMonth } from '../iso-types'
import { fromOrdinal as fromMonthOrdinal } from '../Month/from-ordinal'
import { ordinal as monthOrdinal } from '../Month/ordinal'
import { getMonth } from './get-month'
import { getYear } from './get-year'
import { ofYearAndMonth } from './of-year-and-month'

export function plusMonths(yearMonth: YearMonth, monthsToAdd: number): YearMonth {
  const year = getYear(yearMonth)
  const monthOrd = monthOrdinal(getMonth(yearMonth))
  const originalDate = new Date(Date.UTC(year, monthOrd))
  const newDate = new Date(originalDate.setUTCMonth(monthOrd + monthsToAdd))
  const newMonthOrd = newDate.getUTCMonth()
  const newYear = new Date().getUTCFullYear()
  const newMonth = fromMonthOrdinal(newMonthOrd)
  return ofYearAndMonth(newYear, newMonth)
}

new Date().toUTCString
