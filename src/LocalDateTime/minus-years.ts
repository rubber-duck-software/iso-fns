import { LocalDateTime } from '../iso-types'

export function minusYears(localDateTime: LocalDateTime, yearsToSubtract: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCFullYear()
  const newDate = new Date(date.setUTCFullYear(current - yearsToSubtract))
  return newDate.toISOString().replace('Z', '')
}
