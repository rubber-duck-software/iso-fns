import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getHours(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.hours
}

export default getHours
