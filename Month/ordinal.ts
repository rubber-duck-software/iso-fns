import { Month } from '../iso-types'
import { getValue } from './get-value'

/**
 * Receives a month and returns the corresponding month ordinal assuming 0-indexings
 * @param {Month} month
 * @returns {number}
 */

export function ordinal(month: Month): number {
  return getValue(month) - 1
}
