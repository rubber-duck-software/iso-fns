/* c8 ignore start */

import { Instant } from '../iso-types'

/**
 * Returns the current time
 * @memberof InstantFns
 *
 * @returns {Instant} current time in yyyy-mm-ddTHH:MM:ss.lZ format
 */

function now(): Instant {
  return new Date().toISOString()
}

export { now }

/* c8 ignore stop */
