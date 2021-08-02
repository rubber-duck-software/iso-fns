import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getYears(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.years
}

export default getYears
