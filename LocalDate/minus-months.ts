import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getMonth } from './get-month'
import { ordinal as monthOrdinal } from '../Month/ordinal'

export function minusMonths(localDate: LocalDate, monthsToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const month = monthOrdinal(getMonth(localDate))
  const newDate = date.setUTCDate(month - monthsToSubtract)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
