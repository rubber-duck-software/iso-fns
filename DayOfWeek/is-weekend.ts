import { DayOfWeek } from '../iso-types'
import { Saturday, Sunday } from './values'

export function isWeekend(dayOfWeek: DayOfWeek): boolean {
  return dayOfWeek === Saturday || dayOfWeek === Sunday
}
