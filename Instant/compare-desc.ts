import { Instant } from '../iso-types'

export function compareDesc(leftInstant: Instant, rightInstant: Instant): number {
  if (leftInstant > rightInstant) {
    return -1
  } else if (leftInstant < rightInstant) {
    return 1
  } else {
    return 0
  }
}
