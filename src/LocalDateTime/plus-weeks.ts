import { LocalDateTime } from '../iso-types'
import { plusDays } from './plus-days'

export function plusWeeks(localDateTime: LocalDateTime, weeksToAdd: number): LocalDateTime {
  return plusDays(localDateTime, weeksToAdd * 7)
}
