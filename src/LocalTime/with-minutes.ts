import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMillisecond } from './get-millisecond'
import { getSecond } from './get-second'
import { of } from './of'

export function withMinutes(localTime: LocalTime, minute: number): LocalTime {
  const hour = getHour(localTime)
  const second = getSecond(localTime)
  const millisecond = getMillisecond(localTime)
  return of(hour, minute, second, millisecond)
}
