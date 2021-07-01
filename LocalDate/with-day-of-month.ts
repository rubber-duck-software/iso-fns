import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'

export function withDayOfMonth(localDate: LocalDate, dayOfMonth: number): LocalDate {
  const date = new Date(localDate.toString())
  const newDate = date.setUTCDate(dayOfMonth)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
