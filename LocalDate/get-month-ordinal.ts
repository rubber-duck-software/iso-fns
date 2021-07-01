import { LocalDate, Month } from '../iso-types'
import { fromOrdinal } from '../Month/from-ordinal'

export function getMonthOrdinal(localDate: LocalDate): number {
  const month = new Date(localDate.toString()).getUTCMonth()
  return month
}
