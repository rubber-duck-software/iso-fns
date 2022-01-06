import { describe, it } from 'beartest-js'
import { strict as assert } from 'assert'
import { zonedDateTimeFns } from './index'

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
    it.skip('Temporal.ZonedDateTime.from(zonedDateTime) is not the same object)', () => {
      const zdt = zonedDateTimeFns.fromEpochMilliseconds(epochMillis, tz)
      assert.notEqual(zonedDateTimeFns.from(zdt), zdt)
    })

    // describe('ZonedDateTime for (1976, 11, 18, 15, 23, 30, 123, 456, 789)', () => {
    //   const zdt = new ZonedDateTime(epochNanos, new Temporal.TimeZone('UTC'))
    //   it('can be constructed', () => {
    //     assert(zdt)
    //     assert.equal(typeof zdt, 'object')
    //   })
    //   it('zdt.year is 1976', () => assert.equal(zdt.year, 1976))
    //   it('zdt.month is 11', () => assert.equal(zdt.month, 11))
    //   it('zdt.monthCode is "M11"', () => assert.equal(zdt.monthCode, 'M11'))
    //   it('zdt.day is 18', () => assert.equal(zdt.day, 18))
    //   it('zdt.hour is 15', () => assert.equal(zdt.hour, 15))
    //   it('zdt.minute is 23', () => assert.equal(zdt.minute, 23))
    //   it('zdt.second is 30', () => assert.equal(zdt.second, 30))
    //   it('zdt.millisecond is 123', () => assert.equal(zdt.millisecond, 123))
    //   it('zdt.microsecond is 456', () => assert.equal(zdt.microsecond, 456))
    //   it('zdt.nanosecond is 789', () => assert.equal(zdt.nanosecond, 789))
    //   it('zdt.epochSeconds is 217178610', () => assert.equal(zdt.epochSeconds, 217178610))
    //   it('zdt.epochMilliseconds is 217178610123', () => assert.equal(zdt.epochMilliseconds, 217178610123))
    //   it('zdt.dayOfWeek is 4', () => assert.equal(zdt.dayOfWeek, 4))
    //   it('zdt.dayOfYear is 323', () => assert.equal(zdt.dayOfYear, 323))
    //   it('zdt.weekOfYear is 47', () => assert.equal(zdt.weekOfYear, 47))
    //   it('zdt.daysInWeek is 7', () => assert.equal(zdt.daysInWeek, 7))
    //   it('zdt.daysInMonth is 30', () => assert.equal(zdt.daysInMonth, 30))
    //   it('zdt.daysInYear is 366', () => assert.equal(zdt.daysInYear, 366))
    //   it('zdt.monthsInYear is 12', () => assert.equal(zdt.monthsInYear, 12))
    //   it('zdt.inLeapYear is true', () => assert.equal(zdt.inLeapYear, true))
    //   it('zdt.offset is +00:00', () => assert.equal(zdt.offset, '+00:00'))
    //   it('zdt.offsetNanoseconds is 0', () => assert.equal(zdt.offsetNanoseconds, 0))
    //   it('string output is 1976-11-18T15:23:30.123456789+00:00[UTC]', () =>
    //     assert.equal(`${zdt}`, '1976-11-18T15:23:30.123456789+00:00[UTC]'))
    // })
    // describe('ZonedDateTime with non-UTC time zone and non-ISO calendar', () => {
    //   const zdt = new ZonedDateTime(epochNanos, Temporal.TimeZone.from('Europe/Vienna'), Temporal.Calendar.from('gregory'))
    //   it('can be constructed', () => {
    //     assert(zdt)
    //     assert.equal(typeof zdt, 'object')
    //   })
    //   it('zdt.era is ce', () => assert.equal(zdt.era, 'ce'))
    //   it('zdt.year is 1976', () => assert.equal(zdt.year, 1976))
    //   it('zdt.month is 11', () => assert.equal(zdt.month, 11))
    //   it('zdt.monthCode is "M11"', () => assert.equal(zdt.monthCode, 'M11'))
    //   it('zdt.day is 18', () => assert.equal(zdt.day, 18))
    //   it('zdt.hour is 16', () => assert.equal(zdt.hour, 16))
    //   it('zdt.minute is 23', () => assert.equal(zdt.minute, 23))
    //   it('zdt.second is 30', () => assert.equal(zdt.second, 30))
    //   it('zdt.millisecond is 123', () => assert.equal(zdt.millisecond, 123))
    //   it('zdt.microsecond is 456', () => assert.equal(zdt.microsecond, 456))
    //   it('zdt.nanosecond is 789', () => assert.equal(zdt.nanosecond, 789))
    //   it('zdt.epochSeconds is 217178610', () => assert.equal(zdt.epochSeconds, 217178610))
    //   it('zdt.epochMilliseconds is 217178610123', () => assert.equal(zdt.epochMilliseconds, 217178610123))
    //   it('zdt.epochMicroseconds is 217178610123456n', () => assert.equal(zdt.epochMicroseconds, 217178610123456n))
    //   it('zdt.epochNanoseconds is 217178610123456789n', () => assert.equal(zdt.epochNanoseconds, 217178610123456789n))
    //   it('zdt.dayOfWeek is 4', () => assert.equal(zdt.dayOfWeek, 4))
    //   it('zdt.dayOfYear is 323', () => assert.equal(zdt.dayOfYear, 323))
    //   it('zdt.weekOfYear is 47', () => assert.equal(zdt.weekOfYear, 47))
    //   it('zdt.daysInWeek is 7', () => assert.equal(zdt.daysInWeek, 7))
    //   it('zdt.daysInMonth is 30', () => assert.equal(zdt.daysInMonth, 30))
    //   it('zdt.daysInYear is 366', () => assert.equal(zdt.daysInYear, 366))
    //   it('zdt.monthsInYear is 12', () => assert.equal(zdt.monthsInYear, 12))
    //   it('zdt.inLeapYear is true', () => assert.equal(zdt.inLeapYear, true))
    //   it('zdt.offset is +01:00', () => assert.equal(zdt.offset, '+01:00'))
    //   it('zdt.offsetNanoseconds is 3600e9', () => assert.equal(zdt.offsetNanoseconds, 3600e9))
    //   it('string output is 1976-11-18T16:23:30.123456789+01:00[Europe/Vienna][u-ca=gregory]', () =>
    //     assert.equal(`${zdt}`, '1976-11-18T16:23:30.123456789+01:00[Europe/Vienna][u-ca=gregory]'))
    // })

    // it('casts time zone', () => {
    //   const zdt = new ZonedDateTime(epochNanos, 'Asia/Seoul')
    //   assert.equal(typeof zdt.timeZone, 'object')
    //   assert(zdt.timeZone instanceof Temporal.TimeZone)
    //   assert.equal(zdt.timeZone.id, 'Asia/Seoul')
    // })
    // it('defaults to ISO calendar', () => {
    //   const zdt = new ZonedDateTime(epochNanos, tz)
    //   assert.equal(typeof zdt.calendar, 'object')
    //   assert(zdt.calendar instanceof Temporal.Calendar)
    //   assert.equal(zdt.calendar.id, 'iso8601')
    // })
    // it('casts calendar', () => {
    //   const zdt = new ZonedDateTime(epochNanos, Temporal.TimeZone.from('Asia/Tokyo'), 'japanese')
    //   assert.equal(typeof zdt.calendar, 'object')
    //   assert(zdt.calendar instanceof Temporal.Calendar)
    //   assert.equal(zdt.calendar.id, 'japanese')
    // })
  })

  // describe('string parsing', () => {
  //   it('parses with an IANA zone', () => {
  //     const zdt = ZonedDateTime.from('2020-03-08T01:00-08:00[America/Los_Angeles]')
  //     assert.equal(zdt.toString(), '2020-03-08T01:00:00-08:00[America/Los_Angeles]')
  //   })
  //   it('parses with an IANA zone but no offset', () => {
  //     const zdt = ZonedDateTime.from('2020-03-08T01:00[America/Los_Angeles]')
  //     assert.equal(zdt.toString(), '2020-03-08T01:00:00-08:00[America/Los_Angeles]')
  //   })
  //   it('parses with an IANA zone but no offset (with disambiguation)', () => {
  //     const zdt = ZonedDateTime.from('2020-03-08T02:30[America/Los_Angeles]', { disambiguation: 'earlier' })
  //     assert.equal(zdt.toString(), '2020-03-08T01:30:00-08:00[America/Los_Angeles]')
  //   })
  //   it('parses with an offset in brackets', () => {
  //     const zdt = ZonedDateTime.from('2020-03-08T01:00-08:00[-08:00]')
  //     assert.equal(zdt.toString(), '2020-03-08T01:00:00-08:00[-08:00]')
  //   })
  //   it('throws if no brackets', () => {
  //     assert.throws(() => ZonedDateTime.from('2020-03-08T01:00-08:00'), RangeError)
  //     assert.throws(() => ZonedDateTime.from('2020-03-08T01:00Z'), RangeError)
  //   })
  //   it('"Z" means preserve the exact time in the given IANA time zone', () => {
  //     const zdt = ZonedDateTime.from('2020-03-08T09:00:00Z[America/Los_Angeles]')
  //     assert.equal(zdt.toString(), '2020-03-08T01:00:00-08:00[America/Los_Angeles]')
  //   })
  //   it('ZonedDateTime.from(ISO string leap second) is constrained', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from('2016-12-31T23:59:60-08:00[America/Vancouver]')}`,
  //       '2016-12-31T23:59:59-08:00[America/Vancouver]'
  //     )
  //   })
  //   it('variant time separators', () => {
  //     ;['1976-11-18t15:23-08:00[America/Los_Angeles]', '1976-11-18 15:23-08:00[America/Los_Angeles]'].forEach((input) =>
  //       assert.equal(`${ZonedDateTime.from(input)}`, '1976-11-18T15:23:00-08:00[America/Los_Angeles]')
  //     )
  //   })
  //   it('any number of decimal places', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.1-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.1-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.12-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.12-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.123-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.123-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.1234-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.1234-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.12345-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.12345-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.123456-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.123456-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.1234567-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.1234567-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.12345678-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.12345678-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.123456789-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.123456789-08:00[America/Los_Angeles]'
  //     )
  //   })
  //   it('variant decimal separator', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30,12-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.12-08:00[America/Los_Angeles]'
  //     )
  //   })
  //   it('variant minus sign', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30.12\u221208:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30.12-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('\u2212009999-11-18T15:23:30.12+00:00[UTC]')}`,
  //       '-009999-11-18T15:23:30.12+00:00[UTC]'
  //     )
  //   })
  //   it('mixture of basic and extended format', () => {
  //     ;[
  //       '1976-11-18T152330.1-08:00[America/Los_Angeles]',
  //       '19761118T15:23:30.1-08:00[America/Los_Angeles]',
  //       '1976-11-18T15:23:30.1-0800[America/Los_Angeles]',
  //       '1976-11-18T152330.1-0800[America/Los_Angeles]',
  //       '19761118T15:23:30.1-0800[America/Los_Angeles]',
  //       '19761118T152330.1-08:00[America/Los_Angeles]',
  //       '19761118T152330.1-0800[America/Los_Angeles]',
  //       '+001976-11-18T152330.1-08:00[America/Los_Angeles]',
  //       '+0019761118T15:23:30.1-08:00[America/Los_Angeles]',
  //       '+001976-11-18T15:23:30.1-0800[America/Los_Angeles]',
  //       '+001976-11-18T152330.1-0800[America/Los_Angeles]',
  //       '+0019761118T15:23:30.1-0800[America/Los_Angeles]',
  //       '+0019761118T152330.1-08:00[America/Los_Angeles]',
  //       '+0019761118T152330.1-0800[America/Los_Angeles]'
  //     ].forEach((input) => assert.equal(`${ZonedDateTime.from(input)}`, '1976-11-18T15:23:30.1-08:00[America/Los_Angeles]'))
  //   })
  //   it('optional parts', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15:23:30-08[America/Los_Angeles]')}`,
  //       '1976-11-18T15:23:30-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('1976-11-18T15-08:00[America/Los_Angeles]')}`,
  //       '1976-11-18T15:00:00-08:00[America/Los_Angeles]'
  //     )
  //     assert.equal(`${ZonedDateTime.from('2020-01-01[Asia/Tokyo]')}`, '2020-01-01T00:00:00+09:00[Asia/Tokyo]')
  //   })
  //   it('no junk at end of string', () =>
  //     assert.throws(() => ZonedDateTime.from('1976-11-18T15:23:30.123456789-08:00[America/Los_Angeles]junk'), RangeError))
  //   it('constrain has no effect on invalid ISO string', () => {
  //     assert.throws(() => ZonedDateTime.from('2020-13-34T24:60[America/Los_Angeles]', { overflow: 'constrain' }), RangeError)
  //   })
  //   describe('Offset option', () => {
  //     it("{ offset: 'reject' } throws if offset does not match offset time zone", () => {
  //       assert.throws(() => ZonedDateTime.from('2020-03-08T01:00-04:00[-08:00]'), RangeError)
  //       assert.throws(() => ZonedDateTime.from('2020-03-08T01:00-04:00[-08:00]', { offset: 'reject' }), RangeError)
  //     })
  //     it("{ offset: 'reject' } throws if offset does not match IANA time zone", () => {
  //       assert.throws(() => ZonedDateTime.from('2020-03-08T01:00-04:00[America/Chicago]'), RangeError)
  //       assert.throws(() => ZonedDateTime.from('2020-03-08T01:00-04:00[America/Chicago]', { offset: 'reject' }), RangeError)
  //     })
  //     it("{ offset: 'prefer' } if offset matches time zone (first 1:30 when DST ends)", () => {
  //       const zdt = ZonedDateTime.from('2020-11-01T01:30-07:00[America/Los_Angeles]', { offset: 'prefer' })
  //       assert.equal(zdt.toString(), '2020-11-01T01:30:00-07:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'prefer' } if offset matches time zone (second 1:30 when DST ends)", () => {
  //       const zdt = ZonedDateTime.from('2020-11-01T01:30-08:00[America/Los_Angeles]', { offset: 'prefer' })
  //       assert.equal(zdt.toString(), '2020-11-01T01:30:00-08:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'prefer' } if offset does not match time zone", () => {
  //       const zdt = ZonedDateTime.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'prefer' })
  //       assert.equal(zdt.toString(), '2020-11-01T04:00:00-08:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'ignore' } uses time zone only", () => {
  //       const zdt = ZonedDateTime.from('2020-11-01T04:00-12:00[America/Los_Angeles]', { offset: 'ignore' })
  //       assert.equal(zdt.toString(), '2020-11-01T04:00:00-08:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'use' } uses offset only", () => {
  //       const zdt = ZonedDateTime.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset: 'use' })
  //       assert.equal(zdt.toString(), '2020-11-01T03:00:00-08:00[America/Los_Angeles]')
  //     })
  //     it('throw when bad offset', () => {
  //       ;['', 'PREFER', 'balance', 3, null].forEach((offset) => {
  //         assert.throws(() => ZonedDateTime.from('2020-11-01T04:00-07:00[America/Los_Angeles]', { offset }), RangeError)
  //       })
  //     })
  //   })
  //   describe('Disambiguation option', () => {
  //     it('plain datetime with multiple instants - Fall DST in Brazil', () => {
  //       const str = '2019-02-16T23:45[America/Sao_Paulo]'
  //       assert.equal(`${ZonedDateTime.from(str)}`, '2019-02-16T23:45:00-02:00[America/Sao_Paulo]')
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { disambiguation: 'compatible' })}`,
  //         '2019-02-16T23:45:00-02:00[America/Sao_Paulo]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { disambiguation: 'earlier' })}`,
  //         '2019-02-16T23:45:00-02:00[America/Sao_Paulo]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { disambiguation: 'later' })}`,
  //         '2019-02-16T23:45:00-03:00[America/Sao_Paulo]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(str, { disambiguation: 'reject' }), RangeError)
  //     })
  //     it('plain datetime with multiple instants - Spring DST in Los Angeles', () => {
  //       const str = '2020-03-08T02:30[America/Los_Angeles]'
  //       assert.equal(`${ZonedDateTime.from(str)}`, '2020-03-08T03:30:00-07:00[America/Los_Angeles]')
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { disambiguation: 'compatible' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { disambiguation: 'earlier' })}`,
  //         '2020-03-08T01:30:00-08:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { disambiguation: 'later' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(str, { disambiguation: 'reject' }), RangeError)
  //     })
  //     it('uses disambiguation if offset is ignored', () => {
  //       const str = '2020-03-08T02:30[America/Los_Angeles]'
  //       const offset = 'ignore'
  //       assert.equal(`${ZonedDateTime.from(str, { offset })}`, '2020-03-08T03:30:00-07:00[America/Los_Angeles]')
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { offset, disambiguation: 'compatible' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { offset, disambiguation: 'earlier' })}`,
  //         '2020-03-08T01:30:00-08:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { offset, disambiguation: 'later' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(str, { offset, disambiguation: 'reject' }), RangeError)
  //     })
  //     it('uses disambiguation if offset is wrong and option is prefer', () => {
  //       const str = '2020-03-08T02:30-23:59[America/Los_Angeles]'
  //       const offset = 'prefer'
  //       assert.equal(`${ZonedDateTime.from(str, { offset })}`, '2020-03-08T03:30:00-07:00[America/Los_Angeles]')
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { offset, disambiguation: 'compatible' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { offset, disambiguation: 'earlier' })}`,
  //         '2020-03-08T01:30:00-08:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(str, { offset, disambiguation: 'later' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(str, { offset, disambiguation: 'reject' }), RangeError)
  //     })
  //     it('throw when bad disambiguation', () => {
  //       ;['', 'EARLIER', 'balance', 3, null].forEach((disambiguation) => {
  //         assert.throws(() => ZonedDateTime.from('2020-11-01T04:00[America/Los_Angeles]', { disambiguation }), RangeError)
  //       })
  //     })
  //   })
  // })
  // describe('property bags', () => {
  //   const lagos = Temporal.TimeZone.from('Africa/Lagos')
  //   it('can be constructed with monthCode and without month', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from({ year: 1976, monthCode: 'M11', day: 18, timeZone: lagos })}`,
  //       '1976-11-18T00:00:00+01:00[Africa/Lagos]'
  //     )
  //   })
  //   it('can be constructed with month and without monthCode', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from({ year: 1976, month: 11, day: 18, timeZone: lagos })}`,
  //       '1976-11-18T00:00:00+01:00[Africa/Lagos]'
  //     )
  //   })
  //   it('month and monthCode must agree', () => {
  //     assert.throws(
  //       () => ZonedDateTime.from({ year: 1976, month: 11, monthCode: 'M12', day: 18, timeZone: lagos }),
  //       RangeError
  //     )
  //   })
  //   it('ZonedDateTime.from({}) throws', () => assert.throws(() => ZonedDateTime.from({}), TypeError))
  //   it('ZonedDateTime.from(required prop undefined) throws', () =>
  //     assert.throws(
  //       () => ZonedDateTime.from({ year: 1976, month: undefined, monthCode: undefined, day: 18, timeZone: lagos }),
  //       TypeError
  //     ))
  //   it('options may only be an object or undefined', () => {
  //     ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
  //       assert.throws(() => ZonedDateTime.from({ year: 1976, month: 11, day: 18, timeZone: lagos }, badOptions), TypeError)
  //     )
  //     ;[{}, () => {}, undefined].forEach((options) =>
  //       assert.equal(
  //         `${ZonedDateTime.from({ year: 1976, month: 11, day: 18, timeZone: lagos }, options)}`,
  //         '1976-11-18T00:00:00+01:00[Africa/Lagos]'
  //       )
  //     )
  //   })
  //   it('object must contain at least the required correctly-spelled properties', () => {
  //     assert.throws(() => ZonedDateTime.from({ years: 1976, months: 11, days: 18, timeZone: lagos }), TypeError)
  //   })
  //   it('incorrectly-spelled properties are ignored', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from({ year: 1976, month: 11, day: 18, timeZone: lagos, hours: 12 })}`,
  //       '1976-11-18T00:00:00+01:00[Africa/Lagos]'
  //     )
  //   })
  //   it('casts timeZone property', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from({ year: 1976, month: 11, day: 18, timeZone: 'Africa/Lagos' })}`,
  //       '1976-11-18T00:00:00+01:00[Africa/Lagos]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from({ year: 1976, month: 11, day: 18, timeZone: -1030 })}`,
  //       '1976-11-18T00:00:00-10:30[-10:30]'
  //     )
  //   })
  //   it('casts offset property', () => {
  //     const zdt = ZonedDateTime.from({
  //       year: 1976,
  //       month: 11,
  //       day: 18,
  //       offset: -1030,
  //       timeZone: Temporal.TimeZone.from('-10:30')
  //     })
  //     assert.equal(`${zdt}`, '1976-11-18T00:00:00-10:30[-10:30]')
  //   })
  //   describe('Overflow option', () => {
  //     const bad = { year: 2019, month: 1, day: 32, timeZone: lagos }
  //     it('reject', () => assert.throws(() => ZonedDateTime.from(bad, { overflow: 'reject' }), RangeError))
  //     it('constrain', () => {
  //       assert.equal(`${ZonedDateTime.from(bad)}`, '2019-01-31T00:00:00+01:00[Africa/Lagos]')
  //       assert.equal(`${ZonedDateTime.from(bad, { overflow: 'constrain' })}`, '2019-01-31T00:00:00+01:00[Africa/Lagos]')
  //     })
  //     it('throw when bad overflow', () => {
  //       ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) => {
  //         assert.throws(
  //           () => ZonedDateTime.from({ year: 2019, month: 1, day: 1, timeZone: lagos }, { overflow }),
  //           RangeError
  //         )
  //       })
  //     })
  //     const leap = { year: 2016, month: 12, day: 31, hour: 23, minute: 59, second: 60, timeZone: lagos }
  //     it('reject leap second', () => assert.throws(() => ZonedDateTime.from(leap, { overflow: 'reject' }), RangeError))
  //     it('constrain leap second', () =>
  //       assert.equal(`${ZonedDateTime.from(leap)}`, '2016-12-31T23:59:59+01:00[Africa/Lagos]'))
  //   })
  //   describe('Offset option', () => {
  //     it("{ offset: 'reject' } throws if offset does not match offset time zone", () => {
  //       const obj = { year: 2020, month: 3, day: 8, hour: 1, offset: '-04:00', timeZone: '-08:00' }
  //       assert.throws(() => ZonedDateTime.from(obj), RangeError)
  //       assert.throws(() => ZonedDateTime.from(obj, { offset: 'reject' }), RangeError)
  //     })
  //     it("{ offset: 'reject' } throws if offset does not match IANA time zone", () => {
  //       const obj = { year: 2020, month: 3, day: 8, hour: 1, offset: '-04:00', timeZone: 'America/Chicago' }
  //       assert.throws(() => ZonedDateTime.from(obj), RangeError)
  //       assert.throws(() => ZonedDateTime.from(obj, { offset: 'reject' }), RangeError)
  //     })
  //     const cali = Temporal.TimeZone.from('America/Los_Angeles')
  //     const date = { year: 2020, month: 11, day: 1, timeZone: cali }
  //     it("{ offset: 'prefer' } if offset matches time zone (first 1:30 when DST ends)", () => {
  //       const obj = { ...date, hour: 1, minute: 30, offset: '-07:00' }
  //       assert.equal(`${ZonedDateTime.from(obj, { offset: 'prefer' })}`, '2020-11-01T01:30:00-07:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'prefer' } if offset matches time zone (second 1:30 when DST ends)", () => {
  //       const obj = { ...date, hour: 1, minute: 30, offset: '-08:00' }
  //       assert.equal(`${ZonedDateTime.from(obj, { offset: 'prefer' })}`, '2020-11-01T01:30:00-08:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'prefer' } if offset does not match time zone", () => {
  //       const obj = { ...date, hour: 4, offset: '-07:00' }
  //       assert.equal(`${ZonedDateTime.from(obj, { offset: 'prefer' })}`, '2020-11-01T04:00:00-08:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'ignore' } uses time zone only", () => {
  //       const obj = { ...date, hour: 4, offset: '-12:00' }
  //       assert.equal(`${ZonedDateTime.from(obj, { offset: 'ignore' })}`, '2020-11-01T04:00:00-08:00[America/Los_Angeles]')
  //     })
  //     it("{ offset: 'use' } uses offset only", () => {
  //       const obj = { ...date, hour: 4, offset: '-07:00' }
  //       assert.equal(`${ZonedDateTime.from(obj, { offset: 'use' })}`, '2020-11-01T03:00:00-08:00[America/Los_Angeles]')
  //     })
  //     it('throw when bad offset', () => {
  //       ;['', 'PREFER', 'balance', 3, null].forEach((offset) => {
  //         assert.throws(() => ZonedDateTime.from({ year: 2019, month: 1, day: 1, timeZone: lagos }, { offset }), RangeError)
  //       })
  //     })
  //   })
  //   describe('Disambiguation option', () => {
  //     it('plain datetime with multiple instants - Fall DST in Brazil', () => {
  //       const brazil = Temporal.TimeZone.from('America/Sao_Paulo')
  //       const obj = { year: 2019, month: 2, day: 16, hour: 23, minute: 45, timeZone: brazil }
  //       assert.equal(`${ZonedDateTime.from(obj)}`, '2019-02-16T23:45:00-02:00[America/Sao_Paulo]')
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { disambiguation: 'compatible' })}`,
  //         '2019-02-16T23:45:00-02:00[America/Sao_Paulo]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { disambiguation: 'earlier' })}`,
  //         '2019-02-16T23:45:00-02:00[America/Sao_Paulo]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { disambiguation: 'later' })}`,
  //         '2019-02-16T23:45:00-03:00[America/Sao_Paulo]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(obj, { disambiguation: 'reject' }), RangeError)
  //     })
  //     it('plain datetime with multiple instants - Spring DST in Los Angeles', () => {
  //       const cali = Temporal.TimeZone.from('America/Los_Angeles')
  //       const obj = { year: 2020, month: 3, day: 8, hour: 2, minute: 30, timeZone: cali }
  //       assert.equal(`${ZonedDateTime.from(obj)}`, '2020-03-08T03:30:00-07:00[America/Los_Angeles]')
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { disambiguation: 'compatible' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { disambiguation: 'earlier' })}`,
  //         '2020-03-08T01:30:00-08:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { disambiguation: 'later' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(obj, { disambiguation: 'reject' }), RangeError)
  //     })
  //     it('uses disambiguation if offset is ignored', () => {
  //       const cali = Temporal.TimeZone.from('America/Los_Angeles')
  //       const obj = { year: 2020, month: 3, day: 8, hour: 2, minute: 30, timeZone: cali }
  //       const offset = 'ignore'
  //       assert.equal(`${ZonedDateTime.from(obj, { offset })}`, '2020-03-08T03:30:00-07:00[America/Los_Angeles]')
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { offset, disambiguation: 'compatible' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { offset, disambiguation: 'earlier' })}`,
  //         '2020-03-08T01:30:00-08:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { offset, disambiguation: 'later' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(obj, { disambiguation: 'reject' }), RangeError)
  //     })
  //     it('uses disambiguation if offset is wrong and option is prefer', () => {
  //       const cali = Temporal.TimeZone.from('America/Los_Angeles')
  //       const obj = { year: 2020, month: 3, day: 8, hour: 2, minute: 30, offset: '-23:59', timeZone: cali }
  //       const offset = 'prefer'
  //       assert.equal(`${ZonedDateTime.from(obj, { offset })}`, '2020-03-08T03:30:00-07:00[America/Los_Angeles]')
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { offset, disambiguation: 'compatible' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { offset, disambiguation: 'earlier' })}`,
  //         '2020-03-08T01:30:00-08:00[America/Los_Angeles]'
  //       )
  //       assert.equal(
  //         `${ZonedDateTime.from(obj, { offset, disambiguation: 'later' })}`,
  //         '2020-03-08T03:30:00-07:00[America/Los_Angeles]'
  //       )
  //       assert.throws(() => ZonedDateTime.from(obj, { offset, disambiguation: 'reject' }), RangeError)
  //     })
  //     it('throw when bad disambiguation', () => {
  //       ;['', 'EARLIER', 'balance', 3, null].forEach((disambiguation) => {
  //         assert.throws(() => ZonedDateTime.from('2020-11-01T04:00[America/Los_Angeles]', { disambiguation }), RangeError)
  //       })
  //     })
  //   })
  // })

  // describe('ZonedDateTime.with()', () => {
  //   const zdt = new Temporal.PlainDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789).toZonedDateTime('UTC')
  //   it('zdt.with({ year: 2019 } works', () => {
  //     assert.equal(`${zdt.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789+00:00[UTC]')
  //   })
  //   it('zdt.with({ month: 5 } works', () => {
  //     assert.equal(`${zdt.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789+00:00[UTC]')
  //   })
  //   it('zdt.with({ monthCode: "M05" }) works', () => {
  //     assert.equal(`${zdt.with({ monthCode: 'M05' })}`, '1976-05-18T15:23:30.123456789+00:00[UTC]')
  //   })
  //   it('month and monthCode must agree', () => {
  //     assert.throws(() => zdt.with({ month: 5, monthCode: 'M06' }), RangeError)
  //   })
  //   it('zdt.with({ day: 5 } works', () => {
  //     assert.equal(`${zdt.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789+00:00[UTC]')
  //   })
  //   it('zdt.with({ hour: 5 } works', () => {
  //     assert.equal(`${zdt.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789+00:00[UTC]')
  //   })
  //   it('zdt.with({ minute: 5 } works', () => {
  //     assert.equal(`${zdt.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789+00:00[UTC]')
  //   })
  //   it('zdt.with({ second: 5 } works', () => {
  //     assert.equal(`${zdt.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789+00:00[UTC]')
  //   })
  //   it('zdt.with({ millisecond: 5 } works', () => {
  //     assert.equal(`${zdt.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789+00:00[UTC]')
  //   })
  //   it('zdt.with({ microsecond: 5 } works', () => {
  //     assert.equal(`${zdt.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789+00:00[UTC]')
  //   })
  //   it('zdt.with({ nanosecond: 5 } works', () => {
  //     assert.equal(`${zdt.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005+00:00[UTC]')
  //   })
  //   it('zdt.with({ month: 5, second: 15 } works', () => {
  //     assert.equal(`${zdt.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789+00:00[UTC]')
  //   })
  //   describe('Overflow', () => {
  //     it('constrain', () => {
  //       const overflow = 'constrain'
  //       assert.equal(`${zdt.with({ month: 29 }, { overflow })}`, '1976-12-18T15:23:30.123456789+00:00[UTC]')
  //       assert.equal(`${zdt.with({ day: 31 }, { overflow })}`, '1976-11-30T15:23:30.123456789+00:00[UTC]')
  //       assert.equal(`${zdt.with({ hour: 29 }, { overflow })}`, '1976-11-18T23:23:30.123456789+00:00[UTC]')
  //       assert.equal(`${zdt.with({ nanosecond: 9000 }, { overflow })}`, '1976-11-18T15:23:30.123456999+00:00[UTC]')
  //     })
  //     it('reject', () => {
  //       const overflow = 'reject'
  //       assert.throws(() => zdt.with({ month: 29 }, { overflow }), RangeError)
  //       assert.throws(() => zdt.with({ day: 31 }, { overflow }), RangeError)
  //       assert.throws(() => zdt.with({ hour: 29 }, { overflow }), RangeError)
  //       assert.throws(() => zdt.with({ nanosecond: 9000 }, { overflow }), RangeError)
  //     })
  //     it('constrain is the default', () => {
  //       assert.equal(`${zdt.with({ month: 29 })}`, `${zdt.with({ month: 29 }, { overflow: 'constrain' })}`)
  //     })
  //     it('invalid overflow', () => {
  //       ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //         assert.throws(() => zdt.with({ day: 5 }, { overflow }), RangeError)
  //       )
  //     })
  //   })
  //   const dstStartDay = ZonedDateTime.from('2019-03-10T12:00:01-02:30[America/St_Johns]')
  //   const dstEndDay = ZonedDateTime.from('2019-11-03T12:00:01-03:30[America/St_Johns]')
  //   const oneThirty = { hour: 1, minute: 30 }
  //   const twoThirty = { hour: 2, minute: 30 }
  //   describe('Disambiguation option', () => {
  //     const offset = 'ignore'
  //     it('compatible, skipped wall time', () => {
  //       assert.equal(
  //         `${dstStartDay.with(twoThirty, { offset, disambiguation: 'compatible' })}`,
  //         '2019-03-10T03:30:01-02:30[America/St_Johns]'
  //       )
  //     })
  //     it('earlier, skipped wall time', () => {
  //       assert.equal(
  //         `${dstStartDay.with(twoThirty, { offset, disambiguation: 'earlier' })}`,
  //         '2019-03-10T01:30:01-03:30[America/St_Johns]'
  //       )
  //     })
  //     it('later, skipped wall time', () => {
  //       assert.equal(
  //         `${dstStartDay.with(twoThirty, { offset, disambiguation: 'later' })}`,
  //         '2019-03-10T03:30:01-02:30[America/St_Johns]'
  //       )
  //     })
  //     it('compatible, repeated wall time', () => {
  //       assert.equal(
  //         `${dstEndDay.with(oneThirty, { offset, disambiguation: 'compatible' })}`,
  //         '2019-11-03T01:30:01-02:30[America/St_Johns]'
  //       )
  //     })
  //     it('earlier, repeated wall time', () => {
  //       assert.equal(
  //         `${dstEndDay.with(oneThirty, { offset, disambiguation: 'earlier' })}`,
  //         '2019-11-03T01:30:01-02:30[America/St_Johns]'
  //       )
  //     })
  //     it('later, repeated wall time', () => {
  //       assert.equal(
  //         `${dstEndDay.with(oneThirty, { offset, disambiguation: 'later' })}`,
  //         '2019-11-03T01:30:01-03:30[America/St_Johns]'
  //       )
  //     })
  //     it('reject', () => {
  //       assert.throws(() => dstStartDay.with(twoThirty, { offset, disambiguation: 'reject' }), RangeError)
  //       assert.throws(() => dstEndDay.with(oneThirty, { offset, disambiguation: 'reject' }), RangeError)
  //     })
  //     it('compatible is the default', () => {
  //       assert.equal(
  //         `${dstStartDay.with(twoThirty, { offset })}`,
  //         `${dstStartDay.with(twoThirty, { offset, disambiguation: 'compatible' })}`
  //       )
  //       assert.equal(
  //         `${dstEndDay.with(twoThirty, { offset })}`,
  //         `${dstEndDay.with(twoThirty, { offset, disambiguation: 'compatible' })}`
  //       )
  //     })
  //     it('invalid disambiguation', () => {
  //       ;['', 'EARLIER', 'balance', 3, null].forEach((disambiguation) =>
  //         assert.throws(() => zdt.with({ day: 5 }, { disambiguation }), RangeError)
  //       )
  //     })
  //   })
  //   describe('Offset option', () => {
  //     const bogus = { ...twoThirty, offset: '+23:59' }
  //     it('use, with bogus offset, changes to the exact time with the offset', () => {
  //       const preserveExact = dstStartDay.with(bogus, { offset: 'use' })
  //       assert.equal(`${preserveExact}`, '2019-03-08T23:01:01-03:30[America/St_Johns]')
  //       assert.equal(preserveExact.epochNanoseconds, Temporal.Instant.from('2019-03-10T02:30:01+23:59').epochNanoseconds)
  //     })
  //     it('ignore, with bogus offset, defers to disambiguation option', () => {
  //       const offset = 'ignore'
  //       assert.equal(
  //         `${dstStartDay.with(bogus, { offset, disambiguation: 'earlier' })}`,
  //         '2019-03-10T01:30:01-03:30[America/St_Johns]'
  //       )
  //       assert.equal(
  //         `${dstStartDay.with(bogus, { offset, disambiguation: 'later' })}`,
  //         '2019-03-10T03:30:01-02:30[America/St_Johns]'
  //       )
  //     })
  //     it('prefer, with bogus offset, defers to disambiguation option', () => {
  //       const offset = 'prefer'
  //       assert.equal(
  //         `${dstStartDay.with(bogus, { offset, disambiguation: 'earlier' })}`,
  //         '2019-03-10T01:30:01-03:30[America/St_Johns]'
  //       )
  //       assert.equal(
  //         `${dstStartDay.with(bogus, { offset, disambiguation: 'later' })}`,
  //         '2019-03-10T03:30:01-02:30[America/St_Johns]'
  //       )
  //     })
  //     it('reject, with bogus offset, throws', () => {
  //       assert.throws(() => dstStartDay.with({ ...twoThirty, offset: '+23:59' }, { offset: 'reject' }), RangeError)
  //     })
  //     const doubleTime = ZonedDateTime.from('2019-11-03T01:30:01-03:30[America/St_Johns]')
  //     it('use changes to the exact time with the offset', () => {
  //       const preserveExact = doubleTime.with({ offset: '-02:30' }, { offset: 'use' })
  //       assert.equal(preserveExact.offset, '-02:30')
  //       assert.equal(preserveExact.epochNanoseconds, Temporal.Instant.from('2019-11-03T01:30:01-02:30').epochNanoseconds)
  //     })
  //     it('ignore defers to disambiguation option', () => {
  //       const offset = 'ignore'
  //       assert.equal(doubleTime.with({ offset: '-02:30' }, { offset, disambiguation: 'earlier' }).offset, '-02:30')
  //       assert.equal(doubleTime.with({ offset: '-02:30' }, { offset, disambiguation: 'later' }).offset, '-03:30')
  //     })
  //     it('prefer adjusts offset of repeated clock time', () => {
  //       assert.equal(doubleTime.with({ offset: '-02:30' }, { offset: 'prefer' }).offset, '-02:30')
  //     })
  //     it('reject adjusts offset of repeated clock time', () => {
  //       assert.equal(doubleTime.with({ offset: '-02:30' }, { offset: 'reject' }).offset, '-02:30')
  //     })
  //     it('use does not cause the offset to change when adjusting repeated clock time', () => {
  //       assert.equal(doubleTime.with({ minute: 31 }, { offset: 'use' }).offset, '-03:30')
  //     })
  //     it('ignore may cause the offset to change when adjusting repeated clock time', () => {
  //       assert.equal(doubleTime.with({ minute: 31 }, { offset: 'ignore' }).offset, '-02:30')
  //     })
  //     it('prefer does not cause the offset to change when adjusting repeated clock time', () => {
  //       assert.equal(doubleTime.with({ minute: 31 }, { offset: 'prefer' }).offset, '-03:30')
  //     })
  //     it('reject does not cause the offset to change when adjusting repeated clock time', () => {
  //       assert.equal(doubleTime.with({ minute: 31 }, { offset: 'reject' }).offset, '-03:30')
  //     })
  //     it('prefer is the default', () => {
  //       assert.equal(`${dstStartDay.with(twoThirty)}`, `${dstStartDay.with(twoThirty, { offset: 'prefer' })}`)
  //       assert.equal(`${dstEndDay.with(twoThirty)}`, `${dstEndDay.with(twoThirty, { offset: 'prefer' })}`)
  //       assert.equal(`${doubleTime.with({ minute: 31 })}`, `${doubleTime.with({ minute: 31 }, { offset: 'prefer' })}`)
  //     })
  //     it('invalid offset', () => {
  //       ;['', 'PREFER', 'balance', 3, null].forEach((offset) =>
  //         assert.throws(() => zdt.with({ day: 5 }, { offset }), RangeError)
  //       )
  //     })
  //   })
  //   it('options may only be an object or undefined', () => {
  //     ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
  //       assert.throws(() => zdt.with({ day: 5 }, badOptions), TypeError)
  //     )
  //     ;[{}, () => {}, undefined].forEach((options) =>
  //       assert.equal(`${zdt.with({ day: 5 }, options)}`, '1976-11-05T15:23:30.123456789+00:00[UTC]')
  //     )
  //   })
  //   it('object must contain at least one correctly-spelled property', () => {
  //     assert.throws(() => zdt.with({}), TypeError)
  //     assert.throws(() => zdt.with({ months: 12 }), TypeError)
  //   })
  //   it('incorrectly-spelled properties are ignored', () => {
  //     assert.equal(`${zdt.with({ month: 12, days: 15 })}`, '1976-12-18T15:23:30.123456789+00:00[UTC]')
  //   })
  //   it('throws if timeZone is included', () => {
  //     assert.throws(() => zdt.with({ month: 2, timeZone: 'Asia/Ulaanbaatar' }), TypeError)
  //   })
  //   it('throws if given a Temporal object with a time zone', () => {
  //     assert.throws(() => zdt.with(dstStartDay), TypeError)
  //   })
  //   it('throws if calendarName is included', () => {
  //     assert.throws(() => zdt.with({ month: 2, calendar: 'japanese' }), TypeError)
  //   })
  //   it('throws if given a Temporal object with a calendar', () => {
  //     assert.throws(() => zdt.with(Temporal.PlainDateTime.from('1976-11-18T12:00')), TypeError)
  //     assert.throws(() => zdt.with(Temporal.PlainDate.from('1976-11-18')), TypeError)
  //     assert.throws(() => zdt.with(Temporal.PlainTime.from('12:00')), TypeError)
  //     assert.throws(() => zdt.with(Temporal.PlainYearMonth.from('1976-11')), TypeError)
  //     assert.throws(() => zdt.with(Temporal.PlainMonthDay.from('11-18')), TypeError)
  //   })
  //   it('throws if given a string', () => {
  //     assert.throws(() => zdt.with('1976-11-18T12:00+00:00[UTC]'), TypeError)
  //     assert.throws(() => zdt.with('1976-11-18'), TypeError)
  //     assert.throws(() => zdt.with('12:00'), TypeError)
  //     assert.throws(() => zdt.with('invalid'), TypeError)
  //   })
  // })

  // describe('.withPlainTime manipulation', () => {
  //   const zdt = Temporal.ZonedDateTime.from('2015-12-07T03:24:30.000003500[America/Los_Angeles]')
  //   it('withPlainTime({ hour: 10 }) works', () => {
  //     assert.equal(`${zdt.withPlainTime({ hour: 10 })}`, '2015-12-07T10:00:00-08:00[America/Los_Angeles]')
  //   })
  //   it('withPlainTime(time) works', () => {
  //     const time = Temporal.PlainTime.from('11:22')
  //     assert.equal(`${zdt.withPlainTime(time)}`, '2015-12-07T11:22:00-08:00[America/Los_Angeles]')
  //   })
  //   it("withPlainTime('12:34') works", () => {
  //     assert.equal(`${zdt.withPlainTime('12:34')}`, '2015-12-07T12:34:00-08:00[America/Los_Angeles]')
  //   })
  //   it('withPlainTime() defaults to midnight', () => {
  //     assert.equal(`${zdt.withPlainTime()}`, '2015-12-07T00:00:00-08:00[America/Los_Angeles]')
  //   })
  //   it('object must contain at least one correctly-spelled property', () => {
  //     assert.throws(() => zdt.withPlainTime({}), TypeError)
  //     assert.throws(() => zdt.withPlainTime({ minutes: 12 }), TypeError)
  //   })
  //   it('incorrectly-spelled properties are ignored', () => {
  //     assert.equal(`${zdt.withPlainTime({ hour: 10, seconds: 55 })}`, '2015-12-07T10:00:00-08:00[America/Los_Angeles]')
  //   })
  // })
  // describe('.withPlainDate manipulation', () => {
  //   const zdt = Temporal.ZonedDateTime.from('1995-12-07T03:24:30[America/Los_Angeles]')
  //   it('withPlainDate({ year: 2000, month: 6, day: 1 }) works', () => {
  //     assert.equal(
  //       `${zdt.withPlainDate({ year: 2000, month: 6, day: 1 })}`,
  //       '2000-06-01T03:24:30-07:00[America/Los_Angeles]'
  //     )
  //   })
  //   it('withPlainDate(plainDate) works', () => {
  //     const date = Temporal.PlainDate.from('2020-01-23')
  //     assert.equal(`${zdt.withPlainDate(date)}`, '2020-01-23T03:24:30-08:00[America/Los_Angeles]')
  //   })
  //   it("withPlainDate('2018-09-15') works", () => {
  //     assert.equal(`${zdt.withPlainDate('2018-09-15')}`, '2018-09-15T03:24:30-07:00[America/Los_Angeles]')
  //   })
  //   it('result contains a non-ISO calendar if present in the input', () => {
  //     assert.equal(
  //       `${zdt.withCalendar('japanese').withPlainDate('2008-09-06')}`,
  //       '2008-09-06T03:24:30-07:00[America/Los_Angeles][u-ca=japanese]'
  //     )
  //   })
  //   it('calendar is unchanged if input has ISO calendar', () => {
  //     assert.equal(
  //       `${zdt.withPlainDate('2008-09-06[u-ca=japanese]')}`,
  //       '2008-09-06T03:24:30-07:00[America/Los_Angeles][u-ca=japanese]'
  //     )
  //   })
  //   it('throws if both `this` and `other` have a non-ISO calendar', () => {
  //     assert.throws(
  //       () => zdt.withCalendar('gregory').withPlainDate('2008-09-06-07:00[America/Los_Angeles][u-ca=japanese]'),
  //       RangeError
  //     )
  //   })
  //   it('object must contain at least one correctly-spelled property', () => {
  //     assert.throws(() => zdt.withPlainDate({}), TypeError)
  //     assert.throws(() => zdt.withPlainDate({ months: 12 }), TypeError)
  //   })
  //   it('incorrectly-spelled properties are ignored', () => {
  //     assert.equal(
  //       `${zdt.withPlainDate({ year: 2000, month: 6, day: 1, months: 123 })}`,
  //       '2000-06-01T03:24:30-07:00[America/Los_Angeles]'
  //     )
  //   })
  // })

  // describe('ZonedDateTime.withTimeZone()', () => {
  //   const instant = Temporal.Instant.from('2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]')
  //   const zdt = instant.toZonedDateTimeISO('UTC')
  //   it('zonedDateTime.withTimeZone(America/Los_Angeles) works', () => {
  //     assert.equal(`${zdt.withTimeZone(tz)}`, '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]')
  //   })
  //   it('casts its argument', () => {
  //     assert.equal(`${zdt.withTimeZone('America/Los_Angeles')}`, '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]')
  //   })
  //   it('keeps instant and calendar the same', () => {
  //     const zdt = ZonedDateTime.from('2019-11-18T15:23:30.123456789+01:00[Europe/Madrid][u-ca=gregory]')
  //     const zdt2 = zdt.withTimeZone('America/Vancouver')
  //     assert.equal(zdt.epochNanoseconds, zdt2.epochNanoseconds)
  //     assert.equal(zdt2.calendar.id, 'gregory')
  //     assert.equal(zdt2.timeZone.id, 'America/Vancouver')
  //     assert.notequal(`${zdt.toPlainDateTime()}`, `${zdt2.toPlainDateTime()}`)
  //   })
  // })
  // describe('ZonedDateTime.withCalendar()', () => {
  //   const zdt = ZonedDateTime.from('2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles]')
  //   it('zonedDateTime.withCalendar(japanese) works', () => {
  //     const cal = Temporal.Calendar.from('japanese')
  //     assert.equal(`${zdt.withCalendar(cal)}`, '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles][u-ca=japanese]')
  //   })
  //   it('casts its argument', () => {
  //     assert.equal(
  //       `${zdt.withCalendar('japanese')}`,
  //       '2019-11-18T15:23:30.123456789-08:00[America/Los_Angeles][u-ca=japanese]'
  //     )
  //   })
  //   it('keeps instant and time zone the same', () => {
  //     const zdt = ZonedDateTime.from('2019-11-18T15:23:30.123456789+01:00[Europe/Madrid][u-ca=gregory]')
  //     const zdt2 = zdt.withCalendar('japanese')
  //     assert.equal(zdt.epochNanoseconds, zdt2.epochNanoseconds)
  //     assert.equal(zdt2.calendar.id, 'japanese')
  //     assert.equal(zdt2.timeZone.id, 'Europe/Madrid')
  //   })
  // })

  // describe('Reversibility of differences', () => {
  //   const earlier = ZonedDateTime.from('1976-11-18T15:23:30.123456789-03:00[America/Santiago]')
  //   const later = ZonedDateTime.from('2019-10-29T10:46:38.271986102-03:00[America/Santiago]')
  //   // The interchangeability of since() and until() holds for time units only
  //   ;['hours', 'minutes', 'seconds'].forEach((largestUnit) => {
  //     const diff = later.since(earlier, { largestUnit })
  //     it(`earlier.since(later, ${largestUnit}) == later.since(earlier, ${largestUnit}).negated()`, () =>
  //       assert.equal(`${earlier.since(later, { largestUnit })}`, `${diff.negated()}`))
  //     it(`earlier.until(later, ${largestUnit}) == later.since(earlier, ${largestUnit})`, () =>
  //       assert.equal(`${earlier.until(later, { largestUnit })}`, `${diff}`))
  //     it(`${largestUnit} difference symmetrical with regard to negative durations`, () => {
  //       assert(earlier.subtract(diff.negated()).equals(later))
  //       assert(later.add(diff.negated()).equals(earlier))
  //     })
  //   })
  //   // For all units, add() undoes until() and subtract() undoes since()
  //   ;['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].forEach((largestUnit) => {
  //     const diff1 = earlier.until(later, { largestUnit })
  //     const diff2 = later.since(earlier, { largestUnit })
  //     it(`earlier.add(${diff1}) == later`, () => assert(earlier.add(diff1).equals(later)))
  //     it(`later.subtract(${diff2}) == earlier`, () => assert(later.subtract(diff2).equals(earlier)))
  //   })
  // })
  // describe('date/time maths: hours overflow', () => {
  //   it('subtract result', () => {
  //     const later = ZonedDateTime.from('2019-10-29T10:46:38.271986102-03:00[America/Santiago]')
  //     const earlier = later.subtract({ hours: 12 })
  //     assert.equal(`${earlier}`, '2019-10-28T22:46:38.271986102-03:00[America/Santiago]')
  //   })
  //   it('add result', () => {
  //     const earlier = ZonedDateTime.from('2020-05-31T23:12:38.271986102-04:00[America/Santiago]')
  //     const later = earlier.add({ hours: 2 })
  //     assert.equal(`${later}`, '2020-06-01T01:12:38.271986102-04:00[America/Santiago]')
  //   })
  //   it('symmetrical with regard to negative durations', () => {
  //     assert.equal(
  //       `${ZonedDateTime.from('2019-10-29T10:46:38.271986102-03:00[America/Santiago]').add({ hours: -12 })}`,
  //       '2019-10-28T22:46:38.271986102-03:00[America/Santiago]'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('2020-05-31T23:12:38.271986102-04:00[America/Santiago]').subtract({ hours: -2 })}`,
  //       '2020-06-01T01:12:38.271986102-04:00[America/Santiago]'
  //     )
  //   })
  // })
  // describe('ZonedDateTime.add()', () => {
  //   const zdt = ZonedDateTime.from('1969-12-25T12:23:45.678901234+00:00[UTC]')
  //   describe('cross epoch in ms', () => {
  //     const one = zdt.subtract({ hours: 240, nanoseconds: 800 })
  //     const two = zdt.add({ hours: 240, nanoseconds: 800 })
  //     const three = two.subtract({ hours: 480, nanoseconds: 1600 })
  //     const four = one.add({ hours: 480, nanoseconds: 1600 })
  //     it(`(${zdt}).subtract({ hours: 240, nanoseconds: 800 }) = ${one}`, () =>
  //       assert.equal(`${one}`, '1969-12-15T12:23:45.678900434+00:00[UTC]'))
  //     it(`(${zdt}).add({ hours: 240, nanoseconds: 800 }) = ${two}`, () =>
  //       assert.equal(`${two}`, '1970-01-04T12:23:45.678902034+00:00[UTC]'))
  //     it(`(${two}).subtract({ hours: 480, nanoseconds: 1600 }) = ${one}`, () => assert(three.equals(one)))
  //     it(`(${one}).add({ hours: 480, nanoseconds: 1600 }) = ${two}`, () => assert(four.equals(two)))
  //   })
  //   it('zdt.add(durationObj)', () => {
  //     const later = zdt.add(Temporal.Duration.from('PT240H0.000000800S'))
  //     assert.equal(`${later}`, '1970-01-04T12:23:45.678902034+00:00[UTC]')
  //   })
  //   it('casts argument', () => {
  //     assert.equal(`${zdt.add('PT240H0.000000800S')}`, '1970-01-04T12:23:45.678902034+00:00[UTC]')
  //   })
  //   const jan31 = ZonedDateTime.from('2020-01-31T15:00-08:00[America/Vancouver]')
  //   it('constrain when ambiguous result', () => {
  //     assert.equal(`${jan31.add({ months: 1 })}`, '2020-02-29T15:00:00-08:00[America/Vancouver]')
  //     assert.equal(`${jan31.add({ months: 1 }, { overflow: 'constrain' })}`, '2020-02-29T15:00:00-08:00[America/Vancouver]')
  //   })
  //   it('symmetrical with regard to negative durations in the time part', () => {
  //     assert.equal(`${jan31.add({ minutes: -30 })}`, '2020-01-31T14:30:00-08:00[America/Vancouver]')
  //     assert.equal(`${jan31.add({ seconds: -30 })}`, '2020-01-31T14:59:30-08:00[America/Vancouver]')
  //   })
  //   it('throw when ambiguous result with reject', () => {
  //     assert.throws(() => jan31.add({ months: 1 }, { overflow: 'reject' }), RangeError)
  //   })
  //   it('invalid overflow', () => {
  //     ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //       assert.throws(() => zdt.add({ months: 1 }, { overflow }), RangeError)
  //     )
  //   })
  //   it('mixed positive and negative values always throw', () => {
  //     ;['constrain', 'reject'].forEach((overflow) =>
  //       assert.throws(() => zdt.add({ hours: 1, minutes: -30 }, { overflow }), RangeError)
  //     )
  //   })
  //   it('options may only be an object or undefined', () => {
  //     ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
  //       assert.throws(() => zdt.add({ years: 1 }, badOptions), TypeError)
  //     )
  //     ;[{}, () => {}, undefined].forEach((options) =>
  //       assert.equal(`${zdt.add({ years: 1 }, options)}`, '1970-12-25T12:23:45.678901234+00:00[UTC]')
  //     )
  //   })
  //   it('object must contain at least one correctly-spelled property', () => {
  //     assert.throws(() => zdt.add({}), TypeError)
  //     assert.throws(() => zdt.add({ hour: 12 }), TypeError)
  //   })
  //   it('incorrectly-spelled properties are ignored', () => {
  //     assert.equal(`${zdt.add({ hour: 1, minutes: 1 })}`, '1969-12-25T12:24:45.678901234+00:00[UTC]')
  //   })
  // })
  // describe('ZonedDateTime.subtract()', () => {
  //   const zdt = ZonedDateTime.from('1969-12-25T12:23:45.678901234+00:00[UTC]')
  //   it('inst.subtract(durationObj)', () => {
  //     const earlier = zdt.subtract(Temporal.Duration.from('PT240H0.000000800S'))
  //     assert.equal(`${earlier}`, '1969-12-15T12:23:45.678900434+00:00[UTC]')
  //   })
  //   it('casts argument', () => {
  //     assert.equal(`${zdt.subtract('PT240H0.000000800S')}`, '1969-12-15T12:23:45.678900434+00:00[UTC]')
  //   })
  //   const mar31 = ZonedDateTime.from('2020-03-31T15:00-07:00[America/Vancouver]')
  //   it('constrain when ambiguous result', () => {
  //     assert.equal(`${mar31.subtract({ months: 1 })}`, '2020-02-29T15:00:00-08:00[America/Vancouver]')
  //     assert.equal(
  //       `${mar31.subtract({ months: 1 }, { overflow: 'constrain' })}`,
  //       '2020-02-29T15:00:00-08:00[America/Vancouver]'
  //     )
  //   })
  //   it('symmetrical with regard to negative durations in the time part', () => {
  //     assert.equal(`${mar31.subtract({ minutes: -30 })}`, '2020-03-31T15:30:00-07:00[America/Vancouver]')
  //     assert.equal(`${mar31.subtract({ seconds: -30 })}`, '2020-03-31T15:00:30-07:00[America/Vancouver]')
  //   })
  //   it('throw when ambiguous result with reject', () => {
  //     assert.throws(() => mar31.subtract({ months: 1 }, { overflow: 'reject' }), RangeError)
  //   })
  //   it('invalid overflow', () => {
  //     ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //       assert.throws(() => zdt.subtract({ months: 1 }, { overflow }), RangeError)
  //     )
  //   })
  //   it('mixed positive and negative values always throw', () => {
  //     ;['constrain', 'reject'].forEach((overflow) =>
  //       assert.throws(() => zdt.add({ hours: 1, minutes: -30 }, { overflow }), RangeError)
  //     )
  //   })
  //   it('options may only be an object or undefined', () => {
  //     ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
  //       assert.throws(() => zdt.subtract({ years: 1 }, badOptions), TypeError)
  //     )
  //     ;[{}, () => {}, undefined].forEach((options) =>
  //       assert.equal(`${zdt.subtract({ years: 1 }, options)}`, '1968-12-25T12:23:45.678901234+00:00[UTC]')
  //     )
  //   })
  //   it('object must contain at least one correctly-spelled property', () => {
  //     assert.throws(() => zdt.subtract({}), TypeError)
  //     assert.throws(() => zdt.subtract({ hour: 12 }), TypeError)
  //   })
  //   it('incorrectly-spelled properties are ignored', () => {
  //     assert.equal(`${zdt.subtract({ hour: 1, minutes: 1 })}`, '1969-12-25T12:22:45.678901234+00:00[UTC]')
  //   })
  // })

  // describe('ZonedDateTime.until()', () => {
  //   const zdt = ZonedDateTime.from('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]')
  //   it('zdt.until(later) === later.since(zdt) with default options', () => {
  //     const later = ZonedDateTime.from({ year: 2016, month: 3, day: 3, hour: 18, timeZone: 'Europe/Vienna' })
  //     assert.equal(`${zdt.until(later)}`, `${later.since(zdt)}`)
  //   })
  //   it('casts argument', () => {
  //     assert.equal(
  //       `${zdt.until({ year: 2019, month: 10, day: 29, hour: 10, timeZone: 'Europe/Vienna' })}`,
  //       'PT376434H36M29.876543211S'
  //     )
  //     assert.equal(`${zdt.until('2019-10-29T10:46:38.271986102+01:00[Europe/Vienna]')}`, 'PT376435H23M8.148529313S')
  //   })
  //   const feb20 = ZonedDateTime.from('2020-02-01T00:00+01:00[Europe/Vienna]')
  //   const feb21 = ZonedDateTime.from('2021-02-01T00:00+01:00[Europe/Vienna]')
  //   it('defaults to returning hours', () => {
  //     assert.equal(`${feb20.until(feb21)}`, 'PT8784H')
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'auto' })}`, 'PT8784H')
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'hours' })}`, 'PT8784H')
  //     assert.equal(
  //       `${feb20.until(ZonedDateTime.from('2021-02-01T00:00:00.000000001+01:00[Europe/Vienna]'))}`,
  //       'PT8784H0.000000001S'
  //     )
  //     assert.equal(
  //       `${ZonedDateTime.from('2020-02-01T00:00:00.000000001+01:00[Europe/Vienna]').until(feb21)}`,
  //       'PT8783H59M59.999999999S'
  //     )
  //   })
  //   it('can return lower or higher units', () => {
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'years' })}`, 'P1Y')
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'months' })}`, 'P12M')
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'weeks' })}`, 'P52W2D')
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'days' })}`, 'P366D')
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'minutes' })}`, 'PT527040M')
  //     assert.equal(`${feb20.until(feb21, { largestUnit: 'seconds' })}`, 'PT31622400S')
  //   })
  //   it('can return subseconds', () => {
  //     const later = feb20.add({ days: 1, milliseconds: 250, microseconds: 250, nanoseconds: 250 })

  //     const msDiff = feb20.until(later, { largestUnit: 'milliseconds' })
  //     assert.equal(msDiff.seconds, 0)
  //     assert.equal(msDiff.milliseconds, 86400250)
  //     assert.equal(msDiff.microseconds, 250)
  //     assert.equal(msDiff.nanoseconds, 250)

  //     const µsDiff = feb20.until(later, { largestUnit: 'microseconds' })
  //     assert.equal(µsDiff.milliseconds, 0)
  //     assert.equal(µsDiff.microseconds, 86400250250)
  //     assert.equal(µsDiff.nanoseconds, 250)

  //     const nsDiff = feb20.until(later, { largestUnit: 'nanoseconds' })
  //     assert.equal(nsDiff.microseconds, 0)
  //     assert.equal(nsDiff.nanoseconds, 86400250250250)
  //   })
  //   it('does not include higher units than necessary', () => {
  //     const lastFeb20 = ZonedDateTime.from('2020-02-29T00:00+01:00[Europe/Vienna]')
  //     const lastJan21 = ZonedDateTime.from('2021-01-31T00:00+01:00[Europe/Vienna]')
  //     assert.equal(`${lastFeb20.until(lastJan21)}`, 'PT8088H')
  //     assert.equal(`${lastFeb20.until(lastJan21, { largestUnit: 'months' })}`, 'P11M2D')
  //     assert.equal(`${lastFeb20.until(lastJan21, { largestUnit: 'years' })}`, 'P11M2D')
  //   })
  //   it('weeks and months are mutually exclusive', () => {
  //     const laterDateTime = zdt.add({ days: 42, hours: 3 })
  //     const weeksDifference = zdt.until(laterDateTime, { largestUnit: 'weeks' })
  //     assert.notequal(weeksDifference.weeks, 0)
  //     assert.equal(weeksDifference.months, 0)
  //     const monthsDifference = zdt.until(laterDateTime, { largestUnit: 'months' })
  //     assert.equal(monthsDifference.weeks, 0)
  //     assert.notequal(monthsDifference.months, 0)
  //   })
  //   it('no two different calendars', () => {
  //     const zdt1 = new ZonedDateTime(0n, 'UTC')
  //     const zdt2 = new ZonedDateTime(0n, 'UTC', Temporal.Calendar.from('japanese'))
  //     assert.throws(() => zdt1.until(zdt2), RangeError)
  //   })
  //   it('options may only be an object or undefined', () => {
  //     ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
  //       assert.throws(() => feb20.until(feb21, badOptions), TypeError)
  //     )
  //     ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${feb20.until(feb21, options)}`, 'PT8784H'))
  //   })
  //   const earlier = ZonedDateTime.from('2019-01-08T09:22:36.123456789+01:00[Europe/Vienna]')
  //   const later = ZonedDateTime.from('2021-09-07T14:39:40.987654321+02:00[Europe/Vienna]')
  //   it('throws on disallowed or invalid smallestUnit', () => {
  //     ;['era', 'nonsense'].forEach((smallestUnit) => {
  //       assert.throws(() => earlier.until(later, { smallestUnit }), RangeError)
  //     })
  //   })
  //   it('throws if smallestUnit is larger than largestUnit', () => {
  //     const units = [
  //       'years',
  //       'months',
  //       'weeks',
  //       'days',
  //       'hours',
  //       'minutes',
  //       'seconds',
  //       'milliseconds',
  //       'microseconds',
  //       'nanoseconds'
  //     ]
  //     for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
  //       for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
  //         const largestUnit = units[largestIdx]
  //         const smallestUnit = units[smallestIdx]
  //         assert.throws(() => earlier.until(later, { largestUnit, smallestUnit }), RangeError)
  //       }
  //     }
  //   })
  //   it('assumes a different default for largestUnit if smallestUnit is larger than hours', () => {
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y')
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M')
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W')
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'days', roundingMode: 'halfExpand' })}`, 'P973D')
  //   })
  //   it('throws on invalid roundingMode', () => {
  //     assert.throws(() => earlier.until(later, { roundingMode: 'cile' }), RangeError)
  //   })
  //   const incrementOneNearest = [
  //     ['years', 'P3Y'],
  //     ['months', 'P32M'],
  //     ['weeks', 'P139W'],
  //     ['days', 'P973D'],
  //     ['hours', 'PT23356H'],
  //     ['minutes', 'PT23356H17M'],
  //     ['seconds', 'PT23356H17M5S'],
  //     ['milliseconds', 'PT23356H17M4.864S'],
  //     ['microseconds', 'PT23356H17M4.864198S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S']
  //   ]
  //   incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //     const roundingMode = 'halfExpand'
  //     it(`rounds to nearest ${smallestUnit}`, () => {
  //       assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected)
  //       assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
  //     })
  //   })
  //   const incrementOneCeil = [
  //     ['years', 'P3Y', '-P2Y'],
  //     ['months', 'P32M', '-P31M'],
  //     ['weeks', 'P140W', '-P139W'],
  //     ['days', 'P974D', '-P973D'],
  //     ['hours', 'PT23357H', '-PT23356H'],
  //     ['minutes', 'PT23356H18M', '-PT23356H17M'],
  //     ['seconds', 'PT23356H17M5S', '-PT23356H17M4S'],
  //     ['milliseconds', 'PT23356H17M4.865S', '-PT23356H17M4.864S'],
  //     ['microseconds', 'PT23356H17M4.864198S', '-PT23356H17M4.864197S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S', '-PT23356H17M4.864197532S']
  //   ]
  //   incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //     const roundingMode = 'ceil'
  //     it(`rounds up to ${smallestUnit}`, () => {
  //       assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive)
  //       assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative)
  //     })
  //   })
  //   const incrementOneFloor = [
  //     ['years', 'P2Y', '-P3Y'],
  //     ['months', 'P31M', '-P32M'],
  //     ['weeks', 'P139W', '-P140W'],
  //     ['days', 'P973D', '-P974D'],
  //     ['hours', 'PT23356H', '-PT23357H'],
  //     ['minutes', 'PT23356H17M', '-PT23356H18M'],
  //     ['seconds', 'PT23356H17M4S', '-PT23356H17M5S'],
  //     ['milliseconds', 'PT23356H17M4.864S', '-PT23356H17M4.865S'],
  //     ['microseconds', 'PT23356H17M4.864197S', '-PT23356H17M4.864198S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S', '-PT23356H17M4.864197532S']
  //   ]
  //   incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //     const roundingMode = 'floor'
  //     it(`rounds down to ${smallestUnit}`, () => {
  //       assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive)
  //       assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative)
  //     })
  //   })
  //   const incrementOneTrunc = [
  //     ['years', 'P2Y'],
  //     ['months', 'P31M'],
  //     ['weeks', 'P139W'],
  //     ['days', 'P973D'],
  //     ['hours', 'PT23356H'],
  //     ['minutes', 'PT23356H17M'],
  //     ['seconds', 'PT23356H17M4S'],
  //     ['milliseconds', 'PT23356H17M4.864S'],
  //     ['microseconds', 'PT23356H17M4.864197S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S']
  //   ]
  //   incrementOneTrunc.forEach(([smallestUnit, expected]) => {
  //     const roundingMode = 'trunc'
  //     it(`truncates to ${smallestUnit}`, () => {
  //       assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected)
  //       assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
  //     })
  //   })
  //   it('trunc is the default', () => {
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'minutes' })}`, 'PT23356H17M')
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'seconds' })}`, 'PT23356H17M4S')
  //   })
  //   it('rounds to an increment of hours', () => {
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' })}`,
  //       'PT23355H'
  //     )
  //   })
  //   it('rounds to an increment of minutes', () => {
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' })}`,
  //       'PT23356H30M'
  //     )
  //   })
  //   it('rounds to an increment of seconds', () => {
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M'
  //     )
  //   })
  //   it('rounds to an increment of milliseconds', () => {
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M4.86S'
  //     )
  //   })
  //   it('rounds to an increment of microseconds', () => {
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M4.8642S'
  //     )
  //   })
  //   it('rounds to an increment of nanoseconds', () => {
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M4.86419753S'
  //     )
  //   })
  //   it('valid hour increments divide into 24', () => {
  //     ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
  //       const options = { smallestUnit: 'hours', roundingIncrement }
  //       assert(earlier.until(later, options) instanceof Temporal.Duration)
  //     })
  //   })
  //   ;['minutes', 'seconds'].forEach((smallestUnit) => {
  //     it(`valid ${smallestUnit} increments divide into 60`, () => {
  //       ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
  //         const options = { smallestUnit, roundingIncrement }
  //         assert(earlier.until(later, options) instanceof Temporal.Duration)
  //       })
  //     })
  //   })
  //   ;['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
  //     it(`valid ${smallestUnit} increments divide into 1000`, () => {
  //       ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
  //         const options = { smallestUnit, roundingIncrement }
  //         assert(earlier.until(later, options) instanceof Temporal.Duration)
  //       })
  //     })
  //   })
  //   it('throws on increments that do not divide evenly into the next highest', () => {
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 29 }), RangeError)
  //   })
  //   it('throws on increments that are equal to the next highest', () => {
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'microseconds', roundingIncrement: 1000 }), RangeError)
  //     assert.throws(() => earlier.until(later, { smallestUnit: 'nanoseconds', roundingIncrement: 1000 }), RangeError)
  //   })
  //   it('accepts singular units', () => {
  //     assert.equal(`${earlier.until(later, { largestUnit: 'year' })}`, `${earlier.until(later, { largestUnit: 'years' })}`)
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'year' })}`, `${earlier.until(later, { smallestUnit: 'years' })}`)
  //     assert.equal(`${earlier.until(later, { largestUnit: 'month' })}`, `${earlier.until(later, { largestUnit: 'months' })}`)
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'month' })}`,
  //       `${earlier.until(later, { smallestUnit: 'months' })}`
  //     )
  //     assert.equal(`${earlier.until(later, { largestUnit: 'day' })}`, `${earlier.until(later, { largestUnit: 'days' })}`)
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'day' })}`, `${earlier.until(later, { smallestUnit: 'days' })}`)
  //     assert.equal(`${earlier.until(later, { largestUnit: 'hour' })}`, `${earlier.until(later, { largestUnit: 'hours' })}`)
  //     assert.equal(`${earlier.until(later, { smallestUnit: 'hour' })}`, `${earlier.until(later, { smallestUnit: 'hours' })}`)
  //     assert.equal(
  //       `${earlier.until(later, { largestUnit: 'minute' })}`,
  //       `${earlier.until(later, { largestUnit: 'minutes' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'minute' })}`,
  //       `${earlier.until(later, { smallestUnit: 'minutes' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { largestUnit: 'second' })}`,
  //       `${earlier.until(later, { largestUnit: 'seconds' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'second' })}`,
  //       `${earlier.until(later, { smallestUnit: 'seconds' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { largestUnit: 'millisecond' })}`,
  //       `${earlier.until(later, { largestUnit: 'milliseconds' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'millisecond' })}`,
  //       `${earlier.until(later, { smallestUnit: 'milliseconds' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { largestUnit: 'microsecond' })}`,
  //       `${earlier.until(later, { largestUnit: 'microseconds' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'microsecond' })}`,
  //       `${earlier.until(later, { smallestUnit: 'microseconds' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { largestUnit: 'nanosecond' })}`,
  //       `${earlier.until(later, { largestUnit: 'nanoseconds' })}`
  //     )
  //     assert.equal(
  //       `${earlier.until(later, { smallestUnit: 'nanosecond' })}`,
  //       `${earlier.until(later, { smallestUnit: 'nanoseconds' })}`
  //     )
  //   })
  //   it('rounds relative to the receiver', () => {
  //     const dt1 = ZonedDateTime.from('2019-01-01T00:00+00:00[UTC]')
  //     const dt2 = ZonedDateTime.from('2020-07-02T00:00+00:00[UTC]')
  //     assert.equal(`${dt1.until(dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P2Y')
  //     assert.equal(`${dt2.until(dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P1Y')
  //   })
  // })
  // describe('ZonedDateTime.since()', () => {
  //   const zdt = ZonedDateTime.from('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]')
  //   it('zdt.since(earlier) === earlier.until(zdt) with default options', () => {
  //     const earlier = ZonedDateTime.from({ year: 1966, month: 3, day: 3, hour: 18, timeZone: 'Europe/Vienna' })
  //     assert.equal(`${zdt.since(earlier)}`, `${earlier.until(zdt)}`)
  //   })
  //   it('casts argument', () => {
  //     assert.equal(
  //       `${zdt.since({ year: 2019, month: 10, day: 29, hour: 10, timeZone: 'Europe/Vienna' })}`,
  //       '-PT376434H36M29.876543211S'
  //     )
  //     assert.equal(`${zdt.since('2019-10-29T10:46:38.271986102+01:00[Europe/Vienna]')}`, '-PT376435H23M8.148529313S')
  //   })
  //   const feb20 = ZonedDateTime.from('2020-02-01T00:00+01:00[Europe/Vienna]')
  //   const feb21 = ZonedDateTime.from('2021-02-01T00:00+01:00[Europe/Vienna]')
  //   it('defaults to returning hours', () => {
  //     assert.equal(`${feb21.since(feb20)}`, 'PT8784H')
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'auto' })}`, 'PT8784H')
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'hours' })}`, 'PT8784H')
  //     assert.equal(
  //       `${ZonedDateTime.from('2021-02-01T00:00:00.000000001+01:00[Europe/Vienna]').since(feb20)}`,
  //       'PT8784H0.000000001S'
  //     )
  //     assert.equal(
  //       `${feb21.since(ZonedDateTime.from('2020-02-01T00:00:00.000000001+01:00[Europe/Vienna]'))}`,
  //       'PT8783H59M59.999999999S'
  //     )
  //   })
  //   it('can return lower or higher units', () => {
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'years' })}`, 'P1Y')
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'months' })}`, 'P12M')
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'weeks' })}`, 'P52W2D')
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'days' })}`, 'P366D')
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'minutes' })}`, 'PT527040M')
  //     assert.equal(`${feb21.since(feb20, { largestUnit: 'seconds' })}`, 'PT31622400S')
  //   })
  //   it('can return subseconds', () => {
  //     const later = feb20.add({ days: 1, milliseconds: 250, microseconds: 250, nanoseconds: 250 })

  //     const msDiff = later.since(feb20, { largestUnit: 'milliseconds' })
  //     assert.equal(msDiff.seconds, 0)
  //     assert.equal(msDiff.milliseconds, 86400250)
  //     assert.equal(msDiff.microseconds, 250)
  //     assert.equal(msDiff.nanoseconds, 250)

  //     const µsDiff = later.since(feb20, { largestUnit: 'microseconds' })
  //     assert.equal(µsDiff.milliseconds, 0)
  //     assert.equal(µsDiff.microseconds, 86400250250)
  //     assert.equal(µsDiff.nanoseconds, 250)

  //     const nsDiff = later.since(feb20, { largestUnit: 'nanoseconds' })
  //     assert.equal(nsDiff.microseconds, 0)
  //     assert.equal(nsDiff.nanoseconds, 86400250250250)
  //   })
  //   it('does not include higher units than necessary', () => {
  //     const lastFeb20 = ZonedDateTime.from('2020-02-29T00:00+01:00[Europe/Vienna]')
  //     const lastFeb21 = ZonedDateTime.from('2021-02-28T00:00+01:00[Europe/Vienna]')
  //     assert.equal(`${lastFeb21.since(lastFeb20)}`, 'PT8760H')
  //     assert.equal(`${lastFeb21.since(lastFeb20, { largestUnit: 'months' })}`, 'P11M28D')
  //     assert.equal(`${lastFeb21.since(lastFeb20, { largestUnit: 'years' })}`, 'P11M28D')
  //   })
  //   it('weeks and months are mutually exclusive', () => {
  //     const laterDateTime = zdt.add({ days: 42, hours: 3 })
  //     const weeksDifference = laterDateTime.since(zdt, { largestUnit: 'weeks' })
  //     assert.notequal(weeksDifference.weeks, 0)
  //     assert.equal(weeksDifference.months, 0)
  //     const monthsDifference = laterDateTime.since(zdt, { largestUnit: 'months' })
  //     assert.equal(monthsDifference.weeks, 0)
  //     assert.notequal(monthsDifference.months, 0)
  //   })
  //   it('no two different calendars', () => {
  //     const zdt1 = new ZonedDateTime(0n, 'UTC')
  //     const zdt2 = new ZonedDateTime(0n, 'UTC', Temporal.Calendar.from('japanese'))
  //     assert.throws(() => zdt1.since(zdt2), RangeError)
  //   })
  //   it('options may only be an object or undefined', () => {
  //     ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
  //       assert.throws(() => feb21.since(feb20, badOptions), TypeError)
  //     )
  //     ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${feb21.since(feb20, options)}`, 'PT8784H'))
  //   })
  //   const earlier = ZonedDateTime.from('2019-01-08T09:22:36.123456789+01:00[Europe/Vienna]')
  //   const later = ZonedDateTime.from('2021-09-07T14:39:40.987654321+02:00[Europe/Vienna]')
  //   it('throws on disallowed or invalid smallestUnit', () => {
  //     ;['era', 'nonsense'].forEach((smallestUnit) => {
  //       assert.throws(() => later.since(earlier, { smallestUnit }), RangeError)
  //     })
  //   })
  //   it('throws if smallestUnit is larger than largestUnit', () => {
  //     const units = [
  //       'years',
  //       'months',
  //       'weeks',
  //       'days',
  //       'hours',
  //       'minutes',
  //       'seconds',
  //       'milliseconds',
  //       'microseconds',
  //       'nanoseconds'
  //     ]
  //     for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
  //       for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
  //         const largestUnit = units[largestIdx]
  //         const smallestUnit = units[smallestIdx]
  //         assert.throws(() => later.since(earlier, { largestUnit, smallestUnit }), RangeError)
  //       }
  //     }
  //   })
  //   it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y')
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M')
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W')
  //   })
  //   it('throws on invalid roundingMode', () => {
  //     assert.throws(() => later.since(earlier, { roundingMode: 'cile' }), RangeError)
  //   })
  //   const incrementOneNearest = [
  //     ['years', 'P3Y'],
  //     ['months', 'P32M'],
  //     ['weeks', 'P139W'],
  //     ['days', 'P973D'],
  //     ['hours', 'PT23356H'],
  //     ['minutes', 'PT23356H17M'],
  //     ['seconds', 'PT23356H17M5S'],
  //     ['milliseconds', 'PT23356H17M4.864S'],
  //     ['microseconds', 'PT23356H17M4.864198S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S']
  //   ]
  //   incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //     const roundingMode = 'halfExpand'
  //     it(`rounds to nearest ${smallestUnit}`, () => {
  //       assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected)
  //       assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`)
  //     })
  //   })
  //   const incrementOneCeil = [
  //     ['years', 'P3Y', '-P2Y'],
  //     ['months', 'P32M', '-P31M'],
  //     ['weeks', 'P140W', '-P139W'],
  //     ['days', 'P974D', '-P973D'],
  //     ['hours', 'PT23357H', '-PT23356H'],
  //     ['minutes', 'PT23356H18M', '-PT23356H17M'],
  //     ['seconds', 'PT23356H17M5S', '-PT23356H17M4S'],
  //     ['milliseconds', 'PT23356H17M4.865S', '-PT23356H17M4.864S'],
  //     ['microseconds', 'PT23356H17M4.864198S', '-PT23356H17M4.864197S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S', '-PT23356H17M4.864197532S']
  //   ]
  //   incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //     const roundingMode = 'ceil'
  //     it(`rounds up to ${smallestUnit}`, () => {
  //       assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive)
  //       assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative)
  //     })
  //   })
  //   const incrementOneFloor = [
  //     ['years', 'P2Y', '-P3Y'],
  //     ['months', 'P31M', '-P32M'],
  //     ['weeks', 'P139W', '-P140W'],
  //     ['days', 'P973D', '-P974D'],
  //     ['hours', 'PT23356H', '-PT23357H'],
  //     ['minutes', 'PT23356H17M', '-PT23356H18M'],
  //     ['seconds', 'PT23356H17M4S', '-PT23356H17M5S'],
  //     ['milliseconds', 'PT23356H17M4.864S', '-PT23356H17M4.865S'],
  //     ['microseconds', 'PT23356H17M4.864197S', '-PT23356H17M4.864198S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S', '-PT23356H17M4.864197532S']
  //   ]
  //   incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //     const roundingMode = 'floor'
  //     it(`rounds down to ${smallestUnit}`, () => {
  //       assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive)
  //       assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative)
  //     })
  //   })
  //   const incrementOneTrunc = [
  //     ['years', 'P2Y'],
  //     ['months', 'P31M'],
  //     ['weeks', 'P139W'],
  //     ['days', 'P973D'],
  //     ['hours', 'PT23356H'],
  //     ['minutes', 'PT23356H17M'],
  //     ['seconds', 'PT23356H17M4S'],
  //     ['milliseconds', 'PT23356H17M4.864S'],
  //     ['microseconds', 'PT23356H17M4.864197S'],
  //     ['nanoseconds', 'PT23356H17M4.864197532S']
  //   ]
  //   incrementOneTrunc.forEach(([smallestUnit, expected]) => {
  //     const roundingMode = 'trunc'
  //     it(`truncates to ${smallestUnit}`, () => {
  //       assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected)
  //       assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`)
  //     })
  //   })
  //   it('trunc is the default', () => {
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'minutes' })}`, 'PT23356H17M')
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'seconds' })}`, 'PT23356H17M4S')
  //   })
  //   it('rounds to an increment of hours', () => {
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' })}`,
  //       'PT23355H'
  //     )
  //   })
  //   it('rounds to an increment of minutes', () => {
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' })}`,
  //       'PT23356H30M'
  //     )
  //   })
  //   it('rounds to an increment of seconds', () => {
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M'
  //     )
  //   })
  //   it('rounds to an increment of milliseconds', () => {
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M4.86S'
  //     )
  //   })
  //   it('rounds to an increment of microseconds', () => {
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M4.8642S'
  //     )
  //   })
  //   it('rounds to an increment of nanoseconds', () => {
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 10, roundingMode: 'halfExpand' })}`,
  //       'PT23356H17M4.86419753S'
  //     )
  //   })
  //   it('valid hour increments divide into 24', () => {
  //     ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
  //       const options = { smallestUnit: 'hours', roundingIncrement }
  //       assert(later.since(earlier, options) instanceof Temporal.Duration)
  //     })
  //   })
  //   ;['minutes', 'seconds'].forEach((smallestUnit) => {
  //     it(`valid ${smallestUnit} increments divide into 60`, () => {
  //       ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
  //         const options = { smallestUnit, roundingIncrement }
  //         assert(later.since(earlier, options) instanceof Temporal.Duration)
  //       })
  //     })
  //   })
  //   ;['milliseconds', 'microseconds', 'nanoseconds'].forEach((smallestUnit) => {
  //     it(`valid ${smallestUnit} increments divide into 1000`, () => {
  //       ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
  //         const options = { smallestUnit, roundingIncrement }
  //         assert(later.since(earlier, options) instanceof Temporal.Duration)
  //       })
  //     })
  //   })
  //   it('throws on increments that do not divide evenly into the next highest', () => {
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 29 }), RangeError)
  //   })
  //   it('throws on increments that are equal to the next highest', () => {
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'microseconds', roundingIncrement: 1000 }), RangeError)
  //     assert.throws(() => later.since(earlier, { smallestUnit: 'nanoseconds', roundingIncrement: 1000 }), RangeError)
  //   })
  //   it('accepts singular units', () => {
  //     assert.equal(`${later.since(earlier, { largestUnit: 'year' })}`, `${later.since(earlier, { largestUnit: 'years' })}`)
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'year' })}`, `${later.since(earlier, { smallestUnit: 'years' })}`)
  //     assert.equal(`${later.since(earlier, { largestUnit: 'month' })}`, `${later.since(earlier, { largestUnit: 'months' })}`)
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'month' })}`,
  //       `${later.since(earlier, { smallestUnit: 'months' })}`
  //     )
  //     assert.equal(`${later.since(earlier, { largestUnit: 'day' })}`, `${later.since(earlier, { largestUnit: 'days' })}`)
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'day' })}`, `${later.since(earlier, { smallestUnit: 'days' })}`)
  //     assert.equal(`${later.since(earlier, { largestUnit: 'hour' })}`, `${later.since(earlier, { largestUnit: 'hours' })}`)
  //     assert.equal(`${later.since(earlier, { smallestUnit: 'hour' })}`, `${later.since(earlier, { smallestUnit: 'hours' })}`)
  //     assert.equal(
  //       `${later.since(earlier, { largestUnit: 'minute' })}`,
  //       `${later.since(earlier, { largestUnit: 'minutes' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'minute' })}`,
  //       `${later.since(earlier, { smallestUnit: 'minutes' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { largestUnit: 'second' })}`,
  //       `${later.since(earlier, { largestUnit: 'seconds' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'second' })}`,
  //       `${later.since(earlier, { smallestUnit: 'seconds' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { largestUnit: 'millisecond' })}`,
  //       `${later.since(earlier, { largestUnit: 'milliseconds' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'millisecond' })}`,
  //       `${later.since(earlier, { smallestUnit: 'milliseconds' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { largestUnit: 'microsecond' })}`,
  //       `${later.since(earlier, { largestUnit: 'microseconds' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'microsecond' })}`,
  //       `${later.since(earlier, { smallestUnit: 'microseconds' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { largestUnit: 'nanosecond' })}`,
  //       `${later.since(earlier, { largestUnit: 'nanoseconds' })}`
  //     )
  //     assert.equal(
  //       `${later.since(earlier, { smallestUnit: 'nanosecond' })}`,
  //       `${later.since(earlier, { smallestUnit: 'nanoseconds' })}`
  //     )
  //   })
  //   it('rounds relative to the receiver', () => {
  //     const dt1 = ZonedDateTime.from('2019-01-01T00:00+00:00[UTC]')
  //     const dt2 = ZonedDateTime.from('2020-07-02T00:00+00:00[UTC]')
  //     assert.equal(`${dt2.since(dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P1Y')
  //     assert.equal(`${dt1.since(dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P2Y')
  //   })
  // })

  // describe('ZonedDateTime.round()', () => {
  //   const zdt = ZonedDateTime.from('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]')
  //   it('throws without parameter', () => {
  //     assert.throws(() => zdt.round(), TypeError)
  //   })
  //   it('throws without required smallestUnit parameter', () => {
  //     assert.throws(() => zdt.round({}), RangeError)
  //     assert.throws(() => zdt.round({ roundingIncrement: 1, roundingMode: 'ceil' }), RangeError)
  //   })
  //   it('throws on disallowed or invalid smallestUnit', () => {
  //     ;['era', 'year', 'month', 'week', 'years', 'months', 'weeks', 'nonsense'].forEach((smallestUnit) => {
  //       assert.throws(() => zdt.round({ smallestUnit }), RangeError)
  //     })
  //   })
  //   it('throws on invalid roundingMode', () => {
  //     assert.throws(() => zdt.round({ smallestUnit: 'second', roundingMode: 'cile' }), RangeError)
  //   })
  //   const incrementOneNearest = [
  //     ['day', '1976-11-19T00:00:00+01:00[Europe/Vienna]'],
  //     ['hour', '1976-11-18T15:00:00+01:00[Europe/Vienna]'],
  //     ['minute', '1976-11-18T15:24:00+01:00[Europe/Vienna]'],
  //     ['second', '1976-11-18T15:23:30+01:00[Europe/Vienna]'],
  //     ['millisecond', '1976-11-18T15:23:30.123+01:00[Europe/Vienna]'],
  //     ['microsecond', '1976-11-18T15:23:30.123457+01:00[Europe/Vienna]'],
  //     ['nanosecond', '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]']
  //   ]
  //   incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //     it(`rounds to nearest ${smallestUnit}`, () =>
  //       assert.equal(`${zdt.round({ smallestUnit, roundingMode: 'halfExpand' })}`, expected))
  //   })
  //   const incrementOneCeil = [
  //     ['day', '1976-11-19T00:00:00+01:00[Europe/Vienna]'],
  //     ['hour', '1976-11-18T16:00:00+01:00[Europe/Vienna]'],
  //     ['minute', '1976-11-18T15:24:00+01:00[Europe/Vienna]'],
  //     ['second', '1976-11-18T15:23:31+01:00[Europe/Vienna]'],
  //     ['millisecond', '1976-11-18T15:23:30.124+01:00[Europe/Vienna]'],
  //     ['microsecond', '1976-11-18T15:23:30.123457+01:00[Europe/Vienna]'],
  //     ['nanosecond', '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]']
  //   ]
  //   incrementOneCeil.forEach(([smallestUnit, expected]) => {
  //     it(`rounds up to ${smallestUnit}`, () =>
  //       assert.equal(`${zdt.round({ smallestUnit, roundingMode: 'ceil' })}`, expected))
  //   })
  //   const incrementOneFloor = [
  //     ['day', '1976-11-18T00:00:00+01:00[Europe/Vienna]'],
  //     ['hour', '1976-11-18T15:00:00+01:00[Europe/Vienna]'],
  //     ['minute', '1976-11-18T15:23:00+01:00[Europe/Vienna]'],
  //     ['second', '1976-11-18T15:23:30+01:00[Europe/Vienna]'],
  //     ['millisecond', '1976-11-18T15:23:30.123+01:00[Europe/Vienna]'],
  //     ['microsecond', '1976-11-18T15:23:30.123456+01:00[Europe/Vienna]'],
  //     ['nanosecond', '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]']
  //   ]
  //   incrementOneFloor.forEach(([smallestUnit, expected]) => {
  //     it(`rounds down to ${smallestUnit}`, () =>
  //       assert.equal(`${zdt.round({ smallestUnit, roundingMode: 'floor' })}`, expected))
  //     it(`truncates to ${smallestUnit}`, () =>
  //       assert.equal(`${zdt.round({ smallestUnit, roundingMode: 'trunc' })}`, expected))
  //   })
  //   it('halfExpand is the default', () => {
  //     assert.equal(`${zdt.round({ smallestUnit: 'minute' })}`, '1976-11-18T15:24:00+01:00[Europe/Vienna]')
  //     assert.equal(`${zdt.round({ smallestUnit: 'second' })}`, '1976-11-18T15:23:30+01:00[Europe/Vienna]')
  //   })
  //   it('rounding down is towards the Big Bang, not towards the epoch', () => {
  //     const zdt2 = ZonedDateTime.from('1969-12-15T12:00:00.5+00:00[UTC]')
  //     const smallestUnit = 'second'
  //     assert.equal(`${zdt2.round({ smallestUnit, roundingMode: 'ceil' })}`, '1969-12-15T12:00:01+00:00[UTC]')
  //     assert.equal(`${zdt2.round({ smallestUnit, roundingMode: 'floor' })}`, '1969-12-15T12:00:00+00:00[UTC]')
  //     assert.equal(`${zdt2.round({ smallestUnit, roundingMode: 'trunc' })}`, '1969-12-15T12:00:00+00:00[UTC]')
  //     assert.equal(`${zdt2.round({ smallestUnit, roundingMode: 'halfExpand' })}`, '1969-12-15T12:00:01+00:00[UTC]')
  //   })
  //   it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
  //     const zdt3 = ZonedDateTime.from('-000099-12-15T12:00:00.5+00:00[UTC]')
  //     const smallestUnit = 'second'
  //     assert.equal(`${zdt3.round({ smallestUnit, roundingMode: 'ceil' })}`, '-000099-12-15T12:00:01+00:00[UTC]')
  //     assert.equal(`${zdt3.round({ smallestUnit, roundingMode: 'floor' })}`, '-000099-12-15T12:00:00+00:00[UTC]')
  //     assert.equal(`${zdt3.round({ smallestUnit, roundingMode: 'trunc' })}`, '-000099-12-15T12:00:00+00:00[UTC]')
  //     assert.equal(`${zdt3.round({ smallestUnit, roundingMode: 'halfExpand' })}`, '-000099-12-15T12:00:01+00:00[UTC]')
  //   })
  //   it('rounds to an increment of hours', () => {
  //     assert.equal(
  //       `${zdt.round({ smallestUnit: 'hour', roundingIncrement: 4 })}`,
  //       '1976-11-18T16:00:00+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('rounds to an increment of minutes', () => {
  //     assert.equal(
  //       `${zdt.round({ smallestUnit: 'minute', roundingIncrement: 15 })}`,
  //       '1976-11-18T15:30:00+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('rounds to an increment of seconds', () => {
  //     assert.equal(
  //       `${zdt.round({ smallestUnit: 'second', roundingIncrement: 30 })}`,
  //       '1976-11-18T15:23:30+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('rounds to an increment of milliseconds', () => {
  //     assert.equal(
  //       `${zdt.round({ smallestUnit: 'millisecond', roundingIncrement: 10 })}`,
  //       '1976-11-18T15:23:30.12+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('rounds to an increment of microseconds', () => {
  //     assert.equal(
  //       `${zdt.round({ smallestUnit: 'microsecond', roundingIncrement: 10 })}`,
  //       '1976-11-18T15:23:30.12346+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('rounds to an increment of nanoseconds', () => {
  //     assert.equal(
  //       `${zdt.round({ smallestUnit: 'nanosecond', roundingIncrement: 10 })}`,
  //       '1976-11-18T15:23:30.12345679+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('1 day is a valid increment', () => {
  //     assert.equal(`${zdt.round({ smallestUnit: 'day', roundingIncrement: 1 })}`, '1976-11-19T00:00:00+01:00[Europe/Vienna]')
  //   })
  //   it('valid hour increments divide into 24', () => {
  //     const smallestUnit = 'hour'
  //     ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
  //       assert(zdt.round({ smallestUnit, roundingIncrement }) instanceof ZonedDateTime)
  //     })
  //   })
  //   ;['minute', 'second'].forEach((smallestUnit) => {
  //     it(`valid ${smallestUnit} increments divide into 60`, () => {
  //       ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
  //         assert(zdt.round({ smallestUnit, roundingIncrement }) instanceof ZonedDateTime)
  //       })
  //     })
  //   })
  //   ;['millisecond', 'microsecond', 'nanosecond'].forEach((smallestUnit) => {
  //     it(`valid ${smallestUnit} increments divide into 1000`, () => {
  //       ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
  //         assert(zdt.round({ smallestUnit, roundingIncrement }) instanceof ZonedDateTime)
  //       })
  //     })
  //   })
  //   it('throws on increments that do not divide evenly into the next highest', () => {
  //     assert.throws(() => zdt.round({ smallestUnit: 'day', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'hour', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'minute', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'second', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'microsecond', roundingIncrement: 29 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'nanosecond', roundingIncrement: 29 }), RangeError)
  //   })
  //   it('throws on increments that are equal to the next highest', () => {
  //     assert.throws(() => zdt.round({ smallestUnit: 'hour', roundingIncrement: 24 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'minute', roundingIncrement: 60 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'second', roundingIncrement: 60 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'millisecond', roundingIncrement: 1000 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'microsecond', roundingIncrement: 1000 }), RangeError)
  //     assert.throws(() => zdt.round({ smallestUnit: 'nanosecond', roundingIncrement: 1000 }), RangeError)
  //   })
  //   const bal = ZonedDateTime.from('1976-11-18T23:59:59.999999999+01:00[Europe/Vienna]')
  //   ;['day', 'hour', 'minute', 'second', 'millisecond', 'microsecond'].forEach((smallestUnit) => {
  //     it(`balances to next ${smallestUnit}`, () => {
  //       assert.equal(`${bal.round({ smallestUnit })}`, '1976-11-19T00:00:00+01:00[Europe/Vienna]')
  //     })
  //   })
  //   it('accepts plural units', () => {
  //     assert(zdt.round({ smallestUnit: 'hours' }).equals(zdt.round({ smallestUnit: 'hour' })))
  //     assert(zdt.round({ smallestUnit: 'minutes' }).equals(zdt.round({ smallestUnit: 'minute' })))
  //     assert(zdt.round({ smallestUnit: 'seconds' }).equals(zdt.round({ smallestUnit: 'second' })))
  //     assert(zdt.round({ smallestUnit: 'milliseconds' }).equals(zdt.round({ smallestUnit: 'millisecond' })))
  //     assert(zdt.round({ smallestUnit: 'microseconds' }).equals(zdt.round({ smallestUnit: 'microsecond' })))
  //     assert(zdt.round({ smallestUnit: 'nanoseconds' }).equals(zdt.round({ smallestUnit: 'nanosecond' })))
  //   })
  //   it('rounds correctly to a 25-hour day', () => {
  //     const options = { smallestUnit: 'day' }
  //     const roundMeDown = ZonedDateTime.from('2020-11-01T12:29:59-08:00[America/Vancouver]')
  //     assert.equal(`${roundMeDown.round(options)}`, '2020-11-01T00:00:00-07:00[America/Vancouver]')
  //     const roundMeUp = ZonedDateTime.from('2020-11-01T12:30:01-08:00[America/Vancouver]')
  //     assert.equal(`${roundMeUp.round(options)}`, '2020-11-02T00:00:00-08:00[America/Vancouver]')
  //   })
  //   it('rounds correctly to a 23-hour day', () => {
  //     const options = { smallestUnit: 'day' }
  //     const roundMeDown = ZonedDateTime.from('2020-03-08T11:29:59-07:00[America/Vancouver]')
  //     assert.equal(`${roundMeDown.round(options)}`, '2020-03-08T00:00:00-08:00[America/Vancouver]')
  //     const roundMeUp = ZonedDateTime.from('2020-03-08T11:30:01-07:00[America/Vancouver]')
  //     assert.equal(`${roundMeUp.round(options)}`, '2020-03-09T00:00:00-07:00[America/Vancouver]')
  //   })
  //   it('rounding up to a nonexistent wall-clock time', () => {
  //     const almostSkipped = ZonedDateTime.from('2018-11-03T23:59:59.999999999-03:00[America/Sao_Paulo]')
  //     const rounded = almostSkipped.round({ smallestUnit: 'microsecond', roundingMode: 'halfExpand' })
  //     assert.equal(`${rounded}`, '2018-11-04T01:00:00-02:00[America/Sao_Paulo]')
  //     assert.equal(rounded.epochNanoseconds - almostSkipped.epochNanoseconds, 1n)
  //   })
  // })

  // describe('ZonedDateTime.equals()', () => {
  //   const tz = Temporal.TimeZone.from('America/New_York')
  //   const cal = Temporal.Calendar.from('gregory')
  //   const zdt = new ZonedDateTime(0n, tz, cal)
  //   it('constructed from equivalent parameters are equal', () => {
  //     const zdt2 = ZonedDateTime.from('1969-12-31T19:00-05:00[America/New_York][u-ca=gregory]')
  //     assert(zdt.equals(zdt2))
  //     assert(zdt2.equals(zdt))
  //   })
  //   it('different instant not equal', () => {
  //     const zdt2 = new ZonedDateTime(1n, tz, cal)
  //     assert(!zdt.equals(zdt2))
  //   })
  //   it('different time zone not equal', () => {
  //     const zdt2 = new ZonedDateTime(0n, 'America/Chicago', cal)
  //     assert(!zdt.equals(zdt2))
  //   })
  //   it('different calendar not equal', () => {
  //     const zdt2 = new ZonedDateTime(0n, tz, 'iso8601')
  //     assert(!zdt.equals(zdt2))
  //   })
  //   it('casts its argument', () => {
  //     assert(zdt.equals('1969-12-31T19:00-05:00[America/New_York][u-ca=gregory]'))
  //     assert(
  //       zdt.equals({
  //         year: 1969,
  //         month: 12,
  //         day: 31,
  //         hour: 19,
  //         timeZone: 'America/New_York',
  //         calendar: 'gregory'
  //       })
  //     )
  //   })
  //   it('at least the required properties must be present', () => {
  //     assert(!zdt.equals({ year: 1969, month: 12, day: 31, timeZone: 'America/New_York' }))
  //     assert.throws(() => zdt.equals({ month: 12, day: 31, timeZone: 'America/New_York' }), TypeError)
  //     assert.throws(() => zdt.equals({ year: 1969, day: 31, timeZone: 'America/New_York' }), TypeError)
  //     assert.throws(() => zdt.equals({ year: 1969, month: 12, timeZone: 'America/New_York' }), TypeError)
  //     assert.throws(() => zdt.equals({ year: 1969, month: 12, day: 31 }), TypeError)
  //     assert.throws(
  //       () => zdt.equals({ years: 1969, months: 12, days: 31, timeZone: 'America/New_York', calendarName: 'gregory' }),
  //       TypeError
  //     )
  //   })
  // })
  // describe('ZonedDateTime.toString()', () => {
  //   const zdt1 = ZonedDateTime.from('1976-11-18T15:23+01:00[Europe/Vienna]')
  //   const zdt2 = ZonedDateTime.from('1976-11-18T15:23:30+01:00[Europe/Vienna]')
  //   const zdt3 = ZonedDateTime.from('1976-11-18T15:23:30.1234+01:00[Europe/Vienna]')
  //   it('default is to emit seconds and drop trailing zeros after the decimal', () => {
  //     assert.equal(zdt1.toString(), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
  //     assert.equal(zdt2.toString(), '1976-11-18T15:23:30+01:00[Europe/Vienna]')
  //     assert.equal(zdt3.toString(), '1976-11-18T15:23:30.1234+01:00[Europe/Vienna]')
  //   })
  //   it('shows only non-ISO calendar if calendarName = auto', () => {
  //     assert.equal(zdt1.toString({ calendarName: 'auto' }), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
  //     assert.equal(
  //       zdt1.withCalendar('gregory').toString({ calendarName: 'auto' }),
  //       '1976-11-18T15:23:00+01:00[Europe/Vienna][u-ca=gregory]'
  //     )
  //   })
  //   it('shows ISO calendar if calendarName = always', () => {
  //     assert.equal(zdt1.toString({ calendarName: 'always' }), '1976-11-18T15:23:00+01:00[Europe/Vienna][u-ca=iso8601]')
  //   })
  //   it('omits non-ISO calendar if calendarName = never', () => {
  //     assert.equal(
  //       zdt1.withCalendar('gregory').toString({ calendarName: 'never' }),
  //       '1976-11-18T15:23:00+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('default is calendar = auto', () => {
  //     assert.equal(zdt1.toString(), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
  //     assert.equal(zdt1.withCalendar('gregory').toString(), '1976-11-18T15:23:00+01:00[Europe/Vienna][u-ca=gregory]')
  //   })
  //   it('throws on invalid calendar', () => {
  //     ;['ALWAYS', 'sometimes', false, 3, null].forEach((calendarName) => {
  //       assert.throws(() => zdt1.toString({ calendarName }), RangeError)
  //     })
  //   })
  //   it('shows time zone if timeZoneName = auto', () => {
  //     assert.equal(zdt1.toString({ timeZoneName: 'auto' }), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
  //   })
  //   it('omits time zone if timeZoneName = never', () => {
  //     assert.equal(zdt1.toString({ timeZoneName: 'never' }), '1976-11-18T15:23:00+01:00')
  //   })
  //   it('shows offset if offset = auto', () => {
  //     assert.equal(zdt1.toString({ offset: 'auto' }), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
  //   })
  //   it('omits offset if offset = never', () => {
  //     assert.equal(zdt1.toString({ offset: 'never' }), '1976-11-18T15:23:00[Europe/Vienna]')
  //   })
  //   it('combinations of calendar, time zone, and offset', () => {
  //     const zdt = zdt1.withCalendar('gregory')
  //     assert.equal(zdt.toString({ timeZoneName: 'never', calendarName: 'never' }), '1976-11-18T15:23:00+01:00')
  //     assert.equal(zdt.toString({ offset: 'never', calendarName: 'never' }), '1976-11-18T15:23:00[Europe/Vienna]')
  //     assert.equal(zdt.toString({ offset: 'never', timeZoneName: 'never' }), '1976-11-18T15:23:00[u-ca=gregory]')
  //     assert.equal(zdt.toString({ offset: 'never', timeZoneName: 'never', calendarName: 'never' }), '1976-11-18T15:23:00')
  //   })
  //   it('truncates to minute', () => {
  //     ;[zdt1, zdt2, zdt3].forEach((zdt) =>
  //       assert.equal(zdt.toString({ smallestUnit: 'minute' }), '1976-11-18T15:23+01:00[Europe/Vienna]')
  //     )
  //   })
  //   it('other smallestUnits are aliases for fractional digits', () => {
  //     assert.equal(zdt3.toString({ smallestUnit: 'second' }), zdt3.toString({ fractionalSecondDigits: 0 }))
  //     assert.equal(zdt3.toString({ smallestUnit: 'millisecond' }), zdt3.toString({ fractionalSecondDigits: 3 }))
  //     assert.equal(zdt3.toString({ smallestUnit: 'microsecond' }), zdt3.toString({ fractionalSecondDigits: 6 }))
  //     assert.equal(zdt3.toString({ smallestUnit: 'nanosecond' }), zdt3.toString({ fractionalSecondDigits: 9 }))
  //   })
  //   it('throws on invalid or disallowed smallestUnit', () => {
  //     ;['era', 'year', 'month', 'day', 'hour', 'nonsense'].forEach((smallestUnit) =>
  //       assert.throws(() => zdt1.toString({ smallestUnit }), RangeError)
  //     )
  //   })
  //   it('accepts plural units', () => {
  //     assert.equal(zdt3.toString({ smallestUnit: 'minutes' }), zdt3.toString({ smallestUnit: 'minute' }))
  //     assert.equal(zdt3.toString({ smallestUnit: 'seconds' }), zdt3.toString({ smallestUnit: 'second' }))
  //     assert.equal(zdt3.toString({ smallestUnit: 'milliseconds' }), zdt3.toString({ smallestUnit: 'millisecond' }))
  //     assert.equal(zdt3.toString({ smallestUnit: 'microseconds' }), zdt3.toString({ smallestUnit: 'microsecond' }))
  //     assert.equal(zdt3.toString({ smallestUnit: 'nanoseconds' }), zdt3.toString({ smallestUnit: 'nanosecond' }))
  //   })
  //   it('truncates or pads to 2 places', () => {
  //     const options = { fractionalSecondDigits: 2 }
  //     assert.equal(zdt1.toString(options), '1976-11-18T15:23:00.00+01:00[Europe/Vienna]')
  //     assert.equal(zdt2.toString(options), '1976-11-18T15:23:30.00+01:00[Europe/Vienna]')
  //     assert.equal(zdt3.toString(options), '1976-11-18T15:23:30.12+01:00[Europe/Vienna]')
  //   })
  //   it('pads to 7 places', () => {
  //     const options = { fractionalSecondDigits: 7 }
  //     assert.equal(zdt1.toString(options), '1976-11-18T15:23:00.0000000+01:00[Europe/Vienna]')
  //     assert.equal(zdt2.toString(options), '1976-11-18T15:23:30.0000000+01:00[Europe/Vienna]')
  //     assert.equal(zdt3.toString(options), '1976-11-18T15:23:30.1234000+01:00[Europe/Vienna]')
  //   })
  //   it('auto is the default', () => {
  //     ;[zdt1, zdt2, zdt3].forEach((zdt) => assert.equal(zdt.toString({ fractionalSecondDigits: 'auto' }), zdt.toString()))
  //   })
  //   it('throws on out of range or invalid fractionalSecondDigits', () => {
  //     ;[-1, 10, Infinity, NaN, 'not-auto'].forEach((fractionalSecondDigits) =>
  //       assert.throws(() => zdt1.toString({ fractionalSecondDigits }), RangeError)
  //     )
  //   })
  //   it('accepts and truncates fractional fractionalSecondDigits', () => {
  //     assert.equal(zdt3.toString({ fractionalSecondDigits: 5.5 }), '1976-11-18T15:23:30.12340+01:00[Europe/Vienna]')
  //   })
  //   it('smallestUnit overrides fractionalSecondDigits', () => {
  //     assert.equal(
  //       zdt3.toString({ smallestUnit: 'minute', fractionalSecondDigits: 9 }),
  //       '1976-11-18T15:23+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('throws on invalid roundingMode', () => {
  //     assert.throws(() => zdt1.toString({ roundingMode: 'cile' }), RangeError)
  //   })
  //   it('rounds to nearest', () => {
  //     assert.equal(
  //       zdt2.toString({ smallestUnit: 'minute', roundingMode: 'halfExpand' }),
  //       '1976-11-18T15:24+01:00[Europe/Vienna]'
  //     )
  //     assert.equal(
  //       zdt3.toString({ fractionalSecondDigits: 3, roundingMode: 'halfExpand' }),
  //       '1976-11-18T15:23:30.123+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('rounds up', () => {
  //     assert.equal(zdt2.toString({ smallestUnit: 'minute', roundingMode: 'ceil' }), '1976-11-18T15:24+01:00[Europe/Vienna]')
  //     assert.equal(
  //       zdt3.toString({ fractionalSecondDigits: 3, roundingMode: 'ceil' }),
  //       '1976-11-18T15:23:30.124+01:00[Europe/Vienna]'
  //     )
  //   })
  //   it('rounds down', () => {
  //     ;['floor', 'trunc'].forEach((roundingMode) => {
  //       assert.equal(zdt2.toString({ smallestUnit: 'minute', roundingMode }), '1976-11-18T15:23+01:00[Europe/Vienna]')
  //       assert.equal(
  //         zdt3.toString({ fractionalSecondDigits: 3, roundingMode }),
  //         '1976-11-18T15:23:30.123+01:00[Europe/Vienna]'
  //       )
  //     })
  //   })
  //   it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
  //     const zdt4 = ZonedDateTime.from('-000099-12-15T12:00:00.5+00:00[UTC]')
  //     assert.equal(zdt4.toString({ smallestUnit: 'second', roundingMode: 'floor' }), '-000099-12-15T12:00:00+00:00[UTC]')
  //   })
  //   it('rounding can affect all units', () => {
  //     const zdt5 = ZonedDateTime.from('1999-12-31T23:59:59.999999999+01:00[Europe/Berlin]')
  //     assert.equal(
  //       zdt5.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' }),
  //       '2000-01-01T00:00:00.00000000+01:00[Europe/Berlin]'
  //     )
  //   })
  //   it('rounding up to a nonexistent wall-clock time', () => {
  //     const zdt5 = ZonedDateTime.from('2018-11-03T23:59:59.999999999-03:00[America/Sao_Paulo]')
  //     const roundedString = zdt5.toString({ fractionalSecondDigits: 8, roundingMode: 'halfExpand' })
  //     assert.equal(roundedString, '2018-11-04T01:00:00.00000000-02:00[America/Sao_Paulo]')
  //     const zdt6 = ZonedDateTime.from(roundedString)
  //     assert.equal(zdt6.epochNanoseconds - zdt5.epochNanoseconds, 1n)
  //   })
  //   it('options may only be an object or undefined', () => {
  //     ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
  //       assert.throws(() => zdt1.toString(badOptions), TypeError)
  //     )
  //     ;[{}, () => {}, undefined].forEach((options) =>
  //       assert.equal(zdt1.toString(options), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
  //     )
  //   })
  // })
  // describe('ZonedDateTime.toJSON()', () => {
  //   it('does the default toString', () => {
  //     const zdt1 = ZonedDateTime.from('1976-11-18T15:23+01:00[Europe/Vienna]')
  //     const zdt2 = ZonedDateTime.from('1976-11-18T15:23:30+01:00[Europe/Vienna]')
  //     const zdt3 = ZonedDateTime.from('1976-11-18T15:23:30.1234+01:00[Europe/Vienna]')
  //     assert.equal(zdt1.toJSON(), '1976-11-18T15:23:00+01:00[Europe/Vienna]')
  //     assert.equal(zdt2.toJSON(), '1976-11-18T15:23:30+01:00[Europe/Vienna]')
  //     assert.equal(zdt3.toJSON(), '1976-11-18T15:23:30.1234+01:00[Europe/Vienna]')
  //   })
  // })
  // describe("Comparison operators don't work", () => {
  //   const zdt1 = ZonedDateTime.from('1963-02-13T09:36:29.123456789+01:00[Europe/Vienna]')
  //   const zdt1again = ZonedDateTime.from('1963-02-13T09:36:29.123456789+01:00[Europe/Vienna]')
  //   const zdt2 = ZonedDateTime.from('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]')
  //   it('=== is object equality', () => assert.equal(zdt1, zdt1))
  //   it('!== is object equality', () => assert.notequal(zdt1, zdt1again))
  //   it('<', () => assert.throws(() => zdt1 < zdt2))
  //   it('>', () => assert.throws(() => zdt1 > zdt2))
  //   it('<=', () => assert.throws(() => zdt1 <= zdt2))
  //   it('>=', () => assert.throws(() => zdt1 >= zdt2))
  // })

  // describe('ZonedDateTime.toInstant()', () => {
  //   it('recent date', () => {
  //     const zdt = ZonedDateTime.from('2019-10-29T10:46:38.271986102+01:00[Europe/Amsterdam]')
  //     assert.equal(`${zdt.toInstant()}`, '2019-10-29T09:46:38.271986102Z')
  //   })
  //   it('year ≤ 99', () => {
  //     const zdt = ZonedDateTime.from('+000098-10-29T10:46:38.271986102+00:00[UTC]')
  //     assert.equal(`${zdt.toInstant()}`, '+000098-10-29T10:46:38.271986102Z')
  //   })
  //   it('year < 1', () => {
  //     let zdt = ZonedDateTime.from('+000000-10-29T10:46:38.271986102+00:00[UTC]')
  //     assert.equal(`${zdt.toInstant()}`, '+000000-10-29T10:46:38.271986102Z')
  //     zdt = ZonedDateTime.from('-001000-10-29T10:46:38.271986102+00:00[UTC]')
  //     assert.equal(`${zdt.toInstant()}`, '-001000-10-29T10:46:38.271986102Z')
  //   })
  //   it('year 0 leap day', () => {
  //     const zdt = ZonedDateTime.from('+000000-02-29T00:00-00:01:15[Europe/London]')
  //     assert.equal(`${zdt.toInstant()}`, '+000000-02-29T00:01:15Z')
  //   })
  // })
  // describe('ZonedDateTime.toPlainDate()', () => {
  //   it('works', () => {
  //     const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz)
  //     assert.equal(`${zdt.toPlainDate()}`, '2019-10-29')
  //   })
  //   it('preserves the calendar', () => {
  //     const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTime({
  //       timeZone: tz,
  //       calendar: 'gregory'
  //     })
  //     assert.equal(zdt.toPlainDate().calendar.id, 'gregory')
  //   })
  // })
  // describe('ZonedDateTime.toPlainTime()', () => {
  //   it('works', () => {
  //     const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz)
  //     assert.equal(`${zdt.toPlainTime()}`, '02:46:38.271986102')
  //   })
  // })
  // describe('ZonedDateTime.toPlainYearMonth()', () => {
  //   it('works', () => {
  //     const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz)
  //     assert.equal(`${zdt.toPlainYearMonth()}`, '2019-10')
  //   })
  //   it('preserves the calendar', () => {
  //     const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTime({
  //       timeZone: tz,
  //       calendar: 'gregory'
  //     })
  //     assert.equal(zdt.toPlainYearMonth().calendar.id, 'gregory')
  //   })
  // })
  // describe('ZonedDateTime.toPlainMonthDay()', () => {
  //   it('works', () => {
  //     const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTimeISO(tz)
  //     assert.equal(`${zdt.toPlainMonthDay()}`, '10-29')
  //   })
  //   it('preserves the calendar', () => {
  //     const zdt = Temporal.Instant.from('2019-10-29T09:46:38.271986102Z').toZonedDateTime({
  //       timeZone: tz,
  //       calendar: 'gregory'
  //     })
  //     assert.equal(zdt.toPlainMonthDay().calendar.id, 'gregory')
  //   })
  // })

  // describe('ZonedDateTime.getISOFields()', () => {
  //   const zdt1 = ZonedDateTime.from('1976-11-18T15:23:30.123456789+08:00[Asia/Shanghai]')
  //   const fields = zdt1.getISOFields()
  //   it('fields', () => {
  //     assert.equal(fields.isoYear, 1976)
  //     assert.equal(fields.isoMonth, 11)
  //     assert.equal(fields.isoDay, 18)
  //     assert.equal(fields.isoHour, 15)
  //     assert.equal(fields.isoMinute, 23)
  //     assert.equal(fields.isoSecond, 30)
  //     assert.equal(fields.isoMillisecond, 123)
  //     assert.equal(fields.isoMicrosecond, 456)
  //     assert.equal(fields.isoNanosecond, 789)
  //     assert.equal(fields.offset, '+08:00')
  //     assert.equal(fields.timeZone.id, 'Asia/Shanghai')
  //     assert.equal(fields.calendar.id, 'iso8601')
  //   })
  //   it('enumerable', () => {
  //     const fields2 = { ...fields }
  //     assert.equal(fields2.isoYear, 1976)
  //     assert.equal(fields2.isoMonth, 11)
  //     assert.equal(fields2.isoDay, 18)
  //     assert.equal(fields2.isoHour, 15)
  //     assert.equal(fields2.isoMinute, 23)
  //     assert.equal(fields2.isoSecond, 30)
  //     assert.equal(fields2.isoMillisecond, 123)
  //     assert.equal(fields2.isoMicrosecond, 456)
  //     assert.equal(fields2.isoNanosecond, 789)
  //     assert.equal(fields2.offset, '+08:00')
  //     assert.equal(fields2.timeZone, fields.timeZone)
  //     assert.equal(fields2.calendar, fields.calendar)
  //   })
  // })

  // const hourBeforeDstStart = new Temporal.PlainDateTime(2020, 3, 8, 1).toZonedDateTime(tz)
  // const dayBeforeDstStart = new Temporal.PlainDateTime(2020, 3, 7, 2, 30).toZonedDateTime(tz)
  // describe('properties around DST', () => {
  //   it('hoursInDay works with DST start', () => {
  //     assert.equal(hourBeforeDstStart.hoursInDay, 23)
  //   })
  //   it('hoursInDay works with non-DST days', () => {
  //     assert.equal(dayBeforeDstStart.hoursInDay, 24)
  //   })
  //   it('hoursInDay works with DST end', () => {
  //     const dstEnd = ZonedDateTime.from('2020-11-01T01:00-08:00[America/Los_Angeles]')
  //     assert.equal(dstEnd.hoursInDay, 25)
  //   })
  //   it('hoursInDay works with non-hour DST change', () => {
  //     const zdt1 = ZonedDateTime.from('2020-10-04T12:00[Australia/Lord_Howe]')
  //     assert.equal(zdt1.hoursInDay, 23.5)
  //     const zdt2 = ZonedDateTime.from('2020-04-05T12:00[Australia/Lord_Howe]')
  //     assert.equal(zdt2.hoursInDay, 24.5)
  //   })
  //   it('hoursInDay works with non-half-hour DST change', () => {
  //     const zdt = ZonedDateTime.from('1933-01-01T12:00[Asia/Singapore]')
  //     assert(Math.abs(zdt.hoursInDay - 23.6666666666666666) < Number.EPSILON)
  //   })
  //   it('hoursInDay works when day starts at 1:00 due to DST start at midnight', () => {
  //     const zdt = ZonedDateTime.from('2015-10-18T12:00:00-02:00[America/Sao_Paulo]')
  //     assert.equal(zdt.hoursInDay, 23)
  //   })
  //   it('startOfDay works', () => {
  //     const start = dayBeforeDstStart.startOfDay()
  //     assert.equal(`${start.toPlainDate()}`, `${dayBeforeDstStart.toPlainDate()}`)
  //     assert.equal(`${start.toPlainTime()}`, '00:00:00')
  //   })
  //   it('startOfDay works when day starts at 1:00 due to DST start at midnight', () => {
  //     const zdt = ZonedDateTime.from('2015-10-18T12:00:00-02:00[America/Sao_Paulo]')
  //     assert.equal(`${zdt.startOfDay().toPlainTime()}`, '01:00:00')
  //   })

  //   const dayAfterSamoaDateLineChange = ZonedDateTime.from('2011-12-31T22:00+14:00[Pacific/Apia]')
  //   const dayBeforeSamoaDateLineChange = ZonedDateTime.from('2011-12-29T22:00-10:00[Pacific/Apia]')
  //   it('startOfDay works after Samoa date line change', () => {
  //     const start = dayAfterSamoaDateLineChange.startOfDay()
  //     assert.equal(`${start.toPlainTime()}`, '00:00:00')
  //   })
  //   it('hoursInDay works after Samoa date line change', () => {
  //     assert.equal(dayAfterSamoaDateLineChange.hoursInDay, 24)
  //   })
  //   it('hoursInDay works before Samoa date line change', () => {
  //     assert.equal(dayBeforeSamoaDateLineChange.hoursInDay, 24)
  //   })
  // })

  // describe('math around DST', () => {
  //   it('add 1 hour to get to DST start', () => {
  //     const added = hourBeforeDstStart.add({ hours: 1 })
  //     assert.equal(added.hour, 3)
  //     const diff = hourBeforeDstStart.until(added, { largestUnit: 'hours' })
  //     assert.equal(`${diff}`, 'PT1H')
  //     assert.equal(`${diff}`, `${added.since(hourBeforeDstStart, { largestUnit: 'hours' })}`)
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${hourBeforeDstStart}`)
  //   })

  //   it('add 2 hours to get to DST start +1', () => {
  //     const added = hourBeforeDstStart.add({ hours: 2 })
  //     assert.equal(added.hour, 4)
  //     const diff = hourBeforeDstStart.until(added, { largestUnit: 'hours' })
  //     assert.equal(`${diff}`, 'PT2H')
  //     assert.equal(`${diff}`, `${added.since(hourBeforeDstStart, { largestUnit: 'hours' })}`)
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${hourBeforeDstStart}`)
  //   })

  //   it('add 1.5 hours to get to 0.5 hours after DST start', () => {
  //     const added = hourBeforeDstStart.add({ hours: 1, minutes: 30 })
  //     assert.equal(added.hour, 3)
  //     assert.equal(added.minute, 30)
  //     const diff = hourBeforeDstStart.until(added, { largestUnit: 'hours' })
  //     assert.equal(`${diff}`, 'PT1H30M')
  //     assert.equal(`${diff}`, `${added.since(hourBeforeDstStart, { largestUnit: 'hours' })}`)
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${hourBeforeDstStart}`)
  //   })

  //   it('Samoa date line change (add): 10:00PM 29 Dec 2011 -> 11:00PM 31 Dec 2011', () => {
  //     const timeZone = Temporal.TimeZone.from('Pacific/Apia')
  //     const dayBeforeSamoaDateLineChangeAbs = timeZone.getInstantFor(new Temporal.PlainDateTime(2011, 12, 29, 22))
  //     const start = dayBeforeSamoaDateLineChangeAbs.toZonedDateTimeISO(timeZone)
  //     const added = start.add({ days: 1, hours: 1 })
  //     assert.equal(added.day, 31)
  //     assert.equal(added.hour, 23)
  //     assert.equal(added.minute, 0)
  //     const diff = start.until(added, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P2DT1H')
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${start}`)
  //   })

  //   it('Samoa date line change (subtract): 11:00PM 31 Dec 2011 -> 10:00PM 29 Dec 2011', () => {
  //     const timeZone = Temporal.TimeZone.from('Pacific/Apia')
  //     const dayAfterSamoaDateLineChangeAbs = timeZone.getInstantFor(new Temporal.PlainDateTime(2011, 12, 31, 23))
  //     const start = dayAfterSamoaDateLineChangeAbs.toZonedDateTimeISO(timeZone)
  //     const skipped = start.subtract({ days: 1, hours: 1 })
  //     assert.equal(skipped.day, 31)
  //     assert.equal(skipped.hour, 22)
  //     assert.equal(skipped.minute, 0)
  //     const end = start.subtract({ days: 2, hours: 1 })
  //     assert.equal(end.day, 29)
  //     assert.equal(end.hour, 22)
  //     assert.equal(end.minute, 0)
  //     const diff = end.since(start, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, '-P2DT1H')
  //     const undo = start.add(diff)
  //     assert.equal(`${undo}`, `${end}`)
  //   })

  //   it('3:30 day before DST start -> 3:30 day of DST start', () => {
  //     const start = dayBeforeDstStart.add({ hours: 1 }) // 3:30AM
  //     const added = start.add({ days: 1 })
  //     assert.equal(added.day, 8)
  //     assert.equal(added.hour, 3)
  //     assert.equal(added.minute, 30)
  //     const diff = start.until(added, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P1D')
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${start}`)
  //   })

  //   it('2:30 day before DST start -> 3:30 day of DST start', () => {
  //     const added = dayBeforeDstStart.add({ days: 1 })
  //     assert.equal(added.day, 8)
  //     assert.equal(added.hour, 3)
  //     assert.equal(added.minute, 30)
  //     const diff = dayBeforeDstStart.until(added, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P1D')
  //     const undo = dayBeforeDstStart.add(diff)
  //     assert.equal(`${undo}`, `${added}`)
  //   })

  //   it('1:30 day DST starts -> 4:30 day DST starts', () => {
  //     const start = dayBeforeDstStart.add({ hours: 23 }) // 1:30AM
  //     const added = start.add({ hours: 2 })
  //     assert.equal(added.day, 8)
  //     assert.equal(added.hour, 4)
  //     assert.equal(added.minute, 30)
  //     const diff = start.until(added, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'PT2H')
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${start}`)
  //   })

  //   it('2:00 day before DST starts -> 3:00 day DST starts', () => {
  //     const start = hourBeforeDstStart.subtract({ days: 1 }).add({ hours: 1 }) // 2:00AM
  //     const added = start.add({ days: 1 })
  //     assert.equal(added.day, 8)
  //     assert.equal(added.hour, 3)
  //     assert.equal(added.minute, 0)
  //     const diff = start.until(added, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P1D')
  //     const undo = start.add(diff)
  //     assert.equal(`${undo}`, `${added}`)
  //   })

  //   it('1:00AM day DST starts -> (add 24 hours) -> 2:00AM day after DST starts', () => {
  //     const start = hourBeforeDstStart // 1:00AM
  //     const added = start.add({ hours: 24 })
  //     assert.equal(added.day, 9)
  //     assert.equal(added.hour, 2)
  //     assert.equal(added.minute, 0)
  //     const diff = start.until(added, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P1DT1H')
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${start}`)
  //   })

  //   it('12:00AM day DST starts -> (add 24 hours) -> 1:00AM day after DST starts', () => {
  //     const start = hourBeforeDstStart.subtract({ hours: 1 }) // 1:00AM
  //     const added = start.add({ hours: 24 })
  //     assert.equal(added.day, 9)
  //     assert.equal(added.hour, 1)
  //     assert.equal(added.minute, 0)
  //     const diff = start.until(added, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P1DT1H')
  //     const undo = added.subtract(diff)
  //     assert.equal(`${undo}`, `${start}`)
  //   })

  //   it('Difference can return day length > 24 hours', () => {
  //     const start = ZonedDateTime.from('2020-10-30T01:45-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-11-02T01:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P2DT24H30M')
  //     const undo = start.add(diff)
  //     assert.equal(`${undo}`, `${end}`)
  //   })

  //   it('Difference rounding (nearest day) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { smallestUnit: 'days', roundingMode: 'halfExpand' })
  //     assert.equal(`${diff}`, '-P3D')
  //   })

  //   it('Difference rounding (ceil day) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { smallestUnit: 'days', roundingMode: 'ceil' })
  //     assert.equal(`${diff}`, '-P2D')
  //   })

  //   it('Difference rounding (trunc day) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { smallestUnit: 'days', roundingMode: 'trunc' })
  //     assert.equal(`${diff}`, '-P2D')
  //   })

  //   it('Difference rounding (floor day) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { smallestUnit: 'days', roundingMode: 'floor' })
  //     assert.equal(`${diff}`, '-P3D')
  //   })

  //   it('Difference rounding (nearest hour) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'halfExpand' })
  //     assert.equal(`${diff}`, '-P2DT12H')
  //   })

  //   it('Difference rounding (ceil hour) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'ceil' })
  //     assert.equal(`${diff}`, '-P2DT12H')
  //   })

  //   it('Difference rounding (trunc hour) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'trunc' })
  //     assert.equal(`${diff}`, '-P2DT12H')
  //   })

  //   it('Difference rounding (floor hour) is DST-aware', () => {
  //     const start = ZonedDateTime.from('2020-03-10T02:30-07:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-07T14:15-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'floor' })
  //     assert.equal(`${diff}`, '-P2DT13H')
  //   })

  //   it('Difference when date portion ends inside a DST-skipped period', () => {
  //     const start = ZonedDateTime.from('2020-03-07T02:30-08:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-03-08T03:15-07:00[America/Los_Angeles]')
  //     const diff = start.until(end, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'PT23H45M')
  //   })

  //   it("Difference when date portion ends inside day skipped by Samoa's 24hr 2011 transition", () => {
  //     const end = ZonedDateTime.from('2011-12-31T05:00+14:00[Pacific/Apia]')
  //     const start = ZonedDateTime.from('2011-12-28T10:00-10:00[Pacific/Apia]')
  //     const diff = start.until(end, { largestUnit: 'days' })
  //     assert.equal(`${diff}`, 'P1DT19H')
  //   })

  //   it('Rounding up to hours causes one more day of overflow (positive)', () => {
  //     const start = ZonedDateTime.from('2020-01-01T00:00-08:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-01-03T23:59-08:00[America/Los_Angeles]')
  //     const diff = start.until(end, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'halfExpand' })
  //     assert.equal(`${diff}`, 'P3D')
  //   })

  //   it('Rounding up to hours causes one more day of overflow (negative)', () => {
  //     const start = ZonedDateTime.from('2020-01-01T00:00-08:00[America/Los_Angeles]')
  //     const end = ZonedDateTime.from('2020-01-03T23:59-08:00[America/Los_Angeles]')
  //     const diff = end.until(start, { largestUnit: 'days', smallestUnit: 'hours', roundingMode: 'halfExpand' })
  //     assert.equal(`${diff}`, '-P3D')
  //   })

  //   it('addition and difference work near DST start', () => {
  //     // Test the difference between different distances near DST start
  //     const stepsPerHour = 2
  //     const minutesPerStep = 60 / stepsPerHour
  //     const hoursUntilEnd = 26
  //     const startHourRange = 3
  //     for (let i = 0; i < startHourRange * stepsPerHour; i++) {
  //       const start = hourBeforeDstStart.add({ minutes: minutesPerStep * i })
  //       for (let j = 0; j < hoursUntilEnd * stepsPerHour; j++) {
  //         const end = start.add({ minutes: j * minutesPerStep })
  //         const diff = start.until(end, { largestUnit: 'days' })
  //         const expectedMinutes = minutesPerStep * (j % stepsPerHour)
  //         assert.equal(diff.minutes, expectedMinutes)
  //         const diff60 = Math.floor(j / stepsPerHour)
  //         if (i >= stepsPerHour) {
  //           // DST transition already happened
  //           const expectedDays = diff60 < 24 ? 0 : diff60 < 48 ? 1 : 2
  //           const expectedHours = diff60 < 24 ? diff60 : diff60 < 48 ? diff60 - 24 : diff60 - 48
  //           assert.equal(diff.hours, expectedHours)
  //           assert.equal(diff.days, expectedDays)
  //         } else {
  //           // DST transition hasn't happened yet
  //           const expectedDays = diff60 < 23 ? 0 : diff60 < 47 ? 1 : 2
  //           const expectedHours = diff60 < 23 ? diff60 : diff60 < 47 ? diff60 - 23 : diff60 - 47
  //           assert.equal(diff.hours, expectedHours)
  //           assert.equal(diff.days, expectedDays)
  //         }
  //       }
  //     }
  //   })
  // })

  // describe('math order of operations and options', () => {
  //   const breakoutUnits = (op, zdt, d, options) =>
  //     zdt[op]({ years: d.years }, options)
  //       [op]({ months: d.months }, options)
  //       [op]({ weeks: d.weeks }, options)
  //       [op]({ days: d.days }, options)
  //       [op](
  //         {
  //           hours: d.hours,
  //           minutes: d.minutes,
  //           seconds: d.seconds,
  //           milliseconds: d.milliseconds,
  //           microseconds: d.microseconds,
  //           nanoseconds: d.nanoseconds
  //         },

  //         options
  //       )

  //   it('order of operations: add / none', () => {
  //     const zdt = ZonedDateTime.from('2020-01-31T00:00-08:00[America/Los_Angeles]')
  //     const d = Temporal.Duration.from({ months: 1, days: 1 })
  //     const options = undefined
  //     const result = zdt.add(d, options)
  //     assert.equal(result.toString(), '2020-03-01T00:00:00-08:00[America/Los_Angeles]')
  //     assert.equal(breakoutUnits('add', zdt, d, options).toString(), result.toString())
  //   })
  //   it('order of operations: add / constrain', () => {
  //     const zdt = ZonedDateTime.from('2020-01-31T00:00-08:00[America/Los_Angeles]')
  //     const d = Temporal.Duration.from({ months: 1, days: 1 })
  //     const options = { overflow: 'constrain' }
  //     const result = zdt.add(d, options)
  //     assert.equal(result.toString(), '2020-03-01T00:00:00-08:00[America/Los_Angeles]')
  //     assert.equal(breakoutUnits('add', zdt, d, options).toString(), result.toString())
  //   })
  //   it('order of operations: add / reject', () => {
  //     const zdt = ZonedDateTime.from('2020-01-31T00:00-08:00[America/Los_Angeles]')
  //     const d = Temporal.Duration.from({ months: 1, days: 1 })
  //     const options = { overflow: 'reject' }
  //     assert.throws(() => zdt.add(d, options), RangeError)
  //   })
  //   it('order of operations: subtract / none', () => {
  //     const zdt = ZonedDateTime.from('2020-03-31T00:00-07:00[America/Los_Angeles]')
  //     const d = Temporal.Duration.from({ months: 1, days: 1 })
  //     const options = undefined
  //     const result = zdt.subtract(d, options)
  //     assert.equal(result.toString(), '2020-02-28T00:00:00-08:00[America/Los_Angeles]')
  //     assert.equal(breakoutUnits('subtract', zdt, d, options).toString(), result.toString())
  //   })
  //   it('order of operations: subtract / constrain', () => {
  //     const zdt = ZonedDateTime.from('2020-03-31T00:00-07:00[America/Los_Angeles]')
  //     const d = Temporal.Duration.from({ months: 1, days: 1 })
  //     const options = { overflow: 'constrain' }
  //     const result = zdt.subtract(d, options)
  //     assert.equal(result.toString(), '2020-02-28T00:00:00-08:00[America/Los_Angeles]')
  //     assert.equal(breakoutUnits('subtract', zdt, d, options).toString(), result.toString())
  //   })
  //   it('order of operations: subtract / reject', () => {
  //     const zdt = ZonedDateTime.from('2020-03-31T00:00-07:00[America/Los_Angeles]')
  //     const d = Temporal.Duration.from({ months: 1, days: 1 })
  //     const options = { overflow: 'reject' }
  //     assert.throws(() => zdt.subtract(d, options), RangeError)
  //   })
  // })

  // describe('ZonedDateTime.compare()', () => {
  //   const zdt1 = ZonedDateTime.from('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]')
  //   const zdt2 = ZonedDateTime.from('2019-10-29T10:46:38.271986102+01:00[Europe/Vienna]')
  //   it('equal', () => assert.equal(ZonedDateTime.compare(zdt1, zdt1), 0))
  //   it('smaller/larger', () => assert.equal(ZonedDateTime.compare(zdt1, zdt2), -1))
  //   it('larger/smaller', () => assert.equal(ZonedDateTime.compare(zdt2, zdt1), 1))
  //   it('casts first argument', () => {
  //     assert.equal(ZonedDateTime.compare({ year: 1976, month: 11, day: 18, hour: 15, timeZone: 'Europe/Vienna' }, zdt2), -1)
  //     assert.equal(ZonedDateTime.compare('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]', zdt2), -1)
  //   })
  //   it('casts second argument', () => {
  //     assert.equal(ZonedDateTime.compare(zdt1, { year: 2019, month: 10, day: 29, hour: 10, timeZone: 'Europe/Vienna' }), -1)
  //     assert.equal(ZonedDateTime.compare(zdt1, '2019-10-29T10:46:38.271986102+01:00[Europe/Vienna]'), -1)
  //   })
  //   it('object must contain at least the required properties', () => {
  //     assert.equal(ZonedDateTime.compare({ year: 1976, month: 11, day: 18, timeZone: 'Europe/Vienna' }, zdt2), -1)
  //     assert.throws(() => ZonedDateTime.compare({ month: 11, day: 18, timeZone: 'Europe/Vienna' }, zdt2), TypeError)
  //     assert.throws(() => ZonedDateTime.compare({ year: 1976, day: 18, timeZone: 'Europe/Vienna' }, zdt2), TypeError)
  //     assert.throws(() => ZonedDateTime.compare({ year: 1976, month: 11, timeZone: 'Europe/Vienna' }, zdt2), TypeError)
  //     assert.throws(() => ZonedDateTime.compare({ year: 1976, month: 11, day: 18 }, zdt2), TypeError)
  //     assert.throws(
  //       () => ZonedDateTime.compare({ years: 1976, months: 11, days: 19, hours: 15, timeZone: 'Europe/Vienna' }, zdt2),
  //       TypeError
  //     )
  //     assert.equal(ZonedDateTime.compare(zdt1, { year: 2019, month: 10, day: 29, timeZone: 'Europe/Vienna' }), -1)
  //     assert.throws(() => ZonedDateTime.compare(zdt1, { month: 10, day: 29, timeZone: 'Europe/Vienna' }), TypeError)
  //     assert.throws(() => ZonedDateTime.compare(zdt1, { year: 2019, day: 29, timeZone: 'Europe/Vienna' }), TypeError)
  //     assert.throws(() => ZonedDateTime.compare(zdt1, { year: 2019, month: 10, timeZone: 'Europe/Vienna' }), TypeError)
  //     assert.throws(() => ZonedDateTime.compare(zdt1, { year: 2019, month: 10, day: 29 }), TypeError)
  //     assert.throws(
  //       () => ZonedDateTime.compare(zdt1, { years: 2019, months: 10, days: 29, hours: 10, timeZone: 'Europe/Vienna' }),
  //       TypeError
  //     )
  //   })
  //   it('disregards time zone IDs if exact times are equal', () => {
  //     assert.equal(ZonedDateTime.compare(zdt1, zdt1.withTimeZone('Asia/Kolkata')), 0)
  //   })
  //   it('disregards calendar IDs if exact times and time zones are equal', () => {
  //     assert.equal(ZonedDateTime.compare(zdt1, zdt1.withCalendar('japanese')), 0)
  //   })
  //   it('compares exact time, not clock time', () => {
  //     const clockBefore = ZonedDateTime.from('1999-12-31T23:30-08:00[America/Vancouver]')
  //     const clockAfter = ZonedDateTime.from('2000-01-01T01:30-04:00[America/Halifax]')
  //     assert.equal(ZonedDateTime.compare(clockBefore, clockAfter), 1)
  //     assert.equal(Temporal.PlainDateTime.compare(clockBefore.toPlainDateTime(), clockAfter.toPlainDateTime()), -1)
  //   })
  // })
})
