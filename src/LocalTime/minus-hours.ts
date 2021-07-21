import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMillisecond } from './get-millisecond'
import { getMinute } from './get-minute'
import { getSecond } from './get-second'
import { of } from './of'

export function minusHours(localTime: LocalTime, hoursToSubtract: number): LocalTime {
  const hour = getHour(localTime) - hoursToSubtract
  const minute = getMinute(localTime)
  const second = getSecond(localTime)
  const millisecond = getMillisecond(localTime)
  return of(hour, minute, second, millisecond)
}
