import { LocalDate } from '../iso-types'

export function compareDesc(leftLocalDate: LocalDate, rightLocalDate: LocalDate): number {
  if (leftLocalDate > rightLocalDate) {
    return -1
  } else if (leftLocalDate < rightLocalDate) {
    return 1
  } else {
    return 0
  }
}
