import { Month, MonthDay } from '../iso-types'
import { format as monthFormat } from '../Month/format'

export function ofMonthAndNumber(month: Month, dayOfMonth: number): MonthDay {
  return `${monthFormat(month, 'mm')}-${dayOfMonthToString(dayOfMonth)}`
}

function dayOfMonthToString(dayOfMonth: number): string {
  const str = Number(dayOfMonth).toLocaleString('en-US', {
    minimumIntegerDigits: 2
  })
  return str.replace(',', '')
}
