import { Instant } from '../iso-types'

/**
 * Compares two instances of time
 * @param leftInstant
 * @param rightInstant
 * @returns -1 if the days are in ascending order, 1 if they are in descending order, and 0 if they are the same instant.
 */

export function compareAsc(leftInstant: Instant, rightInstant: Instant): number {
  if (leftInstant < rightInstant) {
    return -1
  } else if (leftInstant > rightInstant) {
    return 1
  } else {
    return 0
  }
}
