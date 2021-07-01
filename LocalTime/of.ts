import { LocalTime } from '../iso-types'

export function of(hours: number, minutes: number, seconds: number, milliSeconds: number): LocalTime {
  const date = new Date(Date.UTC(2000, 1, 1, hours, minutes, seconds, milliSeconds))
  const str = date.toISOString()
  const [dateString, timeString] = str.split('T')
  const formattedTimeString = 'T' + timeString.replace('Z', '')
  return formattedTimeString
}
