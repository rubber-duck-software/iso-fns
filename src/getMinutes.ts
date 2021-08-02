import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getMinutes(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.minutes
}

export default getMinutes
