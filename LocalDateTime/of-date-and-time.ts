import { LocalDate, LocalDateTime, LocalTime } from '../iso-types'

export function ofDateAndTime(localDate: LocalDate, localTime: LocalTime): LocalDateTime {
  const date = new Date(`${localDate}${localTime}Z`)
  return date.toISOString().replace('Z', '')
}
