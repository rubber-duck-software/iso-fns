import { LocalDate, Year } from '../iso-types'

/**
 * Receives a local date and returns the corresponding year
 * @param {LocalDate} localDate
 * @returns {Year}
 */

export function getYear(localDate: LocalDate): Year {
  const year = new Date(localDate.toString()).getUTCFullYear()
  return year
}
