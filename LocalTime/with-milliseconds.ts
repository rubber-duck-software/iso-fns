import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMinute } from './get-minute'
import { getSecond } from './get-second'
import { of } from './of'

export function withMilliseconds(localTime: LocalTime, millisecond: number): LocalTime {
  const hour = getHour(localTime)
  const minute = getMinute(localTime)
  const second = getSecond(localTime)
  return of(hour, minute, second, millisecond)
}
