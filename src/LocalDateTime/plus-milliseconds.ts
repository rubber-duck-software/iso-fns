import { LocalDateTime } from '../iso-types'

export function plusMilliseconds(localDateTime: LocalDateTime, millisecondsToAdd: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCMilliseconds()
  const newDate = new Date(date.setUTCMilliseconds(current + millisecondsToAdd))
  return newDate.toISOString().replace('Z', '')
}
