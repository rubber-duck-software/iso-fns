import { LocalDate } from '../iso-types'
import { getYear } from './get-year'
import { isLeap as isYearLeap } from '../Year/is-leap'
import { getMonth } from './get-month'
import { length as monthLength } from '../Month/length'

/**
 * Receives a local date and returns
 * @param {LocalDate} localDate
 * @returns {number}
 */

export function lengthOfMonth(localDate: LocalDate): number {
  const month = getMonth(localDate)
  const year = getYear(localDate)
  const leap = isYearLeap(year)
  return monthLength(month, leap)
}
