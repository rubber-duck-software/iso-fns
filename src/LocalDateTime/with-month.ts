import { LocalDateTime, Month } from '../iso-types'
import { ordinal as monthOrdinal } from '../Month/ordinal'

export function withMonth(localDateTime: LocalDateTime, month: Month): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const newDate = new Date(date.setUTCMonth(monthOrdinal(month)))
  return newDate.toISOString().replace('Z', '')
}
