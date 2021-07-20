import { Year } from '../iso-types'

/**
 * Determines if two years are in descending order, ascending order, or the same year
 * @memberof YearFns
 *
 * @param leftYear
 * @param rightYear
 *
 * @returns -1 if they are in descending order, 1 if they are in ascending order, and 0 if they are the same
 */

function compareDesc(leftYear: Year, rightYear: Year): number {
  if (leftYear > rightYear) {
    return -1
  } else if (leftYear < rightYear) {
    return 1
  } else {
    return 0
  }
}

export { compareDesc }
