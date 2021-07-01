import { Year } from '../iso-types'

export function compareDesc(leftYear: Year, rightYear: Year): number {
  if (leftYear > rightYear) {
    return -1
  } else if (leftYear < rightYear) {
    return 1
  } else {
    return 0
  }
}
