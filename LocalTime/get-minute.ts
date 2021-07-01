import { LocalTime } from '../iso-types'

export function getMinute(localTime: LocalTime): number {
  const date = new Date(`2000-01-01${localTime}Z`)
  return date.getUTCMinutes()
}
