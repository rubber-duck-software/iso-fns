import { isWeekend } from './is-weekend'
import { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, values } from './values'
import { ordinal } from './ordinal'
import { fromOrdinal } from './from-ordinal'
import { plus } from './plus'
import { minus } from './minus'
import { getValue } from './get-value'
import { fromValue } from './from-value'
import { compareAsc } from './compare-asc'
import { compareDesc } from './compare-desc'

export const DayOfWeekFns = {
  ordinal,
  fromOrdinal,
  isWeekend,
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  values,
  plus,
  minus,
  getValue,
  fromValue,
  compareAsc,
  compareDesc
}
