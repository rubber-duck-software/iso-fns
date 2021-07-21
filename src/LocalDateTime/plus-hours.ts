import { LocalDateTime } from '../iso-types'

export function plusHours(localDateTime: LocalDateTime, hoursToAdd: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCHours()
  const newDate = new Date(date.setUTCHours(current + hoursToAdd))
  return newDate.toISOString().replace('Z', '')
}
