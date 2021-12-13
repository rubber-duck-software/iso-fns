import defaultLocale from './en-us-locale'
import allFormatters from './formatters'
import allLongFormatters from './longFormatters'

// This RegExp consists of three parts separated by `|`:
// - [yQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
const formattingTokensRegExp = /[yQMIdDihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g
const longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`

const escapedStringRegExp = /^'([^]*?)'?$/
const doubleQuoteRegExp = /''/g
const unescapedLatinCharacterRegExp = /[a-zA-Z]/

const formatterMap = {
  a: ['hour'],
  b: ['hour'],
  B: ['hour'],
  d: ['day'],
  G: ['year'],
  h: ['hour'],
  H: ['hour'],
  i: ['year', 'month', 'day'],
  I: ['year', 'month', 'day'],
  k: ['hour'],
  K: ['hour'],
  m: ['minute'],
  M: ['month'],
  O: ['offset'],
  p: ['hour', 'minute', 'second', 'millisecond'],
  P: ['year', 'month', 'day'],
  Q: ['month'],
  s: ['second'],
  S: ['millisecond'],
  u: ['year'],
  x: ['offset'],
  X: ['offset'],
  y: ['year'],
  z: ['timeZone', 'epochMilliseconds']
}

function getFormattersBySlots(slots: string[]) {
  const formatters = Object.keys(formatterMap) as (keyof typeof formatterMap)[]
  const result = formatters.filter((f) => formatterMap[f].every((s) => slots.includes(s)))
  return result
}

function pick<T, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  return keys.reduce((obj, key) => {
    // @ts-ignore
    if (object && object.hasOwnProperty(key)) {
      // @ts-ignore
      obj[key] = object[key]
    }
    return obj
  }, {}) as any
}

export default function format(
  date: {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
    millisecond?: number
    offset?: string
    timeZone?: string
    epochMilliseconds?: number
  },
  formatStr: string
): string {
  formatStr = String(formatStr)
  if (arguments.length < 2) {
    throw new TypeError('format requires 2 arguments')
  }

  const locale = defaultLocale
  const allowedFormatters = getFormattersBySlots(Object.keys(date))
  const longFormatters = pick(allLongFormatters, allowedFormatters as any)
  const formatters = pick(allFormatters, allowedFormatters as any)

  const longResult = formatStr
    .match(longFormattingTokensRegExp)
    ?.map(function (substring) {
      var firstCharacter = substring[0]
      if (firstCharacter === 'p' || firstCharacter === 'P') {
        const longFormatter = longFormatters[firstCharacter]
        return longFormatter(substring, locale.formatLong)
      }
      return substring
    })
    .join('') as string
  const result = longResult
    .match(formattingTokensRegExp)
    ?.map(function (substring) {
      // Replace two single quote characters with one single quote character
      if (substring === "''") {
        return "'"
      }

      const firstCharacter = substring[0]
      if (firstCharacter === "'") {
        return cleanEscapedString(substring)
      }

      // @ts-ignore
      const formatter = formatters[firstCharacter]
      if (formatter) {
        return formatter(date, substring, locale.localize)
      } else if (Object.keys(formatterMap).includes(firstCharacter)) {
        // @ts-ignore
        const needed = formatterMap[firstCharacter] as string[]
        const missing = needed.find((n) => !Object.keys(date).includes(n))
        throw new RangeError(
          `Cannot format this type with formatter '${firstCharacter}'. Missing required field '${missing}'`
        )
      }

      if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
        throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`')
      }

      return substring
    })
    .join('')

  return result as string
}

function cleanEscapedString(input: string) {
  // @ts-ignore
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'")
}
