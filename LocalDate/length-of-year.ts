import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { length as yearLength } from '../Year/length'

/**
 * Receives a local date and returns the number of days in the year that date occurred
 * @param {LocalDate} localDate
 * @returns {number}
 */

export function lengthOfYear(localDate: LocalDate): number {
  const year = getYear(localDate)
  return yearLength(year)
}
