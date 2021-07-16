import { LocalDateTime } from '../iso-types'

/**
 * This is a type guard for the LocalDateTime type.
 * @param {unknown} localDateTime
 * @returns {LocalDateTime}
 */
export function check(localDateTime: unknown): localDateTime is LocalDateTime {
  if (localDateTime instanceof String || typeof localDateTime === 'string') {
    return new Date(localDateTime.toString()).toISOString().replace('Z', '') === localDateTime
  } else {
    return false
  }
}
