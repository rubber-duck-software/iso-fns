import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMillisecond } from './get-millisecond'
import { getMinute } from './get-minute'
import { of } from './of'

export function withSeconds(localTime: LocalTime, second: number): LocalTime {
  const hour = getHour(localTime)
  const minute = getMinute(localTime)
  const millisecond = getMillisecond(localTime)
  return of(hour, minute, second, millisecond)
}
