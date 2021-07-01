import { LocalTime } from '../iso-types'
import { getHour } from './get-hour'
import { getMinute } from './get-minute'
import { getSecond } from './get-second'

export function toSecondOfDay(localTime: LocalTime): number {
  const hour = getHour(localTime)
  const minute = getMinute(localTime)
  const second = getSecond(localTime)
  return hour * 60 * 60 + minute * 60 + second
}
