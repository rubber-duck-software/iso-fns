import isBlank from './isBlank'
import { IsoDuration } from 'iso-types'

export default function getSign(duration: IsoDuration): number {
  if (isBlank(duration)) {
    return 0
  } else if (duration.startsWith('-')) {
    return -1
  } else {
    return 1
  }
}
