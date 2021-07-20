import { Instant } from '../iso-types'

/**
 * Determines if two instances in time are in ascending order
 * @memberof InstantFns
 *
 * @param {Instant} leftInstant
 * @param {Instant} rightInstant
 *
 * @returns {Number} -1 if the days are in ascending order, 1 if they are in descending order, and 0 if they are the same instant.
 */

function compareAsc(leftInstant: Instant, rightInstant: Instant): number {
  if (leftInstant < rightInstant) {
    return -1
  } else if (leftInstant > rightInstant) {
    return 1
  } else {
    return 0
  }
}

export { compareAsc }