import { LocalDate } from '../iso-types'

/**
 * Compares two local dates and returns -1 if they are in ascending order, 1 if they are not, and 0 if they are the same time.
 * @param {LocalDate} leftLocalDate
 * @param {LocalDate} rightLocalDate
 * @returns {number}
 */

export function compareAsc(leftLocalDate: LocalDate, rightLocalDate: LocalDate): number {
  if (leftLocalDate < rightLocalDate) {
    return -1
  } else if (leftLocalDate > rightLocalDate) {
    return 1
  } else {
    return 0
  }
}
