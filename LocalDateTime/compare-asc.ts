import { LocalDateTime } from '../iso-types'

/**
 * Determines if two LocalDateTimes are in ascending order
 * @memberof LocalDateTimeFns
 *
 * @param {LocalDateTime} leftLocalDateTime
 * @param {LocalDateTime} rightLocalDateTime
 *
 * @returns {number}
 */

function compareAsc(leftLocalDateTime: LocalDateTime, rightLocalDateTime: LocalDateTime): number {
  if (leftLocalDateTime < rightLocalDateTime) {
    return -1
  } else if (leftLocalDateTime > rightLocalDateTime) {
    return 1
  } else {
    return 0
  }
}

export { compareAsc }
