import { LocalDate, Year } from '../iso-types'
import dateFormat from 'dateformat'
import { plusDays } from './plus-days'

/**
 * Sets the year of a given LocalDate
 * @param {LocalDate} localDate
 * @param {Year} year
 * @returns {LocalDate}
 */

export function withYear(localDate: LocalDate, year: Year): LocalDate {
  const date = new Date(localDate.toString())
  const newDate = date.setUTCFullYear(year)
  const formattedDate = dateFormat(newDate, 'yyyy-mm-dd')
  return plusDays(formattedDate, 1)
}
