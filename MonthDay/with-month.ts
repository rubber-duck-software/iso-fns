import { Month, MonthDay } from '../iso-types'
import { getDayOfMonth } from './get-day-of-month'
import { ofMonthAndNumber } from './of-month-and-number'

export function withMonth(monthDay: MonthDay, month: Month): MonthDay {
  const dayOfMonth = getDayOfMonth(monthDay)
  return ofMonthAndNumber(month, dayOfMonth)
}
