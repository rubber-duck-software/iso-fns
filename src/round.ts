import getFields from './getFields'
import { IsoDate, IsoDateTime, IsoDuration, IsoInstant, IsoTime } from 'iso-types'
import isoDateTime from './isoDateTime'
import isoTime from './isoTime'
import { IsoSplitter } from './utils/isoFlexFunction'
import getEpochMilliseconds from './getEpochMilliseconds'
import fromEpochMilliseconds from './fromEpochMilliseconds'
import { roundTemporal } from './utils/roundTemporal'
import { roundDuration } from './utils/roundDuration'
import { msPerTimeUnit } from './utils/msPerTimeUnit'
import { roundNumberToIncrement } from './utils/roundNumberToIncrement'
import isoDuration from './isoDuration'

export default function round(
  instant: IsoInstant,
  options: {
    smallestUnit: 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoDateTime

export default function round(
  dateTime: IsoDateTime,
  options: {
    smallestUnit: 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoDateTime

export default function round(
  time: IsoTime,
  options: {
    smallestUnit: 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
  }
): IsoTime

export default function round(
  duration: IsoDuration,
  options: {
    largestUnit?: 'auto' | 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    smallestUnit?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond'
    roundingIncrement?: number
    roundingMode?: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
    relativeTo?: IsoDateTime | IsoDate
  }
): IsoDuration

export default function round(input: string, options: any) {
  return IsoSplitter(input, {
    Instant(input) {
      const {
        smallestUnit,
        roundingIncrement = 1,
        roundingMode = 'halfExpand'
      } = options as {
        smallestUnit: 'hour' | 'minute' | 'second' | 'millisecond'
        roundingIncrement: number
        roundingMode: 'halfExpand' | 'ceil' | 'trunc' | 'floor'
      }
      const roundedMs = roundNumberToIncrement(
        getEpochMilliseconds(input),
        msPerTimeUnit[smallestUnit] * roundingIncrement,
        roundingMode
      )
      return fromEpochMilliseconds(roundedMs)
    },

    DateTime(input) {
      const { smallestUnit, roundingIncrement = 1, roundingMode = 'halfExpand' } = options
      const rounded = roundTemporal(getFields(input), { smallestUnit, roundingIncrement, roundingMode })
      return isoDateTime(rounded)
    },
    Time(input) {
      const { smallestUnit, roundingIncrement = 1, roundingMode = 'halfExpand' } = options
      const rounded = roundTemporal(getFields(input), { smallestUnit, roundingIncrement, roundingMode })
      return isoTime(rounded)
    },
    Duration(input) {
      const {
        largestUnit = 'auto',
        smallestUnit = 'millisecond',
        roundingIncrement = 1,
        roundingMode = 'halfExpand',
        relativeTo
      } = options
      return isoDuration(
        roundDuration(getFields(input), {
          largestUnit,
          smallestUnit,
          roundingIncrement,
          roundingMode,
          relativeTo
        })
      )
    }
  })
}
