import { LocalDateTime } from '../iso-types'

export function plusMinutes(localDateTime: LocalDateTime, minutesToAdd: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCMinutes()
  const newDate = new Date(date.setUTCMinutes(current + minutesToAdd))
  return newDate.toISOString().replace('Z', '')
}
