import { LocalDateTime } from '../iso-types'

export function minusHours(localDateTime: LocalDateTime, hoursToSubtract: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCHours()
  const newDate = new Date(date.setUTCHours(current - hoursToSubtract))
  return newDate.toISOString().replace('Z', '')
}
