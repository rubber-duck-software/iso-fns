import { LocalDateTime } from '../iso-types'

export function minusMinutes(localDateTime: LocalDateTime, minutesToSubtract: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCMinutes()
  const newDate = new Date(date.setUTCMinutes(current - minutesToSubtract))
  return newDate.toISOString().replace('Z', '')
}
