import { LocalDateTime } from '../iso-types'
import { minusDays } from './minus-days'

export function minusWeeks(localDateTime: LocalDateTime, weeksToSubtract: number): LocalDateTime {
  return minusDays(localDateTime, weeksToSubtract * 7)
}
