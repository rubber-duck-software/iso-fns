import getSign from './getSign'
import isBlank from './isBlank'
import { IsoDuration } from './iso-types'

function negate(duration: IsoDuration): IsoDuration {
  if (isBlank(duration)) {
    return duration
  } else if (getSign(duration) < 0) {
    return duration.substring(1) as IsoDuration
  } else {
    return `-${duration}` as IsoDuration
  }
}

export default negate
