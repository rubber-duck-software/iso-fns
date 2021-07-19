import { LocalDate } from '../iso-types'
import dateFormat from 'dateformat'
import { getYear } from './get-year'
import { plusDays } from './plus-days'

/**
 * Receives a LocalDate and adds a given number of years to the date
 * @param {LocalDate} localDate
 * @param {number} yearsToAdd
 * @returns {LocalDate}
 */

export function plusYears(localDate: LocalDate, yearsToAdd: number): LocalDate {
  const date = new Date(localDate.toString())
  const year = getYear(localDate)
  const newDate = date.setUTCFullYear(year + yearsToAdd)
  return dateFormat(newDate, 'yyyy-mm-dd')
}
