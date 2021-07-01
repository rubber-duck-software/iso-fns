import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMillisecond } from './get-millisecond'
import { getMinute } from './get-minute'
import { getSecond } from './get-second'
import { of } from './of'

export function plusMinutes(localTime: LocalTime, minutesToAdd: number): LocalTime {
  const hour = getHour(localTime)
  const minute = getMinute(localTime) + minutesToAdd
  const second = getSecond(localTime)
  const millisecond = getMillisecond(localTime)
  return of(hour, minute, second, millisecond)
}
