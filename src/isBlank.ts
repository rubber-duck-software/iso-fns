import getFields from './getFields'
import { IsoDuration } from 'iso-types'

function isBlank(duration: IsoDuration): boolean {
  const fields = getFields(duration)
  return Object.values(fields).every((v) => v === 0)
}

export default isBlank
