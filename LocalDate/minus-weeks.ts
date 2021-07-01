import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getDayOfMonth } from './get-day-of-month'

export function minusWeeks(localDate: LocalDate, weeksToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = getDayOfMonth(localDate)
  const newDate = date.setUTCDate(month - weeksToSubtract * 7)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
