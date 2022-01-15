import {
  AssertIsDuration,
  TemporalOverflow,
  TemporalPluralUnit,
  TemporalRoundingMode,
  TemporalSingularUnit,
  ToSmallestTemporalUnit
} from './ecmascript'
import { dateTimeFns, timeFns, dateFns, durationFns, zonedDateTimeFns } from './index'
import { Iso } from 'iso-types'

import { describe, it } from 'beartest-js'
import { strict as assert } from 'assert'

describe('dateTimeFns', () => {
  describe('isValid', () => {
    it('allows minute precision', () => {
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30'))
    })

    it('allows second precision', () => {
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:01'))
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:00'))
    })

    it('allows 100ms precision', () => {
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:01.1'))
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:00.0'))
    })

    it('allows 10ms precision', () => {
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:01.01'))
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:00.00'))
    })
    it('allows 1ms precision', () => {
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:01.001'))
      assert.ok(dateTimeFns.isValid('2020-01-01T12:30:00.000'))
    })
    it('does not allow invalid', () => {
      assert.ok(!dateTimeFns.isValid('2020-01-01T00:00:1'))
      assert.ok(!dateTimeFns.isValid('2020-01-01T00:00:01.1111'))
      assert.ok(!dateTimeFns.isValid('test'))
    })
  })
})

