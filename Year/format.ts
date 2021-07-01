import { Year } from '../iso-types'
import dateFormat from 'dateformat'

export function format(year: Year, format: string): string {
  const date = new Date(new Date().setUTCFullYear(year))
  return dateFormat(date, format)
}
