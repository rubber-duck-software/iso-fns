import { test } from 'beartest-js'
import { timeFns } from '../src/fns/index.ts'
import { strict as assert } from 'node:assert'

const { describe } = test
const it = test

describe('timeFns', () => {
  describe('isValid', () => {
    it('allows minute precision', () => {
      assert.ok(timeFns.isValid('12:30'))
    })

    it('allows second precision', () => {
      assert.ok(timeFns.isValid('12:30:01'))
      assert.ok(timeFns.isValid('12:30:00'))
    })

    it('allows 100ms precision', () => {
      assert.ok(timeFns.isValid('12:30:01.1'))
      assert.ok(timeFns.isValid('12:30:00.0'))
    })

    it('allows 10ms precision', () => {
      assert.ok(timeFns.isValid('12:30:01.01'))
      assert.ok(timeFns.isValid('12:30:00.00'))
    })
    it('allows 1ms precision', () => {
      assert.ok(timeFns.isValid('12:30:01.001'))
      assert.ok(timeFns.isValid('12:30:00.000'))
    })
    it('does not allow invalid', () => {
      assert.ok(!timeFns.isValid('00:00:1'))
      assert.ok(!timeFns.isValid('test'))
      assert.ok(!timeFns.isValid('24:00'))
      assert.ok(!timeFns.isValid(42))
    })
  })

  describe('timeFns.fromNumbers', () => {
    it('builds a Time from hour/minute/second/ms', () => {
      assert.equal(timeFns.fromNumbers(1, 2, 3, 4), '01:02:03.004')
      assert.equal(timeFns.fromNumbers(0, 0, 0, 0), '00:00')
      assert.equal(timeFns.fromNumbers(23, 59, 59), '23:59:59')
    })
    it('defaults all arguments to 0', () => {
      assert.equal(timeFns.fromNumbers(), '00:00')
      assert.equal(timeFns.fromNumbers(10), '10:00')
    })
    it('throws for out-of-range values', () => {
      assert.throws(() => timeFns.fromNumbers(24))
      assert.throws(() => timeFns.fromNumbers(12, 60))
    })
  })

  describe('timeFns.from', () => {
    it('parses ISO time strings', () => {
      assert.equal(timeFns.from('12:30'), '12:30')
      assert.equal(timeFns.from('12:30:00'), '12:30')
      assert.equal(timeFns.from('12:30:45.123'), '12:30:45.123')
    })
    it('parses object input', () => {
      assert.equal(timeFns.from({ hour: 12, minute: 30 }), '12:30')
    })
    it('extracts the time portion from an ISO date-time string', () => {
      assert.equal(timeFns.from('2020-01-01T12:30:45'), '12:30:45')
    })
    it('respects overflow: reject', () => {
      assert.throws(() => timeFns.from({ hour: 25 }, { overflow: 'reject' }))
    })
  })

  describe('timeFns property accessors', () => {
    const t = '13:45:30.123'
    it('getHour / getMinute / getSecond / getMillisecond', () => {
      assert.equal(timeFns.getHour(t), 13)
      assert.equal(timeFns.getMinute(t), 45)
      assert.equal(timeFns.getSecond(t), 30)
      assert.equal(timeFns.getMillisecond(t), 123)
    })
    it('reads 0 for unspecified fields', () => {
      assert.equal(timeFns.getSecond('13:45'), 0)
      assert.equal(timeFns.getMillisecond('13:45:30'), 0)
    })
  })

  describe('timeFns.with', () => {
    const t = '13:45:30.123'
    it('replaces individual fields', () => {
      assert.equal(timeFns.with(t, { hour: 5 }), '05:45:30.123')
      assert.equal(timeFns.with(t, { minute: 0, second: 0, millisecond: 0 }), '13:00')
    })
    it('respects overflow: reject', () => {
      assert.throws(() => timeFns.with(t, { hour: 25 }, { overflow: 'reject' }))
    })
    it('constrains by default', () => {
      assert.equal(timeFns.with(t, { hour: 25 }), '23:45:30.123')
    })
  })

  describe('timeFns.add / subtract', () => {
    const t = '12:00'
    it('add(durationObj)', () => {
      assert.equal(timeFns.add(t, { hours: 2, minutes: 30 }), '14:30')
      assert.equal(timeFns.add(t, { milliseconds: 500 }), '12:00:00.5')
    })
    it('add wraps past midnight', () => {
      assert.equal(timeFns.add('23:00', { hours: 2 }), '01:00')
    })
    it('add(duration string)', () => {
      assert.equal(timeFns.add(t, 'PT1H'), '13:00')
    })
    it('subtract(durationObj)', () => {
      assert.equal(timeFns.subtract(t, { hours: 1 }), '11:00')
    })
    it('subtract wraps past midnight', () => {
      assert.equal(timeFns.subtract('01:00', { hours: 2 }), '23:00')
    })
  })

  describe('timeFns.until / since', () => {
    it('until returns a positive duration for later time', () => {
      const d = timeFns.until('09:00', '11:30')
      assert.equal(d, 'PT2H30M')
    })
    it('since returns a positive duration for earlier time', () => {
      assert.equal(timeFns.since('11:30', '09:00'), 'PT2H30M')
    })
    it('until/since are negations', () => {
      assert.equal(timeFns.until('09:00', '11:30'), timeFns.since('11:30', '09:00'))
      assert.equal(timeFns.until('11:30', '09:00'), timeFns.since('09:00', '11:30'))
    })
    it('honors largestUnit', () => {
      assert.equal(timeFns.until('00:00', '02:30', { largestUnit: 'minute' }), 'PT150M')
    })
  })

  describe('timeFns.round', () => {
    it('rounds to the nearest hour', () => {
      assert.equal(timeFns.round('12:30', { smallestUnit: 'hour' }), '13:00')
      assert.equal(timeFns.round('12:29', { smallestUnit: 'hour' }), '12:00')
    })
    it('rounds down with roundingMode', () => {
      assert.equal(timeFns.round('12:45', { smallestUnit: 'hour', roundingMode: 'floor' }), '12:00')
    })
    it('rounds with increment', () => {
      assert.equal(timeFns.round('12:34', { smallestUnit: 'minute', roundingIncrement: 15 }), '12:30')
    })
  })

  describe('timeFns.equals / compare', () => {
    it('equals', () => {
      assert.ok(timeFns.equals('12:30', '12:30'))
      assert.ok(timeFns.equals('12:30', '12:30:00'))
      assert.ok(!timeFns.equals('12:30', '12:31'))
    })
    it('compare', () => {
      assert.equal(timeFns.compare('12:30', '12:30'), 0)
      assert.equal(timeFns.compare('09:00', '10:00'), -1)
      assert.equal(timeFns.compare('10:00', '09:00'), 1)
    })
  })

  describe('timeFns.toDateTime / toZonedDateTime', () => {
    it('toDateTime combines with an Iso.Date', () => {
      assert.equal(timeFns.toDateTime('12:30', '2020-01-01'), '2020-01-01T12:30')
    })
    it('toZonedDateTime combines with date + timeZone', () => {
      assert.equal(timeFns.toZonedDateTime('12:30', { date: '2020-01-01', timeZone: 'UTC' }), '2020-01-01T12:30+00:00[UTC]')
    })
    it('toZonedDateTime requires the item argument', () => {
      // @ts-expect-error - missing required item argument
      assert.throws(() => timeFns.toZonedDateTime('12:30'))
    })
    it('toZonedDateTime requires date and timeZone', () => {
      // @ts-expect-error - missing required timeZone
      assert.throws(() => timeFns.toZonedDateTime('12:30', { date: '2020-01-01' }))
      // @ts-expect-error - missing required date
      assert.throws(() => timeFns.toZonedDateTime('12:30', { timeZone: 'UTC' }))
    })
  })

  describe('timeFns.getFields', () => {
    it('returns all fields', () => {
      assert.deepEqual(timeFns.getFields('13:45:30.123'), {
        hour: 13,
        minute: 45,
        second: 30,
        millisecond: 123
      })
    })
  })

  describe('timeFns.format', () => {
    it('formats with time tokens', () => {
      assert.equal(timeFns.format('13:45:30', 'HH:mm:ss'), '13:45:30')
      assert.equal(timeFns.format('13:45', 'h:mm a'), '1:45 PM')
    })
  })

  describe('timeFns.chain', () => {
    const t = '13:45:30.123'
    it('round-trips via value()', () => {
      assert.equal(timeFns.chain(t).value(), t)
    })
    it('exposes getters', () => {
      assert.equal(timeFns.chain(t).getHour().value(), 13)
      assert.equal(timeFns.chain(t).getMinute().value(), 45)
    })
    it('supports arithmetic', () => {
      assert.equal(timeFns.chain(t).add({ hours: 1 }).value(), '14:45:30.123')
      assert.equal(timeFns.chain(t).subtract({ minutes: 45 }).value(), '13:00:30.123')
    })
    it('supports with()', () => {
      assert.equal(timeFns.chain(t).with({ hour: 0 }).value(), '00:45:30.123')
    })
    it('supports until/since', () => {
      assert.equal(timeFns.chain('09:00').until('11:30').value(), 'PT2H30M')
    })
    it('supports round()', () => {
      assert.equal(timeFns.chain('12:30').round({ smallestUnit: 'hour' }).value(), '13:00')
    })
    it('supports equals', () => {
      assert.equal(timeFns.chain(t).equals(t).value(), true)
    })
    it('supports toDateTime', () => {
      assert.equal(timeFns.chain('12:30').toDateTime('2020-01-01').value(), '2020-01-01T12:30')
    })
    it('supports toZonedDateTime', () => {
      assert.equal(
        timeFns.chain('12:30').toZonedDateTime({ date: '2020-01-01', timeZone: 'UTC' }).value(),
        '2020-01-01T12:30+00:00[UTC]'
      )
    })
    it('supports getFields', () => {
      assert.deepEqual(timeFns.chain(t).getFields().value(), timeFns.getFields(t))
    })
    it('supports format', () => {
      assert.equal(timeFns.chain(t).format('HH:mm').value(), '13:45')
    })
  })
})