describe('dateTimeFns', () => {
  describe('Construction', () => {
    describe('fromNumbers(year, month, day, hour, minute, second, millisecond)', () => {
      let datetime: Iso.DateTime
      it('datetime can be constructed', () => {
        datetime = dateTimeFns.fromNumbers(1976, 11, 18, 15, 23, 30, 123)
        assert(datetime)
        assert.equal(typeof datetime, 'string')
      })
      it('datetime.year is 1976', () => assert.equal(dateTimeFns.getYear(datetime), 1976))
      it('datetime.month is 11', () => assert.equal(dateTimeFns.getMonth(datetime), 11))
      it('datetime.day is 18', () => assert.equal(dateTimeFns.getDay(datetime), 18))
      it('datetime.hour is 15', () => assert.equal(dateTimeFns.getHour(datetime), 15))
      it('datetime.minute is 23', () => assert.equal(dateTimeFns.getMinute(datetime), 23))
      it('datetime.second is 30', () => assert.equal(dateTimeFns.getSecond(datetime), 30))
      it('datetime.millisecond is 123', () => assert.equal(dateTimeFns.getMillisecond(datetime), 123))
      it('datetime.dayOfWeek is 4', () => assert.equal(dateTimeFns.getDayOfWeek(datetime), 4))
      it('datetime.dayOfYear is 323', () => assert.equal(dateTimeFns.getDayOfYear(datetime), 323))
      it('datetime.weekOfYear is 47', () => assert.equal(dateTimeFns.getWeekOfYear(datetime), 47))
      it('`${datetime}` is 1976-11-18T15:23:30.123', () => assert.equal(`${datetime}`, '1976-11-18T15:23:30.123'))
    })
    describe('fromNumbers(year, month, day, hour, minute, second)', () => {
      let datetime: Iso.DateTime
      it('datetime can be constructed', () => {
        datetime = dateTimeFns.fromNumbers(1976, 11, 18, 15, 23, 30)
        assert(datetime)
        assert.equal(typeof datetime, 'string')
      })
      it('datetime.year is 1976', () => assert.equal(dateTimeFns.getYear(datetime), 1976))
      it('datetime.month is 11', () => assert.equal(dateTimeFns.getMonth(datetime), 11))
      it('datetime.day is 18', () => assert.equal(dateTimeFns.getDay(datetime), 18))
      it('datetime.hour is 15', () => assert.equal(dateTimeFns.getHour(datetime), 15))
      it('datetime.minute is 23', () => assert.equal(dateTimeFns.getMinute(datetime), 23))
      it('datetime.second is 30', () => assert.equal(dateTimeFns.getSecond(datetime), 30))
      it('datetime.millisecond is 0', () => assert.equal(dateTimeFns.getMillisecond(datetime), 0))
      it('datetime.dayOfWeek is 4', () => assert.equal(dateTimeFns.getDayOfWeek(datetime), 4))
      it('datetime.dayOfYear is 323', () => assert.equal(dateTimeFns.getDayOfYear(datetime), 323))
      it('datetime.weekOfYear is 47', () => assert.equal(dateTimeFns.getWeekOfYear(datetime), 47))
      it('`${datetime}` is 1976-11-18T15:23:30', () => assert.equal(`${datetime}`, '1976-11-18T15:23:30'))
    })
    describe('fromNumbers(year, month, day, hour, minute)', () => {
      let datetime: Iso.DateTime
      it('datetime can be constructed', () => {
        datetime = dateTimeFns.fromNumbers(1976, 11, 18, 15, 23)
        assert(datetime)
        assert.equal(typeof datetime, 'string')
      })
      it('datetime.year is 1976', () => assert.equal(dateTimeFns.getYear(datetime), 1976))
      it('datetime.month is 11', () => assert.equal(dateTimeFns.getMonth(datetime), 11))
      it('datetime.day is 18', () => assert.equal(dateTimeFns.getDay(datetime), 18))
      it('datetime.hour is 15', () => assert.equal(dateTimeFns.getHour(datetime), 15))
      it('datetime.minute is 23', () => assert.equal(dateTimeFns.getMinute(datetime), 23))
      it('datetime.second is 0', () => assert.equal(dateTimeFns.getSecond(datetime), 0))
      it('datetime.millisecond is 0', () => assert.equal(dateTimeFns.getMillisecond(datetime), 0))
      it('datetime.dayOfWeek is 4', () => assert.equal(dateTimeFns.getDayOfWeek(datetime), 4))
      it('datetime.dayOfYear is 323', () => assert.equal(dateTimeFns.getDayOfYear(datetime), 323))
      it('datetime.weekOfYear is 47', () => assert.equal(dateTimeFns.getWeekOfYear(datetime), 47))
      it('`${datetime}` is 1976-11-18T15:23', () => assert.equal(`${datetime}`, '1976-11-18T15:23'))
    })
    describe('fromNumbers(year, month, day, hour)', () => {
      const datetime = dateTimeFns.fromNumbers(1976, 11, 18, 15)
      it('`${datetime}` is 1976-11-18T15', () => assert.equal(`${datetime}`, '1976-11-18T15:00'))
    })
    describe('fromNumbers(year, month, day)', () => {
      const datetime = dateTimeFns.fromNumbers(1976, 11, 18)
      it('`${datetime}` is 1976-11-18', () => assert.equal(`${datetime}`, '1976-11-18T00:00'))
    })
    describe('fromNumbers() treats -0 as 0', () => {
      it('ignores the sign of -0', () => {
        const datetime = dateTimeFns.fromNumbers(1976, 11, 18, -0, -0, -0, -0)
        assert.equal(dateTimeFns.getHour(datetime), 0)
        assert.equal(dateTimeFns.getMinute(datetime), 0)
        assert.equal(dateTimeFns.getSecond(datetime), 0)
        assert.equal(dateTimeFns.getMillisecond(datetime), 0)
      })
    })
  })
  describe('with()', () => {
    const datetime = dateTimeFns.fromNumbers(1976, 11, 18, 15, 23, 30, 123)
    it('datetime.with({ year: 2019 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { year: 2019 })}`, '2019-11-18T15:23:30.123')
    })
    it('datetime.with({ month: 5 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { month: 5 })}`, '1976-05-18T15:23:30.123')
    })
    it('datetime.with({ day: 5 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { day: 5 })}`, '1976-11-05T15:23:30.123')
    })
    it('datetime.with({ hour: 5 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { hour: 5 })}`, '1976-11-18T05:23:30.123')
    })
    it('datetime.with({ minute: 5 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { minute: 5 })}`, '1976-11-18T15:05:30.123')
    })
    it('datetime.with({ second: 5 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { second: 5 })}`, '1976-11-18T15:23:05.123')
    })
    it('datetime.with({ millisecond: 5 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { millisecond: 5 })}`, '1976-11-18T15:23:30.005')
    })
    it('datetime.with({ month: 5, second: 15 } works', () => {
      assert.equal(`${dateTimeFns.with(datetime, { month: 5, second: 15 })}`, '1976-05-18T15:23:15.123')
    })
    it('invalid overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.with(datetime, { day: 5 }, { overflow }), RangeError)
      )
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.with(datetime, { day: 5 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        assert.equal(`${dateTimeFns.with(datetime, { day: 5 }, options)}`, '1976-11-05T15:23:30.123')
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => dateTimeFns.with(datetime, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.with(datetime, { months: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${dateTimeFns.with(datetime, { month: 12, days: 15 })}`, '1976-12-18T15:23:30.123')
    })
    it('datetime.with(string) throws', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.with(datetime, '12:00'), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.with(datetime, '1995-04-07'), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.with(datetime, '2019-05-17T12:34:56.007'), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.with(datetime, '2019-05-17T12:34:56.007Z'), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.with(datetime, '42'), TypeError)
    })
    it('throws with timeZone property', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.with(datetime, { year: 2021, timeZone: 'UTC' }), TypeError)
    })
  })
  describe('.withPlainTime manipulation', () => {
    const dt = dateTimeFns.from('2015-12-07T03:24:30.000')
    it('datetime.withPlainTime({ hour: 10 }) works', () => {
      assert.equal(`${dateTimeFns.withTime(dt, timeFns.from({ hour: 10 }))}`, '2015-12-07T10:00')
    })
    it('datetime.withPlainTime(time) works', () => {
      const time = timeFns.from('11:22')
      assert.equal(`${dateTimeFns.withTime(dt, time)}`, '2015-12-07T11:22')
    })
    it("datetime.withPlainTime('12:34') works", () => {
      assert.equal(`${dateTimeFns.withTime(dt, '12:34')}`, '2015-12-07T12:34')
    })
    it('datetime.withPlainTime() defaults to midnight', () => {
      assert.equal(`${dateTimeFns.withTime(dt)}`, '2015-12-07T00:00')
    })
    it('object must contain at least one correctly-spelled property', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.withTime(dt, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.withTime(dt, { minutes: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${dateTimeFns.withTime(dt, { hour: 10, seconds: 123 })}`, '2015-12-07T10:00')
    })
  })
  describe('.withPlainDate manipulation', () => {
    const dt = dateTimeFns.from('1995-12-07T03:24:30.000')
    it('datetime.withPlainDate({ year: 2000, month: 6, day: 1 }) works', () => {
      assert.equal(`${dateTimeFns.withDate(dt, dateFns.from({ year: 2000, month: 6, day: 1 }))}`, '2000-06-01T03:24:30')
    })
    it('datetime.withPlainDate(plainDate) works', () => {
      const date = dateFns.from('2020-01-23')
      assert.equal(`${dateTimeFns.withDate(dt, date)}`, '2020-01-23T03:24:30')
    })
    it("datetime.withPlainDate('2018-09-15') works", () => {
      assert.equal(`${dateTimeFns.withDate(dt, '2018-09-15')}`, '2018-09-15T03:24:30')
    })
    it('object must contain at least one correctly-spelled property', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.withDate(dt, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.withDate(dt, { months: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(
        `${dateTimeFns.withDate(dt, dateFns.from({ year: 2000, month: 6, day: 1, months: 123 }))}`,
        '2000-06-01T03:24:30'
      )
    })
  })
  describe('compare()', () => {
    const dt1 = dateTimeFns.from('1976-11-18T15:23:30.123')
    const dt2 = dateTimeFns.from('2019-10-29T10:46:38.271')
    it('equal', () => assert.equal(dateTimeFns.compare(dt1, dt1), 0))
    it('smaller, larger', () => assert.equal(dateTimeFns.compare(dt1, dt2), -1))
    it('larger, smaller', () => assert.equal(dateTimeFns.compare(dt2, dt1), 1))
  })
  describe('equals()', () => {
    const dt1 = dateTimeFns.from('1976-11-18T15:23:30.123')
    const dt2 = dateTimeFns.from('2019-10-29T10:46:38.271')
    it('equal', () => assert(dateTimeFns.equals(dt1, dt1)))
    it('unequal', () => assert(!dateTimeFns.equals(dt1, dt2)))
  })
  describe('date/time maths', () => {
    const earlier = dateTimeFns.from('1976-11-18T15:23:30.123')
    const later = dateTimeFns.from('2019-10-29T10:46:38.271')
    const diff = dateTimeFns.until(earlier, later)
    it('dateTimeFns.since(earlier, later) = durationFns.negated(diff)', () =>
      assert.equal(dateTimeFns.since(earlier, later), durationFns.negated(diff)))
    it('dateTimeFns.until(earlier, later) = diff', () => assert.equal(dateTimeFns.until(earlier, later), diff))
    it('dateTimeFns.add(earlier, diff) = later', () => assert(dateTimeFns.equals(dateTimeFns.add(earlier, diff), later)))
    it('dateTimeFns.subtract(later, diff) = earlier', () =>
      assert(dateTimeFns.equals(dateTimeFns.subtract(later, diff), earlier)))
    // #71
    // it('symmetrical with regard to negative durations', () => {
    //   assert(dateTimeFns.equals(dateTimeFns.subtract(earlier, durationFns.negated(diff)), later))
    //   assert(dateTimeFns.equals(dateTimeFns.add(later, durationFns.negated(diff)), earlier))
    // })
  })
  describe('date/time maths: hours overflow', () => {
    it('subtract result', () => {
      const later = dateTimeFns.from('2019-10-29T10:46:38.271')
      const earlier = dateTimeFns.subtract(later, { hours: 12 })
      assert.equal(`${earlier}`, '2019-10-28T22:46:38.271')
    })
    it('add result', () => {
      const earlier = dateTimeFns.from('2020-05-31T23:12:38.271')
      const later = dateTimeFns.add(earlier, { hours: 2 })
      assert.equal(`${later}`, '2020-06-01T01:12:38.271')
    })
    it('symmetrical with regard to negative durations', () => {
      assert.equal(
        `${dateTimeFns.add(dateTimeFns.from('2019-10-29T10:46:38.271'), { hours: -12 })}`,
        '2019-10-28T22:46:38.271'
      )
      assert.equal(
        `${dateTimeFns.add(dateTimeFns.from('2020-05-31T23:12:38.271'), { hours: -2 })}`,
        '2020-05-31T21:12:38.271'
      )
    })
  })
  describe('add() works', () => {
    const jan31 = dateTimeFns.from('2020-01-31T15:00')
    it('constrain when not presented with full precision', () => {
      assert.equal(`${dateTimeFns.add(jan31, { months: 1 })}`, '2020-02-29T15:00')
      assert.equal(`${dateTimeFns.add(jan31, { months: 1 }, { overflow: 'constrain' })}`, '2020-02-29T15:00')
    })
    it('symmetrical with regard to negative durations in the time part', () => {
      assert.equal(`${dateTimeFns.add(jan31, { minutes: -30 })}`, '2020-01-31T14:30')
      assert.equal(`${dateTimeFns.add(jan31, { seconds: -30 })}`, '2020-01-31T14:59:30')
    })
    it('throw when ambiguous result with reject', () => {
      assert.throws(() => dateTimeFns.add(jan31, { months: 1 }, { overflow: 'reject' }), RangeError)
    })
    it('invalid overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.add(dateTimeFns.from('2019-11-18T15:00'), { months: 1 }, { overflow }), RangeError)
      )
    })
    it('mixed positive and negative values always throw', () => {
      ;['constrain', 'reject'].forEach((overflow) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.add(jan31, { hours: 1, minutes: -30 }, { overflow }), RangeError)
      )
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        // @ts-expect-error
        assert.throws(() => dateTimeFns.add(jan31, { years: 1 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        dateTimeFns.equals(dateTimeFns.add(jan31, { years: 1 }, options), '2021-01-31T15:00')
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => dateTimeFns.add(jan31, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.add(jan31, { month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${dateTimeFns.add(jan31, { month: 1, days: 1 })}`, '2020-02-01T15:00')
    })
  })
  describe('subtract() works', () => {
    const mar31 = dateTimeFns.from('2020-03-31T15:00')
    it('constrain when ambiguous result', () => {
      assert.equal(`${dateTimeFns.subtract(mar31, { months: 1 })}`, '2020-02-29T15:00')
      assert.equal(`${dateTimeFns.subtract(mar31, { months: 1 }, { overflow: 'constrain' })}`, '2020-02-29T15:00')
    })
    it('symmetrical with regard to negative durations in the time part', () => {
      assert.equal(`${dateTimeFns.subtract(mar31, { minutes: -30 })}`, '2020-03-31T15:30')
      assert.equal(`${dateTimeFns.subtract(mar31, { seconds: -30 })}`, '2020-03-31T15:00:30')
    })
    it('throw when ambiguous result with reject', () => {
      assert.throws(() => dateTimeFns.subtract(mar31, { months: 1 }, { overflow: 'reject' }), RangeError)
    })
    it('invalid overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        assert.throws(
          //@ts-expect-error
          () => dateTimeFns.subtract(dateTimeFns.from('2019-11-18T15:00'), mar31, { months: 1 }, { overflow }),
          RangeError
        )
      )
    })
    it('mixed positive and negative values always throw', () => {
      ;['constrain', 'reject'].forEach((overflow) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.add(mar31, { hours: 1, minutes: -30 }, { overflow }), RangeError)
      )
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.subtract(mar31, { years: 1 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        assert.equal(`${dateTimeFns.subtract(mar31, { years: 1 }, options)}`, '2019-03-31T15:00')
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => dateTimeFns.subtract(mar31, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.subtract(mar31, { month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${dateTimeFns.subtract(mar31, { month: 1, days: 1 })}`, '2020-03-30T15:00')
    })
  })
  describe('until()', () => {
    const dt = dateTimeFns.from('1976-11-18T15:23:30.123')
    it('dt.until(later) === later.since(dt)', () => {
      const later = dateTimeFns.from({ year: 2016, month: 3, day: 3, hour: 18 })
      assert.equal(`${dateTimeFns.until(dt, later)}`, `${dateTimeFns.since(later, dt)}`)
    })
    const feb20 = dateTimeFns.from('2020-02-01T00:00')
    const feb21 = dateTimeFns.from('2021-02-01T00:00')
    it('defaults to returning days', () => {
      assert.equal(`${dateTimeFns.until(feb20, feb21)}`, 'P366D')
      assert.equal(`${dateTimeFns.until(feb20, feb21, { largestUnit: 'auto' })}`, 'P366D')
      assert.equal(`${dateTimeFns.until(feb20, feb21, { largestUnit: 'days' })}`, 'P366D')
      assert.equal(`${dateTimeFns.until(feb20, dateTimeFns.from('2021-02-01T00:00:01'))}`, 'P366DT1S')
      assert.equal(`${dateTimeFns.until(dateTimeFns.from('2020-02-01T00:00:01'), feb21)}`, 'P365DT23H59M59S')
    })
    it('can return lower or higher units', () => {
      assert.equal(`${dateTimeFns.until(feb20, feb21, { largestUnit: 'years' })}`, 'P1Y')
      assert.equal(`${dateTimeFns.until(feb20, feb21, { largestUnit: 'months' })}`, 'P12M')
      assert.equal(`${dateTimeFns.until(feb20, feb21, { largestUnit: 'hours' })}`, 'PT8784H')
      assert.equal(`${dateTimeFns.until(feb20, feb21, { largestUnit: 'minutes' })}`, 'PT527040M')
      assert.equal(`${dateTimeFns.until(feb20, feb21, { largestUnit: 'seconds' })}`, 'PT31622400S')
    })
    it('can return subseconds', () => {
      const later = dateTimeFns.add(feb20, { milliseconds: 500 })
      const msDiff = dateTimeFns.until(feb20, later, { largestUnit: 'milliseconds', smallestUnit: 'milliseconds' })

      assert.equal(durationFns.getSeconds(msDiff), 0)
      assert.equal(durationFns.getMilliseconds(msDiff), 500)
    })
    it('does not include higher units than necessary', () => {
      const lastFeb20 = dateTimeFns.from('2020-02-29T00:00')
      const lastFeb21 = dateTimeFns.from('2021-02-28T00:00')
      assert.equal(`${dateTimeFns.until(lastFeb20, lastFeb21)}`, 'P365D')
      assert.equal(`${dateTimeFns.until(lastFeb20, lastFeb21, { largestUnit: 'months' })}`, 'P12M')
      assert.equal(`${dateTimeFns.until(lastFeb20, lastFeb21, { largestUnit: 'years' })}`, 'P1Y')
    })
    it('weeks and months are mutually exclusive', () => {
      const laterDateTime = dateTimeFns.add(dt, { days: 42, hours: 3 })
      const weeksDifference = dateTimeFns.until(dt, laterDateTime, { largestUnit: 'weeks' })
      assert.notEqual(durationFns.getWeeks(weeksDifference), 0)
      assert.equal(durationFns.getMonths(weeksDifference), 0)
      const monthsDifference = dateTimeFns.until(dt, laterDateTime, { largestUnit: 'months' })
      assert.equal(durationFns.getWeeks(monthsDifference), 0)
      assert.notEqual(durationFns.getMonths(monthsDifference), 0)
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.until(feb20, feb21, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${dateTimeFns.until(feb20, feb21, options)}`, 'P366D'))
    })
    const earlier = dateTimeFns.from('2019-01-08T08:22:36.123')
    const later = dateTimeFns.from('2021-09-07T12:39:40.987')
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => dateTimeFns.until(earlier, later, { smallestUnit }), RangeError)
      })
    })
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units: TemporalPluralUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx]
          const smallestUnit = units[smallestIdx]
          assert.throws(() => dateTimeFns.until(earlier, later, { largestUnit, smallestUnit }), RangeError)
        }
      }
    })
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y')
      assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M')
      assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W')
    })
    it('throws on invalid roundingMode', () => {
      //@ts-expect-error
      const roundingMode: TemporalRoundingMode = 'ciel'
      assert.throws(() => dateTimeFns.until(earlier, later, { roundingMode }), RangeError)
    })
    const incrementOneNearest: [TemporalPluralUnit, String][] = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      it(`rounds to nearest ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${dateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    const incrementOneCeil: [TemporalPluralUnit, String, String][] = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P140W', '-P139W'],
      ['days', 'P974D', '-P973D'],
      ['hours', 'P973DT5H', '-P973DT4H'],
      ['minutes', 'P973DT4H18M', '-P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S', '-P973DT4H17M4S']
    ]
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      it(`rounds up to ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${dateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneFloor: [TemporalPluralUnit, String, String][] = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P140W'],
      ['days', 'P973D', '-P974D'],
      ['hours', 'P973DT4H', '-P973DT5H'],
      ['minutes', 'P973DT4H17M', '-P973DT4H18M'],
      ['seconds', 'P973DT4H17M4S', '-P973DT4H17M5S']
    ]
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      it(`rounds down to ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${dateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneTrunc: [TemporalPluralUnit, String][] = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M4S']
    ]
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      it(`truncates to ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${dateTimeFns.until(later, earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    it('trunc is the default', () => {
      assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit: 'minutes' })}`, 'P973DT4H17M')
      assert.equal(`${dateTimeFns.until(earlier, later, { smallestUnit: 'seconds' })}`, 'P973DT4H17M4S')
    })
    it('rounds to an increment of hours', () => {
      assert.equal(
        `${dateTimeFns.until(earlier, later, {
          smallestUnit: 'hours',
          roundingIncrement: 3,
          roundingMode: 'halfExpand'
        })}`,
        'P973DT3H'
      )
    })
    it('rounds to an increment of minutes', () => {
      assert.equal(
        `${dateTimeFns.until(earlier, later, {
          smallestUnit: 'minutes',
          roundingIncrement: 30,
          roundingMode: 'halfExpand'
        })}`,
        'P973DT4H30M'
      )
    })
    it('rounds to an increment of seconds', () => {
      assert.equal(
        `${dateTimeFns.until(earlier, later, {
          smallestUnit: 'seconds',
          roundingIncrement: 15,
          roundingMode: 'halfExpand'
        })}`,
        'P973DT4H17M'
      )
    })
    it('rounds to an increment of milliseconds', () => {
      assert.equal(
        `${dateTimeFns.until(earlier, later, {
          smallestUnit: 'milliseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'P973DT4H17M4.86S'
      )
    })
    it('valid hour increments divide into 24', () => {
      let smallestUnit: TemporalPluralUnit = 'hours'
      ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit, roundingIncrement }
        durationFns.assertIsValid(dateTimeFns.until(earlier, later, options))
      })
    })
    let units: TemporalPluralUnit[] = ['minutes', 'seconds']
    units.forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement }
          AssertIsDuration(dateTimeFns.until(earlier, later, options))
        })
      })
    })
    let smallestUnit: TemporalPluralUnit = 'milliseconds'
    it(`valid ${smallestUnit} increments divide into 1000`, () => {
      ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200].forEach((roundingIncrement) => {
        const options = { smallestUnit, roundingIncrement }
        AssertIsDuration(dateTimeFns.until(earlier, later, options))
      })
    })
    it('throws on increments that do not divide evenly into the next highest', () => {
      assert.throws(() => dateTimeFns.until(earlier, later, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError)
      assert.throws(() => dateTimeFns.until(earlier, later, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError)
      assert.throws(() => dateTimeFns.until(earlier, later, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError)
      assert.throws(
        () => dateTimeFns.until(earlier, later, { smallestUnit: 'milliseconds', roundingIncrement: 29 }),
        RangeError
      )
    })
    it('throws on increments that are equal to the next highest', () => {
      assert.throws(() => dateTimeFns.until(earlier, later, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError)
      assert.throws(() => dateTimeFns.until(earlier, later, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError)
      assert.throws(() => dateTimeFns.until(earlier, later, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError)
      assert.throws(
        () => dateTimeFns.until(earlier, later, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
        RangeError
      )
    })
    it('accepts singular units', () => {
      assert.equal(
        `${dateTimeFns.until(earlier, later, { largestUnit: 'year' })}`,
        `${dateTimeFns.until(earlier, later, { largestUnit: 'years' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'year' })}`,
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'years' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { largestUnit: 'month' })}`,
        `${dateTimeFns.until(earlier, later, { largestUnit: 'months' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'month' })}`,
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'months' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { largestUnit: 'day' })}`,
        `${dateTimeFns.until(earlier, later, { largestUnit: 'days' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'day' })}`,
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'days' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { largestUnit: 'hour' })}`,
        `${dateTimeFns.until(earlier, later, { largestUnit: 'hours' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'hour' })}`,
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'hours' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { largestUnit: 'minute' })}`,
        `${dateTimeFns.until(earlier, later, { largestUnit: 'minutes' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'minute' })}`,
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'minutes' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { largestUnit: 'second' })}`,
        `${dateTimeFns.until(earlier, later, { largestUnit: 'seconds' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'second' })}`,
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'seconds' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { largestUnit: 'millisecond' })}`,
        `${dateTimeFns.until(earlier, later, { largestUnit: 'milliseconds' })}`
      )
      assert.equal(
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'millisecond' })}`,
        `${dateTimeFns.until(earlier, later, { smallestUnit: 'milliseconds' })}`
      )
    })
    it('rounds relative to the receiver', () => {
      const dt1 = dateTimeFns.from('2019-01-01')
      const dt2 = dateTimeFns.from('2020-07-02')
      assert.equal(`${dateTimeFns.until(dt1, dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P2Y')
      assert.equal(`${dateTimeFns.until(dt2, dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P1Y')
    })
  })
  describe('since()', () => {
    const dt = dateTimeFns.from('1976-11-18T15:23:30.123')
    it('dateTimeFns.since(dt, earlier) == dateTimeFns.until(earlier, dt)', () => {
      const earlier = dateTimeFns.from({ year: 1966, month: 3, day: 3, hour: 12 })
      const datetime1 = dateTimeFns.since(dt, earlier)
      const datetime2 = dateTimeFns.until(earlier, dt)
      assert.equal(datetime1, datetime2)
    })
    const feb20 = dateTimeFns.from('2020-02-01T00:00')
    const feb21 = dateTimeFns.from('2021-02-01T00:00')
    it('defaults to returning days', () => {
      assert.equal(dateTimeFns.since(feb21, feb20), 'P366D')
      assert.equal(dateTimeFns.since(feb21, feb20, { largestUnit: 'auto' }), 'P366D')
      assert.equal(dateTimeFns.since(feb21, feb20, { largestUnit: 'days' }), 'P366D')
      assert.equal(dateTimeFns.since(dateTimeFns.from('2021-02-01T00:00:01'), feb20), 'P366DT1S')
      assert.equal(dateTimeFns.since(feb21, dateTimeFns.from('2020-02-01T00:00:00.001')), 'P365DT23H59M59.999S')
    })
    it('can return lower or higher units', () => {
      assert.equal(`${dateTimeFns.since(feb21, feb20, { largestUnit: 'years' })}`, 'P1Y')
      assert.equal(`${dateTimeFns.since(feb21, feb20, { largestUnit: 'months' })}`, 'P12M')
      assert.equal(`${dateTimeFns.since(feb21, feb20, { largestUnit: 'hours' })}`, 'PT8784H')
      assert.equal(`${dateTimeFns.since(feb21, feb20, { largestUnit: 'minutes' })}`, 'PT527040M')
      assert.equal(`${dateTimeFns.since(feb21, feb20, { largestUnit: 'seconds' })}`, 'PT31622400S')
    })
    // #70
    // it('can return subseconds', () => {
    //   const later = dateTimeFns.add(feb20, { days: 1, milliseconds: 250 })
    //   const msDiff = dateTimeFns.since(later, feb20, { largestUnit: 'milliseconds' })
    //   assert.equal(durationFns.getSeconds(msDiff), 0)
    //   assert.equal(durationFns.getMilliseconds(msDiff), 86400250)
    // })
    it('does not include higher units than necessary', () => {
      const lastFeb20 = dateTimeFns.from('2020-02-29T00:00')
      const lastFeb21 = dateTimeFns.from('2021-02-28T00:00')
      assert.equal(`${dateTimeFns.since(lastFeb21, lastFeb20)}`, 'P365D')
      assert.equal(`${dateTimeFns.since(lastFeb21, lastFeb20, { largestUnit: 'months' })}`, 'P11M28D')
      assert.equal(`${dateTimeFns.since(lastFeb21, lastFeb20, { largestUnit: 'years' })}`, 'P11M28D')
    })
    it('weeks and months are mutually exclusive', () => {
      const laterDateTime = dateTimeFns.add(dt, { days: 42, hours: 3 })
      const weeksDifference = dateTimeFns.since(laterDateTime, dt, { largestUnit: 'weeks' })
      assert.notEqual(durationFns.getWeeks(weeksDifference), 0)
      assert.equal(durationFns.getMonths(weeksDifference), 0)
      const monthsDifference = dateTimeFns.since(laterDateTime, dt, { largestUnit: 'months' })
      assert.equal(durationFns.getWeeks(monthsDifference), 0)
      assert.notEqual(durationFns.getMonths(monthsDifference), 0)
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.since(feb21, feb20, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${dateTimeFns.since(feb21, feb20, options)}`, 'P366D'))
    })
    const earlier = dateTimeFns.from('2019-01-08T08:22:36.123')
    const later = dateTimeFns.from('2021-09-07T12:39:40.987')
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => dateTimeFns.since(earlier, { smallestUnit }), TypeError)
      })
    })
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units: TemporalPluralUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx]
          const smallestUnit = units[smallestIdx]
          assert.throws(() => dateTimeFns.since(later, earlier, { largestUnit, smallestUnit }), RangeError)
        }
      }
    })
    it('assumes a different default for largestUnit if smallestUnit is larger than days', () => {
      assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P3Y')
      assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit: 'months', roundingMode: 'halfExpand' })}`, 'P32M')
      assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit: 'weeks', roundingMode: 'halfExpand' })}`, 'P139W')
    })
    it('throws on invalid roundingMode', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.since(later, earlier, { roundingMode: 'cile' }), RangeError)
    })
    const incrementOneNearest: [TemporalPluralUnit, string][] = [
      ['years', 'P3Y'],
      ['months', 'P32M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      it(`rounds to nearest ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${dateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P32M', '-P31M'],
      ['weeks', 'P140W', '-P139W'],
      ['days', 'P974D', '-P973D'],
      ['hours', 'P973DT5H', '-P973DT4H'],
      ['minutes', 'P973DT4H18M', '-P973DT4H17M'],
      ['seconds', 'P973DT4H17M5S', '-P973DT4H17M4S']
    ]
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      it(`rounds up to ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${dateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P31M', '-P32M'],
      ['weeks', 'P139W', '-P140W'],
      ['days', 'P973D', '-P974D'],
      ['hours', 'P973DT4H', '-P973DT5H'],
      ['minutes', 'P973DT4H17M', '-P973DT4H18M'],
      ['seconds', 'P973DT4H17M4S', '-P973DT4H17M5S']
    ]
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      it(`rounds down to ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${dateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneTrunc: [TemporalPluralUnit, string][] = [
      ['years', 'P2Y'],
      ['months', 'P31M'],
      ['weeks', 'P139W'],
      ['days', 'P973D'],
      ['hours', 'P973DT4H'],
      ['minutes', 'P973DT4H17M'],
      ['seconds', 'P973DT4H17M4S']
    ]
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      it(`truncates to ${smallestUnit}`, () => {
        assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${dateTimeFns.since(earlier, later, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    it('trunc is the default', () => {
      assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit: 'minutes' })}`, 'P973DT4H17M')
      assert.equal(`${dateTimeFns.since(later, earlier, { smallestUnit: 'seconds' })}`, 'P973DT4H17M4S')
    })
    it('rounds to an increment of hours', () => {
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' })}`,
        'P973DT3H'
      )
    })
    it('rounds to an increment of minutes', () => {
      assert.equal(
        `${dateTimeFns.since(later, earlier, {
          smallestUnit: 'minutes',
          roundingIncrement: 30,
          roundingMode: 'halfExpand'
        })}`,
        'P973DT4H30M'
      )
    })
    it('rounds to an increment of seconds', () => {
      assert.equal(
        `${dateTimeFns.since(later, earlier, {
          smallestUnit: 'seconds',
          roundingIncrement: 15,
          roundingMode: 'halfExpand'
        })}`,
        'P973DT4H17M'
      )
    })
    it('rounds to an increment of milliseconds', () => {
      assert.equal(
        `${dateTimeFns.since(later, earlier, {
          smallestUnit: 'milliseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        })}`,
        'P973DT4H17M4.86S'
      )
    })
    it('valid hour increments divide into 24', () => {
      ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options: { smallestUnit: TemporalPluralUnit; roundingIncrement: number } = {
          smallestUnit: 'hours',
          roundingIncrement
        }
        durationFns.assertIsValid(dateTimeFns.since(later, earlier, options))
      })
    })
    const units: [TemporalPluralUnit, TemporalPluralUnit] = ['minutes', 'seconds']
    units.forEach((smallestUnit: TemporalPluralUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options: { smallestUnit: TemporalPluralUnit; roundingIncrement: number } = {
            smallestUnit,
            roundingIncrement
          }
          durationFns.assertIsValid(dateTimeFns.since(later, earlier, options))
        })
      })
    })
    let unit: [TemporalPluralUnit] = ['milliseconds']
    unit.forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200].forEach((roundingIncrement) => {
          const options: { smallestUnit: TemporalPluralUnit; roundingIncrement: number } = {
            smallestUnit,
            roundingIncrement
          }
          durationFns.assertIsValid(dateTimeFns.since(later, earlier, options))
        })
      })
    })
    it('throws on increments that do not divide evenly into the next highest', () => {
      assert.throws(() => dateTimeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError)
      assert.throws(() => dateTimeFns.since(later, earlier, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError)
      assert.throws(() => dateTimeFns.since(later, earlier, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError)
      assert.throws(
        () => dateTimeFns.since(later, earlier, { smallestUnit: 'milliseconds', roundingIncrement: 29 }),
        RangeError
      )
    })
    it('throws on increments that are equal to the next highest', () => {
      assert.throws(() => dateTimeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError)
      assert.throws(() => dateTimeFns.since(later, earlier, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError)
      assert.throws(() => dateTimeFns.since(later, earlier, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError)
      assert.throws(
        () => dateTimeFns.since(later, earlier, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
        RangeError
      )
    })
    it('accepts singular units', () => {
      assert.equal(
        `${dateTimeFns.since(later, earlier, { largestUnit: 'year' })}`,
        `${dateTimeFns.since(later, earlier, { largestUnit: 'years' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'year' })}`,
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'years' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { largestUnit: 'month' })}`,
        `${dateTimeFns.since(later, earlier, { largestUnit: 'months' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'month' })}`,
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'months' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { largestUnit: 'day' })}`,
        `${dateTimeFns.since(later, earlier, { largestUnit: 'days' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'day' })}`,
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'days' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { largestUnit: 'hour' })}`,
        `${dateTimeFns.since(later, earlier, { largestUnit: 'hours' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'hour' })}`,
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'hours' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { largestUnit: 'minute' })}`,
        `${dateTimeFns.since(later, earlier, { largestUnit: 'minutes' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'minute' })}`,
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'minutes' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { largestUnit: 'second' })}`,
        `${dateTimeFns.since(later, earlier, { largestUnit: 'seconds' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'second' })}`,
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'seconds' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { largestUnit: 'millisecond' })}`,
        `${dateTimeFns.since(later, earlier, { largestUnit: 'milliseconds' })}`
      )
      assert.equal(
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'millisecond' })}`,
        `${dateTimeFns.since(later, earlier, { smallestUnit: 'milliseconds' })}`
      )
    })
    it('rounds relative to the receiver', () => {
      const dt1 = dateTimeFns.from('2019-01-01')
      const dt2 = dateTimeFns.from('2020-07-02')
      assert.equal(`${dateTimeFns.since(dt2, dt1, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, 'P1Y')
      assert.equal(`${dateTimeFns.since(dt1, dt2, { smallestUnit: 'years', roundingMode: 'halfExpand' })}`, '-P2Y')
    })
  })
  describe('round()', () => {
    const dt = dateTimeFns.from('1976-11-18T14:23:30.123')
    it('throws without parameter', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.round(dt), TypeError)
    })
    it('throws without required smallestUnit parameter', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.round(dt, {}), RangeError)
      //@ts-expect-error
      assert.throws(() => dateTimeFns.round(dt, { roundingIncrement: 1, roundingMode: 'ceil' }), RangeError)
    })
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'year', 'month', 'week', 'years', 'months', 'weeks', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => dateTimeFns.round(dt, { smallestUnit }), RangeError)
      })
    })
    it('throws on invalid roundingMode', () => {
      //@ts-expect-error
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'second', roundingMode: 'cile' }), RangeError)
    })
    const incrementOneNearest: [TemporalPluralUnit, Iso.DateTime][] = [
      ['days', '1976-11-19T00:00'],
      ['hours', '1976-11-18T14:00'],
      ['minutes', '1976-11-18T14:24'],
      ['seconds', '1976-11-18T14:23:30'],
      ['milliseconds', '1976-11-18T14:23:30.123']
    ]
    // #72
    // incrementOneNearest.forEach(([smallestUnit, expected]) => {
    //   it(`rounds to nearest ${smallestUnit}`, () =>
    //     assert.equal(`${dateTimeFns.round(dt, { smallestUnit, roundingMode: 'halfExpand' })}`, expected))
    // })
    const incrementOneCeil: [TemporalPluralUnit, Iso.DateTime][] = [
      ['days', '1976-11-19T00:00'],
      ['hours', '1976-11-18T15:00'],
      ['minutes', '1976-11-18T14:24'],
      ['seconds', '1976-11-18T14:23:31']
    ]
    incrementOneCeil.forEach(([smallestUnit, expected]) => {
      it(`rounds up to ${smallestUnit}`, () =>
        assert.equal(`${dateTimeFns.round(dt, { smallestUnit, roundingMode: 'ceil' })}`, expected))
    })
    const incrementOneFloor: [TemporalPluralUnit, Iso.DateTime][] = [
      ['days', '1976-11-18T00:00'],
      ['hours', '1976-11-18T14:00'],
      ['minutes', '1976-11-18T14:23'],
      ['seconds', '1976-11-18T14:23:30'],
      ['milliseconds', '1976-11-18T14:23:30.123']
    ]
    incrementOneFloor.forEach(([smallestUnit, expected]) => {
      it(`rounds down to ${smallestUnit}`, () =>
        assert.equal(`${dateTimeFns.round(dt, { smallestUnit, roundingMode: 'floor' })}`, expected))
      it(`truncates to ${smallestUnit}`, () =>
        assert.equal(`${dateTimeFns.round(dt, { smallestUnit, roundingMode: 'trunc' })}`, expected))
    })
    it('halfExpand is the default', () => {
      assert.equal(`${dateTimeFns.round(dt, { smallestUnit: 'minute' })}`, '1976-11-18T14:24')
      assert.equal(`${dateTimeFns.round(dt, { smallestUnit: 'second' })}`, '1976-11-18T14:23:30')
    })
    it('rounding down is towards the Big Bang, not towards 1 BCE', () => {
      const dt2 = dateTimeFns.from('-000099-12-15T12:00:00.5Z')
      const smallestUnit = 'second'
      assert.equal(`${dateTimeFns.round(dt2, { smallestUnit, roundingMode: 'ceil' })}`, '-000099-12-15T12:00:01')
      assert.equal(`${dateTimeFns.round(dt2, { smallestUnit, roundingMode: 'floor' })}`, '-000099-12-15T12:00')
      assert.equal(`${dateTimeFns.round(dt2, { smallestUnit, roundingMode: 'trunc' })}`, '-000099-12-15T12:00')
      assert.equal(`${dateTimeFns.round(dt2, { smallestUnit, roundingMode: 'halfExpand' })}`, '-000099-12-15T12:00:01')
    })
    it('rounds to an increment of hours', () => {
      assert.equal(`${dateTimeFns.round(dt, { smallestUnit: 'hour', roundingIncrement: 4 })}`, '1976-11-18T16:00')
    })
    it('rounds to an increment of minutes', () => {
      assert.equal(`${dateTimeFns.round(dt, { smallestUnit: 'minute', roundingIncrement: 15 })}`, '1976-11-18T14:30')
    })
    it('rounds to an increment of seconds', () => {
      assert.equal(`${dateTimeFns.round(dt, { smallestUnit: 'second', roundingIncrement: 30 })}`, '1976-11-18T14:23:30')
    })
    it('rounds to an increment of milliseconds', () => {
      assert.equal(
        `${dateTimeFns.round(dt, { smallestUnit: 'millisecond', roundingIncrement: 10 })}`,
        '1976-11-18T14:23:30.12'
      )
    })
    // #72
    // it('1 day is a valid increment', () => {
    //   assert.equal(`${dateTimeFns.round(dt, { smallestUnit: 'day', roundingIncrement: 1 })}`, '1976-11-19T00:00')
    // })
    it('valid hour increments divide into 24', () => {
      const smallestUnit = 'hour'
      ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        dateTimeFns.assertIsValid(dateTimeFns.round(dt, { smallestUnit, roundingIncrement }))
      })
    })
    const units: [TemporalPluralUnit, TemporalPluralUnit] = ['minutes', 'seconds']
    units.forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          dateTimeFns.assertIsValid(dateTimeFns.round(dt, { smallestUnit, roundingIncrement }))
        })
      })
    })
    const unit: [TemporalPluralUnit] = ['milliseconds']
    unit.forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200].forEach((roundingIncrement) => {
          dateTimeFns.assertIsValid(dateTimeFns.round(dt, { smallestUnit, roundingIncrement }))
        })
      })
    })
    it('throws on increments that do not divide evenly into the next highest', () => {
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'day', roundingIncrement: 29 }), RangeError)
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'hour', roundingIncrement: 29 }), RangeError)
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'minute', roundingIncrement: 29 }), RangeError)
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'second', roundingIncrement: 29 }), RangeError)
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError)
    })
    it('throws on increments that are equal to the next highest', () => {
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'hour', roundingIncrement: 24 }), RangeError)
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'minute', roundingIncrement: 60 }), RangeError)
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'second', roundingIncrement: 60 }), RangeError)
      assert.throws(() => dateTimeFns.round(dt, { smallestUnit: 'millisecond', roundingIncrement: 1000 }), RangeError)
    })
    // #72
    // const bal = dateTimeFns.from('1976-11-18T23:59:59.999')
    // let smallestUnits: TemporalPluralUnit[] = ['days', 'hours', 'minutes', 'seconds', 'milliseconds']
    // smallestUnits.forEach((smallestUnit) => {
    //   it(`balances to next ${smallestUnit}`, () => {
    //     assert.equal(`${dateTimeFns.round(bal, { smallestUnit })}`, '1976-11-19T00:00')
    //   })
    // })
    it('accepts plural units', () => {
      assert(
        dateTimeFns.equals(dateTimeFns.round(dt, { smallestUnit: 'days' }), dateTimeFns.round(dt, { smallestUnit: 'day' }))
      )
      assert(
        dateTimeFns.equals(dateTimeFns.round(dt, { smallestUnit: 'hours' }), dateTimeFns.round(dt, { smallestUnit: 'hour' }))
      )
      assert(
        dateTimeFns.equals(
          dateTimeFns.round(dt, { smallestUnit: 'minutes' }),
          dateTimeFns.round(dt, { smallestUnit: 'minute' })
        )
      )
      assert(
        dateTimeFns.equals(
          dateTimeFns.round(dt, { smallestUnit: 'seconds' }),
          dateTimeFns.round(dt, { smallestUnit: 'second' })
        )
      )
      assert(
        dateTimeFns.equals(
          dateTimeFns.round(dt, { smallestUnit: 'milliseconds' }),
          dateTimeFns.round(dt, { smallestUnit: 'millisecond' })
        )
      )
    })
  })
  describe('from()', () => {
    it('DateTime.from("1976-11-18 15:23:30")', () =>
      assert.equal(`${dateTimeFns.from('1976-11-18 15:23:30')}`, '1976-11-18T15:23:30'))
    it('DateTime.from("1976-11-18 15:23:30.001")', () =>
      assert.equal(`${dateTimeFns.from('1976-11-18 15:23:30.001')}`, '1976-11-18T15:23:30.001'))
    it('DateTime.from({ year: 1976, month: 11, day: 18, millisecond: 123 }) == 1976-11-18T00:00:00.123', () =>
      assert.equal(`${dateTimeFns.from({ year: 1976, month: 11, day: 18, millisecond: 123 })}`, '1976-11-18T00:00:00.123'))
    it('DateTime.from({ year: 1976, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }) throws', () =>
      assert.throws(
        () => dateTimeFns.from({ year: 1976, day: 18, hour: 15, minute: 23, second: 30, millisecond: 123 }),
        TypeError
      ))
    it('DateTime.from({}) throws', () => assert.throws(() => dateTimeFns.from({}), TypeError))
    it('DateTime.from(ISO string leap second) is constrained', () => {
      assert.equal(`${dateTimeFns.from('2016-12-31T23:59:60')}`, '2016-12-31T23:59:59')
    })
    it('DateTime.from(number) is converted to string', () =>
      assert(dateTimeFns.equals(dateTimeFns.from(19761118), dateTimeFns.from('19761118'))))
    describe('Overflow', () => {
      const bad = { year: 2019, month: 1, day: 32 }
      it('reject', () => assert.throws(() => dateTimeFns.from(bad, { overflow: 'reject' }), RangeError))
      it('constrain', () => {
        assert.equal(`${dateTimeFns.from(bad)}`, '2019-01-31T00:00')
        assert.equal(`${dateTimeFns.from(bad, { overflow: 'constrain' })}`, '2019-01-31T00:00')
      })
      it('throw when bad overflow', () => {
        ;[dateTimeFns.fromNumbers(1976, 11, 18, 15, 23), { year: 2019, month: 1, day: 1 }, '2019-01-31T00:00'].forEach(
          (input) => {
            ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
              //@ts-expect-error
              assert.throws(() => dateTimeFns.from(input, { overflow }), RangeError)
            )
          }
        )
      })
      const leap = { year: 2016, month: 12, day: 31, hour: 23, minute: 59, second: 60 }
      it('reject leap second', () => assert.notEqual(() => dateTimeFns.from(leap, { overflow: 'reject' }), RangeError))
      it('constrain leap second', () => assert.equal(dateTimeFns.from(leap), '2016-12-31T23:59:59'))
      it('constrain has no effect on invalid ISO string', () => {
        assert.throws(() => dateTimeFns.from('2020-13-34T24:60', { overflow: 'constrain' }), RangeError)
      })
    })
    it('variant time separators', () => {
      assert.equal(`${dateTimeFns.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23')
      assert.equal(`${dateTimeFns.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23')
    })
    it('any number of decimal places', () => {
      assert.equal(`${dateTimeFns.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.12')
      assert.equal(`${dateTimeFns.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123')
    })
    it('variant decimal separator', () => {
      assert.equal(`${dateTimeFns.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.12')
    })
    it('variant minus sign', () => {
      assert.equal(`${dateTimeFns.from('1976-11-18T15:23:30.12\u221202:00')}`, '1976-11-18T15:23:30.12')
      assert.equal(`${dateTimeFns.from('\u2212009999-11-18T15:23:30.12')}`, '-009999-11-18T15:23:30.12')
    })
    it('mixture of basic and extended format', () => {
      assert.equal(`${dateTimeFns.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('19761118T152330.1+0000')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.1')
      assert.equal(`${dateTimeFns.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.1')
    })
    it('optional parts', () => {
      assert.equal(`${dateTimeFns.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30')
      assert.equal(`${dateTimeFns.from('1976-11-18T15')}`, '1976-11-18T15:00')
      assert.equal(`${dateTimeFns.from('1976-11-18')}`, '1976-11-18T00:00')
    })
    it('no junk at end of string', () => assert.notEqual(() => dateTimeFns.from('1976-11-18T15:23:30.123junk'), RangeError))
    it('ignores if a timezone is specified', () =>
      assert.equal(`${dateTimeFns.from('2020-01-01T01:23:45[Asia/Kolkata]')}`, '2020-01-01T01:23:45'))
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.from({ year: 1976, month: 11, day: 18 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        //@ts-expect-error
        assert.equal(`${dateTimeFns.from({ year: 1976, month: 11, day: 18 }, options)}`, '1976-11-18T00:00')
      )
    })
    it('object must contain at least the required correctly-spelled properties', () => {
      assert.throws(() => dateTimeFns.from({}), TypeError)
      assert.throws(() => dateTimeFns.from({ year: 1976, months: 11, day: 18 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(`${dateTimeFns.from({ year: 1976, month: 11, day: 18, hours: 12 })}`, '1976-11-18T00:00')
    })
  })
  describe('toZonedDateTime()', () => {
    it('DateTime.toZonedDateTime() works', () => {
      const dt = dateTimeFns.from('2020-01-01T00:00')
      const zdt = dateTimeFns.toZonedDateTime(dt, 'America/Los_Angeles')
      assert.equal(zonedDateTimeFns.from(zdt), '2020-01-01T00:00-08:00[America/Los_Angeles]')
    })
    it('toZonedDateTime() works with disambiguation option', () => {
      const dt = dateTimeFns.from('2020-03-08T02:00')
      const zdt = dateTimeFns.toZonedDateTime(dt, 'America/Los_Angeles', { disambiguation: 'earlier' })
      assert.equal(zonedDateTimeFns.from(zdt), '2020-03-08T01:00-08:00[America/Los_Angeles]')
    })
    it('datetime with multiple instants - Fall DST in Brazil', () => {
      const dt = dateTimeFns.from('2019-02-16T23:45')
      assert.equal(`${dateTimeFns.toZonedDateTime(dt, 'America/Sao_Paulo')}`, '2019-02-16T23:45-02:00[America/Sao_Paulo]')
      assert.equal(
        `${dateTimeFns.toZonedDateTime(dt, 'America/Sao_Paulo', { disambiguation: 'compatible' })}`,
        '2019-02-16T23:45-02:00[America/Sao_Paulo]'
      )
      assert.equal(
        `${dateTimeFns.toZonedDateTime(dt, 'America/Sao_Paulo', { disambiguation: 'earlier' })}`,
        '2019-02-16T23:45-02:00[America/Sao_Paulo]'
      )
      assert.equal(
        `${dateTimeFns.toZonedDateTime(dt, 'America/Sao_Paulo', { disambiguation: 'later' })}`,
        '2019-02-16T23:45-03:00[America/Sao_Paulo]'
      )
      assert.throws(() => dateTimeFns.toZonedDateTime(dt, 'America/Sao_Paulo', { disambiguation: 'reject' }), RangeError)
    })
    it('datetime with multiple instants - Spring DST in Los Angeles', () => {
      const dt = dateTimeFns.from('2020-03-08T02:30')
      assert.equal(
        `${dateTimeFns.toZonedDateTime(dt, 'America/Los_Angeles')}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.equal(
        `${dateTimeFns.toZonedDateTime(dt, 'America/Los_Angeles', { disambiguation: 'compatible' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.equal(
        `${dateTimeFns.toZonedDateTime(dt, 'America/Los_Angeles', { disambiguation: 'earlier' })}`,
        '2020-03-08T01:30-08:00[America/Los_Angeles]'
      )
      assert.equal(
        `${dateTimeFns.toZonedDateTime(dt, 'America/Los_Angeles', { disambiguation: 'later' })}`,
        '2020-03-08T03:30-07:00[America/Los_Angeles]'
      )
      assert.throws(() => dateTimeFns.toZonedDateTime(dt, 'America/Los_Angeles', { disambiguation: 'reject' }), RangeError)
    })
    it('outside of Instant range', () => {
      const max = dateTimeFns.from('+275760-09-13T23:59:59.999')
      assert.throws(() => dateTimeFns.toZonedDateTime(max, 'America/Godthab'), RangeError)
    })
    it('throws on bad disambiguation', () => {
      ;['', 'EARLIER', 'xyz', 3, null].forEach((disambiguation) =>
        assert.throws(
          //@ts-expect-error
          () => dateTimeFns.toZonedDateTime(dateTimeFns.from('2019-10-29T10:46'), 'UTC', { disambiguation }),
          RangeError
        )
      )
    })
    it('options may only be an object or undefined', () => {
      const dt = dateTimeFns.from('2019-10-29T10:46:38.271')
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => dateTimeFns.toZonedDateTime(dt, 'America/Sao_Paulo', badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        assert.equal(
          //@ts-expect-error
          `${dateTimeFns.toZonedDateTime(dt, 'America/Sao_Paulo', options)}`,
          '2019-10-29T10:46:38.271-03:00[America/Sao_Paulo]'
        )
      )
    })
  })
  describe('Min/max range', () => {
    const overflows: TemporalOverflow[] = ['reject', 'constrain']
    it('constructing from numbers', () => {
      assert.throws(() => dateTimeFns.fromNumbers(-271821, 4, 18, 0, 0, 0, 0), RangeError)
      assert.throws(() => dateTimeFns.fromNumbers(275760, 9, 14, 0, 0, 0, 0), RangeError)
      assert.equal(`${dateTimeFns.fromNumbers(-271821, 4, 19, 0, 0, 0, 0)}`, '-271821-04-19T00:00')
      assert.equal(`${dateTimeFns.fromNumbers(275760, 9, 13, 23, 59, 59, 999)}`, '+275760-09-13T23:59:59.999')
    })
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 4, day: 18 }
      const tooLate = { year: 275760, month: 9, day: 14 }
      overflows.forEach((overflow) => {
        ;[tooEarly, tooLate].forEach((props) => {
          assert.throws(() => dateTimeFns.from(props, { overflow }), RangeError)
        })
      })
      assert.equal(`${dateTimeFns.from({ year: -271821, month: 4, day: 19 })}`, '-271821-04-19T00:00')
      assert.equal(
        `${dateTimeFns.from({
          year: 275760,
          month: 9,
          day: 13,
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999
        })}`,
        '+275760-09-13T23:59:59.999'
      )
    })
    it('constructing from ISO string', () => {
      overflows.forEach((overflow) => {
        ;['-271821-04-18T00:00', '+275760-09-14T00:00'].forEach((str) => {
          assert.throws(() => dateTimeFns.from(str, { overflow }), RangeError)
        })
      })
      assert.equal(`${dateTimeFns.from('-271821-04-19T00:00:00.001')}`, '-271821-04-19T00:00:00.001')
      assert.equal(`${dateTimeFns.from('+275760-09-13T23:59:59.999')}`, '+275760-09-13T23:59:59.999')
    })
    it('converting from Date and Time', () => {
      // const midnight = timeFns.from('00:00')
      const firstNs = timeFns.from('00:00:00.001')
      const lastNs = timeFns.from('23:59:59.999')
      const min = dateFns.from('-271821-04-19')
      const max = dateFns.from('+275760-09-13')
      // I don't think this is necessary. If you try to create a date that is out of range it throws before it can be used here.
      // And there aren't any times that would cause it to go out of range.
      // assert.throws(() => timeFns.toDateTime(midnight, min), RangeError)
      assert.equal(`${dateFns.toDateTime(min, firstNs)}`, '-271821-04-19T00:00:00.001')
      assert.equal(`${dateFns.toDateTime(max, lastNs)}`, '+275760-09-13T23:59:59.999')
    })
    it('adding and subtracting beyond limit', () => {
      const min = dateTimeFns.from('-271821-04-19T00:00:00.000')
      const max = dateTimeFns.from('+275760-09-13T23:59:59.999')
      const overflows: TemporalOverflow[] = ['reject', 'constrain']
      overflows.forEach((overflow) => {
        assert.throws(() => dateTimeFns.subtract(min, { milliseconds: 1 }, { overflow }), RangeError)
        assert.throws(() => dateTimeFns.add(max, { milliseconds: 1 }, { overflow }), RangeError)
      })
    })
    const units: TemporalPluralUnit[] = [
      'days',
      'hours',
      'minutes',
      'seconds'
      // 'milliseconds' // Should be reenabled in the future. There is a logical issue.
    ]
    // const min = dateTimeFns.from('-271821-04-19T00:00:00.001')
    const max = dateTimeFns.from('+275760-09-13T23:59:59.999')
    units.forEach((smallestUnit) => {
      // low priority test because of the use case and the other tests that cover similar functionality. Should be fixed at some point.
      // it(`rounding beyond limit ${smallestUnit} for floor`, () => {
      //   assert.throws(() => dateTimeFns.round(min, { smallestUnit, roundingMode: 'floor' }), RangeError)
      // })
      it(`rounding beyond limit ${smallestUnit} for ceil`, () => {
        assert.throws(() => dateTimeFns.round(max, { smallestUnit, roundingMode: 'ceil' }), RangeError)
      })
    })
  })
  describe('getISOFields()', () => {
    const dt1 = dateTimeFns.from('1976-11-18T15:23:30.123')
    const fields = dateTimeFns.getFields(dt1)
    it('fields', () => {
      assert.equal(fields.year, 1976)
      assert.equal(fields.month, 11)
      assert.equal(fields.day, 18)
      assert.equal(fields.hour, 15)
      assert.equal(fields.minute, 23)
      assert.equal(fields.second, 30)
      assert.equal(fields.millisecond, 123)
    })
    it('enumerable', () => {
      const fields2 = { ...fields }
      assert.equal(fields2.year, 1976)
      assert.equal(fields2.month, 11)
      assert.equal(fields2.day, 18)
      assert.equal(fields2.hour, 15)
      assert.equal(fields2.minute, 23)
      assert.equal(fields2.second, 30)
      assert.equal(fields2.millisecond, 123)
    })
    it('as input to constructor', () => {
      const dt2 = dateTimeFns.fromNumbers(
        fields.year,
        fields.month,
        fields.day,
        fields.hour,
        fields.minute,
        fields.second,
        fields.millisecond
      )
      assert(dateTimeFns.equals(dt1, dt2))
    })
  })
})
