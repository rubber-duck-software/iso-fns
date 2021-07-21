import { Year } from '../iso-types'

/**
 * Determines if two years are in ascending order
 * @memberof YearFns
 *
 * @param leftYear
 * @param rightYear
 *
 * @returns -1 if the years are in ascending order, 1 if they are in descending order, and 0 if they are the same year.
 */

function compareAsc(leftYear: Year, rightYear: Year): number {
  if (leftYear < rightYear) {
    return -1
  } else if (leftYear > rightYear) {
    return 1
  } else {
    return 0
  }
}

export { compareAsc }
