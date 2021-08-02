import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getMonths(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.months
}

export default getMonths
