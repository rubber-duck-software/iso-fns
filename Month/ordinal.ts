import { Month } from '../iso-types'
import { getValue } from './get-value'
import { January, February, March, April, May, June, July, August, September, October, November, December } from './values'

export function ordinal(month: Month): number {
  return getValue(month) - 1
}
