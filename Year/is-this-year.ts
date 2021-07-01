import { Year } from '../iso-types'

export function isThisYear(year: Year) {
  return year === new Date(Date.now()).getFullYear()
}
