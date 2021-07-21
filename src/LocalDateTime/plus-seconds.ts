import { LocalDateTime } from '../iso-types'

export function plusSeconds(localDateTime: LocalDateTime, secondsToAdd: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCSeconds()
  const newDate = new Date(date.setUTCSeconds(current + secondsToAdd))
  return newDate.toISOString().replace('Z', '')
}
