import { LocalDate, Month } from '../iso-types'
import dateFormat from 'dateformat'
import { ordinal as monthOrdinal } from '../Month/ordinal'

export function withMonth(localDate: LocalDate, month: Month): LocalDate {
  const date = new Date(localDate.toString())
  const monthOrd = monthOrdinal(month)
  const newDate = date.setUTCDate(monthOrd)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
