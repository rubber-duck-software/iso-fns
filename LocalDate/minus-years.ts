import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getYear } from './get-year'

/**
 * Removes a number of years from a LocalDate
 * @param {LocalDate} localDate
 * @param {number} yearsToSubtract
 * @returns {LocalDate}
 */

export function minusYears(localDate: LocalDate, yearsToSubtract: number): LocalDate {
  const date = new Date(localDate.toString())
  const year = getYear(localDate)
  const newDate = date.setUTCFullYear(year - yearsToSubtract)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
