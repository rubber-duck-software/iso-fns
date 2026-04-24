import { test } from 'beartest-js'
import { strict as assert } from 'assert'
import { zonedDateTimeFns } from '../src/index'

const { describe } = test
const it = test

describe('ZonedDateTime', () => {
  const tz = 'America/Los_Angeles'

  describe('isValid', () => {
    it('allows minute precision', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30-06:00[America/Chicago]'))
    })
    it('allows second precision', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:01-06:00[America/Chicago]'))
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:00-06:00[America/Chicago]'))
    })
    it('allows 100ms precision', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:01.1-06:00[America/Chicago]'))
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:00.0-06:00[America/Chicago]'))
    })
    it('allows 10ms precision', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:01.01-06:00[America/Chicago]'))
    })
    it('allows 1ms precision', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:01.001-06:00[America/Chicago]'))
    })
    it('does not allow invalid', () => {
      assert.ok(!zonedDateTimeFns.isValid('2020-01-01T00:00:1-06:00[America/Chicago]'))
      assert.ok(!zonedDateTimeFns.isValid('test'))
      assert.ok(!zonedDateTimeFns.isValid('2020-01-01T00:00Z'))
    })
  })

  describe('Construction and properties', () => {
    const epochMillis = Date.UTC(1976, 10, 18, 15, 23, 30, 123)
    const zdt = zonedDateTimeFns.fromEpochMilliseconds(epochMillis, tz)
    it('fromEpochMilliseconds produces a valid ZonedDateTime', () => {
      assert.ok(zonedDateTimeFns.isValid(zdt))
    })
    it('round-trips via toInstant', () => {
      assert.equal(zonedDateTimeFns.chain(zdt).toInstant().getEpochMilliseconds().value(), epochMillis)
    })
    it('getEpochSeconds returns an integer (regression: previously returned floats)', () => {
      const sub = zonedDateTimeFns.fromEpochMilliseconds(1_000, tz)
      assert.equal(zonedDateTimeFns.getEpochSeconds(sub), 1)
      assert.equal(zonedDateTimeFns.chain(sub).getEpochSeconds().value(), 1)
      const subMs = zonedDateTimeFns.fromEpochMilliseconds(1_500, tz)
      assert.equal(zonedDateTimeFns.getEpochSeconds(subMs), 1)
    })
    it('exposes calendar/clock fields', () => {
      assert.equal(zonedDateTimeFns.getYear(zdt), 1976)
      assert.equal(zonedDateTimeFns.getMonth(zdt), 11)
      assert.equal(zonedDateTimeFns.getDay(zdt), 18)
      assert.equal(zonedDateTimeFns.getTimeZone(zdt), tz)
      assert.equal(zonedDateTimeFns.getMillisecond(zdt), 123)
    })
    it('exposes derived fields', () => {
      const oct = zonedDateTimeFns.from('2020-10-15T10:00-07:00[America/Los_Angeles]')
      assert.equal(zonedDateTimeFns.getDayOfWeek(oct), 4)
      assert.equal(zonedDateTimeFns.getDaysInMonth(oct), 31)
      assert.equal(zonedDateTimeFns.getDaysInYear(oct), 366) // 2020 is a leap year
      assert.equal(zonedDateTimeFns.inLeapYear(oct), true)
    })
  })

  describe('from()', () => {
    it('parses with an IANA zone', () => {
      assert.equal(
        zonedDateTimeFns.from('2020-03-08T01:00-08:00[America/Los_Angeles]'),
        '2020-03-08T01:00-08:00[America/Los_Angeles]'
      )
    })
    it('parses with an IANA zone but no offset', () => {
      assert.equal(
        zonedDateTimeFns.from('2020-03-08T01:00[America/Los_Angeles]'),
        '2020-03-08T01:00-08:00[America/Los_Angeles]'
      )
    })
    it('"Z" preserves the exact time in the given IANA time zone', () => {
      assert.equal(
        zonedDateTimeFns.from('2020-03-08T09:00:00Z[America/Los_Angeles]'),
        '2020-03-08T01:00-08:00[America/Los_Angeles]'
      )
    })
    it('throws on junk after a valid string', () => {
      assert.throws(() => zonedDateTimeFns.from('2020-01-01T00:00-08:00[America/Los_Angeles]junk'))
    })
  })

  describe('from() disambiguation around spring-forward DST', () => {
    const str = '2020-03-08T02:30[America/Los_Angeles]' // doesn't exist in LA
    it('defaults to compatible', () => {
      assert.equal(zonedDateTimeFns.from(str), '2020-03-08T03:30-07:00[America/Los_Angeles]')
    })
    it('earlier', () => {
      assert.equal(zonedDateTimeFns.from(str, { disambiguation: 'earlier' }), '2020-03-08T01:30-08:00[America/Los_Angeles]')
    })
    it('later', () => {
      assert.equal(zonedDateTimeFns.from(str, { disambiguation: 'later' }), '2020-03-08T03:30-07:00[America/Los_Angeles]')
    })
    it('reject throws', () => {
      assert.throws(() => zonedDateTimeFns.from(str, { disambiguation: 'reject' }))
    })
  })

  describe('from() offset option', () => {
    it('prefer uses matching offset (first 1:30 when DST ends)', () => {
      assert.equal(
        zonedDateTimeFns.from('2020-11-01T01:30-07:00[America/Los_Angeles]', { offset: 'prefer' }),
        '2020-11-01T01:30-07:00[America/Los_Angeles]'
      )
    })
    it('use keeps the offset when it conflicts with the zone', () => {
      assert.equal(
        zonedDateTimeFns.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'use' }),
        '2020-11-01T03:00-08:00[America/Los_Angeles]'
      )
    })
    it('reject throws when the offset does not match', () => {
      assert.throws(() => zonedDateTimeFns.from('2020-03-08T01:00-04:00[America/Chicago]', { offset: 'reject' }))
    })
  })

  describe('from() property bag', () => {
    it('builds from year/month/day/timeZone', () => {
      assert.equal(
        zonedDateTimeFns.from({ year: 1976, month: 11, day: 18, timeZone: 'Africa/Lagos' }),
        '1976-11-18T00:00+01:00[Africa/Lagos]'
      )
    })
    it('casts timeZone property', () => {
      assert.equal(
        zonedDateTimeFns.from({ year: 1976, month: 11, day: 18, timeZone: 'Africa/Lagos' }),
        '1976-11-18T00:00+01:00[Africa/Lagos]'
      )
    })
    it('respects overflow: reject', () => {
      assert.throws(() =>
        zonedDateTimeFns.from({ year: 2019, month: 1, day: 32, timeZone: 'Africa/Lagos' }, { overflow: 'reject' })
      )
    })
    it('constrains by default', () => {
      assert.equal(
        zonedDateTimeFns.from({ year: 2019, month: 1, day: 32, timeZone: 'Africa/Lagos' }),
        '2019-01-31T00:00+01:00[Africa/Lagos]'
      )
    })
  })

  describe('with()', () => {
    const base = zonedDateTimeFns.from('2020-01-15T12:30:45[America/Los_Angeles]')
    it('replaces a single field', () => {
      assert.equal(zonedDateTimeFns.with(base, { year: 2021 }), '2021-01-15T12:30:45-08:00[America/Los_Angeles]')
    })
    it('replaces multiple fields', () => {
      assert.equal(
        zonedDateTimeFns.with(base, { month: 6, day: 1, hour: 0, minute: 0, second: 0 }),
        '2020-06-01T00:00-07:00[America/Los_Angeles]'
      )
    })
  })

  describe('withDate / withTime / withTimeZone', () => {
    const base = zonedDateTimeFns.from('2020-01-15T12:30:45[America/Los_Angeles]')
    it('withDate (string)', () => {
      assert.equal(zonedDateTimeFns.withDate(base, '2022-07-04'), '2022-07-04T12:30:45-07:00[America/Los_Angeles]')
    })
    it('withDate (object)', () => {
      assert.equal(
        zonedDateTimeFns.withDate(base, { year: 2022, month: 7, day: 4 }),
        '2022-07-04T12:30:45-07:00[America/Los_Angeles]'
      )
    })
    it('withTime', () => {
      assert.equal(zonedDateTimeFns.withTime(base, '06:00'), '2020-01-15T06:00-08:00[America/Los_Angeles]')
    })
    it('withTimeZone shifts clock time, preserves instant', () => {
      const utc = zonedDateTimeFns.withTimeZone(base, 'UTC')
      assert.equal(zonedDateTimeFns.chain(base).toInstant().value(), zonedDateTimeFns.chain(utc).toInstant().value())
      assert.equal(zonedDateTimeFns.getTimeZone(utc), 'UTC')
    })
  })

  describe('add / subtract', () => {
    const base = zonedDateTimeFns.from('2020-01-15T12:30[America/Los_Angeles]')
    it('add(durationObj)', () => {
      assert.equal(zonedDateTimeFns.add(base, { hours: 24 }), '2020-01-16T12:30-08:00[America/Los_Angeles]')
    })
    it('add(duration string)', () => {
      assert.equal(zonedDateTimeFns.add(base, 'P1M'), '2020-02-15T12:30-08:00[America/Los_Angeles]')
    })
    it('subtract(durationObj)', () => {
      assert.equal(zonedDateTimeFns.subtract(base, { months: 1 }), '2019-12-15T12:30-08:00[America/Los_Angeles]')
    })
    it('add adjusts for DST (spring forward)', () => {
      // 24h after midnight on a spring-forward day is still 23 clock hours later.
      const before = zonedDateTimeFns.from('2020-03-08T00:00[America/Los_Angeles]')
      const after = zonedDateTimeFns.add(before, { hours: 24 })
      assert.equal(after, '2020-03-09T01:00-07:00[America/Los_Angeles]')
    })
    it('add 1 day vs 24 hours differs across DST (spring forward)', () => {
      const before = zonedDateTimeFns.from('2020-03-08T00:00[America/Los_Angeles]')
      assert.equal(zonedDateTimeFns.add(before, { days: 1 }), '2020-03-09T00:00-07:00[America/Los_Angeles]')
      // Adding 24 hours crosses the 2AM-3AM gap, so clock time advances to 01:00.
      assert.equal(zonedDateTimeFns.add(before, { hours: 24 }), '2020-03-09T01:00-07:00[America/Los_Angeles]')
    })
  })

  describe('until / since', () => {
    const earlier = zonedDateTimeFns.from('2020-01-01T00:00-08:00[America/Los_Angeles]')
    const later = zonedDateTimeFns.from('2020-03-01T00:00-08:00[America/Los_Angeles]')
    it('until returns a positive duration', () => {
      assert.ok(!zonedDateTimeFns.until(earlier, later).startsWith('-'))
    })
    it('since returns a positive duration when other is earlier', () => {
      assert.ok(!zonedDateTimeFns.since(later, earlier).startsWith('-'))
    })
    it('until/since are negations', () => {
      assert.equal(zonedDateTimeFns.until(earlier, later), zonedDateTimeFns.since(later, earlier))
    })
    it('honors largestUnit', () => {
      assert.equal(zonedDateTimeFns.until(earlier, later, { largestUnit: 'day' }), 'P60D')
    })
  })

  describe('round', () => {
    const base = zonedDateTimeFns.from('2020-01-15T12:30:45[America/Los_Angeles]')
    it('rounds to the nearest hour', () => {
      assert.equal(zonedDateTimeFns.round(base, { smallestUnit: 'hour' }), '2020-01-15T13:00-08:00[America/Los_Angeles]')
    })
    it('floors to the day', () => {
      assert.equal(
        zonedDateTimeFns.round(base, { smallestUnit: 'day', roundingMode: 'floor' }),
        '2020-01-15T00:00-08:00[America/Los_Angeles]'
      )
    })
  })

  describe('equals / compare', () => {
    const a = zonedDateTimeFns.from('2020-01-01T00:00-08:00[America/Los_Angeles]')
    // Same exact instant, different zone:
    const b = zonedDateTimeFns.from('2020-01-01T03:00-05:00[America/New_York]')
    it('equals compares exact instant AND zone (so same instant but different zone ≠)', () => {
      assert.ok(!zonedDateTimeFns.equals(a, b))
    })
    it('compare compares exact instant', () => {
      assert.equal(zonedDateTimeFns.compare(a, b), 0)
    })
    it('compare orders by instant', () => {
      const earlier = zonedDateTimeFns.from('1999-12-31T23:30-08:00[America/Vancouver]')
      const later = zonedDateTimeFns.from('2000-01-01T01:30-04:00[America/Halifax]')
      assert.equal(zonedDateTimeFns.compare(earlier, later), 1)
    })
  })

  describe('startOfDay', () => {
    it('returns midnight in the zone', () => {
      const noon = zonedDateTimeFns.from('2020-01-15T12:30[America/Los_Angeles]')
      assert.equal(zonedDateTimeFns.startOfDay(noon), '2020-01-15T00:00-08:00[America/Los_Angeles]')
    })
    it('handles spring-forward days by skipping to first valid instant', () => {
      // 2019-03-10 in LA: local time skips from 02:00 to 03:00. startOfDay is still 00:00.
      const springDay = zonedDateTimeFns.from('2019-03-10T12:00[America/Los_Angeles]')
      assert.equal(zonedDateTimeFns.startOfDay(springDay), '2019-03-10T00:00-08:00[America/Los_Angeles]')
    })
  })

  describe('getHoursInDay', () => {
    it('is 24 on normal days', () => {
      assert.equal(zonedDateTimeFns.getHoursInDay('2020-01-15T12:00-08:00[America/Los_Angeles]'), 24)
    })
    it('is 23 on spring-forward days', () => {
      assert.equal(zonedDateTimeFns.getHoursInDay('2020-03-08T12:00-07:00[America/Los_Angeles]'), 23)
    })
    it('is 25 on fall-back days', () => {
      assert.equal(zonedDateTimeFns.getHoursInDay('2020-11-01T12:00-08:00[America/Los_Angeles]'), 25)
    })
  })

  describe('Conversions', () => {
    const zdt = zonedDateTimeFns.from('2020-01-15T12:30:45[America/Los_Angeles]')
    it('toInstant', () => {
      assert.equal(zonedDateTimeFns.toInstant(zdt), '2020-01-15T20:30:45Z')
    })
    it('toDate', () => {
      assert.equal(zonedDateTimeFns.toDate(zdt), '2020-01-15')
    })
    it('toTime', () => {
      assert.equal(zonedDateTimeFns.toTime(zdt), '12:30:45')
    })
    it('toDateTime', () => {
      assert.equal(zonedDateTimeFns.toDateTime(zdt), '2020-01-15T12:30:45')
    })
    it('toYearMonth', () => {
      assert.equal(zonedDateTimeFns.toYearMonth(zdt), '2020-01')
    })
    it('toMonthDay', () => {
      assert.equal(zonedDateTimeFns.toMonthDay(zdt), '--01-15')
    })
  })

  describe('format', () => {
    const zdt = zonedDateTimeFns.from('2020-01-15T12:30:45-08:00[America/Los_Angeles]')
    it('formats calendar tokens', () => {
      assert.equal(zonedDateTimeFns.format(zdt, 'yyyy-MM-dd'), '2020-01-15')
      assert.equal(zonedDateTimeFns.format(zdt, 'MMMM d, y'), 'January 15, 2020')
    })
    it('formats time tokens', () => {
      assert.equal(zonedDateTimeFns.format(zdt, 'HH:mm:ss'), '12:30:45')
    })
    it('formats offset tokens', () => {
      assert.equal(zonedDateTimeFns.format(zdt, 'XXX'), '-08:00')
    })
    it('time zone name reflects DST (regression: cache used to lock in the first-seen name)', () => {
      const winter = zonedDateTimeFns.from('2020-01-15T12:00-05:00[America/New_York]')
      const summer = zonedDateTimeFns.from('2020-07-15T12:00-04:00[America/New_York]')
      assert.equal(zonedDateTimeFns.format(winter, 'zzz'), 'EST')
      assert.equal(zonedDateTimeFns.format(summer, 'zzz'), 'EDT')
      // And back again — verify the second lookup of winter still resolves EST.
      assert.equal(zonedDateTimeFns.format(winter, 'zzz'), 'EST')
    })
  })

  describe('getFields', () => {
    it('returns all slots including timeZone, offset, and epochMilliseconds', () => {
      const zdt = zonedDateTimeFns.from('2020-01-15T12:30:45[America/Los_Angeles]')
      const fields = zonedDateTimeFns.getFields(zdt)
      assert.equal(fields.year, 2020)
      assert.equal(fields.month, 1)
      assert.equal(fields.day, 15)
      assert.equal(fields.hour, 12)
      assert.equal(fields.minute, 30)
      assert.equal(fields.second, 45)
      assert.equal(fields.timeZone, 'America/Los_Angeles')
      assert.equal(fields.offset, '-08:00')
      assert.equal(typeof fields.epochMilliseconds, 'number')
    })
  })

  describe('zonedDateTime comparison methods', () => {
    const earlier = zonedDateTimeFns.from('2020-01-01T00:00-06:00[America/Chicago]')
    const later = zonedDateTimeFns.from('2020-06-01T00:00-05:00[America/Chicago]')
    it('isBefore', () => {
      assert.equal(zonedDateTimeFns.isBefore(earlier, later), true)
      assert.equal(zonedDateTimeFns.isBefore(later, earlier), false)
      assert.equal(zonedDateTimeFns.isBefore(earlier, earlier), false)
    })
    it('isAfter', () => {
      assert.equal(zonedDateTimeFns.isAfter(later, earlier), true)
      assert.equal(zonedDateTimeFns.isAfter(earlier, later), false)
      assert.equal(zonedDateTimeFns.isAfter(earlier, earlier), false)
    })
    it('isEqualOrBefore', () => {
      assert.equal(zonedDateTimeFns.isEqualOrBefore(earlier, earlier), true)
      assert.equal(zonedDateTimeFns.isEqualOrBefore(earlier, later), true)
      assert.equal(zonedDateTimeFns.isEqualOrBefore(later, earlier), false)
    })
    it('isEqualOrAfter', () => {
      assert.equal(zonedDateTimeFns.isEqualOrAfter(earlier, earlier), true)
      assert.equal(zonedDateTimeFns.isEqualOrAfter(later, earlier), true)
      assert.equal(zonedDateTimeFns.isEqualOrAfter(earlier, later), false)
    })
    it('chain exposes comparisons', () => {
      assert.equal(zonedDateTimeFns.chain(earlier).isBefore(later).value(), true)
      assert.equal(zonedDateTimeFns.chain(later).isAfter(earlier).value(), true)
      assert.equal(zonedDateTimeFns.chain(earlier).isEqualOrBefore(earlier).value(), true)
      assert.equal(zonedDateTimeFns.chain(earlier).isEqualOrAfter(earlier).value(), true)
    })
  })

  describe('chain', () => {
    const zdt = zonedDateTimeFns.from('2020-01-15T12:30:45[America/Los_Angeles]')
    it('round-trips via value()', () => {
      assert.equal(zonedDateTimeFns.chain(zdt).value(), zdt)
    })
    it('exposes getters', () => {
      assert.equal(zonedDateTimeFns.chain(zdt).getYear().value(), 2020)
      assert.equal(zonedDateTimeFns.chain(zdt).getTimeZone().value(), 'America/Los_Angeles')
    })
    it('supports arithmetic', () => {
      assert.equal(zonedDateTimeFns.chain(zdt).add({ days: 1 }).value(), zonedDateTimeFns.add(zdt, { days: 1 }))
      assert.equal(zonedDateTimeFns.chain(zdt).subtract({ hours: 1 }).value(), zonedDateTimeFns.subtract(zdt, { hours: 1 }))
    })
    it('supports conversion methods', () => {
      assert.equal(zonedDateTimeFns.chain(zdt).toDate().value(), '2020-01-15')
      assert.equal(zonedDateTimeFns.chain(zdt).toTime().value(), '12:30:45')
      assert.equal(zonedDateTimeFns.chain(zdt).toDateTime().value(), '2020-01-15T12:30:45')
      assert.equal(zonedDateTimeFns.chain(zdt).toYearMonth().value(), '2020-01')
      assert.equal(zonedDateTimeFns.chain(zdt).toMonthDay().value(), '--01-15')
      assert.equal(zonedDateTimeFns.chain(zdt).toInstant().value(), '2020-01-15T20:30:45Z')
    })
    it('supports withDate / withTime / withTimeZone', () => {
      assert.equal(
        zonedDateTimeFns.chain(zdt).withDate('2021-06-01').value(),
        '2021-06-01T12:30:45-07:00[America/Los_Angeles]'
      )
      assert.equal(zonedDateTimeFns.chain(zdt).withTime('06:00').value(), '2020-01-15T06:00-08:00[America/Los_Angeles]')
    })
    it('supports format', () => {
      assert.equal(zonedDateTimeFns.chain(zdt).format('yyyy-MM-dd').value(), '2020-01-15')
    })
    it('supports startOfDay', () => {
      assert.equal(zonedDateTimeFns.chain(zdt).startOfDay().value(), '2020-01-15T00:00-08:00[America/Los_Angeles]')
    })
  })
})
