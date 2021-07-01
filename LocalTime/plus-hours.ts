import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMillisecond } from './get-millisecond'
import { getMinute } from './get-minute'
import { getSecond } from './get-second'
import { of } from './of'

export function plusHours(localTime: LocalTime, hoursToAdd: number): LocalTime {
  const hour = getHour(localTime) + hoursToAdd
  const minute = getMinute(localTime)
  const second = getSecond(localTime)
  const millisecond = getMillisecond(localTime)
  return of(hour, minute, second, millisecond)
}
