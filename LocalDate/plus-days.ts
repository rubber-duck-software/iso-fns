import { LocalDate } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import dateFormat from 'dateformat'

export function plusDays(localDate: LocalDate, daysToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const currentDayOfMonth = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(currentDayOfMonth + daysToAdd)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
