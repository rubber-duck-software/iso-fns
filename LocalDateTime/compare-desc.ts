import { LocalDateTime } from '../iso-types'

export function compareDesc(leftLocalDateTime: LocalDateTime, rightLocalDateTime: LocalDateTime): number {
  if (leftLocalDateTime > rightLocalDateTime) {
    return -1
  } else if (leftLocalDateTime < rightLocalDateTime) {
    return 1
  } else {
    return 0
  }
}
