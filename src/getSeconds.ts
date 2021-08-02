import { IsoDuration } from './iso-types'
import getFields from './getFields'

function getSeconds(duration: IsoDuration): number {
  const fields = getFields(duration)
  return fields.seconds
}

export default getSeconds
