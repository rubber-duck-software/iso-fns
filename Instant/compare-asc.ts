import { Instant } from '../iso-types'

/**
 * Receives two instants in time and returns 1 if the first instant is before the second
 * @param leftInstant
 * @param rightInstant
 * @returns
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
