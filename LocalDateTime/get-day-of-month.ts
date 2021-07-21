import { LocalDateTime } from '../iso-types'

/**
 * Gets the day of the month from a LocalDateTime
 * @memberof LocalDateTimeFns
 *
 * @param {LocalDateTime} localDateTime
 *
 * @returns {number}
 */

function getDayOfMonth(localDateTime: LocalDateTime): number {
  const date = new Date(`${localDateTime}Z`)
  return date.getUTCDate()
}

export { getDayOfMonth }
