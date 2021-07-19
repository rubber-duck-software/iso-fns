import { Instant } from '../iso-types'

/**
 * Adds a given number of milliseconds to an instance in time
 * @memberof InstantFns
 *
 * @param instant
 * @param millisecondsToAdd
 *
 * @returns new instance in time with added milliseconds
 */

function plusMilliseconds(instant: Instant, millisecondsToAdd: number): Instant {
  const date = new Date(instant.toString())
  const current = date.getUTCMilliseconds()
  const newDate = new Date(date.setUTCMilliseconds(current + millisecondsToAdd))
  return newDate.toISOString()
}

export { plusMilliseconds }
