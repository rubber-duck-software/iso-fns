import { IsoDuration } from 'iso-types'
import isValidDuration from './isValidDuration'

const durationKeys: string[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']

function isDurationFields(input: any) {
  try {
    return (
      Object.keys(input).some((key) => durationKeys.includes(key)) &&
      Object.keys(input)
        .filter((key) => durationKeys.includes(key))
        .every((key) => Number.isFinite(input[key]))
    )
  } catch {
    throw new Error(`Unrecognized Input: ${input}`)
  }
}

export default function isoDuration(fields: {
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}): IsoDuration
export default function isoDuration(input: string): IsoDuration
export default function isoDuration(
  years?: number,
  months?: number,
  weeks?: number,
  days?: number,
  hours?: number,
  minutes?: number,
  seconds?: number,
  milliseconds?: number
): IsoDuration

export default function isoDuration(...args: any[]): any {
  if (args.length === 0) {
    return
  } else if (isValidDuration(args[0])) {
    return args[0]
  } else if (isDurationFields(args[0])) {
    const { years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = args[0]
    const allFields = [years, months, weeks, days, hours, minutes, seconds, milliseconds]
    const allPositive = allFields.every((v) => v >= 0)
    const allNegative = allFields.every((v) => v <= 0)

    if (allPositive) {
      const finalSeconds = seconds + milliseconds / 1000

      const Y = years ? `${years}Y` : ''
      const Mo = months ? `${months}M` : ''
      const W = weeks ? `${weeks}W` : ''
      const D = days ? `${days}D` : ''
      const H = hours ? `${hours}H` : ''
      const Mi = minutes ? `${minutes}M` : ''
      const S = finalSeconds ? `${finalSeconds}S` : ''
      const T = H || Mi || S ? 'T' : ''
      const allBlank =
        years === 0 && months === 0 && weeks === 0 && days === 0 && hours === 0 && minutes === 0 && finalSeconds === 0
      const newDuration = `P${Y}${Mo}${W}${D}${T}${H}${Mi}${S}` as IsoDuration
      return allBlank ? `PT0S` : newDuration
    } else if (allNegative) {
      return `-${isoDuration({
        years: years * -1,
        months: months * -1,
        weeks: weeks * -1,
        days: days * -1,
        hours: hours * -1,
        minutes: minutes * -1,
        seconds: seconds * -1,
        milliseconds: milliseconds * -1
      })}` as IsoDuration
    } else {
      throw new Error('Cannot mix positive and negative fields inside of a duration')
    }
  } else {
    const [years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = args
    return isoDuration({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    })
  }
}
