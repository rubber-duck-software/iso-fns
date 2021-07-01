import { LocalDate } from '../iso-types'

export function getDayOfMonth(localDate: LocalDate): number {
  const dayOfMonth = new Date(localDate.toString()).getUTCDate()
  return dayOfMonth
}
