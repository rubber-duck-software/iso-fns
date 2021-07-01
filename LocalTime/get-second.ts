import { LocalTime } from '../iso-types'

export function getSecond(localTime: LocalTime): number {
  const date = new Date(`2000-01-01${localTime}Z`)
  return date.getUTCSeconds()
}
