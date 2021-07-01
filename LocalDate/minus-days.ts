import { LocalDate } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import dateFormat from 'dateformat'

export function minusDays(localDate: LocalDate, daysToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const currentDayOfMonth = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(currentDayOfMonth - daysToSubtract)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
