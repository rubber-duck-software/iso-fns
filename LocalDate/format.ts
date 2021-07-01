import { Month, Year } from '../iso-types'
import { ordinal as ordinalMonth } from '../Month/ordinal'
import dateFormat from 'dateformat'

export function ofYearAndMonth(year: Year, month: Month) {
  const date = new Date()
  const withYear = new Date(date.setUTCFullYear(year))
  const withMonth = withYear.setUTCMonth(ordinalMonth(month))
  return dateFormat(withMonth, 'yyyy-mm')
}
