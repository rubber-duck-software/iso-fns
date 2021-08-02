import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getWeeks(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.weeks
}

export default getWeeks
