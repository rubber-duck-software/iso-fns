import { LocalDateTime } from '../iso-types'
import { withDayOfYear as localDateWithDayOfYear } from '../LocalDate/with-day-of-year'
import { getLocalDate } from './get-local-date'
import { getLocalTime } from './get-local-time'
import { ofDateAndTime } from './of-date-and-time'

export function withDayOfYear(localDateTime: LocalDateTime, dayOfYear: number): LocalDateTime {
  const localDate = getLocalDate(localDateTime)
  const localTime = getLocalTime(localDateTime)
  const newLocalDate = localDateWithDayOfYear(localDate, dayOfYear)
  return ofDateAndTime(newLocalDate, localTime)
}
