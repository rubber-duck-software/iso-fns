import { LocalDateTime } from '../iso-types'

export function plusYears(localDateTime: LocalDateTime, yearsToAdd: number): LocalDateTime {
  const date = new Date(`${localDateTime}Z`)
  const current = date.getUTCFullYear()
  const newDate = new Date(date.setUTCFullYear(current + yearsToAdd))
  return newDate.toISOString().replace('Z', '')
}
