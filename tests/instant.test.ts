import { test } from 'beartest-js'
import { instantFns } from '../src/fns/index.ts'
import { strict as assert } from 'node:assert'

const { describe } = test
const it = test

describe('Instant', () => {
  describe('isValid', () => {
    it('allows minute precision', () => {
      assert.ok(instantFns.isValid('2020-01-01T12:30Z'))
    })

    it('allows second precision', () => {
      assert.ok(instantFns.isValid('2020-01-01T12:30:01Z'))
      assert.ok(instantFns.isValid('2020-01-01T12:30:00Z'))
    })

    it('allows 100ms precision', () => {
      assert.ok(instantFns.isValid('2020-01-01T12:30:01.1Z'))
      assert.ok(instantFns.isValid('2020-01-01T12:30:00.0Z'))
    })

    it('allows 10ms precision', () => {
      assert.ok(instantFns.isValid('2020-01-01T12:30:01.01Z'))
      assert.ok(instantFns.isValid('2020-01-01T12:30:00.00Z'))
    })
    it('allows 1ms precision', () => {
      assert.ok(instantFns.isValid('2020-01-01T12:30:01.001Z'))
      assert.ok(instantFns.isValid('2020-01-01T12:30:00.000Z'))
    })
    it('does not allow invalid', () => {
      assert.ok(!instantFns.isValid('2020-01-01T00:00:1Z'))
      assert.ok(!instantFns.isValid('test'))
      assert.ok(!instantFns.isValid('2020-01-01T00:00:00'))
      assert.ok(!instantFns.isValid(42))
    })
  })

  describe('instantFns.from()', () => {
    it('parses with UTC designator', () => {
      assert.equal(instantFns.from('1976-11-18T15:23Z'), '1976-11-18T15:23Z')
      assert.equal(instantFns.from('1976-11-18T15:23:30Z'), '1976-11-18T15:23:30Z')
      assert.equal(instantFns.from('1976-11-18T15:23:30.123Z'), '1976-11-18T15:23:30.123Z')
    })
    it('parses with an offset and normalizes to UTC', () => {
      assert.equal(instantFns.from('2020-02-12T11:42-08:00'), '2020-02-12T19:42Z')
      assert.equal(instantFns.from('2020-02-12T11:42+01:00'), '2020-02-12T10:42Z')
    })
    it('parses with an offset in brackets', () => {
      assert.equal(instantFns.from('2020-02-12T11:42-08:00[America/Vancouver]'), '2020-02-12T19:42Z')
    })
    it('throws for garbage input', () => {
      assert.throws(() => instantFns.from('not a date'))
    })
  })

  describe('instantFns.fromEpochMilliseconds / fromEpochSeconds', () => {
    it('fromEpochMilliseconds', () => {
      assert.equal(instantFns.fromEpochMilliseconds(0), '1970-01-01T00:00Z')
      assert.equal(instantFns.fromEpochMilliseconds(1_000), '1970-01-01T00:00:01Z')
      assert.equal(instantFns.fromEpochMilliseconds(1_577_836_800_000), '2020-01-01T00:00Z')
    })
    it('fromEpochSeconds', () => {
      assert.equal(instantFns.fromEpochSeconds(0), '1970-01-01T00:00Z')
      assert.equal(instantFns.fromEpochSeconds(1_577_836_800), '2020-01-01T00:00Z')
    })
    it('fromEpochSeconds rounds fractional seconds to the nearest millisecond', () => {
      assert.equal(instantFns.fromEpochSeconds(0.001), '1970-01-01T00:00:00.001Z')
    })
    it('throws if epochMilliseconds is missing', () => {
      // @ts-expect-error - missing required argument
      assert.throws(() => instantFns.fromEpochMilliseconds())
    })
    it('throws if epochSeconds is missing', () => {
      // @ts-expect-error - missing required argument
      assert.throws(() => instantFns.fromEpochSeconds())
    })
  })

  describe('getEpochSeconds / getEpochMilliseconds', () => {
    it('returns integer seconds for positive epoch', () => {
      assert.equal(instantFns.getEpochSeconds('2020-01-01T00:00Z'), 1_577_836_800)
      assert.equal(instantFns.getEpochMilliseconds('2020-01-01T00:00Z'), 1_577_836_800_000)
    })
    it('getEpochSeconds floors sub-second precision', () => {
      // Regression: previously returned epochMilliseconds/1000 and yielded floats.
      assert.equal(instantFns.getEpochSeconds('2020-01-01T00:00:00.500Z'), 1_577_836_800)
      assert.equal(instantFns.getEpochSeconds('2020-01-01T00:00:00.999Z'), 1_577_836_800)
    })
    it('getEpochSeconds floors toward -Infinity for pre-epoch times', () => {
      // Unix-time semantics: -0.5s → -1.
      assert.equal(instantFns.getEpochSeconds('1969-12-31T23:59:59.500Z'), -1)
      assert.equal(instantFns.getEpochSeconds('1969-12-31T23:59:59Z'), -1)
    })
  })

  describe('instantFns.add / subtract', () => {
    const inst = '1969-12-25T12:23:45.678Z'
    it('add(durationObj)', () => {
      assert.equal(instantFns.add(inst, { hours: 10 }), '1969-12-25T22:23:45.678Z')
      assert.equal(instantFns.add(inst, { minutes: 30 }), '1969-12-25T12:53:45.678Z')
    })
    it('add(duration string)', () => {
      assert.equal(instantFns.add(inst, 'PT1H'), '1969-12-25T13:23:45.678Z')
    })
    it('subtract(durationObj)', () => {
      assert.equal(instantFns.subtract(inst, { hours: 12 }), '1969-12-25T00:23:45.678Z')
    })
    it('add crosses the epoch', () => {
      // 1969-12-25 + 10 days = 1970-01-04
      assert.equal(instantFns.add(inst, { hours: 240 }), '1970-01-04T12:23:45.678Z')
    })
    it('add/subtract refuse calendar units', () => {
      assert.throws(() => instantFns.add(inst, { years: 1 }))
      assert.throws(() => instantFns.add(inst, { months: 1 }))
      assert.throws(() => instantFns.add(inst, { weeks: 1 }))
      assert.throws(() => instantFns.add(inst, { days: 1 }))
      assert.throws(() => instantFns.subtract(inst, { years: 1 }))
    })
  })

  describe('instantFns.until / since', () => {
    const earlier = '1976-11-18T15:23:30.123Z'
    const later = '2019-10-29T10:46:38.271Z'
    it('until returns a positive duration', () => {
      const d = instantFns.until(earlier, later, { largestUnit: 'hour' })
      assert.ok(d.startsWith('PT') && !d.startsWith('-'))
    })
    it('since returns a positive duration when other is earlier', () => {
      const d = instantFns.since(later, earlier, { largestUnit: 'hour' })
      assert.ok(d.startsWith('PT'))
    })
    it('until returns a negative duration when other is earlier', () => {
      const d = instantFns.until(later, earlier, { largestUnit: 'hour' })
      assert.ok(d.startsWith('-'))
    })
    it('until/since are exact inverses', () => {
      assert.equal(
        instantFns.until(earlier, later, { largestUnit: 'hour' }),
        instantFns.since(later, earlier, { largestUnit: 'hour' })
      )
    })
  })

  describe('instantFns.round', () => {
    const inst = '1976-11-18T14:23:30.123Z'
    it('rounds to hour', () => {
      assert.equal(instantFns.round(inst, { smallestUnit: 'hour' }), '1976-11-18T14:00Z')
    })
    it('rounds to minute', () => {
      assert.equal(instantFns.round(inst, { smallestUnit: 'minute' }), '1976-11-18T14:24Z')
    })
    it('rounds down with roundingMode', () => {
      assert.equal(instantFns.round(inst, { smallestUnit: 'minute', roundingMode: 'floor' }), '1976-11-18T14:23Z')
    })
  })

  describe('instantFns.equals / compare', () => {
    const i1 = '1976-11-18T15:23:30.123Z'
    const i2 = '1976-11-18T15:23:30.123Z'
    const i3 = '2019-10-29T10:46:38.271Z'
    it('equals', () => {
      assert.ok(instantFns.equals(i1, i2))
      assert.ok(!instantFns.equals(i1, i3))
    })
    it('compare', () => {
      assert.equal(instantFns.compare(i1, i2), 0)
      assert.equal(instantFns.compare(i1, i3), -1)
      assert.equal(instantFns.compare(i3, i1), 1)
    })
  })

  describe('instant comparison methods', () => {
    const earlier = instantFns.from('1976-11-18T15:23:30.123Z')
    const later = instantFns.from('2019-10-29T10:46:38.271Z')
    it('isBefore', () => {
      assert.equal(instantFns.isBefore(earlier, later), true)
      assert.equal(instantFns.isBefore(later, earlier), false)
      assert.equal(instantFns.isBefore(earlier, earlier), false)
    })
    it('isAfter', () => {
      assert.equal(instantFns.isAfter(later, earlier), true)
      assert.equal(instantFns.isAfter(earlier, later), false)
      assert.equal(instantFns.isAfter(earlier, earlier), false)
    })
    it('isEqualOrBefore', () => {
      assert.equal(instantFns.isEqualOrBefore(earlier, earlier), true)
      assert.equal(instantFns.isEqualOrBefore(earlier, later), true)
      assert.equal(instantFns.isEqualOrBefore(later, earlier), false)
    })
    it('isEqualOrAfter', () => {
      assert.equal(instantFns.isEqualOrAfter(earlier, earlier), true)
      assert.equal(instantFns.isEqualOrAfter(later, earlier), true)
      assert.equal(instantFns.isEqualOrAfter(earlier, later), false)
    })
  })

  describe('instantFns.toZonedDateTime', () => {
    it('converts to UTC', () => {
      assert.equal(instantFns.toZonedDateTime('2020-01-01T00:00Z', 'UTC'), '2020-01-01T00:00+00:00[UTC]')
    })
    it('converts to a non-UTC zone', () => {
      assert.equal(
        instantFns.toZonedDateTime('1976-11-18T14:23:30.123Z', 'America/New_York'),
        '1976-11-18T09:23:30.123-05:00[America/New_York]'
      )
    })
  })

  describe('instantFns.toJsDate', () => {
    it('round-trips through a Date object', () => {
      const d = instantFns.toJsDate('2020-01-01T00:00Z')
      assert.ok(d instanceof Date)
      assert.equal(d.toISOString(), '2020-01-01T00:00:00.000Z')
    })
  })

  describe('formatISO9075', () => {
    it('produces YYYY-MM-DD HH:MM:SS.SSS even for compact forms', () => {
      assert.equal(instantFns.formatISO9075('2020-01-01T00:00Z'), '2020-01-01 00:00:00.000')
      assert.equal(instantFns.formatISO9075('2020-01-01T12:34:56Z'), '2020-01-01 12:34:56.000')
    })
    it('preserves milliseconds', () => {
      assert.equal(instantFns.formatISO9075('2026-06-18T20:19:11.598Z'), '2026-06-18 20:19:11.598')
    })
    it('keeps trailing-zero milliseconds (no trimming)', () => {
      assert.equal(instantFns.formatISO9075('2026-06-18T20:19:11.500Z'), '2026-06-18 20:19:11.500')
    })
    it('emits .000 for a whole second', () => {
      assert.equal(instantFns.formatISO9075('2026-06-18T20:19:11Z'), '2026-06-18 20:19:11.000')
    })
    it('always emits a dot and three trailing digits (regression guard)', () => {
      assert.match(instantFns.formatISO9075('2026-06-18T20:19:11.598Z'), /\.\d{3}$/)
      assert.match(instantFns.formatISO9075('2026-06-18T20:19:11Z'), /\.\d{3}$/)
    })
    it('pads BC years with the sign in front of zero padding', () => {
      // Regression: previously rendered year -1 as "0-1" because padStart sees the minus sign.
      assert.equal(instantFns.formatISO9075('-000001-06-15T00:00Z' as never), '-0001-06-15 00:00:00.000')
      assert.equal(instantFns.formatISO9075('-000100-01-01T00:00Z' as never), '-0100-01-01 00:00:00.000')
    })
    it('throws for invalid input', () => {
      assert.throws(() => instantFns.formatISO9075('not-an-instant' as never))
    })
    it('chain exposes formatISO9075', () => {
      assert.equal(instantFns.chain('2020-01-01T00:00Z').formatISO9075().value(), '2020-01-01 00:00:00.000')
      assert.equal(
        instantFns.chain('2026-06-18T20:19:11.598Z').formatISO9075().value(),
        '2026-06-18 20:19:11.598'
      )
    })
  })

  describe('instantFns.chain', () => {
    const inst = '1976-11-18T15:23:30.123Z'
    it('round-trips via value()', () => {
      assert.equal(instantFns.chain(inst).value(), inst)
    })
    it('exposes getters', () => {
      assert.equal(instantFns.chain(inst).getEpochMilliseconds().value(), instantFns.getEpochMilliseconds(inst))
      assert.equal(instantFns.chain(inst).getEpochSeconds().value(), instantFns.getEpochSeconds(inst))
    })
    it('supports add / subtract', () => {
      assert.equal(instantFns.chain(inst).add({ hours: 1 }).value(), instantFns.add(inst, { hours: 1 }))
      assert.equal(instantFns.chain(inst).subtract({ minutes: 30 }).value(), instantFns.subtract(inst, { minutes: 30 }))
    })
    it('supports comparison methods', () => {
      const other = '2019-10-29T10:46:38.271Z'
      assert.equal(instantFns.chain(inst).isBefore(other).value(), true)
      assert.equal(instantFns.chain(inst).isAfter(other).value(), false)
      assert.equal(instantFns.chain(inst).equals(inst).value(), true)
    })
    it('supports toZonedDateTime', () => {
      assert.equal(instantFns.chain('2020-01-01T00:00Z').toZonedDateTime('UTC').value(), '2020-01-01T00:00+00:00[UTC]')
    })
    it('supports toJsDate', () => {
      const d = instantFns.chain('2020-01-01T00:00Z').toJsDate().value()
      assert.equal(d.toISOString(), '2020-01-01T00:00:00.000Z')
    })
  })
})
