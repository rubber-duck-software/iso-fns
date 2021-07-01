import { LocalDateTime, LocalTime } from '../iso-types'

export function getLocalTime(localDateTime: LocalDateTime): LocalTime {
  const dateTimeComponents = localDateTime.split('T')
  return dateTimeComponents[1].replace('Z', '')
}
