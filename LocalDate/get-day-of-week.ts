import { DayOfWeek, LocalDate } from '../iso-types'
import { fromOrdinal } from '../DayOfWeek/from-ordinal'

export function getDayOfWeek(localDate: LocalDate): DayOfWeek {
  const dayOfWeek = new Date(localDate.toString()).getUTCDay()
  return fromOrdinal(dayOfWeek)
}
