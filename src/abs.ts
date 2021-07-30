import getSign from './getSign'
import { IsoDuration } from 'iso-types'
import negate from './negate'

/**
 * This method gives the absolute value of duration. It returns a new IsoDuration with all the fields
 * having the same magnitude as those of duration, but positive.
 * @param {IsoDuration} duration
 * @returns a new IsoDuration that is always positive.
 */
function abs(duration: IsoDuration): IsoDuration {
  if (getSign(duration) < 0) {
    return negate(duration)
  } else {
    return duration
  }
}

export default abs
