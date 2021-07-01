import { Instant } from '../iso-types'

export function getEpochSecond(instant: Instant): number {
  return Math.floor(new Date(instant.toString()).getTime() / 1000)
}
