import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getMilliseconds(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.milliseconds
}

export default getMilliseconds
