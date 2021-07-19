import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getYear } from './get-year'

/**
 * Adds a number of years to a date
 * @memberof LocalDateFns
 *
 * @param {LocalDate} localDate
 * @param {number} yearsToAdd
 *
 * @returns {LocalDate} date with years added
 */

function plusYears(localDate: LocalDate, yearsToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const currentYear = getYear(localDate)
  const newDate = date.setUTCFullYear(currentYear + yearsToAdd)
  return dateFormat(newDate, 'yyyy-mm-dd', true)
}

export { plusYears }
