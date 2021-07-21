import { LocalDateTime, Year } from '../iso-types'

export function getYear(localDateTime: LocalDateTime): Year {
  const date = new Date(`${localDateTime}Z`)
  return date.getUTCFullYear()
}
