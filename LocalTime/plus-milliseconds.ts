import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMillisecond } from './get-millisecond'
import { getMinute } from './get-minute'
import { getSecond } from './get-second'
import { of } from './of'

export function plusMilliseconds(localTime: LocalTime, millisecondsToAdd: number): LocalTime {
  const hour = getHour(localTime)
  const minute = getMinute(localTime)
  const second = getSecond(localTime)
  const millisecond = getMillisecond(localTime) + millisecondsToAdd
  return of(hour, minute, second, millisecond)
}
