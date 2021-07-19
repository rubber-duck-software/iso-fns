import { LocalDate, Year } from '../iso-types'
import dateFormat from 'dateformat'
import { plusDays } from './plus-days'

/**
 * Sets the year of a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {Year} year
 *
 * @returns {LocalDate}
 */

function withYear(localDate: LocalDate, year: Year): LocalDate {
  const date = new Date(localDate.toString())
  const newDate = date.setUTCFullYear(year)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { withYear }
