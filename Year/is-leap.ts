import { Year } from '../iso-types'

export function isLeap(year: Year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}
