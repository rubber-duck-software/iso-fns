import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMillisecond } from './get-millisecond'
import { getMinute } from './get-minute'
import { getSecond } from './get-second'
import { of } from './of'

export function minusMilliseconds(localTime: LocalTime, millisecondsToSubtract: number): LocalTime {
  const hour = getHour(localTime)
  const minute = getMinute(localTime)
  const second = getSecond(localTime)
  const millisecond = getMillisecond(localTime) - millisecondsToSubtract
  return of(hour, minute, second, millisecond)
}
