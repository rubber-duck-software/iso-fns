import { LocalDateTime } from '../iso-types'

export function minusMilliseconds(localDateTime: LocalDateTime, millisecondsToSubtract: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCMilliseconds()
  const newDate = new Date(date.setUTCMilliseconds(current - millisecondsToSubtract))
  return newDate.toISOString().replace('Z', '')
}
