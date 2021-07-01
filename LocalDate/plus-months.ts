import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getMonth } from './get-month'
import { ordinal as monthOrdinal } from '../Month/ordinal'

export function plusMonths(localDate: LocalDate, monthsToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = monthOrdinal(getMonth(localDate))
  const newDate = date.setUTCDate(month + monthsToAdd)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
