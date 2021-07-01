import { Instant } from '../iso-types'

export function ofEpochMilli(epochMilli: number): Instant {
  return new Date(epochMilli).toISOString()
}
