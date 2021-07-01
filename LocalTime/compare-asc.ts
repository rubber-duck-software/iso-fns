import { LocalTime } from '../iso-types'

export function compareAsc(leftLocalTime: LocalTime, rightLocalTime: LocalTime): number {
  if (leftLocalTime < rightLocalTime) {
    return -1
  } else if (leftLocalTime > rightLocalTime) {
    return 1
  } else {
    return 0
  }
}
