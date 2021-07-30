import { msPerTimeUnit } from './msPerTimeUnit'
import { roundNumberToIncrement } from './roundNumberToIncrement'

export function roundTemporal(
  { year = 1970, month = 1, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0 },
  options: {
    smallestUnit: 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement: number
    roundingMode: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): { year: number; month: number; day: number; hour: number; minute: number; second: number; millisecond: number } {
  const { smallestUnit, roundingIncrement, roundingMode } = options
  let quantity = 0
  switch (smallestUnit) {
    case 'day':
    case 'hour':
      quantity = hour
    // fall through
    case 'minute':
      quantity = quantity * 60 + minute
    // fall through
    case 'second':
      quantity = quantity * 60 + second
    // fall through
    case 'millisecond':
      quantity = quantity * 1000 + millisecond
      break
    default:
      throw new Error(`Unrecognized Unit For Time: ${smallestUnit}`)
  }
  const msPerUnit = msPerTimeUnit[smallestUnit]

  const rounded = roundNumberToIncrement(quantity, msPerUnit * roundingIncrement, roundingMode)
  const result = rounded / Number(msPerUnit)
  switch (smallestUnit) {
    case 'day':
      return { year, month, day: day + result, hour: 0, minute: 0, second: 0, millisecond: 0 }
    case 'hour':
      return { year, month, day, hour: result, minute: 0, second: 0, millisecond: 0 }
    case 'minute':
      return { year, month, day, hour, minute: result, second: 0, millisecond: 0 }
    case 'second':
      return { year, month, day, hour, minute, second: result, millisecond: 0 }
    case 'millisecond':
      return { year, month, day, hour, minute, second, millisecond: result }
  }
}
