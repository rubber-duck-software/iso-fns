import { LocalDateTime, Month } from '../iso-types'
import { fromOrdinal as monthFromOrdinal } from '../Month/from-ordinal'

export function getMonth(localDateTime: LocalDateTime): Month {
  const date = new Date(`${localDateTime}Z`)
  return monthFromOrdinal(date.getUTCMonth())
}
