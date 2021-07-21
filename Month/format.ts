import { Month } from '../iso-types'
import { ordinal } from './ordinal'
import dateFormat from 'dateformat'

export function format(month: Month, format: string): string {
  const monthOrdinal = ordinal(month)
  const date = new Date(new Date().setUTCMonth(monthOrdinal))
  return dateFormat(date, format, true)
}
