import { Month, MonthDay } from '../iso-types'
import { fromOrdinal as fromMonthOrdinal } from '../Month/from-ordinal'

export function getMonth(monthDay: MonthDay): Month {
  return fromMonthOrdinal(new Date(`2000-${monthDay}`).getUTCMonth())
}
