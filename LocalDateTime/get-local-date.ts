import { LocalDateTime, LocalDate } from '../iso-types'

export function getLocalDate(localDateTime: LocalDateTime): LocalDate {
  const dateTimeComponents = localDateTime.split('T')
  return dateTimeComponents[0]
}
