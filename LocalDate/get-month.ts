import { LocalDate, Month } from '../iso-types'
import { fromOrdinal } from '../Month/from-ordinal'

export function getMonth(localDate: LocalDate): Month {
  const month = new Date(localDate.toString()).getUTCMonth()
  return fromOrdinal(month)
}
