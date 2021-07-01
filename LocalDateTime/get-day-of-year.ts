import { LocalDateTime } from '../iso-types'
import { getDayOfYear as localDateGetDayOfYear } from '../LocalDate/get-day-of-year'
import { getLocalDate } from './get-local-date'

export function getDayOfYear(localDateTime: LocalDateTime): number {
  const date = getLocalDate(localDateTime)
  return localDateGetDayOfYear(date)
}
