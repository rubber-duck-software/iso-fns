import { LocalDateTime, Month, Year } from '../iso-types'
import { ordinal as monthOrdinal } from '../Month/ordinal'

export function of(
  year: Year,
  month: Month,
  dayOfMonth: number,
  hours: number,
  minutes: number,
  seconds: number,
  milliSeconds: number
): LocalDateTime {
  const date = new Date(Date.UTC(year, monthOrdinal(month), dayOfMonth, hours, minutes, seconds, milliSeconds))
  return date.toISOString().replace('Z', '')
}
