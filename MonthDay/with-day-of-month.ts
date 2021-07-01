import { MonthDay } from '../iso-types'
import { getMonth } from './get-month'
import { ofMonthAndNumber } from './of-month-and-number'

export function withDayOfMonth(monthDay: MonthDay, dayOfMonth: number): MonthDay {
  const month = getMonth(monthDay)
  return ofMonthAndNumber(month, dayOfMonth)
}
