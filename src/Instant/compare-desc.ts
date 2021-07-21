import { Instant } from '../iso-types'

/**
 * Determines if two instances in time are in descending order
 * @memberof InstantFns
 *
 * @param {Instant} leftInstant
 * @param {Instant} rightInstant
 *
 * @returns {Number} returns -1 if they are in descending order, 1 if they are in ascending order, and 0 if they are the dame day.
 */

function compareDesc(leftInstant: Instant, rightInstant: Instant): number {
  if (leftInstant > rightInstant) {
    return -1
  } else if (leftInstant < rightInstant) {
    return 1
  } else {
    return 0
  }
}

export { compareDesc }
