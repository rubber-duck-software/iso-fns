import { LocalDateTime, DayOfWeek } from '../iso-types'
import { fromOrdinal as dayOfWeekFromOrdinal } from '../DayOfWeek/from-ordinal'

export function getDayOfWeek(localDateTime: LocalDateTime): DayOfWeek {
  const date = new Date(`${localDateTime}Z`)
  return dayOfWeekFromOrdinal(date.getUTCDay())
}
