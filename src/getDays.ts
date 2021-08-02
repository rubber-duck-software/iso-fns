import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getDays(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.days
}

export default getDays
