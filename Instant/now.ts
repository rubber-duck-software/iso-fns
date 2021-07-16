/* c8 ignore start */

import { Instant } from '../iso-types'

/**
 * Returns the current time
 * @returns {Instant} current time in yyyy-mm-ddTHH:MM:ss.lZ format
 */

export function now(): Instant {
  return new Date().toISOString()
}

/* c8 ignore stop */
