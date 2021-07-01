import { LocalDate, Year } from '../iso-types'
import dateFormat from 'dateformat'

export function withYear(localDate: LocalDate, year: Year): LocalDate {
  const date = new Date(localDate.toString())
  const newDate = date.setUTCFullYear(year)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
