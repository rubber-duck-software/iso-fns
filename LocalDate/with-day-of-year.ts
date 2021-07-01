import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { ofYearDay } from './of-year-day'

export function withDayOfYear(localDate: LocalDate, dayOfYear: number): LocalDate {
  const year = getYear(localDate)
  return ofYearDay(year, dayOfYear)
}
