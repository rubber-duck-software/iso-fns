import { Year } from '../iso-types'
import { isLeap } from './is-leap'

export function length(year: Year): number {
  return isLeap(year) ? 366 : 365
}
