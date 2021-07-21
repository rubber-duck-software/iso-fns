import { Month, YearMonth } from '../iso-types'
import { fromOrdinal as monthFromOrdinal } from '../Month/from-ordinal'

export function getMonth(yearMonth: YearMonth): Month {
  return monthFromOrdinal(new Date(yearMonth.toString()).getUTCMonth())
}
