import { LocalDateTime, Year } from '../iso-types'

export function withYear(localDateTime: LocalDateTime, year: Year): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const newDate = new Date(date.setUTCFullYear(year))
  return newDate.toISOString().replace('Z', '')
}
