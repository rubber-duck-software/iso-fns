import { MonthDay } from '../iso-types'

export function getDayOfMonth(monthDay: MonthDay): number {
  return new Date(`2000-${monthDay}`).getUTCDate()
}
