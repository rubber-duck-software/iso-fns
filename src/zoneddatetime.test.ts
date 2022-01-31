import { describe, it } from 'beartest-js'
import { strict as assert } from 'assert'
import { dateFns, dateTimeFns, durationFns, instantFns, timeFns, zonedDateTimeFns } from './index'
import { TemporalPluralUnit, TemporalSingularUnit } from 'ecmascript'

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
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:00.00-06:00[America/Chicago]'))
    })
    it('allows 1ms precision', () => {
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:01.001-06:00[America/Chicago]'))
      assert.ok(zonedDateTimeFns.isValid('2020-01-01T12:30:00.000-06:00[America/Chicago]'))
    })
    it('does not allow invalid', () => {
      assert.ok(!zonedDateTimeFns.isValid('2020-01-01T00:00:1-06:00[America/Chicago]'))
      assert.ok(!zonedDateTimeFns.isValid('2020-01-01T00:00:01.1111-06:00[America/Chicago]'))
      assert.ok(!zonedDateTimeFns.isValid('test'))
    })
  })

  describe('Construction and properties', () => {
    const epochMillis = Date.UTC(1976, 10, 18, 15, 23, 30, 123)
    it('works', () => {
      const zdt = zonedDateTimeFns.fromEpochMilliseconds(epochMillis, tz)
      assert(zdt)
      // assert.equal(typeof zdt, 'object')
      assert.equal(
        zonedDateTimeFns.chain(zdt).toInstant().getEpochSeconds().value(),
        Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3),
        'epochSeconds'
      )
      assert.equal(
        zonedDateTimeFns.chain(zdt).toInstant().getEpochMilliseconds().value(),
        Date.UTC(1976, 10, 18, 15, 23, 30, 123),
        'epochMilliseconds'
      )
    })

    describe('ZonedDateTime for (1976, 11, 18, 15, 23, 30, 123, 456, 789)', () => {
      const zdt = zonedDateTimeFns.fromEpochMilliseconds(epochMillis, 'UTC')
      it('can be constructed', () => {
        assert(zdt)
        assert.equal(typeof zdt, 'string')
      })
      it('zdt.year is 1976', () => assert.equal(zonedDateTimeFns.getYear(zdt), 1976))
      it('zdt.month is 11', () => assert.equal(zonedDateTimeFns.getMonth(zdt), 11))
      it('zdt.day is 18', () => assert.equal(zonedDateTimeFns.getDay(zdt), 18))
      it('zdt.hour is 15', () => assert.equal(zonedDateTimeFns.getHour(zdt), 15))
      it('zdt.minute is 23', () => assert.equal(zonedDateTimeFns.getMinute(zdt), 23))
      it('zdt.second is 30', () => assert.equal(zonedDateTimeFns.getSecond(zdt), 30))
      it('zdt.millisecond is 123', () => assert.equal(zonedDateTimeFns.getMillisecond(zdt), 123))
      it('zdt.epochSeconds is 217178610', () => assert.equal(zonedDateTimeFns.getEpochSeconds(zdt), 217178610))
      it('zdt.epochMilliseconds is 217178610123', () =>
        assert.equal(zonedDateTimeFns.getEpochMilliseconds(zdt), 217178610123))
      it('zdt.dayOfWeek is 4', () => assert.equal(zonedDateTimeFns.getDayOfWeek(zdt), 4))
      it('zdt.dayOfYear is 323', () => assert.equal(zonedDateTimeFns.getDayOfYear(zdt), 323))
      it('zdt.weekOfYear is 47', () => assert.equal(zonedDateTimeFns.getWeekOfYear(zdt), 47))
      it('zdt.daysInMonth is 30', () => assert.equal(zonedDateTimeFns.getDaysInMonth(zdt), 30))
      it('zdt.daysInYear is 366', () => assert.equal(zonedDateTimeFns.getDaysInYear(zdt), 366))
      it('zdt.offset is +00:00', () => assert.equal(zonedDateTimeFns.getOffset(zdt), '+00:00'))
      it('string output is 1976-11-18T15:23:30.123+00:00[UTC]', () =>
        assert.equal(`${zdt}`, '1976-11-18T15:23:30.123+00:00[UTC]'))
    })
  })

  describe('string parsing', () => {
    it('parses with an IANA zone', () => {
      const zdt = zonedDateTimeFns.from('2020-03-08T01:00-08:00[America/Los_Angeles]')
      assert.equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]')
    })
    it('parses with an IANA zone but no offset', () => {
      const zdt = zonedDateTimeFns.from('2020-03-08T01:00[America/Los_Angeles]')
      assert.equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]')
    })
    it('parses with an IANA zone but no offset (with disambiguation)', () => {
      const zdt = zonedDateTimeFns.from('2020-03-08T02:30[America/Los_Angeles]', { disambiguation: 'earlier' })
      assert.equal(zdt.toString(), '2020-03-08T01:30-08:00[America/Los_Angeles]')
    })
    it('parses with an offset in brackets', () => {
      const zdt = zonedDateTimeFns.from('2020-03-08T01:00-08:00[-08:00]')
      assert.equal(zdt.toString(), '2020-03-08T01:00-08:00[-08:00]')
    })
    it('throws if no brackets', () => {
      assert.throws(() => zonedDateTimeFns.from('2020-03-08T01:00-08:00'), RangeError)
      assert.throws(() => zonedDateTimeFns.from('2020-03-08T01:00Z'), RangeError)
    })
    it('"Z" means preserve the exact time in the given IANA time zone', () => {
      const zdt = zonedDateTimeFns.from('2020-03-08T09:00:00Z[America/Los_Angeles]')
      assert.equal(zdt.toString(), '2020-03-08T01:00-08:00[America/Los_Angeles]')
    })
    it('zonedDateTimeFns.from(ISO string leap second) is constrained', () => {
      assert.equal(
        `${zonedDateTimeFns.from('2016-12-31T23:59:60-08:00[America/Vancouver]')}`,
        '2016-12-31T23:59:59-08:00[America/Vancouver]'
      )
    })
    it('variant time separators', () => {
      ;['1976-11-18t15:23-08:00[America/Los_Angeles]', '1976-11-18 15:23-08:00[America/Los_Angeles]'].forEach((input) =>
        assert.equal(`${zonedDateTimeFns.from(input)}`, '1976-11-18T15:23-08:00[America/Los_Angeles]')
      )
    })
    it('any number of decimal places', () => {
      assert.equal(
        `${zonedDateTimeFns.from('1976-11-18T15:23:30.1-08:00[America/Los_Angeles]')}`,
        '1976-11-18T15:23:30.1-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from('1976-11-18T15:23:30.12-08:00[America/Los_Angeles]')}`,
        '1976-11-18T15:23:30.12-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from('1976-11-18T15:23:30.123-08:00[America/Los_Angeles]')}`,
        '1976-11-18T15:23:30.123-08:00[America/Los_Angeles]'
      )
    })
    it('variant decimal separator', () => {
      assert.equal(
        `${zonedDateTimeFns.from('1976-11-18T15:23:30,12-08:00[America/Los_Angeles]')}`,
        '1976-11-18T15:23:30.12-08:00[America/Los_Angeles]'
      )
    })
    it('variant minus sign', () => {
      assert.equal(
        `${zonedDateTimeFns.from('1976-11-18T15:23:30.12\u221208:00[America/Los_Angeles]')}`,
        '1976-11-18T15:23:30.12-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from('\u2212009999-11-18T15:23:30.12+00:00[UTC]')}`,
        '-009999-11-18T15:23:30.12+00:00[UTC]'
      )
    })
    it('mixture of basic and extended format', () => {
      ;[
        '1976-11-18T152330.1-08:00[America/Los_Angeles]',
        '19761118T15:23:30.1-08:00[America/Los_Angeles]',
        '1976-11-18T15:23:30.1-0800[America/Los_Angeles]',
        '1976-11-18T152330.1-0800[America/Los_Angeles]',
        '19761118T15:23:30.1-0800[America/Los_Angeles]',
        '19761118T152330.1-08:00[America/Los_Angeles]',
        '19761118T152330.1-0800[America/Los_Angeles]',
        '+001976-11-18T152330.1-08:00[America/Los_Angeles]',
        '+0019761118T15:23:30.1-08:00[America/Los_Angeles]',
        '+001976-11-18T15:23:30.1-0800[America/Los_Angeles]',
        '+001976-11-18T152330.1-0800[America/Los_Angeles]',
        '+0019761118T15:23:30.1-0800[America/Los_Angeles]',
        '+0019761118T152330.1-08:00[America/Los_Angeles]',
        '+0019761118T152330.1-0800[America/Los_Angeles]'
      ].forEach((input) =>
        assert.equal(`${zonedDateTimeFns.from(input)}`, '1976-11-18T15:23:30.1-08:00[America/Los_Angeles]')
      )
    })
    it('optional parts', () => {
      assert.equal(
        `${zonedDateTimeFns.from('1976-11-18T15:23:30-08[America/Los_Angeles]')}`,
        '1976-11-18T15:23:30-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from('1976-11-18T15-08:00[America/Los_Angeles]')}`,
        '1976-11-18T15:00-08:00[America/Los_Angeles]'
      )
      assert.equal(`${zonedDateTimeFns.from('2020-01-01[Asia/Tokyo]')}`, '2020-01-01T00:00+09:00[Asia/Tokyo]')
    })
    it('no junk at end of string', () =>
      assert.throws(() => zonedDateTimeFns.from('1976-11-18T15:23:30.123-08:00[America/Los_Angeles]junk'), RangeError))
    it('constrain has no effect on invalid ISO string', () => {
      assert.throws(
        () => zonedDateTimeFns.from('2020-13-34T24:60[America/Los_Angeles]', { overflow: 'constrain' }),
        RangeError
      )
    })
    describe('Offset option', () => {
      it("{ offset: 'reject' } throws if offset does not match offset time zone", () => {
        assert.throws(() => zonedDateTimeFns.from('2020-03-08T01:00-04:00[-08:00]'), RangeError)
        assert.throws(() => zonedDateTimeFns.from('2020-03-08T01:00-04:00[-08:00]', { offset: 'reject' }), RangeError)
      })
      it("{ offset: 'reject' } throws if offset does not match IANA time zone", () => {
        assert.throws(() => zonedDateTimeFns.from('2020-03-08T01:00-04:00[America/Chicago]'), RangeError)
        assert.throws(
          () => zonedDateTimeFns.from('2020-03-08T01:00-04:00[America/Chicago]', { offset: 'reject' }),
          RangeError
        )
      })
      it("{ offset: 'prefer' } if offset matches time zone (first 1:30 when DST ends)", () => {
        const zdt = zonedDateTimeFns.from('2020-11-01T01:30-07:00[America/Los_Angeles]', { offset: 'prefer' })
        assert.equal(zdt.toString(), '2020-11-01T01:30-07:00[America/Los_Angeles]')
      })
      it("{ offset: 'prefer' } if offset matches time zone (second 1:30 when DST ends)", () => {
        const zdt = zonedDateTimeFns.from('2020-11-01T01:30-08:00[America/Los_Angeles]', { offset: 'prefer' })
        assert.equal(zdt.toString(), '2020-11-01T01:30-08:00[America/Los_Angeles]')
      })
      it("{ offset: 'prefer' } if offset does not match time zone", () => {
        const zdt = zonedDateTimeFns.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'prefer' })
        assert.equal(zdt.toString(), '2020-11-01T04:00-08:00[America/Los_Angeles]')
      })
      it("{ offset: 'ignore' } uses time zone only", () => {
        const zdt = zonedDateTimeFns.from('2020-11-01T04:00-12:00[America/Los_Angeles]', { offset: 'ignore' })
        assert.equal(zdt.toString(), '2020-11-01T04:00-08:00[America/Los_Angeles]')
      })
      it("{ offset: 'use' } uses offset only", () => {
        const zdt = zonedDateTimeFns.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'use' })
        assert.equal(zdt.toString(), '2020-11-01T03:00-08:00[America/Los_Angeles]')
      })
      it('throw when bad offset', () => {
        ;['', 'PREFER', 'balance', 3, null].forEach((offset) => {
          //@ts-expect-error
          assert.throws(() => zonedDateTimeFns.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset }), RangeError)
        })
      })
    })
  })
  describe('Disambiguation option', () => {
    it('plain datetime with multiple instants - Fall DST in Brazil', () => {
      const str = '2019-02-16T23:45[America/Sao_Paulo]'
      assert.equal(`${zonedDateTimeFns.from(str)}`, '2019-02-16T23:45-02:00[America/Sao_Paulo]')
      assert.equal(
        `${zonedDateTimeFns.from(str, { disambiguation: 'compatible' })}`,
        '2019-02-16T23:45-02:00[America/Sao_Paulo]'
      )
      assert.equal(
        `${zonedDateTimeFns.from(str, { disambiguation: 'earlier' })}`,
        '2019-02-16T23:45-02:00[America/Sao_Paulo]'
      )
      assert.equal(`${zonedDateTimeFns.from(str, { disambiguation: 'later' })}`, '2019-02-16T23:45-03:00[America/Sao_Paulo]')
      assert.throws(() => zonedDateTimeFns.from(str, { disambiguation: 'reject' }), RangeError)
    })
    it('plain datetime with multiple instants - Spring DST in Los Angeles', () => {
      const str = '2020-03-08T02:30[America/Los_Angeles]'
      assert.equal(`${zonedDateTimeFns.from(str)}`, '2020-03-08T03:30-07:00[America/Los_Angeles]')
      assert.equal(
        `${zonedDateTimeFns.from(str, { disambiguation: 'compatible' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from(str, { disambiguation: 'earlier' })}`,
        '2020-03-08T01:30-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from(str, { disambiguation: 'later' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.throws(() => zonedDateTimeFns.from(str, { disambiguation: 'reject' }), RangeError)
    })
    it('uses disambiguation if offset is ignored', () => {
      const str = '2020-03-08T02:30[America/Los_Angeles]'
      const offset = 'ignore'
      assert.equal(`${zonedDateTimeFns.from(str, { offset })}`, '2020-03-08T03:30-07:00[America/Los_Angeles]')
      assert.equal(
        `${zonedDateTimeFns.from(str, { offset, disambiguation: 'compatible' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from(str, { offset, disambiguation: 'earlier' })}`,
        '2020-03-08T01:30-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from(str, { offset, disambiguation: 'later' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.throws(() => zonedDateTimeFns.from(str, { offset, disambiguation: 'reject' }), RangeError)
    })
    it('uses disambiguation if offset is wrong and option is prefer', () => {
      const str = '2020-03-08T02:30-23:59[America/Los_Angeles]'
      const offset = 'prefer'
      assert.equal(`${zonedDateTimeFns.from(str, { offset })}`, '2020-03-08T03:30-07:00[America/Los_Angeles]')
      assert.equal(
        `${zonedDateTimeFns.from(str, { offset, disambiguation: 'compatible' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from(str, { offset, disambiguation: 'earlier' })}`,
        '2020-03-08T01:30-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${zonedDateTimeFns.from(str, { offset, disambiguation: 'later' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.throws(() => zonedDateTimeFns.from(str, { offset, disambiguation: 'reject' }), RangeError)
    })
    it('throw when bad disambiguation', () => {
      ;['', 'EARLIER', 'balance', 3, null].forEach((disambiguation) => {
        //@ts-expect-error
        assert.throws(() => zonedDateTimeFns.from('2020-11-01T04:00[America/Los_Angeles]', { disambiguation }), RangeError)
      })
    })
  })
  describe('property bags', () => {
    const lagos = 'Africa/Lagos'
    it('can be constructed with month and without monthCode', () => {
      assert.equal(
        `${zonedDateTimeFns.from({ year: 1976, month: 11, day: 18, timeZone: lagos })}`,
        '1976-11-18T00:00+01:00[Africa/Lagos]'
      )
    })
    it('zonedDateTimeFns.from({}) throws', () => assert.throws(() => zonedDateTimeFns.from({}), TypeError))
    it('zonedDateTimeFns.from(required prop undefined) throws', () =>
      assert.throws(
        () => zonedDateTimeFns.from({ year: 1976, month: undefined, monthCode: undefined, day: 18, timeZone: lagos }),
        TypeError
      ))
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        assert.throws(
          //@ts-expect-error
          () => zonedDateTimeFns.from({ year: 1976, month: 11, day: 18, timeZone: lagos }, badOptions),
          TypeError
        )
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        assert.equal(
          `${zonedDateTimeFns.from({ year: 1976, month: 11, day: 18, timeZone: lagos }, options)}`,
          '1976-11-18T00:00+01:00[Africa/Lagos]'
        )
      )
    })
    it('object must contain at least the required correctly-spelled properties', () => {
      assert.throws(() => zonedDateTimeFns.from({ years: 1976, months: 11, days: 18, timeZone: lagos }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(
        `${zonedDateTimeFns.from({ year: 1976, month: 11, day: 18, timeZone: lagos, hours: 12 })}`,
        '1976-11-18T00:00+01:00[Africa/Lagos]'
      )
    })
    describe('Overflow option', () => {
      const bad = { year: 2019, month: 1, day: 32, timeZone: lagos }
      it('reject', () => assert.throws(() => zonedDateTimeFns.from(bad, { overflow: 'reject' }), RangeError))
      it('constrain', () => {
        assert.equal(`${zonedDateTimeFns.from(bad)}`, '2019-01-31T00:00+01:00[Africa/Lagos]')
        assert.equal(`${zonedDateTimeFns.from(bad, { overflow: 'constrain' })}`, '2019-01-31T00:00+01:00[Africa/Lagos]')
      })
      it('throw when bad overflow', () => {
        ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) => {
          assert.throws(
            //@ts-expect-error
            () => zonedDateTimeFns.from({ year: 2019, month: 1, day: 1, timeZone: lagos }, { overflow }),
            RangeError
          )
        })
      })
      const leap = { year: 2016, month: 12, day: 31, hour: 23, minute: 59, second: 60, timeZone: lagos }
      it('reject leap second', () => assert.throws(() => zonedDateTimeFns.from(leap, { overflow: 'reject' }), RangeError))
      it('constrain leap second', () =>
        assert.equal(`${zonedDateTimeFns.from(leap)}`, '2016-12-31T23:59:59+01:00[Africa/Lagos]'))
    })
    describe('Offset option', () => {
      it("{ offset: 'reject' } throws if offset does not match offset time zone", () => {
        const obj = { year: 2020, month: 3, day: 8, hour: 1, offset: '-04:00', timeZone: '-08:00' }
        assert.throws(() => zonedDateTimeFns.from(obj), RangeError)
        assert.throws(() => zonedDateTimeFns.from(obj, { offset: 'reject' }), RangeError)
      })
      it("{ offset: 'reject' } throws if offset does not match IANA time zone", () => {
        const obj = { year: 2020, month: 3, day: 8, hour: 1, offset: '-04:00', timeZone: 'America/Chicago' }
        assert.throws(() => zonedDateTimeFns.from(obj), RangeError)
        assert.throws(() => zonedDateTimeFns.from(obj, { offset: 'reject' }), RangeError)
      })
      const cali = 'America/Los_Angeles'
      const date = { year: 2020, month: 11, day: 1, timeZone: cali }
      it("{ offset: 'prefer' } if offset matches time zone (first 1:30 when DST ends)", () => {
        const obj = { ...date, hour: 1, minute: 30, offset: '-07:00' }
        assert.equal(`${zonedDateTimeFns.from(obj, { offset: 'prefer' })}`, '2020-11-01T01:30-07:00[America/Los_Angeles]')
      })
      it("{ offset: 'prefer' } if offset matches time zone (second 1:30 when DST ends)", () => {
        const obj = { ...date, hour: 1, minute: 30, offset: '-08:00' }
        assert.equal(`${zonedDateTimeFns.from(obj, { offset: 'prefer' })}`, '2020-11-01T01:30-08:00[America/Los_Angeles]')
      })
      it("{ offset: 'prefer' } if offset does not match time zone", () => {
        const obj = { ...date, hour: 4, offset: '-07:00' }
        assert.equal(`${zonedDateTimeFns.from(obj, { offset: 'prefer' })}`, '2020-11-01T04:00-08:00[America/Los_Angeles]')
      })
      it("{ offset: 'ignore' } uses time zone only", () => {
        const obj = { ...date, hour: 4, offset: '-12:00' }
        assert.equal(`${zonedDateTimeFns.from(obj, { offset: 'ignore' })}`, '2020-11-01T04:00-08:00[America/Los_Angeles]')
      })
      it("{ offset: 'use' } uses offset only", () => {
        const obj = { ...date, hour: 4, offset: '-07:00' }
        assert.equal(`${zonedDateTimeFns.from(obj, { offset: 'use' })}`, '2020-11-01T03:00-08:00[America/Los_Angeles]')
      })
      it('throw when bad offset', () => {
        ;['', 'PREFER', 'balance', 3, null].forEach((offset) => {
          assert.throws(
            //@ts-expect-error
            () => zonedDateTimeFns.from({ year: 2019, month: 1, day: 1, timeZone: lagos }, { offset }),
            RangeError
          )
        })
      })
    })
    describe('Disambiguation option', () => {
      it('plain datetime with multiple instants - Fall DST in Brazil', () => {
        const brazil = 'America/Sao_Paulo'
        const obj = { year: 2019, month: 2, day: 16, hour: 23, minute: 45, timeZone: brazil }
        assert.equal(`${zonedDateTimeFns.from(obj)}`, '2019-02-16T23:45-02:00[America/Sao_Paulo]')
        assert.equal(
          `${zonedDateTimeFns.from(obj, { disambiguation: 'compatible' })}`,
          '2019-02-16T23:45-02:00[America/Sao_Paulo]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { disambiguation: 'earlier' })}`,
          '2019-02-16T23:45-02:00[America/Sao_Paulo]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { disambiguation: 'later' })}`,
          '2019-02-16T23:45-03:00[America/Sao_Paulo]'
        )
        assert.throws(() => zonedDateTimeFns.from(obj, { disambiguation: 'reject' }), RangeError)
      })
      it('plain datetime with multiple instants - Spring DST in Los Angeles', () => {
        const cali = 'America/Los_Angeles'
        const obj = { year: 2020, month: 3, day: 8, hour: 2, minute: 30, timeZone: cali }
        assert.equal(`${zonedDateTimeFns.from(obj)}`, '2020-03-08T03:30-07:00[America/Los_Angeles]')
        assert.equal(
          `${zonedDateTimeFns.from(obj, { disambiguation: 'compatible' })}`,
          '2020-03-08T03:30-07:00[America/Los_Angeles]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { disambiguation: 'earlier' })}`,
          '2020-03-08T01:30-08:00[America/Los_Angeles]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { disambiguation: 'later' })}`,
          '2020-03-08T03:30-07:00[America/Los_Angeles]'
        )
        assert.throws(() => zonedDateTimeFns.from(obj, { disambiguation: 'reject' }), RangeError)
      })
      it('uses disambiguation if offset is ignored', () => {
        const cali = 'America/Los_Angeles'
        const obj = { year: 2020, month: 3, day: 8, hour: 2, minute: 30, timeZone: cali }
        const offset = 'ignore'
        assert.equal(`${zonedDateTimeFns.from(obj, { offset })}`, '2020-03-08T03:30-07:00[America/Los_Angeles]')
        assert.equal(
          `${zonedDateTimeFns.from(obj, { offset, disambiguation: 'compatible' })}`,
          '2020-03-08T03:30-07:00[America/Los_Angeles]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { offset, disambiguation: 'earlier' })}`,
          '2020-03-08T01:30-08:00[America/Los_Angeles]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { offset, disambiguation: 'later' })}`,
          '2020-03-08T03:30-07:00[America/Los_Angeles]'
        )
        assert.throws(() => zonedDateTimeFns.from(obj, { disambiguation: 'reject' }), RangeError)
      })
      it('uses disambiguation if offset is wrong and option is prefer', () => {
        const cali = 'America/Los_Angeles'
        const obj = { year: 2020, month: 3, day: 8, hour: 2, minute: 30, offset: '-23:59', timeZone: cali }
        const offset = 'prefer'
        assert.equal(`${zonedDateTimeFns.from(obj, { offset })}`, '2020-03-08T03:30-07:00[America/Los_Angeles]')
        assert.equal(
          `${zonedDateTimeFns.from(obj, { offset, disambiguation: 'compatible' })}`,
          '2020-03-08T03:30-07:00[America/Los_Angeles]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { offset, disambiguation: 'earlier' })}`,
          '2020-03-08T01:30-08:00[America/Los_Angeles]'
        )
        assert.equal(
          `${zonedDateTimeFns.from(obj, { offset, disambiguation: 'later' })}`,
          '2020-03-08T03:30-07:00[America/Los_Angeles]'
        )
        assert.throws(() => zonedDateTimeFns.from(obj, { offset, disambiguation: 'reject' }), RangeError)
      })
      it('throw when bad disambiguation', () => {
        ;['', 'EARLIER', 'balance', 3, null].forEach((disambiguation) => {
          //@ts-expect-error
          assert.throws(() => zonedDateTimeFns.from('2020-11-01T04:00[America/Los_Angeles]', { disambiguation }), RangeError)
        })
      })
    })
  })

  describe('ZonedDateTime.with()', () => {
    let zdt = zonedDateTimeFns.from({
      year: 1976,
      month: 11,
      day: 18,
      hour: 15,
      minute: 23,
      second: 30,
      millisecond: 123,
      timeZone: 'UTC'
    })
    it('zonedDateTimeFns.with(zdt, { year: 2019 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { year: 2019 })}`, '2019-11-18T15:23:30.123+00:00[UTC]')
    })
    it('zonedDateTimeFns.with(zdt, { month: 5 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { month: 5 })}`, '1976-05-18T15:23:30.123+00:00[UTC]')
    })
    it('zonedDateTimeFns.with(zdt, { day: 5 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { day: 5 })}`, '1976-11-05T15:23:30.123+00:00[UTC]')
    })
    it('zonedDateTimeFns.with(zdt, { hour: 5 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { hour: 5 })}`, '1976-11-18T05:23:30.123+00:00[UTC]')
    })
    it('zonedDateTimeFns.with(zdt, { minute: 5 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { minute: 5 })}`, '1976-11-18T15:05:30.123+00:00[UTC]')
    })
    it('zonedDateTimeFns.with(zdt, { second: 5 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { second: 5 })}`, '1976-11-18T15:23:05.123+00:00[UTC]')
    })
    it('zonedDateTimeFns.with(zdt, { millisecond: 5 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { millisecond: 5 })}`, '1976-11-18T15:23:30.005+00:00[UTC]')
    })
    it('zonedDateTimeFns.with(zdt, { month: 5, second: 15 } works', () => {
      assert.equal(`${zonedDateTimeFns.with(zdt, { month: 5, second: 15 })}`, '1976-05-18T15:23:15.123+00:00[UTC]')
    })
    describe('Overflow', () => {
      it('constrain', () => {
        const overflow = 'constrain'
        assert.equal(`${zonedDateTimeFns.with(zdt, { month: 29 }, { overflow })}`, '1976-12-18T15:23:30.123+00:00[UTC]')
        assert.equal(`${zonedDateTimeFns.with(zdt, { day: 31 }, { overflow })}`, '1976-11-30T15:23:30.123+00:00[UTC]')
        assert.equal(`${zonedDateTimeFns.with(zdt, { hour: 29 }, { overflow })}`, '1976-11-18T23:23:30.123+00:00[UTC]')
      })
      it('reject', () => {
        const overflow = 'reject'
        assert.throws(() => zonedDateTimeFns.with(zdt, { month: 29 }, { overflow }), RangeError)
        assert.throws(() => zonedDateTimeFns.with(zdt, { day: 31 }, { overflow }), RangeError)
        assert.throws(() => zonedDateTimeFns.with(zdt, { hour: 29 }, { overflow }), RangeError)
      })
      it('constrain is the default', () => {
        assert.equal(
          `${zonedDateTimeFns.with(zdt, { month: 29 })}`,
          `${zonedDateTimeFns.with(zdt, { month: 29 }, { overflow: 'constrain' })}`
        )
      })
      it('invalid overflow', () => {
        ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
          //@ts-expect-error
          assert.throws(() => zonedDateTimeFns.with(zdt, { day: 5 }, { overflow }), RangeError)
        )
      })
    })
    const dstStartDay = zonedDateTimeFns.from('2019-03-10T12:00:01-02:30[America/St_Johns]')
    const dstEndDay = zonedDateTimeFns.from('2019-11-03T12:00:01-03:30[America/St_Johns]')
    const oneThirty = { hour: 1, minute: 30 }
    const twoThirty = { hour: 2, minute: 30 }
    describe('Disambiguation option', () => {
      const offset = 'ignore'
      it('compatible, skipped wall time', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, twoThirty, { offset, disambiguation: 'compatible' })}`,
          '2019-03-10T03:30:01-02:30[America/St_Johns]'
        )
      })
      it('earlier, skipped wall time', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, twoThirty, { offset, disambiguation: 'earlier' })}`,
          '2019-03-10T01:30:01-03:30[America/St_Johns]'
        )
      })
      it('later, skipped wall time', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, twoThirty, { offset, disambiguation: 'later' })}`,
          '2019-03-10T03:30:01-02:30[America/St_Johns]'
        )
      })
      it('compatible, repeated wall time', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstEndDay, oneThirty, { offset, disambiguation: 'compatible' })}`,
          '2019-11-03T01:30:01-02:30[America/St_Johns]'
        )
      })
      it('earlier, repeated wall time', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstEndDay, oneThirty, { offset, disambiguation: 'earlier' })}`,
          '2019-11-03T01:30:01-02:30[America/St_Johns]'
        )
      })
      it('later, repeated wall time', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstEndDay, oneThirty, { offset, disambiguation: 'later' })}`,
          '2019-11-03T01:30:01-03:30[America/St_Johns]'
        )
      })
      it('reject', () => {
        assert.throws(() => zonedDateTimeFns.with(dstStartDay, twoThirty, { offset, disambiguation: 'reject' }), RangeError)
        assert.throws(() => zonedDateTimeFns.with(dstEndDay, oneThirty, { offset, disambiguation: 'reject' }), RangeError)
      })
      it('compatible is the default', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, twoThirty, { offset })}`,
          `${zonedDateTimeFns.with(dstStartDay, twoThirty, { offset, disambiguation: 'compatible' })}`
        )
        assert.equal(
          `${zonedDateTimeFns.with(dstEndDay, twoThirty, { offset })}`,
          `${zonedDateTimeFns.with(dstEndDay, twoThirty, { offset, disambiguation: 'compatible' })}`
        )
      })
      it('invalid disambiguation', () => {
        ;['', 'EARLIER', 'balance', 3, null].forEach((disambiguation) =>
          //@ts-expect-error
          assert.throws(() => zonedDateTimeFns.with(zdt, { day: 5 }, { disambiguation }), RangeError)
        )
      })
    })
    describe('Offset option', () => {
      const bogus = { ...twoThirty, offset: '+23:59' }
      it('use, with bogus offset, changes to the exact time with the offset', () => {
        const preserveExact = zonedDateTimeFns.with(dstStartDay, bogus, { offset: 'use' })
        assert.equal(`${preserveExact}`, '2019-03-08T23:01:01-03:30[America/St_Johns]')
      })
      it('ignore, with bogus offset, defers to disambiguation option', () => {
        const offset = 'ignore'
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, bogus, { offset, disambiguation: 'earlier' })}`,
          '2019-03-10T01:30:01-03:30[America/St_Johns]'
        )
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, bogus, { offset, disambiguation: 'later' })}`,
          '2019-03-10T03:30:01-02:30[America/St_Johns]'
        )
      })
      it('prefer, with bogus offset, defers to disambiguation option', () => {
        const offset = 'prefer'
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, bogus, { offset, disambiguation: 'earlier' })}`,
          '2019-03-10T01:30:01-03:30[America/St_Johns]'
        )
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, bogus, { offset, disambiguation: 'later' })}`,
          '2019-03-10T03:30:01-02:30[America/St_Johns]'
        )
      })
      it('reject, with bogus offset, throws', () => {
        assert.throws(
          //@ts-expect-error
          () => zonedDateTimeFns.with(dstStartDay, { ...twoThirty, offset: '+23:59' }, { offset: 'reject' }),
          RangeError
        )
      })
      const doubleTime = zonedDateTimeFns.from('2019-11-03T01:30:01-03:30[America/St_Johns]')
      it('use changes to the exact time with the offset', () => {
        const preserveExact = zonedDateTimeFns.with(doubleTime, { hour: -2, minute: -30 }, { offset: 'use' })
        assert.equal(zonedDateTimeFns.getOffset(preserveExact), '-02:30')
      })
      it('ignore defers to disambiguation option', () => {
        const offset = 'ignore'
        assert.equal(
          zonedDateTimeFns.getOffset(
            zonedDateTimeFns.with(doubleTime, { hour: -2, minute: -30 }, { offset, disambiguation: 'earlier' })
          ),
          '-02:30'
        )
        // #87
        // assert.equal(
        //   zonedDateTimeFns.getOffset(
        //     zonedDateTimeFns.with(doubleTime, { hour: -3, minute: -30 }, { offset, disambiguation: 'later' })
        //   ),
        //   '-03:30'
        // )
      })
      it('prefer adjusts offset of repeated clock time', () => {
        assert.equal(
          zonedDateTimeFns.getOffset(zonedDateTimeFns.with(doubleTime, { hour: -2, minute: -30 }, { offset: 'prefer' })),
          '-02:30'
        )
      })
      // it('reject adjusts offset of repeated clock time', () => {
      //   assert.equal(
      //     zonedDateTimeFns.getOffset(zonedDateTimeFns.with(doubleTime, { hour: -2, minute: -30 }, { offset: 'reject' })),
      //     '-02:30'
      //   )
      // })
      it('use does not cause the offset to change when adjusting repeated clock time', () => {
        assert.equal(
          zonedDateTimeFns.getOffset(zonedDateTimeFns.with(doubleTime, { minute: 31 }, { offset: 'use' })),
          '-03:30'
        )
      })
      it('ignore may cause the offset to change when adjusting repeated clock time', () => {
        assert.equal(
          zonedDateTimeFns.getOffset(zonedDateTimeFns.with(doubleTime, { minute: 31 }, { offset: 'ignore' })),
          '-02:30'
        )
      })
      it('prefer does not cause the offset to change when adjusting repeated clock time', () => {
        assert.equal(
          zonedDateTimeFns.getOffset(zonedDateTimeFns.with(doubleTime, { minute: 31 }, { offset: 'prefer' })),
          '-03:30'
        )
      })
      it('reject does not cause the offset to change when adjusting repeated clock time', () => {
        assert.equal(
          zonedDateTimeFns.getOffset(zonedDateTimeFns.with(doubleTime, { minute: 31 }, { offset: 'reject' })),
          '-03:30'
        )
      })
      it('prefer is the default', () => {
        assert.equal(
          `${zonedDateTimeFns.with(dstStartDay, twoThirty)}`,
          `${zonedDateTimeFns.with(dstStartDay, twoThirty, { offset: 'prefer' })}`
        )
        assert.equal(
          `${zonedDateTimeFns.with(dstEndDay, twoThirty)}`,
          `${zonedDateTimeFns.with(dstEndDay, twoThirty, { offset: 'prefer' })}`
        )
        assert.equal(
          `${zonedDateTimeFns.with(doubleTime, { minute: 31 })}`,
          `${zonedDateTimeFns.with(doubleTime, { minute: 31 }, { offset: 'prefer' })}`
        )
      })
      it('invalid offset', () => {
        ;['', 'PREFER', 'balance', 3, null].forEach((offset) =>
          //@ts-expect-error
          assert.throws(() => zonedDateTimeFns.with(zdt, { day: 5 }, { offset }), RangeError)
        )
      })
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => zonedDateTimeFns.with(zdt, { day: 5 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        assert.equal(`${zonedDateTimeFns.with(zdt, { day: 5 }, options)}`, '1976-11-05T15:23:30.123+00:00[UTC]')
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => zonedDateTimeFns.with(zdt, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.with(zdt, { months: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${zonedDateTimeFns.with(zdt, { month: 12, days: 15 })}`, '1976-12-18T15:23:30.123+00:00[UTC]')
    })
    it('throws if timeZone is included', () => {
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.with(zdt, { month: 2, timeZone: 'Asia/Ulaanbaatar' }), TypeError)
    })
    it('throws if given a Temporal object with a time zone', () => {
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.with(zdt, dstStartDay), TypeError)
    })
    it('throws if given a string', () => {
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.with(zdt, '1976-11-18T12:00+00:00[UTC]'), TypeError)
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.with(zdt, '1976-11-18'), TypeError)
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.with(zdt, '12:00'), TypeError)
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.with(zdt, 'invalid'), TypeError)
    })
  })

  describe('.withPlainTime manipulation', () => {
    const zdt = zonedDateTimeFns.from('2015-12-07T03:24:30.000003500[America/Los_Angeles]')
    it('withPlainTime({ hour: 10 }) works', () => {
      assert.equal(`${zonedDateTimeFns.withTime(zdt, { hour: 10 })}`, '2015-12-07T10:00-08:00[America/Los_Angeles]')
    })
    it('withPlainTime(time) works', () => {
      const time = timeFns.from('11:22')
      assert.equal(`${zonedDateTimeFns.withTime(zdt, time)}`, '2015-12-07T11:22-08:00[America/Los_Angeles]')
    })
    it("withPlainTime('12:34') works", () => {
      assert.equal(`${zonedDateTimeFns.withTime(zdt, '12:34')}`, '2015-12-07T12:34-08:00[America/Los_Angeles]')
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => zonedDateTimeFns.withTime(zdt, {}), TypeError)
      assert.throws(() => zonedDateTimeFns.withTime(zdt, { minute: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(
        `${zonedDateTimeFns.withTime(zdt, { hour: 10, second: 55 })}`,
        '2015-12-07T10:00-08:00[America/Los_Angeles]'
      )
    })
  })
  describe('.withPlainDate manipulation', () => {
    const zdt = zonedDateTimeFns.from('1995-12-07T03:24:30[America/Los_Angeles]')
    it('withPlainDate({ year: 2000, month: 6, day: 1 }) works', () => {
      assert.equal(
        `${zonedDateTimeFns.withDate(zdt, { year: 2000, month: 6, day: 1 })}`,
        '2000-06-01T03:24:30-07:00[America/Los_Angeles]'
      )
    })
    it('withPlainDate(plainDate) works', () => {
      const date = dateFns.from('2020-01-23')
      assert.equal(`${zonedDateTimeFns.withDate(zdt, date)}`, '2020-01-23T03:24:30-08:00[America/Los_Angeles]')
    })
    it("withPlainDate('2018-09-15') works", () => {
      assert.equal(`${zonedDateTimeFns.withDate(zdt, '2018-09-15')}`, '2018-09-15T03:24:30-07:00[America/Los_Angeles]')
    })
    it('object must contain at least one correctly-spelled property', () => {
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.withDate(zdt, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => zonedDateTimeFns.withDate(zdt, { months: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(
        //@ts-expect-error
        `${zonedDateTimeFns.withDate(zdt, { year: 2000, month: 6, day: 1, months: 123 })}`,
        '2000-06-01T03:24:30-07:00[America/Los_Angeles]'
      )
    })
  })

  //   describe('ZonedDateTime.withTimeZone()', () => {
  //     const instant = instantFns.from('2019-11-18T15:23:30.123-08:00[America/Los_Angeles]')
  //     const zdt = instantFns.toZonedDateTime(instant, 'UTC')
  //     it('zonedDateTime.withTimeZone(America/Los_Angeles) works', () => {
  //       assert.equal(`${zonedDateTimeFns.withTimeZone(zdt, tz)}`, '2019-11-18T15:23:30.123-08:00[America/Los_Angeles]')
  //     })
  //   })

  //   describe('Reversibility of differences', () => {
  //     const earlier = zonedDateTimeFns.from('1976-11-18T15:23:30.123-03:00[America/Santiago]')
  //     const later = zonedDateTimeFns.from('2019-10-29T10:46:38.271986102-03:00[America/Santiago]')
  //     // The interchangeability of since() and until() holds for time units only
  //     const units: TemporalPluralUnit[] = ['hours', 'minutes', 'seconds']
  //     units.forEach((largestUnit) => {
  //       const diff = zonedDateTimeFns.since(later, earlier, { largestUnit })
  //       it(`zonedDateTimeFns.since(earlier, later, ${largestUnit}) == zonedDateTimeFns.since(later, earlier, ${largestUnit}).negated()`, () =>
  //         assert.equal(`${zonedDateTimeFns.since(earlier, later, { largestUnit })}`, `${durationFns.negated(diff)}`))
  //       it(`zonedDateTimeFns.until(earlier, later, ${largestUnit}) == zonedDateTimeFns.since(later, earlier, ${largestUnit})`, () =>
  //         assert.equal(`${zonedDateTimeFns.until(earlier, later, { largestUnit })}`, `${diff}`))
  //       it(`${largestUnit} difference symmetrical with regard to negative durations`, () => {
  //         assert.equal(zonedDateTimeFns.subtract(earlier, durationFns.negated(diff)), later)
  //         assert.equal(zonedDateTimeFns.add(later, durationFns.negated(diff)), earlier)
  //       })
  //     })
  //     // For all units, add() undoes until() and subtract() undoes since()
  //     const largestUnit: TemporalPluralUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']
  //     units.forEach((largestUnit) => {
  //       const diff1 = zonedDateTimeFns.until(earlier, later, { largestUnit })
  //       const diff2 = zonedDateTimeFns.since(later, earlier, { largestUnit })
  //       it(`zonedDateTimeFns.add(earlier, ${diff1}) == later`, () => assert.equal(zonedDateTimeFns.add(earlier, diff1), later))
  //       it(`zonedDateTimeFns.subtract(later, ${diff2}) == earlier`, () =>
  //         assert.equal(zonedDateTimeFns.subtract(later, diff2), earlier))
  //     })
  //   })
  //   describe('date/time maths: hours overflow', () => {
  //     it('subtract result', () => {
  //       const later = zonedDateTimeFns.from('2019-10-29T10:46:38.271986102-03:00[America/Santiago]')
  //       const earlier = zonedDateTimeFns.subtract(later, { hours: 12 })
  //       assert.equal(`${earlier}`, '2019-10-28T22:46:38.271986102-03:00[America/Santiago]')
  //     })
  //     it('add result', () => {
  //       const earlier = zonedDateTimeFns.from('2020-05-31T23:12:38.271986102-04:00[America/Santiago]')
  //       const later = zonedDateTimeFns.add(earlier, { hours: 2 })
  //       assert.equal(`${later}`, '2020-06-01T01:12:38.271986102-04:00[America/Santiago]')
  //     })
  //     it('symmetrical with regard to negative durations', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.add(zonedDateTimeFns.from('2019-10-29T10:46:38.271986102-03:00[America/Santiago]'), {
  //           hours: -12
  //         })}`,
  //         '2019-10-28T22:46:38.271986102-03:00[America/Santiago]'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.subtract(zonedDateTimeFns.from('2020-05-31T23:12:38.271986102-04:00[America/Santiago]'), {
  //           hours: -2
  //         })}`,
  //         '2020-06-01T01:12:38.271986102-04:00[America/Santiago]'
  //       )
  //     })
  //   })
  //   describe('ZonedDateTime.add()', () => {
  //     const zdt = zonedDateTimeFns.from('1969-12-25T12:23:45.678901234+00:00[UTC]')
  //     describe('cross epoch in ms', () => {
  //       const one = zonedDateTimeFns.subtract(zdt, { hours: 240, milliseconds: 800 })
  //       const two = zonedDateTimeFns.add(zdt, { hours: 240, milliseconds: 800 })
  //       const three = zonedDateTimeFns.subtract(two, { hours: 480, milliseconds: 1600 })
  //       const four = zonedDateTimeFns.add(one, { hours: 480, milliseconds: 1600 })
  //       it(`(${zdt}).subtract({ hours: 240, milliseconds: 800 }) = ${one}`, () =>
  //         assert.equal(`${one}`, '1969-12-15T12:23:45.678900434+00:00[UTC]'))
  //       it(`(${zdt}).add({ hours: 240, milliseconds: 800 }) = ${two}`, () =>
  //         assert.equal(`${two}`, '1970-01-04T12:23:45.678902034+00:00[UTC]'))
  //       it(`(${two}).subtract({ hours: 480, milliseconds: 1600 }) = ${one}`, () => assert.equal(three, one))
  //       it(`(${one}).add({ hours: 480, milliseconds: 1600 }) = ${two}`, () => assert.equal(four, two))
  //     })
  //     it('zonedDateTimeFns.add(zdt, durationObj)', () => {
  //       const later = zonedDateTimeFns.add(zdt, durationFns.from('PT240H0.000000800S'))
  //       assert.equal(`${later}`, '1970-01-04T12:23:45.678902034+00:00[UTC]')
  //     })
  //     const jan31 = zonedDateTimeFns.from('2020-01-31T15:00-08:00[America/Vancouver]')
  //     it('constrain when ambiguous result', () => {
  //       assert.equal(`${zonedDateTimeFns.add(jan31, { months: 1 })}`, '2020-02-29T15:00:00-08:00[America/Vancouver]')
  //       assert.equal(
  //         `${zonedDateTimeFns.add(jan31, { months: 1 }, { overflow: 'constrain' })}`,
  //         '2020-02-29T15:00:00-08:00[America/Vancouver]'
  //       )
  //     })
  //     it('symmetrical with regard to negative durations in the time part', () => {
  //       assert.equal(`${zonedDateTimeFns.add(jan31, { minutes: -30 })}`, '2020-01-31T14:30:00-08:00[America/Vancouver]')
  //       assert.equal(`${zonedDateTimeFns.add(jan31, { seconds: -30 })}`, '2020-01-31T14:59:30-08:00[America/Vancouver]')
  //     })
  //     it('throw when ambiguous result with reject', () => {
  //       assert.throws(() => zonedDateTimeFns.add(jan31, { months: 1 }, { overflow: 'reject' }), RangeError)
  //     })
  //     it('invalid overflow', () => {
  //       ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.add(zdt, { months: 1 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('mixed positive and negative values always throw', () => {
  //       ;['constrain', 'reject'].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.add(zdt, { hours: 1, minutes: -30 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.add(zdt, { years: 1 }, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) =>
  //         assert.equal(`${zonedDateTimeFns.add(zdt, { years: 1 }, options)}`, '1970-12-25T12:23:45.678901234+00:00[UTC]')
  //       )
  //     })
  //     it('object must contain at least one correctly-spelled property', () => {
  //       assert.throws(() => zonedDateTimeFns.add(zdt, {}), TypeError)
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.add(zdt, { hour: 12 }), TypeError)
  //     })
  //     it('incorrectly-spelled properties are ignored', () => {
  //       //@ts-expect-error
  //       assert.equal(`${zonedDateTimeFns.add(zdt, { hour: 1, minutes: 1 })}`, '1969-12-25T12:24:45.678901234+00:00[UTC]')
  //     })
  //   })
  //   describe('ZonedDateTime.subtract()', () => {
  //     const zdt = zonedDateTimeFns.from('1969-12-25T12:23:45.678901234+00:00[UTC]')
  //     it('inst.subtract(durationObj)', () => {
  //       const earlier = zonedDateTimeFns.subtract(zdt, durationFns.from('PT240H0.000000800S'))
  //       assert.equal(`${earlier}`, '1969-12-15T12:23:45.678900434+00:00[UTC]')
  //     })
  //     const mar31 = zonedDateTimeFns.from('2020-03-31T15:00-07:00[America/Vancouver]')
  //     it('constrain when ambiguous result', () => {
  //       assert.equal(`${zonedDateTimeFns.subtract(mar31, { months: 1 })}`, '2020-02-29T15:00:00-08:00[America/Vancouver]')
  //       assert.equal(
  //         `${zonedDateTimeFns.subtract(mar31, { months: 1 }, { overflow: 'constrain' })}`,
  //         '2020-02-29T15:00:00-08:00[America/Vancouver]'
  //       )
  //     })
  //     it('symmetrical with regard to negative durations in the time part', () => {
  //       assert.equal(`${zonedDateTimeFns.subtract(mar31, { minutes: -30 })}`, '2020-03-31T15:30:00-07:00[America/Vancouver]')
  //       assert.equal(`${zonedDateTimeFns.subtract(mar31, { seconds: -30 })}`, '2020-03-31T15:00:30-07:00[America/Vancouver]')
  //     })
  //     it('throw when ambiguous result with reject', () => {
  //       assert.throws(() => zonedDateTimeFns.subtract(mar31, { months: 1 }, { overflow: 'reject' }), RangeError)
  //     })
  //     it('invalid overflow', () => {
  //       ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.subtract(zdt, { months: 1 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('mixed positive and negative values always throw', () => {
  //       ;['constrain', 'reject'].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.add(zdt, { hours: 1, minutes: -30 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.subtract(zdt, { years: 1 }, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) =>
  //         assert.equal(`${zonedDateTimeFns.subtract(zdt, { years: 1 }, options)}`, '1968-12-25T12:23:45.678901234+00:00[UTC]')
  //       )
  //     })
  //     it('object must contain at least one correctly-spelled property', () => {
  //       assert.throws(() => zonedDateTimeFns.subtract(zdt, {}), TypeError)
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.subtract(zdt, { hour: 12 }), TypeError)
  //     })
  //     it('incorrectly-spelled properties are ignored', () => {
  //       //@ts-expect-error
  //       assert.equal(`${zonedDateTimeFns.subtract(zdt, { hour: 1, minutes: 1 })}`, '1969-12-25T12:22:45.678901234+00:00[UTC]')
  //     })
  //   })

  //   describe('ZonedDateTime.until()', () => {
  //     const zdt = zonedDateTimeFns.from('1976-11-18T15:23:30.123+01:00[Europe/Vienna]')
  //     it('zonedDateTimeFns.until(zdt, later) === zonedDateTimeFns.since(later, zdt) with default options', () => {
  //       const later = zonedDateTimeFns.from({ year: 2016, month: 3, day: 3, hour: 18, timeZone: 'Europe/Vienna' })
  //       assert.equal(`${zonedDateTimeFns.until(zdt, later)}`, `${zonedDateTimeFns.since(later, zdt)}`)
  //     })
  //     const feb20 = zonedDateTimeFns.from('2020-02-01T00:00+01:00[Europe/Vienna]')
  //     const feb21 = zonedDateTimeFns.from('2021-02-01T00:00+01:00[Europe/Vienna]')
  //     it('defaults to returning hours', () => {
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21)}`, 'PT8784H')
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'auto' })}`, 'PT8784H')
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'hours' })}`, 'PT8784H')
  //       assert.equal(
  //         `${zonedDateTimeFns.until(feb20, zonedDateTimeFns.from('2021-02-01T00:00:00.000000001+01:00[Europe/Vienna]'))}`,
  //         'PT8784H0.000000001S'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(zonedDateTimeFns.from('2020-02-01T00:00:00.000000001+01:00[Europe/Vienna]'), feb21)}`,
  //         'PT8783H59M59.999999999S'
  //       )
  //     })
  //     it('can return lower or higher units', () => {
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'years' })}`, 'P1Y')
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'months' })}`, 'P12M')
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'weeks' })}`, 'P52W2D')
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'days' })}`, 'P366D')
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'minutes' })}`, 'PT527040M')
  //       assert.equal(`${zonedDateTimeFns.until(feb20, feb21, { largestUnit: 'seconds' })}`, 'PT31622400S')
  //     })
  //     it('can return subseconds', () => {
  //       const later = zonedDateTimeFns.add(feb20, { days: 1, milliseconds: 250 })

  //       const msDiff = zonedDateTimeFns.until(feb20, later, { largestUnit: 'milliseconds' })
  //       assert.equal(durationFns.getSeconds(msDiff), 0)
  //       assert.equal(durationFns.getMilliseconds(msDiff), 86400250)
  //     })
  //     it('does not include higher units than necessary', () => {
  //       const lastFeb20 = zonedDateTimeFns.from('2020-02-29T00:00+01:00[Europe/Vienna]')
  //       const lastJan21 = zonedDateTimeFns.from('2021-01-31T00:00+01:00[Europe/Vienna]')
  //       assert.equal(`${zonedDateTimeFns.until(lastFeb20, lastJan21)}`, 'PT8088H')
  //       assert.equal(`${zonedDateTimeFns.until(lastFeb20, lastJan21, { largestUnit: 'months' })}`, 'P11M2D')
  //       assert.equal(`${zonedDateTimeFns.until(lastFeb20, lastJan21, { largestUnit: 'years' })}`, 'P11M2D')
  //     })
  //     it('weeks and months are mutually exclusive', () => {
  //       const laterDateTime = zonedDateTimeFns.add(zdt, { days: 42, hours: 3 })
  //       const weeksDifference = zonedDateTimeFns.until(zdt, laterDateTime, { largestUnit: 'weeks' })
  //       assert.notEqual(durationFns.getWeeks(weeksDifference), 0)
  //       assert.equal(durationFns.getMonths(weeksDifference), 0)
  //       const monthsDifference = zonedDateTimeFns.until(zdt, laterDateTime, { largestUnit: 'months' })
  //       assert.equal(durationFns.getWeeks(monthsDifference), 0)
  //       assert.notEqual(durationFns.getMonths(monthsDifference), 0)
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.until(feb20, feb21, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) =>
  //         assert.equal(`${zonedDateTimeFns.until(feb20, feb21, options)}`, 'PT8784H')
  //       )
  //     })
  //     const earlier = zonedDateTimeFns.from('2019-01-08T09:22:36.123+01:00[Europe/Vienna]')
  //     const later = zonedDateTimeFns.from('2021-09-07T14:39:40.987654321+02:00[Europe/Vienna]')
  //     it('throws on disallowed or invalid smallestUnit', () => {
  //       ;['era', 'nonsense'].forEach((smallestUnit) => {
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.until(earlier, later, { smallestUnit }), RangeError)
  //       })
  //     })
  //     it('throws if smallestUnit is larger than largestUnit', () => {
  //       const units: TemporalPluralUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']
  //       for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
  //         for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
  //           const largestUnit = units[largestIdx]
  //           const smallestUnit = units[smallestIdx]
  //           assert.throws(() => zonedDateTimeFns.until(earlier, later, { largestUnit, smallestUnit }), RangeError)
  //         }
  //       }
  //     })
  //     it('assumes a different default for largestUnit if smallestUnit is larger than hours', () => {
  //       assert.equal(`${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y')
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`,
  //         'P32M'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`,
  //         'P139W'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'days', roundingMode: 'halfExpand' })}`,
  //         'P973D'
  //       )
  //     })
  //     it('throws on invalid roundingMode', () => {
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.until(earlier, later, { roundingMode: 'cile' }), RangeError)
  //     })
  //     const incrementOneNearest: [TemporalPluralUnit, string][] = [
  //       ['years', 'P3Y'],
  //       ['months', 'P32M'],
  //       ['weeks', 'P139W'],
  //       ['days', 'P973D'],
  //       ['hours', 'PT23356H'],
  //       ['minutes', 'PT23356H17M'],
  //       ['seconds', 'PT23356H17M5S'],
  //       ['milliseconds', 'PT23356H17M4.864S']
  //     ]
  //     incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'halfExpand'
  //       it(`rounds to nearest ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${zonedDateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P3Y', '-P2Y'],
  //       ['months', 'P32M', '-P31M'],
  //       ['weeks', 'P140W', '-P139W'],
  //       ['days', 'P974D', '-P973D'],
  //       ['hours', 'PT23357H', '-PT23356H'],
  //       ['minutes', 'PT23356H18M', '-PT23356H17M'],
  //       ['seconds', 'PT23356H17M5S', '-PT23356H17M4S'],
  //       ['milliseconds', 'PT23356H17M4.865S', '-PT23356H17M4.864S']
  //     ]
  //     incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'ceil'
  //       it(`rounds up to ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${zonedDateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P2Y', '-P3Y'],
  //       ['months', 'P31M', '-P32M'],
  //       ['weeks', 'P139W', '-P140W'],
  //       ['days', 'P973D', '-P974D'],
  //       ['hours', 'PT23356H', '-PT23357H'],
  //       ['minutes', 'PT23356H17M', '-PT23356H18M'],
  //       ['seconds', 'PT23356H17M4S', '-PT23356H17M5S'],
  //       ['milliseconds', 'PT23356H17M4.864S', '-PT23356H17M4.865S']
  //     ]
  //     incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'floor'
  //       it(`rounds down to ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${zonedDateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneTrunc: [TemporalPluralUnit, string][] = [
  //       ['years', 'P2Y'],
  //       ['months', 'P31M'],
  //       ['weeks', 'P139W'],
  //       ['days', 'P973D'],
  //       ['hours', 'PT23356H'],
  //       ['minutes', 'PT23356H17M'],
  //       ['seconds', 'PT23356H17M4S'],
  //       ['milliseconds', 'PT23356H17M4.864S']
  //     ]
  //     incrementOneTrunc.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'trunc'
  //       it(`truncates to ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${zonedDateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     it('trunc is the default', () => {
  //       assert.equal(`${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'minutes' })}`, 'PT23356H17M')
  //       assert.equal(`${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'seconds' })}`, 'PT23356H17M4S')
  //     })
  //     it('rounds to an increment of hours', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, {
  //           smallestUnit: 'hours',
  //           roundingIncrement: 3,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23355H'
  //       )
  //     })
  //     it('rounds to an increment of minutes', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, {
  //           smallestUnit: 'minutes',
  //           roundingIncrement: 30,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23356H30M'
  //       )
  //     })
  //     it('rounds to an increment of seconds', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, {
  //           smallestUnit: 'seconds',
  //           roundingIncrement: 15,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23356H17M'
  //       )
  //     })
  //     it('rounds to an increment of milliseconds', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, {
  //           smallestUnit: 'milliseconds',
  //           roundingIncrement: 10,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23356H17M4.86S'
  //       )
  //     })
  //     it('valid hour increments divide into 24', () => {
  //       const unit: TemporalPluralUnit = 'hours'
  //       ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
  //         const options = { smallestUnit: unit, roundingIncrement }
  //         assert(durationFns.isValid(zonedDateTimeFns.until(earlier, later, options)))
  //       })
  //     })
  //     const units: TemporalPluralUnit[] = ['minutes', 'seconds']
  //     units.forEach((smallestUnit) => {
  //       it(`valid ${smallestUnit} increments divide into 60`, () => {
  //         ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
  //           const options = { smallestUnit, roundingIncrement }
  //           assert(durationFns.isValid(zonedDateTimeFns.until(earlier, later, options)))
  //         })
  //       })
  //     })
  //     const unit: TemporalPluralUnit = 'milliseconds'
  //     it(`valid milliseconds increments divide into 1000`, () => {
  //       ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
  //         const options = { smallestUnit: unit, roundingIncrement }
  //         assert(durationFns.isValid(zonedDateTimeFns.until(earlier, later, options)))
  //       })
  //     })
  //     it('throws on increments that do not divide evenly into the next highest', () => {
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'hours', roundingIncrement: 11 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'minutes', roundingIncrement: 29 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'seconds', roundingIncrement: 29 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'milliseconds', roundingIncrement: 29 }),
  //         RangeError
  //       )
  //     })
  //     it('throws on increments that are equal to the next highest', () => {
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'hours', roundingIncrement: 24 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'minutes', roundingIncrement: 60 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'seconds', roundingIncrement: 60 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.until(earlier, later, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
  //         RangeError
  //       )
  //     })
  //     it('accepts singular units', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'year' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'year' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'month' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'months' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'month' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'months' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'day' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'days' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'day' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'days' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'hour' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'hours' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'hour' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'hours' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'minute' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'minutes' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'minute' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'minutes' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'second' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'seconds' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'second' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'seconds' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'millisecond' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { largestUnit: 'milliseconds' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'millisecond' })}`,
  //         `${zonedDateTimeFns.until(earlier, later, { smallestUnit: 'milliseconds' })}`
  //       )
  //     })
  //     it('rounds relative to the receiver', () => {
  //       const dt1 = zonedDateTimeFns.from('2019-01-01T00:00+00:00[UTC]')
  //       const dt2 = zonedDateTimeFns.from('2020-07-02T00:00+00:00[UTC]')
  //       assert.equal(`${zonedDateTimeFns.until(dt1, dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P2Y')
  //       assert.equal(`${zonedDateTimeFns.until(dt2, dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P1Y')
  //     })
  //   })
  //   describe('ZonedDateTime.since()', () => {
  //     const zdt = zonedDateTimeFns.from('1976-11-18T15:23:30.123+01:00[Europe/Vienna]')
  //     it('zonedDateTimeFns.since(zdt, earlier) === zonedDateTimeFns.until(earlier, zdt) with default options', () => {
  //       const earlier = zonedDateTimeFns.from({ year: 1966, month: 3, day: 3, hour: 18, timeZone: 'Europe/Vienna' })
  //       assert.equal(`${zonedDateTimeFns.since(zdt, earlier)}`, `${zonedDateTimeFns.until(earlier, zdt)}`)
  //     })
  //     const feb20 = zonedDateTimeFns.from('2020-02-01T00:00+01:00[Europe/Vienna]')
  //     const feb21 = zonedDateTimeFns.from('2021-02-01T00:00+01:00[Europe/Vienna]')
  //     it('defaults to returning hours', () => {
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20)}`, 'PT8784H')
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'auto' })}`, 'PT8784H')
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'hours' })}`, 'PT8784H')
  //       assert.equal(
  //         `${zonedDateTimeFns.since(zonedDateTimeFns.from('2021-02-01T00:00:00.000000001+01:00[Europe/Vienna]'), feb20)}`,
  //         'PT8784H0.000000001S'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(feb21, zonedDateTimeFns.from('2020-02-01T00:00:00.000000001+01:00[Europe/Vienna]'))}`,
  //         'PT8783H59M59.999999999S'
  //       )
  //     })
  //     it('can return lower or higher units', () => {
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'years' })}`, 'P1Y')
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'months' })}`, 'P12M')
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'weeks' })}`, 'P52W2D')
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'days' })}`, 'P366D')
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'minutes' })}`, 'PT527040M')
  //       assert.equal(`${zonedDateTimeFns.since(feb21, feb20, { largestUnit: 'seconds' })}`, 'PT31622400S')
  //     })
  //     it('can return subseconds', () => {
  //       const later = zonedDateTimeFns.add(feb20, { days: 1, milliseconds: 250 })

  //       const msDiff = zonedDateTimeFns.since(later, feb20, { largestUnit: 'milliseconds' })
  //       assert.equal(durationFns.getSeconds(msDiff), 0)
  //       assert.equal(durationFns.getMilliseconds(msDiff), 86400250)
  //     })
  //     it('does not include higher units than necessary', () => {
  //       const lastFeb20 = zonedDateTimeFns.from('2020-02-29T00:00+01:00[Europe/Vienna]')
  //       const lastFeb21 = zonedDateTimeFns.from('2021-02-28T00:00+01:00[Europe/Vienna]')
  //       assert.equal(`${zonedDateTimeFns.since(lastFeb21, lastFeb20)}`, 'PT8760H')
  //       assert.equal(`${zonedDateTimeFns.since(lastFeb21, lastFeb20, { largestUnit: 'months' })}`, 'P11M28D')
  //       assert.equal(`${zonedDateTimeFns.since(lastFeb21, lastFeb20, { largestUnit: 'years' })}`, 'P11M28D')
  //     })
  //     it('weeks and months are mutually exclusive', () => {
  //       const laterDateTime = zonedDateTimeFns.add(zdt, { days: 42, hours: 3 })
  //       const weeksDifference = zonedDateTimeFns.since(laterDateTime, zdt, { largestUnit: 'weeks' })
  //       assert.notEqual(durationFns.getWeeks(weeksDifference), 0)
  //       assert.equal(durationFns.getMonths(weeksDifference), 0)
  //       const monthsDifference = zonedDateTimeFns.since(laterDateTime, zdt, { largestUnit: 'months' })
  //       assert.equal(durationFns.getWeeks(monthsDifference), 0)
  //       assert.notEqual(durationFns.getMonths(monthsDifference), 0)
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.since(feb21, feb20, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) =>
  //         assert.equal(`${zonedDateTimeFns.since(feb21, feb20, options)}`, 'PT8784H')
  //       )
  //     })
  //     const earlier = zonedDateTimeFns.from('2019-01-08T09:22:36.123+01:00[Europe/Vienna]')
  //     const later = zonedDateTimeFns.from('2021-09-07T14:39:40.987654321+02:00[Europe/Vienna]')
  //     it('throws on disallowed or invalid smallestUnit', () => {
  //       ;['era', 'nonsense'].forEach((smallestUnit) => {
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.since(later, earlier, { smallestUnit }), RangeError)
  //       })
  //     })
  //     it('throws if smallestUnit is larger than largestUnit', () => {
  //       const units: TemporalPluralUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']
  //       for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
  //         for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
  //           const largestUnit = units[largestIdx]
  //           const smallestUnit = units[smallestIdx]
  //           assert.throws(() => zonedDateTimeFns.since(later, earlier, { largestUnit, smallestUnit }), RangeError)
  //         }
  //       }
  //     })
  //     it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
  //       assert.equal(`${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y')
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`,
  //         'P32M'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`,
  //         'P139W'
  //       )
  //     })
  //     it('throws on invalid roundingMode', () => {
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.since(later, earlier, { roundingMode: 'cile' }), RangeError)
  //     })
  //     const incrementOneNearest: [TemporalPluralUnit, string][] = [
  //       ['years', 'P3Y'],
  //       ['months', 'P32M'],
  //       ['weeks', 'P139W'],
  //       ['days', 'P973D'],
  //       ['hours', 'PT23356H'],
  //       ['minutes', 'PT23356H17M'],
  //       ['seconds', 'PT23356H17M5S'],
  //       ['milliseconds', 'PT23356H17M4.864S']
  //     ]
  //     incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'halfExpand'
  //       it(`rounds to nearest ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${zonedDateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P3Y', '-P2Y'],
  //       ['months', 'P32M', '-P31M'],
  //       ['weeks', 'P140W', '-P139W'],
  //       ['days', 'P974D', '-P973D'],
  //       ['hours', 'PT23357H', '-PT23356H'],
  //       ['minutes', 'PT23356H18M', '-PT23356H17M'],
  //       ['seconds', 'PT23356H17M5S', '-PT23356H17M4S'],
  //       ['milliseconds', 'PT23356H17M4.865S', '-PT23356H17M4.864S']
  //     ]
  //     incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'ceil'
  //       it(`rounds up to ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${zonedDateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P2Y', '-P3Y'],
  //       ['months', 'P31M', '-P32M'],
  //       ['weeks', 'P139W', '-P140W'],
  //       ['days', 'P973D', '-P974D'],
  //       ['hours', 'PT23356H', '-PT23357H'],
  //       ['minutes', 'PT23356H17M', '-PT23356H18M'],
  //       ['seconds', 'PT23356H17M4S', '-PT23356H17M5S'],
  //       ['milliseconds', 'PT23356H17M4.864S', '-PT23356H17M4.865S']
  //     ]
  //     incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'floor'
  //       it(`rounds down to ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${zonedDateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneTrunc: [TemporalPluralUnit, string][] = [
  //       ['years', 'P2Y'],
  //       ['months', 'P31M'],
  //       ['weeks', 'P139W'],
  //       ['days', 'P973D'],
  //       ['hours', 'PT23356H'],
  //       ['minutes', 'PT23356H17M'],
  //       ['seconds', 'PT23356H17M4S'],
  //       ['milliseconds', 'PT23356H17M4.864S']
  //     ]
  //     incrementOneTrunc.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'trunc'
  //       it(`truncates to ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${zonedDateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     it('trunc is the default', () => {
  //       assert.equal(`${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'minutes' })}`, 'PT23356H17M')
  //       assert.equal(`${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'seconds' })}`, 'PT23356H17M4S')
  //     })
  //     it('rounds to an increment of hours', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, {
  //           smallestUnit: 'hours',
  //           roundingIncrement: 3,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23355H'
  //       )
  //     })
  //     it('rounds to an increment of minutes', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, {
  //           smallestUnit: 'minutes',
  //           roundingIncrement: 30,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23356H30M'
  //       )
  //     })
  //     it('rounds to an increment of seconds', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, {
  //           smallestUnit: 'seconds',
  //           roundingIncrement: 15,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23356H17M'
  //       )
  //     })
  //     it('rounds to an increment of milliseconds', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, {
  //           smallestUnit: 'milliseconds',
  //           roundingIncrement: 10,
  //           roundingMode: 'halfExpand'
  //         })}`,
  //         'PT23356H17M4.86S'
  //       )
  //     })
  //     it('valid hour increments divide into 24', () => {
  //       const unit: TemporalPluralUnit = 'hours'
  //       ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
  //         const options = { smallestUnit: unit, roundingIncrement }
  //         assert(durationFns.isValid(zonedDateTimeFns.since(later, earlier, options)))
  //       })
  //     })
  //     const units: TemporalPluralUnit[] = ['minutes', 'seconds']
  //     units.forEach((smallestUnit) => {
  //       it(`valid ${smallestUnit} increments divide into 60`, () => {
  //         ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
  //           const options = { smallestUnit, roundingIncrement }
  //           assert(durationFns.isValid(zonedDateTimeFns.since(later, earlier, options)))
  //         })
  //       })
  //     })
  //     const unit: TemporalPluralUnit = 'milliseconds'
  //     it(`valid milliseconds increments divide into 1000`, () => {
  //       ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
  //         const options = { smallestUnit: unit, roundingIncrement }
  //         assert(durationFns.isValid(zonedDateTimeFns.since(later, earlier, options)))
  //       })
  //     })
  //     it('throws on increments that do not divide evenly into the next highest', () => {
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 11 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'minutes', roundingIncrement: 29 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'seconds', roundingIncrement: 29 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'milliseconds', roundingIncrement: 29 }),
  //         RangeError
  //       )
  //     })
  //     it('throws on increments that are equal to the next highest', () => {
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 24 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'minutes', roundingIncrement: 60 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'seconds', roundingIncrement: 60 }),
  //         RangeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.since(later, earlier, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
  //         RangeError
  //       )
  //     })
  //     it('accepts singular units', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'year' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'year' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'month' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'months' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'month' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'months' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'day' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'days' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'day' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'days' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'hour' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'hours' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'hour' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'hours' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'minute' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'minutes' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'minute' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'minutes' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'second' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'seconds' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'second' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'seconds' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'millisecond' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { largestUnit: 'milliseconds' })}`
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'millisecond' })}`,
  //         `${zonedDateTimeFns.since(later, earlier, { smallestUnit: 'milliseconds' })}`
  //       )
  //     })
  //     it('rounds relative to the receiver', () => {
  //       const dt1 = zonedDateTimeFns.from('2019-01-01T00:00+00:00[UTC]')
  //       const dt2 = zonedDateTimeFns.from('2020-07-02T00:00+00:00[UTC]')
  //       assert.equal(`${zonedDateTimeFns.since(dt2, dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P1Y')
  //       assert.equal(`${zonedDateTimeFns.since(dt1, dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P2Y')
  //     })
  //   })

  //   describe('ZonedDateTime.round()', () => {
  //     const zdt = zonedDateTimeFns.from('1976-11-18T15:23:30.123+01:00[Europe/Vienna]')
  //     it('throws without parameter', () => {
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.round(), TypeError)
  //     })
  //     it('throws without required smallestUnit parameter', () => {
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.round(zdt, {}), RangeError)
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { roundingIncrement: 1, roundingMode: 'ceil' }), RangeError)
  //     })
  //     it('throws on disallowed or invalid smallestUnit', () => {
  //       const units: (TemporalPluralUnit | TemporalSingularUnit | 'era')[] = [
  //         'era',
  //         'year',
  //         'month',
  //         'week',
  //         'years',
  //         'months',
  //         'weeks',
  //         //@ts-expect-error
  //         'nonsense'
  //       ]
  //       units.forEach((smallestUnit) => {
  //         //@ts-expect-error
  //         assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit }), RangeError)
  //       })
  //     })
  //     it('throws on invalid roundingMode', () => {
  //       //@ts-expect-error
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'second', roundingMode: 'cile' }), RangeError)
  //     })
  //     const incrementOneNearest: [Exclude<TemporalSingularUnit, 'year' | 'month' | 'week'>, string][] = [
  //       ['day', '1976-11-19T00:00:00+01:00[Europe/Vienna]'],
  //       ['hour', '1976-11-18T15:00:00+01:00[Europe/Vienna]'],
  //       ['minute', '1976-11-18T15:24:00+01:00[Europe/Vienna]'],
  //       ['second', '1976-11-18T15:23:30+01:00[Europe/Vienna]'],
  //       ['millisecond', '1976-11-18T15:23:30.123+01:00[Europe/Vienna]']
  //     ]
  //     incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //       it(`rounds to nearest ${smallestUnit}`, () =>
  //         assert.equal(`${zonedDateTimeFns.round(zdt, { smallestUnit, roundingMode: 'halfExpand' })}`, expected))
  //     })
  //     const incrementOneCeil: [Exclude<TemporalSingularUnit, 'year' | 'month' | 'week'>, string][] = [
  //       ['day', '1976-11-19T00:00:00+01:00[Europe/Vienna]'],
  //       ['hour', '1976-11-18T16:00:00+01:00[Europe/Vienna]'],
  //       ['minute', '1976-11-18T15:24:00+01:00[Europe/Vienna]'],
  //       ['second', '1976-11-18T15:23:31+01:00[Europe/Vienna]'],
  //       ['millisecond', '1976-11-18T15:23:30.124+01:00[Europe/Vienna]']
  //     ]
  //     incrementOneCeil.forEach(([smallestUnit, expected]) => {
  //       it(`rounds up to ${smallestUnit}`, () =>
  //         assert.equal(`${zonedDateTimeFns.round(zdt, { smallestUnit, roundingMode: 'ceil' })}`, expected))
  //     })
  //     const incrementOneFloor: [Exclude<TemporalSingularUnit, 'year' | 'month' | 'week'>, string][] = [
  //       ['day', '1976-11-18T00:00:00+01:00[Europe/Vienna]'],
  //       ['hour', '1976-11-18T15:00:00+01:00[Europe/Vienna]'],
  //       ['minute', '1976-11-18T15:23:00+01:00[Europe/Vienna]'],
  //       ['second', '1976-11-18T15:23:30+01:00[Europe/Vienna]'],
  //       ['millisecond', '1976-11-18T15:23:30.123+01:00[Europe/Vienna]']
  //     ]
  //     incrementOneFloor.forEach(([smallestUnit, expected]) => {
  //       it(`rounds down to ${smallestUnit}`, () =>
  //         assert.equal(`${zonedDateTimeFns.round(zdt, { smallestUnit, roundingMode: 'floor' })}`, expected))
  //       it(`truncates to ${smallestUnit}`, () =>
  //         assert.equal(`${zonedDateTimeFns.round(zdt, { smallestUnit, roundingMode: 'trunc' })}`, expected))
  //     })
  //     it('halfExpand is the default', () => {
  //       assert.equal(`${zonedDateTimeFns.round(zdt, { smallestUnit: 'minute' })}`, '1976-11-18T15:24:00+01:00[Europe/Vienna]')
  //       assert.equal(`${zonedDateTimeFns.round(zdt, { smallestUnit: 'second' })}`, '1976-11-18T15:23:30+01:00[Europe/Vienna]')
  //     })
  //     it('rounding down is towards the Big Bang, not towards the epoch', () => {
  //       const zdt2 = zonedDateTimeFns.from('1969-12-15T12:00:00.5+00:00[UTC]')
  //       const smallestUnit = 'second'
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt2, { smallestUnit, roundingMode: 'ceil' })}`,
  //         '1969-12-15T12:00:01+00:00[UTC]'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt2, { smallestUnit, roundingMode: 'floor' })}`,
  //         '1969-12-15T12:00:00+00:00[UTC]'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt2, { smallestUnit, roundingMode: 'trunc' })}`,
  //         '1969-12-15T12:00:00+00:00[UTC]'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt2, { smallestUnit, roundingMode: 'halfExpand' })}`,
  //         '1969-12-15T12:00:01+00:00[UTC]'
  //       )
  //     })
  //     it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
  //       const zdt3 = zonedDateTimeFns.from('-000099-12-15T12:00:00.5+00:00[UTC]')
  //       const smallestUnit = 'second'
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt3, { smallestUnit, roundingMode: 'ceil' })}`,
  //         '-000099-12-15T12:00:01+00:00[UTC]'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt3, { smallestUnit, roundingMode: 'floor' })}`,
  //         '-000099-12-15T12:00:00+00:00[UTC]'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt3, { smallestUnit, roundingMode: 'trunc' })}`,
  //         '-000099-12-15T12:00:00+00:00[UTC]'
  //       )
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt3, { smallestUnit, roundingMode: 'halfExpand' })}`,
  //         '-000099-12-15T12:00:01+00:00[UTC]'
  //       )
  //     })
  //     it('rounds to an increment of hours', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt, { smallestUnit: 'hour', roundingIncrement: 4 })}`,
  //         '1976-11-18T16:00:00+01:00[Europe/Vienna]'
  //       )
  //     })
  //     it('rounds to an increment of minutes', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt, { smallestUnit: 'minute', roundingIncrement: 15 })}`,
  //         '1976-11-18T15:30:00+01:00[Europe/Vienna]'
  //       )
  //     })
  //     it('rounds to an increment of seconds', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt, { smallestUnit: 'second', roundingIncrement: 30 })}`,
  //         '1976-11-18T15:23:30+01:00[Europe/Vienna]'
  //       )
  //     })
  //     it('rounds to an increment of milliseconds', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt, { smallestUnit: 'millisecond', roundingIncrement: 10 })}`,
  //         '1976-11-18T15:23:30.12+01:00[Europe/Vienna]'
  //       )
  //     })
  //     it('1 day is a valid increment', () => {
  //       assert.equal(
  //         `${zonedDateTimeFns.round(zdt, { smallestUnit: 'day', roundingIncrement: 1 })}`,
  //         '1976-11-19T00:00:00+01:00[Europe/Vienna]'
  //       )
  //     })
  //     it('valid hour increments divide into 24', () => {
  //       const smallestUnit = 'hour'
  //       ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
  //         assert(zonedDateTimeFns.isValid(zonedDateTimeFns.round(zdt, { smallestUnit, roundingIncrement })))
  //       })
  //     })
  //     let units: Exclude<TemporalSingularUnit, 'year' | 'month' | 'week'>[] = ['minute', 'second']
  //     units.forEach((smallestUnit) => {
  //       it(`valid ${smallestUnit} increments divide into 60`, () => {
  //         ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
  //           assert(zonedDateTimeFns.isValid(zonedDateTimeFns.round(zdt, { smallestUnit, roundingIncrement })))
  //         })
  //       })
  //     })
  //     const unit: TemporalSingularUnit = 'millisecond'
  //     it(`valid millisecond increments divide into 1000`, () => {
  //       ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
  //         assert(zonedDateTimeFns.isValid(zonedDateTimeFns.round(zdt, { smallestUnit: unit, roundingIncrement })))
  //       })
  //     })
  //     it('throws on increments that do not divide evenly into the next highest', () => {
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'day', roundingIncrement: 29 }), RangeError)
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'hour', roundingIncrement: 29 }), RangeError)
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'minute', roundingIncrement: 29 }), RangeError)
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'second', roundingIncrement: 29 }), RangeError)
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError)
  //     })
  //     it('throws on increments that are equal to the next highest', () => {
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'hour', roundingIncrement: 24 }), RangeError)
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'minute', roundingIncrement: 60 }), RangeError)
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'second', roundingIncrement: 60 }), RangeError)
  //       assert.throws(() => zonedDateTimeFns.round(zdt, { smallestUnit: 'millisecond', roundingIncrement: 1000 }), RangeError)
  //     })
  //     const bal = zonedDateTimeFns.from('1976-11-18T23:59:59.999999999+01:00[Europe/Vienna]')
  //     units = ['day', 'hour', 'minute', 'second', 'millisecond']
  //     units.forEach((smallestUnit) => {
  //       it(`balances to next ${smallestUnit}`, () => {
  //         assert.equal(`${zonedDateTimeFns.round(bal, { smallestUnit })}`, '1976-11-19T00:00:00+01:00[Europe/Vienna]')
  //       })
  //     })
  //     it('accepts plural units', () => {
  //       const unit: TemporalSingularUnit = 'hour'
  //       assert.equal(
  //         zonedDateTimeFns.round(zdt, { smallestUnit: unit }),
  //         zonedDateTimeFns.round(zdt, { smallestUnit: 'hour' })
  //       )
  //       assert.equal(
  //         zonedDateTimeFns.round(zdt, { smallestUnit: 'minute' }),
  //         zonedDateTimeFns.round(zdt, { smallestUnit: 'minute' })
  //       )
  //       assert.equal(
  //         zonedDateTimeFns.round(zdt, { smallestUnit: 'second' }),
  //         zonedDateTimeFns.round(zdt, { smallestUnit: 'second' })
  //       )
  //       assert(
  //         zonedDateTimeFns.round(zdt, { smallestUnit: 'millisecond' }),
  //         zonedDateTimeFns.round(zdt, { smallestUnit: 'millisecond' })
  //       )
  //     })
  //     it('rounds correctly to a 25-hour day', () => {
  //       const roundMeDown = zonedDateTimeFns.from('2020-11-01T12:29:59-08:00[America/Vancouver]')
  //       assert.equal(
  //         `${zonedDateTimeFns.round(roundMeDown, { smallestUnit: 'day' })}`,
  //         '2020-11-01T00:00:00-07:00[America/Vancouver]'
  //       )
  //       const roundMeUp = zonedDateTimeFns.from('2020-11-01T12:30:01-08:00[America/Vancouver]')
  //       assert.equal(
  //         `${zonedDateTimeFns.round(roundMeUp, { smallestUnit: 'day' })}`,
  //         '2020-11-02T00:00:00-08:00[America/Vancouver]'
  //       )
  //     })
  //     it('rounds correctly to a 23-hour day', () => {
  //       const roundMeDown = zonedDateTimeFns.from('2020-03-08T11:29:59-07:00[America/Vancouver]')
  //       assert.equal(
  //         `${zonedDateTimeFns.round(roundMeDown, { smallestUnit: 'day' })}`,
  //         '2020-03-08T00:00:00-08:00[America/Vancouver]'
  //       )
  //       const roundMeUp = zonedDateTimeFns.from('2020-03-08T11:30:01-07:00[America/Vancouver]')
  //       assert.equal(
  //         `${zonedDateTimeFns.round(roundMeUp, { smallestUnit: 'day' })}`,
  //         '2020-03-09T00:00:00-07:00[America/Vancouver]'
  //       )
  //     })
  //     it('rounding up to a nonexistent wall-clock time', () => {
  //       const almostSkipped = zonedDateTimeFns.from('2018-11-03T23:59:59.999-03:00[America/Sao_Paulo]')
  //       const rounded = zonedDateTimeFns.round(almostSkipped, { smallestUnit: 'millisecond', roundingMode: 'halfExpand' })
  //       assert.equal(`${rounded}`, '2018-11-04T01:00:00-02:00[America/Sao_Paulo]')
  //     })

  //     describe('ZonedDateTime.toInstant()', () => {
  //       it('recent date', () => {
  //         const zdt = zonedDateTimeFns.from('2019-10-29T10:46:38.271986102+01:00[Europe/Amsterdam]')
  //         assert.equal(`${zonedDateTimeFns.toInstant(zdt)}`, '2019-10-29T09:46:38.271986102Z')
  //       })
  //       it('year ≤ 99', () => {
  //         const zdt = zonedDateTimeFns.from('+000098-10-29T10:46:38.271986102+00:00[UTC]')
  //         assert.equal(`${zonedDateTimeFns.toInstant(zdt)}`, '+000098-10-29T10:46:38.271986102Z')
  //       })
  //       it('year < 1', () => {
  //         let zdt = zonedDateTimeFns.from('+000000-10-29T10:46:38.271986102+00:00[UTC]')
  //         assert.equal(`${zonedDateTimeFns.toInstant(zdt)}`, '+000000-10-29T10:46:38.271986102Z')
  //         zdt = zonedDateTimeFns.from('-001000-10-29T10:46:38.271986102+00:00[UTC]')
  //         assert.equal(`${zonedDateTimeFns.toInstant(zdt)}`, '-001000-10-29T10:46:38.271986102Z')
  //       })
  //       it('year 0 leap day', () => {
  //         const zdt = zonedDateTimeFns.from('+000000-02-29T00:00-00:01:15[Europe/London]')
  //         assert.equal(`${zonedDateTimeFns.toInstant(zdt)}`, '+000000-02-29T00:01:15Z')
  //       })
  //     })
  //     describe('ZonedDateTime.toPlainDate()', () => {
  //       it('works', () => {
  //         const zdt = instantFns.toZonedDateTime(instantFns.from('2019-10-29T09:46:38.271986102Z'), tz)
  //         assert.equal(zonedDateTimeFns.toDate(zdt), '2019-10-29')
  //       })
  //     })
  //     describe('ZonedDateTime.toPlainTime()', () => {
  //       it('works', () => {
  //         const zdt = instantFns.toZonedDateTime(instantFns.from('2019-10-29T09:46:38.271986102Z'), tz)
  //         assert.equal(`${zonedDateTimeFns.toTime(zdt)}`, '02:46:38.271986102')
  //       })
  //     })
  //   })

  //   describe('ZonedDateTime.getISOFields()', () => {
  //     const zdt1 = zonedDateTimeFns.from('1976-11-18T15:23:30.123+08:00[Asia/Shanghai]')
  //     const fields = zonedDateTimeFns.getFields(zdt1)
  //     it('fields', () => {
  //       assert.equal(fields.year, 1976)
  //       assert.equal(fields.month, 11)
  //       assert.equal(fields.day, 18)
  //       assert.equal(fields.hour, 15)
  //       assert.equal(fields.minute, 23)
  //       assert.equal(fields.second, 30)
  //       assert.equal(fields.millisecond, 123)
  //       assert.equal(fields.offset, '+08:00')
  //       assert.equal(fields.timeZone, 'Asia/Shanghai')
  //     })
  //     it('enumerable', () => {
  //       const fields2 = { ...fields }
  //       assert.equal(fields2.year, 1976)
  //       assert.equal(fields2.month, 11)
  //       assert.equal(fields2.day, 18)
  //       assert.equal(fields2.hour, 15)
  //       assert.equal(fields2.minute, 23)
  //       assert.equal(fields2.second, 30)
  //       assert.equal(fields2.millisecond, 123)
  //       assert.equal(fields2.offset, '+08:00')
  //       assert.equal(fields2.timeZone, fields.timeZone)
  //     })
  //   })

  //   const hourBeforeDstStart = dateTimeFns.toZonedDateTime(dateTimeFns.fromNumbers(2020, 3, 8, 1), tz)
  //   const dayBeforeDstStart = dateTimeFns.toZonedDateTime(dateTimeFns.fromNumbers(2020, 3, 7, 2, 30), tz)
  //   describe('properties around DST', () => {
  //     it('hoursInDay works with DST start', () => {
  //       assert.equal(zonedDateTimeFns.getHoursInDay(hourBeforeDstStart), 23)
  //     })
  //     it('hoursInDay works with non-DST days', () => {
  //       assert.equal(zonedDateTimeFns.getHoursInDay(dayBeforeDstStart), 24)
  //     })
  //     it('hoursInDay works with DST end', () => {
  //       const dstEnd = zonedDateTimeFns.from('2020-11-01T01:00-08:00[America/Los_Angeles]')
  //       assert.equal(zonedDateTimeFns.getHoursInDay(dstEnd), 25)
  //     })
  //     it('hoursInDay works with non-hour DST change', () => {
  //       const zdt1 = zonedDateTimeFns.from('2020-10-04T12:00[Australia/Lord_Howe]')
  //       assert.equal(zonedDateTimeFns.getHoursInDay(zdt1), 23.5)
  //       const zdt2 = zonedDateTimeFns.from('2020-04-05T12:00[Australia/Lord_Howe]')
  //       assert.equal(zonedDateTimeFns.getHoursInDay(zdt2), 24.5)
  //     })
  //     it('hoursInDay works with non-half-hour DST change', () => {
  //       const zdt = zonedDateTimeFns.from('1933-01-01T12:00[Asia/Singapore]')
  //       assert(Math.abs(zonedDateTimeFns.getHoursInDay(zdt) - 23.6666666666666666) < Number.EPSILON)
  //     })
  //     it('hoursInDay works when day starts at 1:00 due to DST start at midnight', () => {
  //       const zdt = zonedDateTimeFns.from('2015-10-18T12:00:00-02:00[America/Sao_Paulo]')
  //       assert.equal(zonedDateTimeFns.getHoursInDay(zdt), 23)
  //     })

  //     const dayAfterSamoaDateLineChange = zonedDateTimeFns.from('2011-12-31T22:00+14:00[Pacific/Apia]')
  //     const dayBeforeSamoaDateLineChange = zonedDateTimeFns.from('2011-12-29T22:00-10:00[Pacific/Apia]')
  //     it('hoursInDay works after Samoa date line change', () => {
  //       assert.equal(zonedDateTimeFns.getHoursInDay(dayAfterSamoaDateLineChange), 24)
  //     })
  //     it('hoursInDay works before Samoa date line change', () => {
  //       assert.equal(zonedDateTimeFns.getHoursInDay(dayBeforeSamoaDateLineChange), 24)
  //     })
  //   })

  //   describe('math around DST', () => {
  //     it('add 1 hour to get to DST start', () => {
  //       const added = zonedDateTimeFns.add(hourBeforeDstStart, { hours: 1 })
  //       assert.equal(zonedDateTimeFns.getHour(added), 3)
  //       const diff = zonedDateTimeFns.until(hourBeforeDstStart, added, { largestUnit: 'hours' })
  //       assert.equal(`${diff}`, 'PT1H')
  //       assert.equal(`${diff}`, `${zonedDateTimeFns.since(added, hourBeforeDstStart, { largestUnit: 'hours' })}`)
  //       const undo = zonedDateTimeFns.subtract(added, diff)
  //       assert.equal(`${undo}`, `${hourBeforeDstStart}`)
  //     })

  //     it('add 2 hours to get to DST start +1', () => {
  //       const added = zonedDateTimeFns.add(hourBeforeDstStart, { hours: 2 })
  //       assert.equal(zonedDateTimeFns.getHour(added), 4)
  //       const diff = zonedDateTimeFns.until(hourBeforeDstStart, added, { largestUnit: 'hours' })
  //       assert.equal(`${diff}`, 'PT2H')
  //       assert.equal(`${diff}`, `${zonedDateTimeFns.since(added, hourBeforeDstStart, { largestUnit: 'hours' })}`)
  //       const undo = zonedDateTimeFns.subtract(added, diff)
  //       assert.equal(`${undo}`, `${hourBeforeDstStart}`)
  //     })

  //     it('add 1.5 hours to get to 0.5 hours after DST start', () => {
  //       const added = zonedDateTimeFns.add(hourBeforeDstStart, { hours: 1, minutes: 30 })
  //       assert.equal(zonedDateTimeFns.getHour(added), 3)
  //       assert.equal(zonedDateTimeFns.getMinute(added), 30)
  //       const diff = zonedDateTimeFns.until(hourBeforeDstStart, added, { largestUnit: 'hours' })
  //       assert.equal(`${diff}`, 'PT1H30M')
  //       assert.equal(`${diff}`, `${zonedDateTimeFns.since(added, hourBeforeDstStart, { largestUnit: 'hours' })}`)
  //       const undo = zonedDateTimeFns.subtract(added, diff)
  //       assert.equal(`${undo}`, `${hourBeforeDstStart}`)
  //     })

  //     // it('Samoa date line change (add): 10:00PM 29 Dec 2011 -> 11:00PM 31 Dec 2011', () => {
  //     //   const timeZone = 'Pacific/Apia'
  //     //   const dayBeforeSamoaDateLineChangeAbs = timeZone.getInstantFor(dateTimeFns.fromNumbers(2011, 12, 29, 22))
  //     //   const start = dayBeforeSamoaDateLineChangeAbs.toZonedDateTimeISO(timeZone)
  //     //   const added = zonedDateTimeFns.add(start, { days: 1, hours: 1 })
  //     //   assert.equal(added.day, 31)
  //     //   assert.equal(added.hour, 23)
  //     //   assert.equal(added.minute, 0)
  //     //   const diff = zonedDateTimeFns.until(start, added, { largestUnit: 'days' })
  //     //   assert.equal(`${diff}`, 'P2DT1H')
  //     //   const undo = zonedDateTimeFns.subtract(added, diff)
  //     //   assert.equal(`${undo}`, `${start}`)
  //     // })

  //     // it('Samoa date line change (subtract): 11:00PM 31 Dec 2011 -> 10:00PM 29 Dec 2011', () => {
  //     //   const timeZone = 'Pacific/Apia'
  //     //   const dayAfterSamoaDateLineChangeAbs = timeZone.getInstantFor(dateTimeFns.fromNumbers(2011, 12, 31, 23))
  //     //   const start = dayAfterSamoaDateLineChangeAbs.toZonedDateTimeISO(timeZone)
  //     //   const skipped = start.subtract({ days: 1, hours: 1 })
  //     //   assert.equal(skipped.day, 31)
  //     //   assert.equal(skipped.hour, 22)
  //     //   assert.equal(skipped.minute, 0)
  //     //   const end = start.subtract({ days: 2, hours: 1 })
  //     //   assert.equal(end.day, 29)
  //     //   assert.equal(end.hour, 22)
  //     //   assert.equal(end.minute, 0)
  //     //   const diff = end.since(start, { largestUnit: 'days' })
  //     //   assert.equal(`${diff}`, '-P2DT1H')
  //     //   const undo = zonedDateTimeFns.add(start, diff)
  //     //   assert.equal(`${undo}`, `${end}`)
  //     // })

  //     it('3:30 day before DST start -> 3:30 day of DST start', () => {
  //       const start = zonedDateTimeFns.add(dayBeforeDstStart, { hours: 1 }) // 3:30AM
  //       const added = zonedDateTimeFns.add(start, { days: 1 })
  //       assert.equal(zonedDateTimeFns.getDay(added), 8)
  //       assert.equal(zonedDateTimeFns.getHour(added), 3)
  //       assert.equal(zonedDateTimeFns.getMinute(added), 30)
  //       const diff = zonedDateTimeFns.until(start, added, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'P1D')
  //       const undo = zonedDateTimeFns.subtract(added, diff)
  //       assert.equal(`${undo}`, `${start}`)
  //     })

  //     it('2:30 day before DST start -> 3:30 day of DST start', () => {
  //       const added = zonedDateTimeFns.add(dayBeforeDstStart, { days: 1 })
  //       assert.equal(zonedDateTimeFns.getDay(added), 8)
  //       assert.equal(zonedDateTimeFns.getHour(added), 3)
  //       assert.equal(zonedDateTimeFns.getMinute(added), 30)
  //       const diff = zonedDateTimeFns.until(dayBeforeDstStart, added, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'P1D')
  //       const undo = zonedDateTimeFns.add(dayBeforeDstStart, diff)
  //       assert.equal(`${undo}`, `${added}`)
  //     })

  //     it('1:30 day DST starts -> 4:30 day DST starts', () => {
  //       const start = zonedDateTimeFns.add(dayBeforeDstStart, { hours: 23 }) // 1:30AM
  //       const added = zonedDateTimeFns.add(start, { hours: 2 })
  //       assert.equal(zonedDateTimeFns.getDay(added), 8)
  //       assert.equal(zonedDateTimeFns.getHour(added), 4)
  //       assert.equal(zonedDateTimeFns.getMinute(added), 30)
  //       const diff = zonedDateTimeFns.until(start, added, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'PT2H')
  //       const undo = zonedDateTimeFns.subtract(added, diff)
  //       assert.equal(`${undo}`, `${start}`)
  //     })

  //     it('2:00 day before DST starts -> 3:00 day DST starts', () => {
  //       const start = zonedDateTimeFns.add(zonedDateTimeFns.subtract(hourBeforeDstStart, { days: 1 }), { hours: 1 }) // 2:00AM
  //       const added = zonedDateTimeFns.add(start, { days: 1 })
  //       assert.equal(zonedDateTimeFns.getDay(added), 8)
  //       assert.equal(zonedDateTimeFns.getHour(added), 3)
  //       assert.equal(zonedDateTimeFns.getMinute(added), 0)
  //       const diff = zonedDateTimeFns.until(start, added, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'P1D')
  //       const undo = zonedDateTimeFns.add(start, diff)
  //       assert.equal(`${undo}`, `${added}`)
  //     })

  //     it('1:00AM day DST starts -> (add 24 hours) -> 2:00AM day after DST starts', () => {
  //       const start = hourBeforeDstStart // 1:00AM
  //       const added = zonedDateTimeFns.add(start, { hours: 24 })
  //       assert.equal(zonedDateTimeFns.getDay(added), 9)
  //       assert.equal(zonedDateTimeFns.getHour(added), 2)
  //       assert.equal(zonedDateTimeFns.getMinute(added), 0)
  //       const diff = zonedDateTimeFns.until(start, added, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'P1DT1H')
  //       const undo = zonedDateTimeFns.subtract(added, diff)
  //       assert.equal(`${undo}`, `${start}`)
  //     })

  //     it('12:00AM day DST starts -> (add 24 hours) -> 1:00AM day after DST starts', () => {
  //       const start = zonedDateTimeFns.subtract(hourBeforeDstStart, { hours: 1 }) // 1:00AM
  //       const added = zonedDateTimeFns.add(start, { hours: 24 })
  //       assert.equal(zonedDateTimeFns.getDay(added), 9)
  //       assert.equal(zonedDateTimeFns.getHour(added), 1)
  //       assert.equal(zonedDateTimeFns.getMinute(added), 0)
  //       const diff = zonedDateTimeFns.until(start, added, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'P1DT1H')
  //       const undo = zonedDateTimeFns.subtract(added, diff)
  //       assert.equal(`${undo}`, `${start}`)
  //     })

  //     it('Difference can return day length > 24 hours', () => {
  //       const start = zonedDateTimeFns.from('2020-10-30T01:45-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-11-02T01:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'P2DT24H30M')
  //       const undo = zonedDateTimeFns.add(start, diff)
  //       assert.equal(`${undo}`, `${end}`)
  //     })

  //     it('Difference rounding (nearest day) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { smallestUnit: 'days', roundingMode: 'halfExpand' })
  //       assert.equal(`${diff}`, '-P3D')
  //     })

  //     it('Difference rounding (ceil day) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { smallestUnit: 'days', roundingMode: 'ceil' })
  //       assert.equal(`${diff}`, '-P2D')
  //     })

  //     it('Difference rounding (trunc day) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { smallestUnit: 'days', roundingMode: 'trunc' })
  //       assert.equal(`${diff}`, '-P2D')
  //     })

  //     it('Difference rounding (floor day) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { smallestUnit: 'days', roundingMode: 'floor' })
  //       assert.equal(`${diff}`, '-P3D')
  //     })

  //     it('Difference rounding (nearest hour) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, {
  //         largestUnit: 'days',
  //         smallestUnit: 'hours',
  //         roundingMode: 'halfExpand'
  //       })
  //       assert.equal(`${diff}`, '-P2DT12H')
  //     })

  //     it('Difference rounding (ceil hour) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'ceil' })
  //       assert.equal(`${diff}`, '-P2DT12H')
  //     })

  //     it('Difference rounding (trunc hour) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'trunc' })
  //       assert.equal(`${diff}`, '-P2DT12H')
  //     })

  //     it('Difference rounding (floor hour) is DST-aware', () => {
  //       const start = zonedDateTimeFns.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'floor' })
  //       assert.equal(`${diff}`, '-P2DT13H')
  //     })

  //     it('Difference when date portion ends inside a DST-skipped period', () => {
  //       const start = zonedDateTimeFns.from('2020-03-07T02:30-08:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-03-08T03:15-07:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'PT23H45M')
  //     })

  //     it("Difference when date portion ends inside day skipped by Samoa's 24hr 2011 transition", () => {
  //       const end = zonedDateTimeFns.from('2011-12-31T05:00+14:00[Pacific/Apia]')
  //       const start = zonedDateTimeFns.from('2011-12-28T10:00-10:00[Pacific/Apia]')
  //       const diff = zonedDateTimeFns.until(start, end, { largestUnit: 'days' })
  //       assert.equal(`${diff}`, 'P1DT19H')
  //     })

  //     it('Rounding up to hours causes one more day of overflow (positive)', () => {
  //       const start = zonedDateTimeFns.from('2020-01-01T00:00-08:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-01-03T23:59-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(start, end, {
  //         largestUnit: 'days',
  //         smallestUnit: 'hours',
  //         roundingMode: 'halfExpand'
  //       })
  //       assert.equal(`${diff}`, 'P3D')
  //     })

  //     it('Rounding up to hours causes one more day of overflow (negative)', () => {
  //       const start = zonedDateTimeFns.from('2020-01-01T00:00-08:00[America/Los_Angeles]')
  //       const end = zonedDateTimeFns.from('2020-01-03T23:59-08:00[America/Los_Angeles]')
  //       const diff = zonedDateTimeFns.until(end, start, {
  //         largestUnit: 'days',
  //         smallestUnit: 'hours',
  //         roundingMode: 'halfExpand'
  //       })
  //       assert.equal(`${diff}`, '-P3D')
  //     })

  //     it('addition and difference work near DST start', () => {
  //       // Test the difference between different distances near DST start
  //       const stepsPerHour = 2
  //       const minutesPerStep = 60 / stepsPerHour
  //       const hoursUntilEnd = 26
  //       const startHourRange = 3
  //       for (let i = 0; i < startHourRange * stepsPerHour; i++) {
  //         const start = zonedDateTimeFns.add(hourBeforeDstStart, { minutes: minutesPerStep * i })
  //         for (let j = 0; j < hoursUntilEnd * stepsPerHour; j++) {
  //           const end = zonedDateTimeFns.add(start, { minutes: j * minutesPerStep })
  //           const diff = zonedDateTimeFns.until(start, end, { largestUnit: 'days' })
  //           const expectedMinutes = minutesPerStep * (j % stepsPerHour)
  //           assert.equal(durationFns.getMinutes(diff), expectedMinutes)
  //           const diff60 = Math.floor(j / stepsPerHour)
  //           if (i >= stepsPerHour) {
  //             // DST transition already happened
  //             const expectedDays = diff60 < 24 ? 0 : diff60 < 48 ? 1 : 2
  //             const expectedHours = diff60 < 24 ? diff60 : diff60 < 48 ? diff60 - 24 : diff60 - 48
  //             assert.equal(durationFns.getHours(diff), expectedHours)
  //             assert.equal(durationFns.getDays(diff), expectedDays)
  //           } else {
  //             // DST transition hasn't happened yet
  //             const expectedDays = diff60 < 23 ? 0 : diff60 < 47 ? 1 : 2
  //             const expectedHours = diff60 < 23 ? diff60 : diff60 < 47 ? diff60 - 23 : diff60 - 47
  //             assert.equal(durationFns.getHours(diff), expectedHours)
  //             assert.equal(durationFns.getDays(diff), expectedDays)
  //           }
  //         }
  //       }
  //     })
  //   })

  //   // describe('math order of operations and options', () => {
  //   //   const breakoutUnits = (op: any, zdt: Iso.ZonedDateTime, d: any, options: object) =>
  //   //     zdt[op]({ years: d.years }, options)
  //   //       [op]({ months: d.months }, options)
  //   //       [op]({ weeks: d.weeks }, options)
  //   //       [op]({ days: d.days }, options)
  //   //       [op](
  //   //         {
  //   //           hours: d.hours,
  //   //           minutes: d.minutes,
  //   //           seconds: d.seconds,
  //   //           milliseconds: d.milliseconds
  //   //         },

  //   //         options
  //   //       )

  //   //   it('order of operations: add / none', () => {
  //   //     const zdt = zonedDateTimeFns.from('2020-01-31T00:00-08:00[America/Los_Angeles]')
  //   //     const d = durationFns.from({ months: 1, days: 1 })
  //   //     const options = undefined
  //   //     const result = zonedDateTimeFns.add(zdt, d, options)
  //   //     assert.equal(result.toString(), '2020-03-01T00:00:00-08:00[America/Los_Angeles]')
  //   //     assert.equal(breakoutUnits('add', zdt, d, options).toString(), result.toString())
  //   //   })
  //   //   it('order of operations: add / constrain', () => {
  //   //     const zdt = zonedDateTimeFns.from('2020-01-31T00:00-08:00[America/Los_Angeles]')
  //   //     const d = durationFns.from({ months: 1, days: 1 })
  //   //     const options = { overflow: 'constrain' }
  //   //     const result = zonedDateTimeFns.add(zdt, d, options)
  //   //     assert.equal(result.toString(), '2020-03-01T00:00:00-08:00[America/Los_Angeles]')
  //   //     assert.equal(breakoutUnits('add', zdt, d, options).toString(), result.toString())
  //   //   })
  //   //   it('order of operations: add / reject', () => {
  //   //     const zdt = zonedDateTimeFns.from('2020-01-31T00:00-08:00[America/Los_Angeles]')
  //   //     const d = durationFns.from({ months: 1, days: 1 })
  //   //     const options = { overflow: 'reject' }
  //   //     assert.throws(() => zonedDateTimeFns.add(zdt, d, options), RangeError)
  //   //   })
  //   //   it('order of operations: subtract / none', () => {
  //   //     const zdt = zonedDateTimeFns.from('2020-03-31T00:00-07:00[America/Los_Angeles]')
  //   //     const d = durationFns.from({ months: 1, days: 1 })
  //   //     const options = undefined
  //   //     const result = zonedDateTimeFns.subtract(zdt, d, options)
  //   //     assert.equal(result.toString(), '2020-02-28T00:00:00-08:00[America/Los_Angeles]')
  //   //     assert.equal(breakoutUnits('subtract', zdt, d, options).toString(), result.toString())
  //   //   })
  //   //   it('order of operations: subtract / constrain', () => {
  //   //     const zdt = zonedDateTimeFns.from('2020-03-31T00:00-07:00[America/Los_Angeles]')
  //   //     const d = durationFns.from({ months: 1, days: 1 })
  //   //     const options = { overflow: 'constrain' }
  //   //     const result = zonedDateTimeFns.subtract(zdt, d, options)
  //   //     assert.equal(result.toString(), '2020-02-28T00:00:00-08:00[America/Los_Angeles]')
  //   //     assert.equal(breakoutUnits('subtract', zdt, d, options).toString(), result.toString())
  //   //   })
  //   //   it('order of operations: subtract / reject', () => {
  //   //     const zdt = zonedDateTimeFns.from('2020-03-31T00:00-07:00[America/Los_Angeles]')
  //   //     const d = durationFns.from({ months: 1, days: 1 })
  //   //     const options = { overflow: 'reject' }
  //   //     assert.throws(() => zonedDateTimeFns.subtract(zdt, d, options), RangeError)
  //   //   })
  //   // })

  //   describe('zonedDateTimeFns.compare( )', () => {
  //     const zdt1 = zonedDateTimeFns.from('1976-11-18T15:23:30.123+01:00[Europe/Vienna]')
  //     const zdt2 = zonedDateTimeFns.from('2019-10-29T10:46:38.271986102+01:00[Europe/Vienna]')
  //     it('equal', () => assert.equal(zonedDateTimeFns.compare(zdt1, zdt1), 0))
  //     it('smaller/larger', () => assert.equal(zonedDateTimeFns.compare(zdt1, zdt2), -1))
  //     it('larger/smaller', () => assert.equal(zonedDateTimeFns.compare(zdt2, zdt1), 1))
  //     it('object must contain at least the required properties', () => {
  //       assert.equal(
  //         zonedDateTimeFns.compare(zonedDateTimeFns.from({ year: 1976, month: 11, day: 18, timeZone: 'Europe/Vienna' }), zdt2),
  //         -1
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zonedDateTimeFns.from({ month: 11, day: 18, timeZone: 'Europe/Vienna' }), zdt2),
  //         TypeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zonedDateTimeFns.from({ year: 1976, day: 18, timeZone: 'Europe/Vienna' }), zdt2),
  //         TypeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zonedDateTimeFns.from({ year: 1976, month: 11, timeZone: 'Europe/Vienna' }), zdt2),
  //         TypeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zonedDateTimeFns.from({ year: 1976, month: 11, day: 18 }), zdt2),
  //         TypeError
  //       )
  //       assert.throws(
  //         () =>
  //           zonedDateTimeFns.compare(
  //             zonedDateTimeFns.from({ years: 1976, months: 11, days: 19, hours: 15, timeZone: 'Europe/Vienna' }),
  //             zdt2
  //           ),
  //         TypeError
  //       )
  //       assert.equal(
  //         zonedDateTimeFns.compare(zdt1, zonedDateTimeFns.from({ year: 2019, month: 10, day: 29, timeZone: 'Europe/Vienna' })),
  //         -1
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zdt1, zonedDateTimeFns.from({ month: 10, day: 29, timeZone: 'Europe/Vienna' })),
  //         TypeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zdt1, zonedDateTimeFns.from({ year: 2019, day: 29, timeZone: 'Europe/Vienna' })),
  //         TypeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zdt1, zonedDateTimeFns.from({ year: 2019, month: 10, timeZone: 'Europe/Vienna' })),
  //         TypeError
  //       )
  //       assert.throws(
  //         () => zonedDateTimeFns.compare(zdt1, zonedDateTimeFns.from({ year: 2019, month: 10, day: 29 })),
  //         TypeError
  //       )
  //       assert.throws(
  //         () =>
  //           zonedDateTimeFns.compare(
  //             zdt1,
  //             zonedDateTimeFns.from({ years: 2019, months: 10, days: 29, hours: 10, timeZone: 'Europe/Vienna' })
  //           ),
  //         TypeError
  //       )
  //     })
  //     it('disregards time zone IDs if exact times are equal', () => {
  //       assert.equal(zonedDateTimeFns.compare(zdt1, zonedDateTimeFns.withTimeZone(zdt1, 'Asia/Kolkata')), 0)
  //     })
  //     it('compares exact time, not clock time', () => {
  //       const clockBefore = zonedDateTimeFns.from('1999-12-31T23:30-08:00[America/Vancouver]')
  //       const clockAfter = zonedDateTimeFns.from('2000-01-01T01:30-04:00[America/Halifax]')
  //       assert.equal(zonedDateTimeFns.compare(clockBefore, clockAfter), 1)
  //       assert.equal(
  //         dateTimeFns.compare(zonedDateTimeFns.toDateTime(clockBefore), zonedDateTimeFns.toDateTime(clockAfter)),
  //         -1
  //       )
  //     })
  //   })
})
