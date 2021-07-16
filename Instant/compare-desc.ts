import { Instant } from '../iso-types'

/**
 * Compares two instances in time and returns -1 if they are in descending order, 1 if they are in ascending order, and 0 if they are the dame day.
 * @param {Instant} leftInstant
 * @param {Instant} rightInstant
 * @returns {Number}
 */

export function compareDesc(leftInstant: Instant, rightInstant: Instant): number {
  if (leftInstant > rightInstant) {
    return -1
  } else if (leftInstant < rightInstant) {
    return 1
  } else {
    return 0
  }
}
