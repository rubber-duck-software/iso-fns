import { LocalDate } from '../iso-types'

/**
 * Compares two local dates to determine if they are in descending order.
 * @memberof LocalDateFns
 *
 * @param {LocalDate} leftLocalDate
 * @param {LocalDate} rightLocalDate
 *
 * @returns {number} -1 if they are in descending order, 1 if they are in ascending order, and 0 if they are they same date
 */

function compareDesc(leftLocalDate: LocalDate, rightLocalDate: LocalDate): number {
  if (leftLocalDate > rightLocalDate) {
    return -1
  } else if (leftLocalDate < rightLocalDate) {
    return 1
  } else {
    return 0
  }
}

export { compareDesc }
