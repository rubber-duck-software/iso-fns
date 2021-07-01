import { LocalDate, Year } from '../iso-types'

export function getYear(localDate: LocalDate): Year {
  const year = new Date(localDate.toString()).getUTCFullYear()
  return year
}
