import { IsoDuration } from 'iso-types'

function isValidDuration(duration: unknown): duration is IsoDuration {
  try {
    const d: string = duration as string
    if (d.startsWith('P')) {
      return handlePositiveDuration(d.substring(1))
    } else if (d.startsWith('-P')) {
      return handlePositiveDuration(d.substring(2))
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

function handlePositiveDuration(duration: string): boolean {
  if (duration.includes('T')) {
    const [dateSegment, timeSegment, ...other] = duration.split('T')
    if (other.length) {
      throw new Error('Multiple time delimiters found in Duration')
    } else {
      return matchesDateSegment(dateSegment) && matchesTimeSegment(timeSegment)
    }
  } else {
    return matchesDateSegment(duration)
  }
}

function matchesDateSegment(duration: string): boolean {
  return matchesDurationSegments(duration, [
    { character: 'Y', int: true },
    { character: 'M', int: true },
    { character: 'W', int: true },
    { character: 'D', int: true }
  ])
}

function matchesTimeSegment(duration: string): boolean {
  return matchesDurationSegments(duration, [
    { character: 'H', int: true },
    { character: 'M', int: true },
    { character: 'S', int: false }
  ])
}

function isInteger(string: string): boolean {
  const integerRegex = /^[0-9]*$/
  return integerRegex.test(string) && Number.isInteger(Number(string))
}

function isFloat(string: string): boolean {
  const floatRegex = /^([0-9]*[.])?[0-9]+$/
  return floatRegex.test(string) && Number.isFinite(Number(string))
}

function matchesDurationSegments(
  duration: string,
  segments: Array<{
    character: string
    int?: boolean
    maxValue?: number
  }>
): boolean {
  const remaining = segments.reduce((d, segment) => {
    const { int = false, character } = segment
    if (d.includes(segment.character)) {
      const index = d.indexOf(character)
      const value = d.substring(0, index)
      if (int && isInteger(value)) {
        return d.substring(index + 1)
      } else if (!int && isFloat(value)) {
        return d.substring(index + 1)
      } else {
        throw new Error(`Cannot parse ${value} as duration value`)
      }
    } else {
      return d
    }
  }, duration)
  return remaining === ''
}

export default isValidDuration
