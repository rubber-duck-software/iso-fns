import { Instant } from '../iso-types'

export function ofEpochSecond(epochSecond: number): Instant {
  return new Date(epochSecond * 1000).toISOString()
}
