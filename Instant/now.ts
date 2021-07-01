import { Instant } from '../iso-types'

export function now(): Instant {
  return new Date().toISOString()
}
