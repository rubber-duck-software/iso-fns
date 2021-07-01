import { Year, YearMonth } from '../iso-types'

export function getYear(yearMonth: YearMonth): Year {
  return new Date(yearMonth.toString()).getUTCFullYear()
}
