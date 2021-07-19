import { LocalDate } from '../iso-types'

/**
 * Receives two dates and returns -1 if they are in descending order, 1 if they are not in descending order, and 0 if they are they same day.
 * @param {LocalDate} leftLocalDate
 * @param {LocalDate} rightLocalDate
 * @returns {number}
 */

export function compareDesc(leftLocalDate: LocalDate, rightLocalDate: LocalDate): number {
  if (leftLocalDate > rightLocalDate) {
    return -1
  } else if (leftLocalDate < rightLocalDate) {
    return 1
  } else {
    return 0
  }
}
