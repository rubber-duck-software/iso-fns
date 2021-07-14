import { Instant } from '../iso-types'

/**
 * Adds a given number of milliseconds to an instance in time
 * @param instant
 * @param millisecondsToAdd
 * @returns new instance in time
 */

export function plusMilliseconds(instant: Instant, millisecondsToAdd: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCMilliseconds()
  const newDate = new Date(date.setUTCMilliseconds(current + millisecondsToAdd))
  return newDate.toISOString()
}
