import { describe, it } from 'beartest-js'
import { strict as assert } from 'assert'
import { dateFns, dateTimeFns, durationFns, zonedDateTimeFns } from './fns'
import { Iso } from 'iso-types'
import { TemporalPluralUnit, TemporalSingularUnit, TemporalRoundingMode } from 'ecmascript'

describe('durationFns', () => {
  describe('Structure', () => {
    it('durationFns is a Function', () => {
      assert.equal(typeof durationFns, 'object')
    })
    it('durationFns.compare is a Function', () => {
      assert.equal(typeof durationFns.compare, 'function')
    })
  })
  describe('Construction', () => {
    it('positive duration, sets fields', () => {
      const d = durationFns.fromNumbers(5, 5, 5, 5, 5, 5, 5, 5)
      assert.equal(durationFns.getSign(d), 1)
      assert.equal(durationFns.getYears(d), 5)
      assert.equal(durationFns.getMonths(d), 5)
      assert.equal(durationFns.getWeeks(d), 5)
      assert.equal(durationFns.getDays(d), 5)
      assert.equal(durationFns.getHours(d), 5)
      assert.equal(durationFns.getMinutes(d), 5)
      assert.equal(durationFns.getSeconds(d), 5)
      assert.equal(durationFns.getMilliseconds(d), 5)
    })
    it('negative duration, sets fields', () => {
      const d = durationFns.fromNumbers(-5, -5, -5, -5, -5, -5, -5, -5)
      assert.equal(durationFns.getSign(d), -1)
      assert.equal(durationFns.getYears(d), -5)
      assert.equal(durationFns.getMonths(d), -5)
      assert.equal(durationFns.getWeeks(d), -5)
      assert.equal(durationFns.getDays(d), -5)
      assert.equal(durationFns.getHours(d), -5)
      assert.equal(durationFns.getMinutes(d), -5)
      assert.equal(durationFns.getSeconds(d), -5)
      assert.equal(durationFns.getMilliseconds(d), -5)
    })
    it('zero-length, sets fields', () => {
      const d = durationFns.fromNumbers()
      assert.equal(durationFns.getSign(d), 0)
      assert.equal(durationFns.getYears(d), 0)
      assert.equal(durationFns.getMonths(d), 0)
      assert.equal(durationFns.getWeeks(d), 0)
      assert.equal(durationFns.getDays(d), 0)
      assert.equal(durationFns.getHours(d), 0)
      assert.equal(durationFns.getMinutes(d), 0)
      assert.equal(durationFns.getSeconds(d), 0)
      assert.equal(durationFns.getMilliseconds(d), 0)
    })
    it('constructor treats -0 as 0', () => {
      const d = durationFns.fromNumbers(-0, -0, -0, -0, -0, -0, -0, -0)
      assert.equal(durationFns.getSign(d), 0)
      assert.equal(durationFns.getYears(d), 0)
      assert.equal(durationFns.getMonths(d), 0)
      assert.equal(durationFns.getWeeks(d), 0)
      assert.equal(durationFns.getDays(d), 0)
      assert.equal(durationFns.getHours(d), 0)
      assert.equal(durationFns.getMinutes(d), 0)
      assert.equal(durationFns.getSeconds(d), 0)
      assert.equal(durationFns.getMilliseconds(d), 0)
    })
    it('mixed positive and negative values throw', () => {
      assert.throws(() => durationFns.fromNumbers(-1, 1, 1, 1, 1, 1, 1, 1), RangeError)
      assert.throws(() => durationFns.fromNumbers(1, -1, 1, 1, 1, 1, 1, 1), RangeError)
      assert.throws(() => durationFns.fromNumbers(1, 1, -1, 1, 1, 1, 1, 1), RangeError)
      assert.throws(() => durationFns.fromNumbers(1, 1, 1, -1, 1, 1, 1, 1), RangeError)
      assert.throws(() => durationFns.fromNumbers(1, 1, 1, 1, -1, 1, 1, 1), RangeError)
      assert.throws(() => durationFns.fromNumbers(1, 1, 1, 1, 1, -1, 1, 1), RangeError)
      assert.throws(() => durationFns.fromNumbers(1, 1, 1, 1, 1, 1, -1, 1), RangeError)
      assert.throws(() => durationFns.fromNumbers(1, 1, 1, 1, 1, 1, 1, -1), RangeError)
    })
  })
  describe('from()', () => {
    it('Duration.from({ milliseconds: 5 }) == PT0.005S', () =>
      assert.equal(`${durationFns.from({ milliseconds: 5 })}`, 'PT0.005S'))
    it('Duration.from("P1D") == P1D', () => assert.equal(`${durationFns.from('P1D')}`, 'P1D'))
    it('lowercase variant', () => assert.equal(`${durationFns.from('p1y1m1dt1h1m1s')}`, 'P1Y1M1DT1H1M1S'))
    it('upto three decimal places work', () => {
      assert.equal(`${durationFns.from('P1Y1M1W1DT1H1M1.1S')}`, 'P1Y1M1W1DT1H1M1.1S')
      assert.equal(`${durationFns.from('P1Y1M1W1DT1H1M1.12S')}`, 'P1Y1M1W1DT1H1M1.12S')
      assert.equal(`${durationFns.from('P1Y1M1W1DT1H1M1.123S')}`, 'P1Y1M1W1DT1H1M1.123S')
    })
    it('above three decimal places rounds to three', () => {
      assert.equal(`${durationFns.from('P1Y1M1W1DT1H1M1.1234S')}`, 'P1Y1M1W1DT1H1M1.123S')
    })
    it('variant decimal separator', () => {
      assert.equal(`${durationFns.from('P1Y1M1W1DT1H1M1,12S')}`, 'P1Y1M1W1DT1H1M1.12S')
    })
    it('decimal places only allowed in time units', () => {
      ;[
        'P0.5Y',
        'P1Y0,5M',
        'P1Y1M0.5W',
        'P1Y1M1W0,5D',
        { years: 0.5 },
        { months: 0.5 },
        { weeks: 0.5 },
        { days: 0.5 }
      ].forEach((str) => assert.throws(() => durationFns.from(str), RangeError))
    })
    it('decimal places only allowed in last non-zero unit', () => {
      ;[
        'P1Y1M1W1DT0.5H5S',
        'P1Y1M1W1DT1.5H0,5M',
        'P1Y1M1W1DT1H0.5M0.5S',
        { hours: 0.5, minutes: 20 },
        { hours: 0.5, seconds: 15 },
        { minutes: 10.7 }
      ].forEach((str) => assert.throws(() => durationFns.from(str), RangeError))
    })
    it('decimal places are properly handled on valid units', () => {
      assert.equal(`${durationFns.from('P1DT0.5M')}`, 'P1DT30S')
      assert.equal(`${durationFns.from('P1DT0,5H')}`, 'P1DT30M')
    })
    it('"P" by itself is not a valid string', () => {
      ;['P', 'PT', '-P', '-PT', '+P', '+PT'].forEach((s) => assert.throws(() => durationFns.from(s), RangeError))
    })
    it('no junk at end of string', () => assert.throws(() => durationFns.from('P1Y1M1W1DT1H1M1.01Sjunk'), RangeError))
    it('with a + sign', () => {
      const d = durationFns.from('+P1D')
      assert.equal(durationFns.getDays(d), 1)
    })
    it('with a - sign', () => {
      const d = durationFns.from('-P1D')
      assert.equal(durationFns.getDays(d), -1)
    })
    it('variant minus sign', () => {
      const d = durationFns.from('\u2212P1D')
      assert.equal(durationFns.getDays(d), -1)
    })
    it('all units have the same sign', () => {
      const d = durationFns.from('-P1Y1M1W1DT1H1M1.123456789S')
      assert.equal(durationFns.getYears(d), -1)
      assert.equal(durationFns.getMonths(d), -1)
      assert.equal(durationFns.getWeeks(d), -1)
      assert.equal(durationFns.getDays(d), -1)
      assert.equal(durationFns.getHours(d), -1)
      assert.equal(durationFns.getMinutes(d), -1)
      assert.equal(durationFns.getSeconds(d), -1)
      assert.equal(durationFns.getMilliseconds(d), -123)
    })
    it('does not accept minus signs in individual units', () => {
      assert.throws(() => durationFns.from('P-1Y1M'), RangeError)
      assert.throws(() => durationFns.from('P1Y-1M'), RangeError)
    })
    it('mixed positive and negative values throw', () => {
      assert.throws(() => durationFns.from({ hours: 1, minutes: -30 }), RangeError)
    })
    it('excessive values unchanged', () => {
      assert.equal(`${durationFns.from({ minutes: 100 })}`, 'PT100M')
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => durationFns.from({}), TypeError)
      assert.throws(() => durationFns.from({ month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(`${durationFns.from({ month: 1, days: 1 })}`, 'P1D')
    })
  })
  describe('min/max values', () => {
    const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds']
    it('minimum is zero', () => {
      assert.equal(`${durationFns.fromNumbers(0, 0, 0, 0, 0, 0, 0)}`, 'PT0S')
      units.forEach((unit) => assert.equal(`${durationFns.from({ [unit]: 0 })}`, 'PT0S'))
      ;['P0Y', 'P0M', 'P0W', 'P0D', 'PT0H', 'PT0M', 'PT0S'].forEach((str) =>
        assert.equal(`${durationFns.from(str)}`, 'PT0S')
      )
    })
    it('unrepresentable number is not allowed', () => {
      units.forEach((unit, ix) => {
        assert.throws(() => durationFns.fromNumbers(...Array(ix).fill(0), 1e309), RangeError)
        assert.throws(() => durationFns.from({ [unit]: 1e309 }), RangeError)
      })
      const manyNines = '9'.repeat(309)
      ;[
        `P${manyNines}Y`,
        `P${manyNines}M`,
        `P${manyNines}W`,
        `P${manyNines}D`,
        `PT${manyNines}H`,
        `PT${manyNines}M`,
        `PT${manyNines}S`
      ].forEach((str) => assert.throws(() => durationFns.from(str), RangeError))
    })
    it('max safe integer is allowed', () => {
      ;[
        'P9007199254740991Y',
        'P9007199254740991M',
        'P9007199254740991W',
        'P9007199254740991D',
        'PT9007199254740991H',
        'PT9007199254740991M',
        'PT9007199254740991S',
        'PT9007199254740.991S'
      ].forEach((str, ix) => {
        assert.equal(`${durationFns.fromNumbers(...Array(ix).fill(0), Number.MAX_SAFE_INTEGER)}`, str)
        assert.equal(`${durationFns.from(str)}`, str)
      })
    })

    it('larger integers are allowed but may lose precision', () => {
      function test(ix: any, prefix: string, suffix: string, infix = '') {
        function doAsserts(duration: Iso.Duration) {
          assert.equal(duration.slice(0, prefix.length + 10), `${prefix}1000000000`)
          assert(duration.includes(infix))
          assert.equal(duration.slice(-1), suffix)
          assert.equal(duration.length, prefix.length + suffix.length + infix.length + 27)
        }
        doAsserts(durationFns.fromNumbers(...Array(ix).fill(0), 1e26, ...Array(9 - ix).fill(0)))
        doAsserts(durationFns.from({ [units[ix]]: 1e26 }))
        if (!infix) doAsserts(durationFns.from(`${prefix}100000000000000000000000000${suffix}`))
      }
      test(0, 'P', 'Y')
      test(1, 'P', 'M')
      test(2, 'P', 'W')
      test(3, 'P', 'D')
      test(4, 'PT', 'H')
      test(5, 'PT', 'M')
      test(6, 'PT', 'S')
      test(7, 'PT', 'S', '.')
    })
  })
  describe('Duration.with()', () => {
    const duration = durationFns.fromNumbers(5, 5, 5, 5, 5, 5, 5, 5)
    it('duration.with({ years: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { years: 1 })}`, 'P1Y5M5W5DT5H5M5.005S')
    })
    it('duration.with({ months: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { months: 1 })}`, 'P5Y1M5W5DT5H5M5.005S')
    })
    it('duration.with({ weeks: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { weeks: 1 })}`, 'P5Y5M1W5DT5H5M5.005S')
    })
    it('duration.with({ days: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { days: 1 })}`, 'P5Y5M5W1DT5H5M5.005S')
    })
    it('duration.with({ hours: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { hours: 1 })}`, 'P5Y5M5W5DT1H5M5.005S')
    })
    it('duration.with({ minutes: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { minutes: 1 })}`, 'P5Y5M5W5DT5H1M5.005S')
    })
    it('duration.with({ seconds: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { seconds: 1 })}`, 'P5Y5M5W5DT5H5M1.005S')
    })
    it('duration.with({ milliseconds: 1 } works', () => {
      assert.equal(`${durationFns.with(duration, { milliseconds: 1 })}`, 'P5Y5M5W5DT5H5M5.001S')
    })
    it('duration.with({ months: 1, seconds: 15 } works', () => {
      assert.equal(`${durationFns.with(duration, { months: 1, seconds: 15 })}`, 'P5Y1M5W5DT5H5M15.005S')
    })
    it('mixed positive and negative values throw', () => {
      assert.throws(() => durationFns.with(duration, { hours: 1, minutes: -1 }), RangeError)
    })
    it('can reverse the sign if all the fields are replaced', () => {
      const d = durationFns.from({ years: 5, days: 1 })
      const d2 = durationFns.with(d, { years: -1, days: -1, minutes: -0 })
      assert.equal(`${d2}`, '-P1Y1D')
      assert.notEqual(durationFns.getSign(d), durationFns.getSign(d2))
    })
    it('throws if new fields have a different sign from the old fields', () => {
      const d = durationFns.from({ years: 5, days: 1 })
      assert.throws(() => durationFns.with(d, { months: -5, minutes: 0 }), RangeError)
    })
    it('sign cannot be manipulated independently', () => {
      //@ts-expect-error
      assert.throws(() => durationFns.with(duration, { sign: -1 }), TypeError)
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => durationFns.with(duration, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => durationFns.with(duration, { month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${durationFns.with(duration, { month: 1, days: 1 })}`, 'P5Y5M5W1DT5H5M5.005S')
    })
  })
  describe('Duration.add()', () => {
    const duration = durationFns.from({ days: 1, minutes: 5 })
    it('adds same units', () => {
      assert.equal(`${durationFns.add(duration, { days: 2, minutes: 5 })}`, 'P3DT10M')
    })
    it('adds different units', () => {
      assert.equal(`${durationFns.add(duration, { hours: 12, seconds: 30 })}`, 'P1DT12H5M30S')
    })
    it('symmetric with regard to negative durations', () => {
      assert.equal(`${durationFns.add(durationFns.from('P3DT10M'), { days: -2, minutes: -5 })}`, 'P1DT5M')
      assert.equal(`${durationFns.add(durationFns.from('P1DT12H5M30S'), { hours: -12, seconds: -30 })}`, 'P1DT5M')
    })
    it('balances time units even if both operands are positive', () => {
      const d = durationFns.from('P50DT50H50M50.500S')
      const result = durationFns.add(d, d)
      assert.equal(durationFns.getDays(result), 104)
      assert.equal(durationFns.getHours(result), 5)
      assert.equal(durationFns.getMinutes(result), 41)
      assert.equal(durationFns.getSeconds(result), 41)
      assert.equal(durationFns.getMilliseconds(result), 0)
    })
    it('balances correctly if adding different units flips the overall sign', () => {
      const d1 = durationFns.from({ hours: -1, seconds: -60 })
      assert.equal(`${durationFns.add(d1, { minutes: 122 })}`, 'PT1H1M')
      const d2 = durationFns.from({ hours: -1, seconds: -3721 })
      assert.equal(`${durationFns.add(d2, { minutes: 124 })}`, 'PT1M59S')
    })
    const max = durationFns.fromNumbers(0, 0, 0, ...Array(7).fill(Number.MAX_VALUE))
    it('always throws when addition overflows', () => {
      assert.throws(() => durationFns.add(max, max), TypeError)
    })
    it('mixed positive and negative values always throw', () => {
      assert.throws(() => durationFns.add(duration, { hours: 1, minutes: -30 }), RangeError)
    })
    it('relativeTo required for years, months, and weeks', () => {
      const d = durationFns.from({ hours: 1 })
      const dy = durationFns.from({ years: 1 })
      const dm = durationFns.from({ months: 1 })
      const dw = durationFns.from({ weeks: 1 })
      assert.throws(() => durationFns.add(d, dy), RangeError)
      assert.throws(() => durationFns.add(d, dm), RangeError)
      assert.throws(() => durationFns.add(d, dw), RangeError)
      assert.throws(() => durationFns.add(dy, d), RangeError)
      assert.throws(() => durationFns.add(dm, d), RangeError)
      assert.throws(() => durationFns.add(dw, d), RangeError)
      const relativeTo = dateTimeFns.from('2000-01-01')
      assert.equal(`${durationFns.add(d, dy, { relativeTo })}`, 'P1YT1H')
      assert.equal(`${durationFns.add(d, dm, { relativeTo })}`, 'P1MT1H')
      assert.equal(`${durationFns.add(d, dw, { relativeTo })}`, 'P1WT1H')
      assert.equal(`${durationFns.add(dy, d, { relativeTo })}`, 'P1YT1H')
      assert.equal(`${durationFns.add(dm, d, { relativeTo })}`, 'P1MT1H')
      assert.equal(`${durationFns.add(dw, d, { relativeTo })}`, 'P1WT1H')
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => durationFns.add(duration, { hours: 1 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        //@ts-expect-error
        assert.equal(durationFns.getHours(durationFns.add(duration, { hours: 1 }, options)), 1)
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => durationFns.add(duration, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => durationFns.add(duration, { month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${durationFns.add(duration, { month: 1, days: 1 })}`, 'P2DT5M')
    })
    it('casts argument', () => {
      assert.equal(`${durationFns.add(duration, durationFns.from('P2DT5M'))}`, 'P3DT10M')
      assert.equal(`${durationFns.add(duration, 'P2DT5M')}`, 'P3DT10M')
    })
    it('relativeTo affects year length', () => {
      const oneYear = durationFns.fromNumbers(1)
      const days365 = durationFns.fromNumbers(0, 0, 0, 365)
      assert.equal(`${durationFns.add(oneYear, days365, { relativeTo: dateTimeFns.from('2016-01-01') })}`, 'P2Y')
      assert.equal(`${durationFns.add(oneYear, days365, { relativeTo: dateTimeFns.from('2015-01-01') })}`, 'P1Y11M30D')
    })
    it('relativeTo affects month length', () => {
      const oneMonth = durationFns.fromNumbers(0, 1)
      const days30 = durationFns.fromNumbers(0, 0, 0, 30)
      assert.equal(`${durationFns.add(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-01-01') })}`, 'P2M2D')
      assert.equal(`${durationFns.add(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-02-01') })}`, 'P1M30D')
      assert.equal(`${durationFns.add(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-03-01') })}`, 'P2M')
    })
    it('first this is resolved against relativeTo, then the argument against relativeTo + this', () => {
      const d1 = durationFns.fromNumbers(0, 1, 0, 1)
      const d2 = durationFns.fromNumbers(0, 1, 0, 1)
      const relativeTo = dateTimeFns.fromNumbers(2000, 1, 1)
      assert.equal(`${durationFns.add(d1, d2, { relativeTo })}`, 'P2M2D')
    })
    const oneDay = durationFns.fromNumbers(0, 0, 0, 1)
    const hours24 = durationFns.fromNumbers(0, 0, 0, 0, 24)
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = dateTimeFns.from('2017-01-01')
      assert.equal(`${durationFns.add(oneDay, hours24, { relativeTo })}`, 'P2D')
    })
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = zonedDateTimeFns.from('2017-01-01T00:00[America/Montevideo]')
      assert.equal(`${durationFns.add(oneDay, hours24, { relativeTo })}`, 'P2D')
    })
    const skippedHourDay = zonedDateTimeFns.from('2019-03-10T00:00[America/Vancouver]')
    const repeatedHourDay = zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
    const inRepeatedHour = zonedDateTimeFns.from('2019-11-03T01:00-07:00[America/Vancouver]')
    const hours12 = durationFns.fromNumbers(0, 0, 0, 0, 12)
    const hours25 = durationFns.fromNumbers(0, 0, 0, 0, 25)
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        assert.equal(`${durationFns.add(hours25, oneDay, { relativeTo: inRepeatedHour })}`, 'P2D')
        assert.equal(`${durationFns.add(oneDay, hours25, { relativeTo: inRepeatedHour })}`, 'P2DT1H')
      })
      it('start after repeated hour, end inside (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-05T01:00[America/Vancouver]')
        assert.equal(
          `${durationFns.add(durationFns.negated(hours25), durationFns.negated(oneDay), { relativeTo })}`,
          '-P2DT1H'
        )
        assert.equal(`${durationFns.add(durationFns.negated(oneDay), durationFns.negated(hours25), { relativeTo })}`, '-P2D')
      })
      it('start inside repeated hour, end in skipped hour', () => {
        assert.equal(
          `${durationFns.add(hours25, durationFns.from({ days: 125, hours: 1 }), { relativeTo: inRepeatedHour })}`,
          'P126DT1H'
        )
        // this takes you to 03:00 on the next skipped-hour day
        assert.equal(
          `${durationFns.add(oneDay, durationFns.from({ days: 125, hours: 1 }), { relativeTo: inRepeatedHour })}`,
          'P126DT1H'
        )
      })
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-08T02:30[America/Vancouver]')
        assert.equal(`${durationFns.add(oneDay, hours25, { relativeTo })}`, 'P2DT1H')
        assert.equal(`${durationFns.add(hours25, oneDay, { relativeTo })}`, 'P2D')
      })
      it('start before skipped hour, end >1 day after', () => {
        assert.equal(`${durationFns.add(hours25, oneDay, { relativeTo: skippedHourDay })}`, 'P2DT2H')
        assert.equal(`${durationFns.add(oneDay, hours25, { relativeTo: skippedHourDay })}`, 'P2DT1H')
      })
      it('start after skipped hour, end >1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-11T00:00[America/Vancouver]')
        assert.equal(
          `${durationFns.add(durationFns.negated(hours25), durationFns.negated(oneDay), { relativeTo })}`,
          '-P2DT2H'
        )
        assert.equal(
          `${durationFns.add(durationFns.negated(oneDay), durationFns.negated(hours25), { relativeTo })}`,
          '-P2DT1H'
        )
      })
      it('start before skipped hour, end <1 day after', () => {
        assert.equal(`${durationFns.add(hours12, oneDay, { relativeTo: skippedHourDay })}`, 'P1DT13H')
        assert.equal(`${durationFns.add(oneDay, hours12, { relativeTo: skippedHourDay })}`, 'P1DT12H')
      })
      it('start after skipped hour, end <1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-10T12:00[America/Vancouver]')
        assert.equal(
          `${durationFns.add(durationFns.negated(hours12), durationFns.negated(oneDay), { relativeTo })}`,
          '-P1DT13H'
        )
        assert.equal(
          `${durationFns.add(durationFns.negated(oneDay), durationFns.negated(hours12), { relativeTo })}`,
          '-P1DT12H'
        )
      })
      it('start before repeated hour, end >1 day after', () => {
        assert.equal(`${durationFns.add(hours25, oneDay, { relativeTo: repeatedHourDay })}`, 'P2D')
        assert.equal(`${durationFns.add(oneDay, hours25, { relativeTo: repeatedHourDay })}`, 'P2DT1H')
      })
      it('start after repeated hour, end >1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-04T00:00[America/Vancouver]')
        assert.equal(`${durationFns.add(durationFns.negated(hours25), durationFns.negated(oneDay), { relativeTo })}`, '-P2D')
        assert.equal(
          `${durationFns.add(durationFns.negated(oneDay), durationFns.negated(hours25), { relativeTo })}`,
          '-P2DT1H'
        )
      })
      it('start before repeated hour, end <1 day after', () => {
        assert.equal(`${durationFns.add(hours12, oneDay, { relativeTo: repeatedHourDay })}`, 'P1DT11H')
        assert.equal(`${durationFns.add(oneDay, hours12, { relativeTo: repeatedHourDay })}`, 'P1DT12H')
      })
      it('start after repeated hour, end <1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-03T12:00[America/Vancouver]')
        assert.equal(
          `${durationFns.add(durationFns.negated(hours12), durationFns.negated(oneDay), { relativeTo })}`,
          '-P1DT11H'
        )
        assert.equal(
          `${durationFns.add(durationFns.negated(oneDay), durationFns.negated(hours12), { relativeTo })}`,
          '-P1DT12H'
        )
      })
      it('Samoa skipped 24 hours', () => {
        const relativeTo = zonedDateTimeFns.from('2011-12-29T12:00-10:00[Pacific/Apia]')
        assert.equal(`${durationFns.add(hours25, oneDay, { relativeTo })}`, 'P3DT1H')
        assert.equal(`${durationFns.add(oneDay, hours25, { relativeTo })}`, 'P3DT1H')
      })
    })
    it('casts relativeTo to ZonedDateTime if possible', () => {
      assert.equal(
        `${durationFns.add(oneDay, hours24, { relativeTo: zonedDateTimeFns.from('2019-11-02T00:00[America/Vancouver]') })}`,
        'P1DT24H'
      )
      assert.equal(
        `${durationFns.add(oneDay, hours24, {
          relativeTo: zonedDateTimeFns.from({ year: 2019, month: 11, day: 2, timeZone: 'America/Vancouver' })
        })}`,
        'P1DT24H'
      )
    })
    it('casts relativeTo to PlainDateTime if possible', () => {
      assert.equal(`${durationFns.add(oneDay, hours24, { relativeTo: '2019-11-02T00:00' })}`, 'P2D')
      assert.equal(
        `${durationFns.add(oneDay, hours24, { relativeTo: dateTimeFns.from({ year: 2019, month: 11, day: 2 }) })}`,
        'P2D'
      )
    })
    it('at least the required properties must be present in relativeTo', () => {
      assert.throws(
        () => durationFns.add(oneDay, hours24, { relativeTo: dateTimeFns.from({ month: 11, day: 3 }) }),
        TypeError
      )
      assert.throws(
        () => durationFns.add(oneDay, hours24, { relativeTo: dateTimeFns.from({ year: 2019, month: 11 }) }),
        TypeError
      )
      assert.throws(
        () => durationFns.add(oneDay, hours24, { relativeTo: dateTimeFns.from({ year: 2019, day: 3 }) }),
        TypeError
      )
    })
  })
  describe('Duration.subtract()', () => {
    const duration = durationFns.from({ days: 3, hours: 1, minutes: 10 })
    it('subtracts same units with positive result', () => {
      assert.equal(`${durationFns.subtract(duration, { days: 1, minutes: 5 })}`, 'P2DT1H5M')
    })
    it('subtracts same units with zero result', () => {
      assert.equal(`${durationFns.subtract(duration, duration)}`, 'PT0S')
      assert.equal(`${durationFns.subtract(duration, { days: 3 })}`, 'PT1H10M')
      assert.equal(`${durationFns.subtract(duration, { minutes: 10 })}`, 'P3DT1H')
    })
    it('balances when subtracting same units with negative result', () => {
      assert.equal(`${durationFns.subtract(duration, { minutes: 15 })}`, 'P3DT55M')
    })
    it('balances when subtracting different units', () => {
      assert.equal(`${durationFns.subtract(duration, { seconds: 30 })}`, 'P3DT1H9M30S')
    })
    it('symmetric with regard to negative durations', () => {
      assert.equal(`${durationFns.subtract(durationFns.from('P2DT1H5M'), { days: -1, minutes: -5 })}`, 'P3DT1H10M')
      assert.equal(`${durationFns.subtract(durationFns.fromNumbers(), { days: -3, hours: -1, minutes: -10 })}`, 'P3DT1H10M')
      assert.equal(`${durationFns.subtract(durationFns.from('PT1H10M'), { days: -3 })}`, 'P3DT1H10M')
      assert.equal(`${durationFns.subtract(durationFns.from('P3DT1H'), { minutes: -10 })}`, 'P3DT1H10M')
      assert.equal(`${durationFns.subtract(durationFns.from('P3DT55M'), { minutes: -15 })}`, 'P3DT1H10M')
      assert.equal(`${durationFns.subtract(durationFns.from('P3DT1H9M30S'), { seconds: -30 })}`, 'P3DT1H10M')
    })
    it('balances positive units up to the largest nonzero unit', () => {
      const d = durationFns.from({
        minutes: 100,
        seconds: 100,
        milliseconds: 2000
      })
      const less = durationFns.from({
        minutes: 10,
        seconds: 10,
        milliseconds: 500
      })
      const result = durationFns.subtract(d, less)
      assert.equal(durationFns.getMinutes(result), 91)
      assert.equal(durationFns.getSeconds(result), 31)
      assert.equal(durationFns.getMilliseconds(result), 500)
    })
    const tenDays = durationFns.from('P10D')
    const tenMinutes = durationFns.from('PT10M')
    it('has correct negative result', () => {
      let result = durationFns.subtract(tenDays, { days: 15 })
      assert.equal(durationFns.getDays(result), -5)
      result = durationFns.subtract(tenMinutes, { minutes: 15 })
      assert.equal(durationFns.getMinutes(result), -5)
    })
    it('balances correctly if subtracting different units flips the overall sign', () => {
      const d1 = durationFns.from({ hours: 1, seconds: 60 })
      assert.equal(`${durationFns.subtract(d1, { minutes: 122 })}`, '-PT1H1M')
      const d2 = durationFns.from({ minutes: 59, seconds: 59 })
      assert.equal(`${durationFns.subtract(d2, { minutes: 61 })}`, '-PT1M1S')
    })
    it('mixed positive and negative values always throw', () => {
      assert.throws(() => durationFns.subtract(duration, { hours: 1, minutes: -30 }), RangeError)
    })
    it('relativeTo required for years, months, and weeks', () => {
      const d = durationFns.from({ hours: 1 })
      const dy = durationFns.from({ years: 1, hours: 1 })
      const dm = durationFns.from({ months: 1, hours: 1 })
      const dw = durationFns.from({ weeks: 1, hours: 1 })
      assert.throws(() => durationFns.subtract(d, dy), RangeError)
      assert.throws(() => durationFns.subtract(d, dm), RangeError)
      assert.throws(() => durationFns.subtract(d, dw), RangeError)
      assert.throws(() => durationFns.subtract(dy, d), RangeError)
      assert.throws(() => durationFns.subtract(dm, d), RangeError)
      assert.throws(() => durationFns.subtract(dw, d), RangeError)
      const relativeTo = dateTimeFns.from('2000-01-01')
      assert.equal(`${durationFns.subtract(d, dy, { relativeTo })}`, '-P1Y')
      assert.equal(`${durationFns.subtract(d, dm, { relativeTo })}`, '-P1M')
      assert.equal(`${durationFns.subtract(d, dw, { relativeTo })}`, '-P1W')
      assert.equal(`${durationFns.subtract(dy, d, { relativeTo })}`, 'P1Y')
      assert.equal(`${durationFns.subtract(dm, d, { relativeTo })}`, 'P1M')
      assert.equal(`${durationFns.subtract(dw, d, { relativeTo })}`, 'P1W')
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => durationFns.subtract(duration, { hours: 1 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        //@ts-expect-error
        assert.equal(durationFns.getHours(durationFns.subtract(duration, { hours: 1 }, options)), 0)
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => durationFns.subtract(duration, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => durationFns.subtract(duration, { month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${durationFns.subtract(duration, { month: 1, days: 1 })}`, 'P2DT1H10M')
    })
    it('casts argument', () => {
      assert.equal(`${durationFns.subtract(duration, durationFns.from('P1DT5M'))}`, 'P2DT1H5M')
      assert.equal(`${durationFns.subtract(duration, 'P1DT5M')}`, 'P2DT1H5M')
    })
    it('relativeTo affects year length', () => {
      const oneYear = durationFns.fromNumbers(1)
      const days365 = durationFns.fromNumbers(0, 0, 0, 365)
      assert.equal(`${durationFns.subtract(oneYear, days365, { relativeTo: dateTimeFns.from('2017-01-01') })}`, 'PT0S')
      assert.equal(`${durationFns.subtract(oneYear, days365, { relativeTo: dateTimeFns.from('2016-01-01') })}`, 'P1D')
    })
    it('relativeTo affects month length', () => {
      const oneMonth = durationFns.fromNumbers(0, 1)
      const days30 = durationFns.fromNumbers(0, 0, 0, 30)
      assert.equal(`${durationFns.subtract(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-02-01') })}`, '-P2D')
      assert.equal(`${durationFns.subtract(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-03-01') })}`, 'P1D')
      assert.equal(`${durationFns.subtract(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-04-01') })}`, 'PT0S')
    })
    it('first this is resolved against relativeTo, then the argument against relativeTo + this', () => {
      const d1 = durationFns.fromNumbers(0, 2, 1, 4)
      const d2 = durationFns.fromNumbers(0, 1, 1, 1)
      const relativeTo = dateTimeFns.fromNumbers(2000, 1, 1)
      assert.equal(`${durationFns.subtract(d1, d2, { relativeTo })}`, 'P1M3D')
    })
    const oneDay = durationFns.fromNumbers(0, 0, 0, 1)
    const hours24 = durationFns.fromNumbers(0, 0, 0, 0, 24)
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = dateTimeFns.from('2017-01-01')
      assert.equal(`${durationFns.subtract(oneDay, hours24, { relativeTo })}`, 'PT0S')
    })
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = zonedDateTimeFns.from('2017-01-01T00:00[America/Montevideo]')
      assert.equal(`${durationFns.subtract(oneDay, hours24, { relativeTo })}`, 'PT0S')
    })
    const skippedHourDay = zonedDateTimeFns.from('2019-03-10T00:00[America/Vancouver]')
    const repeatedHourDay = zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
    const inRepeatedHour = zonedDateTimeFns.from('2019-11-03T01:00-07:00[America/Vancouver]')
    const twoDays = durationFns.fromNumbers(0, 0, 0, 2)
    const threeDays = durationFns.fromNumbers(0, 0, 0, 3)
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        assert.equal(`${durationFns.subtract(hours24, oneDay, { relativeTo: inRepeatedHour })}`, '-PT1H')
        assert.equal(`${durationFns.subtract(oneDay, hours24, { relativeTo: inRepeatedHour })}`, 'PT1H')
      })
      it('start inside repeated hour, end in skipped hour', () => {
        assert.equal(
          `${durationFns.subtract(durationFns.from({ days: 127, hours: 1 }), oneDay, { relativeTo: inRepeatedHour })}`,
          'P126DT1H'
        )
        assert.equal(
          `${durationFns.subtract(durationFns.from({ days: 127, hours: 1 }), hours24, { relativeTo: inRepeatedHour })}`,
          'P126D'
        )
      })
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-09T02:30[America/Vancouver]')
        assert.equal(`${durationFns.subtract(hours24, oneDay, { relativeTo })}`, 'PT1H')
        assert.equal(`${durationFns.subtract(oneDay, hours24, { relativeTo })}`, 'PT0S')
      })
      it('start before skipped hour, end >1 day after', () => {
        assert.equal(`${durationFns.subtract(threeDays, hours24, { relativeTo: skippedHourDay })}`, 'P2D')
        assert.equal(`${durationFns.subtract(hours24, threeDays, { relativeTo: skippedHourDay })}`, '-P1DT23H')
      })
      it('start before skipped hour, end <1 day after', () => {
        assert.equal(`${durationFns.subtract(twoDays, hours24, { relativeTo: skippedHourDay })}`, 'P1D')
        assert.equal(`${durationFns.subtract(hours24, twoDays, { relativeTo: skippedHourDay })}`, '-PT23H')
      })
      it('start before repeated hour, end >1 day after', () => {
        assert.equal(`${durationFns.subtract(threeDays, hours24, { relativeTo: repeatedHourDay })}`, 'P2D')
        assert.equal(`${durationFns.subtract(hours24, threeDays, { relativeTo: repeatedHourDay })}`, '-P2DT1H')
      })
      it('start before repeated hour, end <1 day after', () => {
        assert.equal(`${durationFns.subtract(twoDays, hours24, { relativeTo: repeatedHourDay })}`, 'P1D')
        assert.equal(`${durationFns.subtract(hours24, twoDays, { relativeTo: repeatedHourDay })}`, '-P1DT1H')
      })
      it('Samoa skipped 24 hours', () => {
        const relativeTo = zonedDateTimeFns.from('2011-12-29T12:00-10:00[Pacific/Apia]')
        assert.equal(`${durationFns.subtract(twoDays, durationFns.from({ hours: 48 }), { relativeTo })}`, '-P1D')
        assert.equal(`${durationFns.subtract(durationFns.from({ hours: 48 }), twoDays, { relativeTo })}`, 'P2D')
      })
    })
    it('casts relativeTo to ZonedDateTime if possible', () => {
      assert.equal(
        `${durationFns.subtract(oneDay, hours24, {
          relativeTo: zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
        })}`,
        'PT1H'
      )
      assert.equal(
        `${durationFns.subtract(oneDay, hours24, {
          relativeTo: zonedDateTimeFns.from({ year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' })
        })}`,
        'PT1H'
      )
    })
    it('casts relativeTo to PlainDateTime if possible', () => {
      assert.equal(`${durationFns.subtract(oneDay, hours24, { relativeTo: '2019-11-02T00:00' })}`, 'PT0S')
      assert.equal(
        `${durationFns.subtract(oneDay, hours24, { relativeTo: dateTimeFns.from({ year: 2019, month: 11, day: 2 }) })}`,
        'PT0S'
      )
    })
    it('at least the required properties must be present in relativeTo', () => {
      assert.throws(
        () => durationFns.subtract(oneDay, hours24, { relativeTo: dateTimeFns.from({ month: 11, day: 3 }) }),
        TypeError
      )
      assert.throws(
        () => durationFns.subtract(oneDay, hours24, { relativeTo: dateTimeFns.from({ year: 2019, month: 11 }) }),
        TypeError
      )
      assert.throws(
        () => durationFns.subtract(oneDay, hours24, { relativeTo: dateTimeFns.from({ year: 2019, day: 3 }) }),
        TypeError
      )
    })
  })
  describe('Duration.negated()', () => {
    it('makes a positive duration negative', () => {
      const pos = durationFns.from('P3DT1H')
      const neg = durationFns.negated(pos)
      assert.equal(neg, '-P3DT1H')
      assert.equal(durationFns.getSign(neg), -1)
    })
    it('makes a negative duration positive', () => {
      const neg = durationFns.from('-PT2H20M30S')
      const pos = durationFns.negated(neg)
      assert.equal(pos, 'PT2H20M30S')
      assert.equal(durationFns.getSign(pos), 1)
    })
    it('makes a copy of a zero duration', () => {
      const zero = durationFns.from('PT0S')
      const zero2 = durationFns.negated(zero)
      assert.equal(zero, zero)
      assert.equal(durationFns.getSign(zero2), 0)
      assert.equal(durationFns.getYears(zero2), 0)
      assert.equal(durationFns.getMonths(zero2), 0)
      assert.equal(durationFns.getWeeks(zero2), 0)
      assert.equal(durationFns.getDays(zero2), 0)
      assert.equal(durationFns.getHours(zero2), 0)
      assert.equal(durationFns.getMinutes(zero2), 0)
      assert.equal(durationFns.getSeconds(zero2), 0)
      assert.equal(durationFns.getMilliseconds(zero2), 0)
    })
  })
  describe('Duration.abs()', () => {
    it('makes a copy of a positive duration', () => {
      const pos = durationFns.from('P3DT1H')
      const pos2 = durationFns.abs(pos)
      assert.equal(pos, pos2)
      assert.equal(durationFns.getSign(pos2), 1)
    })
    it('makes a negative duration positive', () => {
      const neg = durationFns.from('-PT2H20M30S')
      const pos = durationFns.abs(neg)
      assert.equal(pos, 'PT2H20M30S')
      assert.equal(durationFns.getSign(pos), 1)
    })
    it('makes a copy of a zero duration', () => {
      const zero = durationFns.from('PT0S')
      const zero2 = durationFns.abs(zero)
      assert.equal(zero, zero2)
      assert.equal(durationFns.getSign(zero2), 0)
    })
  })
  describe('Duration.blank', () => {
    it('works', () => {
      assert(!durationFns.isBlank(durationFns.from('P3DT1H')))
      assert(!durationFns.isBlank(durationFns.from('-PT2H20M30S')))
      assert(durationFns.isBlank(durationFns.from('PT0S')))
    })
    it('zero regardless of how many fields are in the duration', () => {
      const zero = durationFns.from({
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      })
      assert(durationFns.isBlank(zero))
    })
  })
  describe('Duration.round()', () => {
    const d = durationFns.fromNumbers(5, 5, 5, 5, 5, 5, 5, 5)
    const d2 = durationFns.fromNumbers(0, 0, 0, 5, 5, 5, 5, 5)
    const relativeTo = dateTimeFns.from('2020-01-01T00:00')
    it('options may only be an object', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => durationFns.round(d, badOptions), TypeError)
      )
    })
    it('throws without parameter', () => {
      //@ts-expect-error
      assert.throws(() => durationFns.round(d, TypeError))
    })
    it('throws with empty object', () => {
      assert.throws(() => durationFns.round(d, {}), RangeError)
    })
    it("succeeds with largestUnit: 'auto'", () => {
      assert.equal(`${durationFns.round(durationFns.from({ hours: 25 }), { largestUnit: 'auto' })}`, 'PT25H')
    })
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => durationFns.round(d, { smallestUnit }), RangeError)
      })
    })
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = [
        'years',
        'months',
        'weeks',
        'days',
        'hours',
        'minutes',
        'seconds',
        'milliseconds'
      ] as TemporalPluralUnit[]
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx]
          const smallestUnit = units[smallestIdx]
          assert.throws(() => durationFns.round(d, { largestUnit, smallestUnit, relativeTo }), RangeError)
        }
      }
    })
    it('assumes a different default for largestUnit if smallestUnit is larger than the default', () => {
      const almostYear = durationFns.from({ days: 364 })
      assert.equal(`${durationFns.round(almostYear, { smallestUnit: 'year', relativeTo })}`, 'P1Y')
      const almostMonth = durationFns.from({ days: 27 })
      assert.equal(`${durationFns.round(almostMonth, { smallestUnit: 'month', relativeTo })}`, 'P1M')
      const almostWeek = durationFns.from({ days: 6 })
      assert.equal(`${durationFns.round(almostWeek, { smallestUnit: 'week', relativeTo })}`, 'P1W')
      const almostDay = durationFns.from({ seconds: 86399 })
      assert.equal(`${durationFns.round(almostDay, { smallestUnit: 'day' })}`, 'P1D')
      const almostHour = durationFns.from({ seconds: 3599 })
      assert.equal(`${durationFns.round(almostHour, { smallestUnit: 'hour' })}`, 'PT1H')
      const almostMinute = durationFns.from({ seconds: 59 })
      assert.equal(`${durationFns.round(almostMinute, { smallestUnit: 'minute' })}`, 'PT1M')
    })
    const hours25 = durationFns.fromNumbers(0, 0, 0, 0, 25)
    it('days are 24 hours if relativeTo not given', () => {
      assert.equal(`${durationFns.round(hours25, { largestUnit: 'day' })}`, 'P1DT1H')
    })
    it('days are 24 hours if relativeTo is PlainDateTime', () => {
      const relativeTo = dateTimeFns.from('2017-01-01')
      assert.equal(`${durationFns.round(hours25, { largestUnit: 'day', relativeTo })}`, 'P1DT1H')
    })
    it('days are 24 hours if relativeTo is ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = zonedDateTimeFns.from('2017-01-01T00:00[America/Montevideo]')
      assert.equal(`${durationFns.round(hours25, { largestUnit: 'day', relativeTo })}`, 'P1DT1H')
    })
    const skippedHourDay = zonedDateTimeFns.from('2019-03-10T00:00[America/Vancouver]')
    const repeatedHourDay = zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
    const inRepeatedHour = zonedDateTimeFns.from('2019-11-03T01:00-07:00[America/Vancouver]')
    const oneDay = durationFns.fromNumbers(0, 0, 0, 1)
    const hours12 = durationFns.fromNumbers(0, 0, 0, 0, 12)
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        assert.equal(`${durationFns.round(hours25, { largestUnit: 'day', relativeTo: inRepeatedHour })}`, 'P1D')
        assert.equal(`${durationFns.round(oneDay, { largestUnit: 'hour', relativeTo: inRepeatedHour })}`, 'PT25H')
      })
      it('start after repeated hour, end inside (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-04T01:00[America/Vancouver]')
        assert.equal(`${durationFns.round(durationFns.negated(hours25), { largestUnit: 'day', relativeTo })}`, '-P1D')
        assert.equal(`${durationFns.round(durationFns.negated(oneDay), { largestUnit: 'hour', relativeTo })}`, '-PT25H')
      })
      it('start inside repeated hour, end in skipped hour', () => {
        assert.equal(
          durationFns.round(durationFns.from({ days: 126, hours: 1 }), {
            largestUnit: 'day',
            relativeTo: inRepeatedHour
          }),
          'P126DT1H'
        )
        assert.equal('PT3026H')
      })
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-09T02:30[America/Vancouver]')
        assert.equal(`${durationFns.round(hours25, { largestUnit: 'day', relativeTo })}`, 'P1DT1H')
        assert.equal(`${durationFns.round(oneDay, { largestUnit: 'hour', relativeTo })}`, 'PT24H')
      })
      it('start before skipped hour, end >1 day after', () => {
        assert.equal(`${durationFns.round(hours25, { largestUnit: 'day', relativeTo: skippedHourDay })}`, 'P1DT2H')
        assert.equal(`${durationFns.round(oneDay, { largestUnit: 'hour', relativeTo: skippedHourDay })}`, 'PT23H')
      })
      it('start after skipped hour, end >1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-11T00:00[America/Vancouver]')
        assert.equal(`${durationFns.round(durationFns.negated(hours25), { largestUnit: 'day', relativeTo })}`, '-P1DT2H')
        assert.equal(`${durationFns.round(durationFns.negated(oneDay), { largestUnit: 'hour', relativeTo })}`, '-PT23H')
      })
      it('start before skipped hour, end <1 day after', () => {
        assert.equal(`${durationFns.round(hours12, { largestUnit: 'day', relativeTo: skippedHourDay })}`, 'PT12H')
      })
      it('start after skipped hour, end <1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-10T12:00[America/Vancouver]')
        assert.equal(`${durationFns.round(durationFns.negated(hours12), { largestUnit: 'day', relativeTo })}`, '-PT12H')
      })
      it('start before repeated hour, end >1 day after', () => {
        assert.equal(`${durationFns.round(hours25, { largestUnit: 'day', relativeTo: repeatedHourDay })}`, 'P1D')
        assert.equal(`${durationFns.round(oneDay, { largestUnit: 'hour', relativeTo: repeatedHourDay })}`, 'PT25H')
      })
      it('start after repeated hour, end >1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-04T00:00[America/Vancouver]')
        assert.equal(`${durationFns.round(durationFns.negated(hours25), { largestUnit: 'day', relativeTo })}`, '-P1D')
        assert.equal(`${durationFns.round(durationFns.negated(oneDay), { largestUnit: 'hour', relativeTo })}`, '-PT25H')
      })
      it('start before repeated hour, end <1 day after', () => {
        assert.equal(`${durationFns.round(hours12, { largestUnit: 'day', relativeTo: repeatedHourDay })}`, 'PT12H')
      })
      it('start after repeated hour, end <1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-03T12:00[America/Vancouver]')
        assert.equal(`${durationFns.round(durationFns.negated(hours12), { largestUnit: 'day', relativeTo })}`, '-PT12H')
      })
      it('Samoa skipped 24 hours', () => {
        const relativeTo = zonedDateTimeFns.from('2011-12-29T12:00-10:00[Pacific/Apia]')
        assert.equal(`${durationFns.round(hours25, { largestUnit: 'day', relativeTo })}`, 'P2DT1H')
        assert.equal(`${durationFns.round(durationFns.from({ hours: 48 }), { largestUnit: 'day', relativeTo })}`, 'P3D')
      })
    })
    it('casts relativeTo to ZonedDateTime if possible', () => {
      assert.equal(
        `${durationFns.round(hours25, {
          largestUnit: 'day',
          relativeTo: zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
        })}`,
        'P1D'
      )
      assert.equal(
        `${durationFns.round(hours25, {
          largestUnit: 'day',
          relativeTo: zonedDateTimeFns.from({ year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' })
        })}`,
        'P1D'
      )
    })
    it('casts relativeTo to PlainDateTime if possible', () => {
      assert.equal(
        `${durationFns.round(hours25, { largestUnit: 'day', relativeTo: dateTimeFns.from('2019-11-02T00:00') })}`,
        'P1DT1H'
      )
      assert.equal(
        `${durationFns.round(hours25, {
          largestUnit: 'day',
          relativeTo: dateTimeFns.from({ year: 2019, month: 11, day: 2 })
        })}`,
        'P1DT1H'
      )
    })
    it('accepts datetime string equivalents or fields for relativeTo', () => {
      ;[
        dateFns.from('2020-01-01'),
        dateTimeFns.from('2020-01-01T00:00:00.000'),
        dateFns.from(20200101),
        dateFns.from({ year: 2020, month: 1, day: 1 })
      ].forEach((relativeTo) => {
        assert.equal(`${durationFns.round(d, { smallestUnit: 'second', relativeTo })}`, 'P5Y5M5W5DT5H5M5S')
      })
    })
    it("throws on relativeTo that can't be converted to datetime string", () => {
      //@ts-expect-error
      assert.throws(() => durationFns.round(d, { smallestUnit: 'second', relativeTo: Symbol('foo') }), TypeError)
    })
    it('throws on relativeTo that converts to an invalid datetime string', () => {
      ;[3.14, true, null, 'hello'].forEach((relativeTo) => {
        //@ts-expect-error
        assert.throws(() => durationFns.round(d, { smallestUnit: 'second', relativeTo }), RangeError)
      })
    })
    it('relativeTo object must contain at least the required correctly-spelled properties', () => {
      //@ts-expect-error
      assert.throws(() => durationFns.round(hours25, { largestUnit: 'day', relativeTo: { month: 11, day: 3 } }), TypeError)
      assert.throws(
        //@ts-expect-error
        () => durationFns.round(hours25, { largestUnit: 'day', relativeTo: { year: 2019, month: 11 } }),
        TypeError
      )
      //@ts-expect-error
      assert.throws(() => durationFns.round(hours25, { largestUnit: 'day', relativeTo: { year: 2019, day: 3 } }), TypeError)
    })
    it('incorrectly-spelled properties are ignored in relativeTo', () => {
      const oneMonth = durationFns.from({ months: 1 })
      assert.equal(
        `${durationFns.round(oneMonth, {
          largestUnit: 'day',
          relativeTo: dateFns.from({ year: 2020, month: 1, day: 1, months: 2 })
        })}`,
        'P31D'
      )
    })
    it('throws on invalid roundingMode', () => {
      //@ts-expect-error
      assert.throws(() => durationFns.round(d2, { smallestUnit: 'millisecond', roundingMode: 'cile' }), RangeError)
    })
    it('throws if neither one of largestUnit or smallestUnit is given', () => {
      const hoursOnly = durationFns.fromNumbers(0, 0, 0, 0, 1)
      ;[{}, () => {}, { roundingMode: 'ceil' }].forEach((options) => {
        //@ts-expect-error
        assert.throws(() => durationFns.round(d, options), RangeError)
        //@ts-expect-error
        assert.throws(() => durationFns.round(hoursOnly, options), RangeError)
      })
    })
    it('relativeTo is not required for rounding non-calendar units in durations without calendar units', () => {
      assert.equal(`${durationFns.round(d2, { smallestUnit: 'day' })}`, 'P5D')
      assert.equal(`${durationFns.round(d2, { smallestUnit: 'hour' })}`, 'P5DT5H')
      assert.equal(`${durationFns.round(d2, { smallestUnit: 'minute' })}`, 'P5DT5H5M')
      assert.equal(`${durationFns.round(d2, { smallestUnit: 'second' })}`, 'P5DT5H5M5S')
      assert.equal(`${durationFns.round(d2, { smallestUnit: 'millisecond' })}`, 'P5DT5H5M5.005S')
    })
    it('relativeTo is required for rounding calendar units even in durations without calendar units', () => {
      assert.throws(() => durationFns.round(d2, { smallestUnit: 'year' }), RangeError)
      assert.throws(() => durationFns.round(d2, { smallestUnit: 'month' }), RangeError)
      assert.throws(() => durationFns.round(d2, { smallestUnit: 'week' }), RangeError)
    })
    it('relativeTo is required for rounding durations with calendar units', () => {
      assert.throws(() => durationFns.round(d, { largestUnit: 'year' }), RangeError)
      assert.throws(() => durationFns.round(d, { largestUnit: 'month' }), RangeError)
      assert.throws(() => durationFns.round(d, { largestUnit: 'week' }), RangeError)
      assert.throws(() => durationFns.round(d, { largestUnit: 'day' }), RangeError)
      assert.throws(() => durationFns.round(d, { largestUnit: 'hour' }), RangeError)
      assert.throws(() => durationFns.round(d, { largestUnit: 'minute' }), RangeError)
      assert.throws(() => durationFns.round(d, { largestUnit: 'second' }), RangeError)
      assert.throws(() => durationFns.round(d, { largestUnit: 'millisecond' }), RangeError)
    })
    it('durations do not balance beyond their current largest unit by default', () => {
      const fortyDays = durationFns.from({ days: 40 })
      assert.equal(`${durationFns.round(fortyDays, { smallestUnit: 'second' })}`, 'P40D')
    })
    const roundAndBalanceResults = {
      // largestUnit
      years: {
        // smallestUnit
        years: 'P6Y',
        months: 'P5Y6M',
        weeks: 'P5Y5M6W',
        days: 'P5Y5M5W5D',
        hours: 'P5Y5M5W5DT5H',
        minutes: 'P5Y5M5W5DT5H5M',
        seconds: 'P5Y5M5W5DT5H5M5S',
        milliseconds: 'P5Y5M5W5DT5H5M5.005S'
      },
      months: {
        months: 'P66M',
        weeks: 'P65M6W',
        days: 'P65M5W5D',
        hours: 'P65M5W5DT5H',
        minutes: 'P65M5W5DT5H5M',
        seconds: 'P65M5W5DT5H5M5S',
        milliseconds: 'P65M5W5DT5H5M5.005S'
      },
      weeks: {
        weeks: 'P288W',
        days: 'P288W2D',
        hours: 'P288W2DT5H',
        minutes: 'P288W2DT5H5M',
        seconds: 'P288W2DT5H5M5S',
        milliseconds: 'P288W2DT5H5M5.005S'
      },
      days: {
        days: 'P2018D',
        hours: 'P2018DT5H',
        minutes: 'P2018DT5H5M',
        seconds: 'P2018DT5H5M5S',
        milliseconds: 'P2018DT5H5M5.005S'
      },
      hours: {
        hours: 'PT48437H',
        minutes: 'PT48437H5M',
        seconds: 'PT48437H5M5S',
        milliseconds: 'PT48437H5M5.005S'
      },
      minutes: {
        // minutes: 'PT2906225M',
        // seconds: 'PT2906225M5S',
        // milliseconds: 'PT2906225M5.005S'
      },
      seconds: {
        // seconds: 'PT174373505S',
        // milliseconds: 'PT174373505.005S'
      },
      milliseconds: {
        // milliseconds: 'PT174373505.005S'
      }
    }
    for (const [largestUnit, entry] of Object.entries(roundAndBalanceResults)) {
      for (const [smallestUnit, expected] of Object.entries(entry)) {
        it(`round(${largestUnit}, ${smallestUnit}) = ${expected}`, () => {
          //@ts-ignore
          assert.equal(`${durationFns.round(d, { largestUnit, smallestUnit, relativeTo })}`, expected)
        })
      }
    }
    const roundingModeResults = {
      halfExpand: ['P6Y', '-P6Y'],
      ceil: ['P6Y', '-P5Y'],
      floor: ['P5Y', '-P6Y'],
      trunc: ['P5Y', '-P5Y']
    }
    for (const [roundingMode, [posResult, negResult]] of Object.entries(roundingModeResults)) {
      it(`rounds correctly in ${roundingMode} mode`, () => {
        assert.equal(
          `${durationFns.round(d, {
            smallestUnit: 'year',
            relativeTo,
            roundingMode: roundingMode as TemporalRoundingMode
          })}`,
          posResult
        )
        assert.equal(
          `${durationFns.round(durationFns.negated(d), {
            smallestUnit: 'year',
            relativeTo,
            roundingMode: roundingMode as TemporalRoundingMode
          })}`,
          negResult
        )
      })
    }
    it('halfExpand is the default', () => {
      assert.equal(`${durationFns.round(d, { smallestUnit: 'year', relativeTo })}`, 'P6Y')
      assert.equal(`${durationFns.round(durationFns.negated(d), { smallestUnit: 'year', relativeTo })}`, '-P6Y')
    })
    it('balances up differently depending on relativeTo', () => {
      const fortyDays = durationFns.from({ days: 40 })
      assert.equal(`${durationFns.round(fortyDays, { largestUnit: 'year', relativeTo: '2020-01-01' })}`, 'P1M9D')
      assert.equal(`${durationFns.round(fortyDays, { largestUnit: 'year', relativeTo: '2020-02-01' })}`, 'P1M11D')
      assert.equal(`${durationFns.round(fortyDays, { largestUnit: 'year', relativeTo: '2020-03-01' })}`, 'P1M9D')
      assert.equal(`${durationFns.round(fortyDays, { largestUnit: 'year', relativeTo: '2020-04-01' })}`, 'P1M10D')
      const minusForty = durationFns.from({ days: -40 })
      assert.equal(`${durationFns.round(minusForty, { largestUnit: 'year', relativeTo: '2020-02-01' })}`, '-P1M9D')
      assert.equal(`${durationFns.round(minusForty, { largestUnit: 'year', relativeTo: '2020-01-01' })}`, '-P1M9D')
      assert.equal(`${durationFns.round(minusForty, { largestUnit: 'year', relativeTo: '2020-03-01' })}`, '-P1M11D')
      assert.equal(`${durationFns.round(minusForty, { largestUnit: 'year', relativeTo: '2020-04-01' })}`, '-P1M9D')
    })
    it('balances up to the next unit after rounding', () => {
      const almostWeek = durationFns.from({ days: 6, hours: 20 })
      assert.equal(
        `${durationFns.round(almostWeek, { largestUnit: 'week', smallestUnit: 'day', relativeTo: '2020-01-01' })}`,
        'P1W'
      )
    })
    it('balances days up to both years and months', () => {
      const twoYears = durationFns.from({ months: 11, days: 396 })
      assert.equal(`${durationFns.round(twoYears, { largestUnit: 'year', relativeTo: '2017-01-01' })}`, 'P2Y')
    })
    it('does not balance up to weeks if largestUnit is larger than weeks', () => {
      const monthAlmostWeek = durationFns.from({ months: 1, days: 6, hours: 20 })
      assert.equal(`${durationFns.round(monthAlmostWeek, { smallestUnit: 'day', relativeTo: '2020-01-01' })}`, 'P1M7D')
    })
    it('balances down differently depending on relativeTo', () => {
      const oneYear = durationFns.from({ years: 1 })
      assert.equal(`${durationFns.round(oneYear, { largestUnit: 'day', relativeTo: '2019-01-01' })}`, 'P365D')
      assert.equal(`${durationFns.round(oneYear, { largestUnit: 'day', relativeTo: '2019-07-01' })}`, 'P366D')
      const minusYear = durationFns.from({ years: -1 })
      assert.equal(`${durationFns.round(minusYear, { largestUnit: 'day', relativeTo: '2020-01-01' })}`, '-P365D')
      assert.equal(`${durationFns.round(minusYear, { largestUnit: 'day', relativeTo: '2020-07-01' })}`, '-P366D')
    })
    it('rounds to an increment of hours', () => {
      assert.equal(`${durationFns.round(d, { smallestUnit: 'hour', roundingIncrement: 3, relativeTo })}`, 'P5Y5M5W5DT6H')
    })
    it('rounds to an increment of minutes', () => {
      assert.equal(`${durationFns.round(d, { smallestUnit: 'minute', roundingIncrement: 30, relativeTo })}`, 'P5Y5M5W5DT5H')
    })
    it('rounds to an increment of seconds', () => {
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'second', roundingIncrement: 15, relativeTo })}`,
        'P5Y5M5W5DT5H5M'
      )
    })
    it('rounds to an increment of milliseconds', () => {
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'millisecond', roundingIncrement: 10, relativeTo })}`,
        'P5Y5M5W5DT5H5M5.01S'
      )
    })
    it('valid hour increments divide into 24', () => {
      ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hour', roundingIncrement, relativeTo } as const
        assert(durationFns.isValid(durationFns.round(d, options)))
      })
    })
    let units: [TemporalPluralUnit, TemporalPluralUnit] = ['minutes', 'seconds']
    units.forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement, relativeTo }
          assert(durationFns.isValid(durationFns.round(d, options)))
        })
      })
    })
    it(`valid millisecond increments divide into 1000`, () => {
      ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'millisecond', roundingIncrement, relativeTo } as const
        assert(durationFns.isValid(durationFns.round(d, options)))
      })
    })
    it('throws on increments that do not divide evenly into the next highest', () => {
      assert.throws(() => durationFns.round(d, { relativeTo, smallestUnit: 'hour', roundingIncrement: 11 }), RangeError)
      assert.throws(() => durationFns.round(d, { relativeTo, smallestUnit: 'minute', roundingIncrement: 29 }), RangeError)
      assert.throws(() => durationFns.round(d, { relativeTo, smallestUnit: 'second', roundingIncrement: 29 }), RangeError)
      assert.throws(
        () => durationFns.round(d, { relativeTo, smallestUnit: 'millisecond', roundingIncrement: 29 }),
        RangeError
      )
    })
    it('throws on increments that are equal to the next highest', () => {
      assert.throws(() => durationFns.round(d, { relativeTo, smallestUnit: 'hour', roundingIncrement: 24 }), RangeError)
      assert.throws(() => durationFns.round(d, { relativeTo, smallestUnit: 'minute', roundingIncrement: 60 }), RangeError)
      assert.throws(() => durationFns.round(d, { relativeTo, smallestUnit: 'second', roundingIncrement: 60 }), RangeError)
      assert.throws(
        () => durationFns.round(d, { relativeTo, smallestUnit: 'millisecond', roundingIncrement: 1000 }),
        RangeError
      )
    })
    it('accepts singular units', () => {
      assert.equal(
        `${durationFns.round(d, { largestUnit: 'year', relativeTo })}`,
        `${durationFns.round(d, { largestUnit: 'years', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'year', relativeTo })}`,
        `${durationFns.round(d, { smallestUnit: 'years', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { largestUnit: 'month', relativeTo })}`,
        `${durationFns.round(d, { largestUnit: 'months', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'month', relativeTo })}`,
        `${durationFns.round(d, { smallestUnit: 'months', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { largestUnit: 'day', relativeTo })}`,
        `${durationFns.round(d, { largestUnit: 'days', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'day', relativeTo })}`,
        `${durationFns.round(d, { smallestUnit: 'days', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { largestUnit: 'hour', relativeTo })}`,
        `${durationFns.round(d, { largestUnit: 'hours', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'hour', relativeTo })}`,
        `${durationFns.round(d, { smallestUnit: 'hours', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { largestUnit: 'minute', relativeTo })}`,
        `${durationFns.round(d, { largestUnit: 'minutes', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'minute', relativeTo })}`,
        `${durationFns.round(d, { smallestUnit: 'minutes', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { largestUnit: 'second', relativeTo })}`,
        `${durationFns.round(d, { largestUnit: 'seconds', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'second', relativeTo })}`,
        `${durationFns.round(d, { smallestUnit: 'seconds', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { largestUnit: 'millisecond', relativeTo })}`,
        `${durationFns.round(d, { largestUnit: 'milliseconds', relativeTo })}`
      )
      assert.equal(
        `${durationFns.round(d, { smallestUnit: 'millisecond', relativeTo })}`,
        `${durationFns.round(d, { smallestUnit: 'milliseconds', relativeTo })}`
      )
    })
    it('counts the correct number of days when rounding relative to a date', () => {
      const days = durationFns.from({ days: 45 })
      assert.equal(`${durationFns.round(days, { relativeTo: '2019-01-01', smallestUnit: 'months' })}`, 'P2M')
      assert.equal(
        `${durationFns.round(durationFns.negated(days), { relativeTo: '2019-02-15', smallestUnit: 'months' })}`,
        '-P1M'
      )
      const yearAndHalf = durationFns.from({ days: 547, hours: 12 })
      assert.equal(`${durationFns.round(yearAndHalf, { relativeTo: '2018-01-01', smallestUnit: 'years' })}`, 'P2Y')
      assert.equal(`${durationFns.round(yearAndHalf, { relativeTo: '2018-07-01', smallestUnit: 'years' })}`, 'P1Y')
      assert.equal(`${durationFns.round(yearAndHalf, { relativeTo: '2019-01-01', smallestUnit: 'years' })}`, 'P1Y')
      assert.equal(`${durationFns.round(yearAndHalf, { relativeTo: '2019-07-01', smallestUnit: 'years' })}`, 'P1Y')
      assert.equal(`${durationFns.round(yearAndHalf, { relativeTo: '2020-01-01', smallestUnit: 'years' })}`, 'P1Y')
      assert.equal(`${durationFns.round(yearAndHalf, { relativeTo: '2020-07-01', smallestUnit: 'years' })}`, 'P2Y')
    })
  })
  describe('Duration.total()', () => {
    const d = durationFns.fromNumbers(5, 5, 5, 5, 5, 5, 5, 5)
    const d2 = durationFns.fromNumbers(0, 0, 0, 5, 5, 5, 5, 5)
    const relativeTo = dateTimeFns.from('2020-01-01T00:00')
    it('options may only be an object', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => durationFns.total(d, badOptions), TypeError)
      )
    })
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'nonsense'].forEach((unit) => {
        //@ts-expect-error
        assert.throws(() => durationFns.total(d, { unit }), RangeError)
      })
    })
    it('does not lose precision for seconds and smaller units', () => {
      const s = durationFns.total(durationFns.from({ milliseconds: 2 }), { unit: 'seconds' })
      assert.equal(s, 0.002)
    })
    it('accepts datetime string equivalents or fields for relativeTo', () => {
      ;[
        dateFns.from('2020-01-01'),
        dateTimeFns.from('2020-01-01T00:00:00.000'),
        dateFns.from(20200101),
        dateFns.from({ year: 2020, month: 1, day: 1 })
      ].forEach((relativeTo) => {
        const daysPastJuly1 = 5 * 7 + 5 - 30 // 5 weeks + 5 days - 30 days in June
        const partialDayMilliseconds =
          durationFns.getHours(d) * 3.6e12 +
          durationFns.getMinutes(d) * 6e10 +
          durationFns.getSeconds(d) * 1e9 +
          durationFns.getMilliseconds(d) * 1e6
        const partialDay = partialDayMilliseconds / (3.6e12 * 24)
        const partialMonth = (daysPastJuly1 + partialDay) / 31
        const totalMonths = 5 * 12 + 5 + 1 + partialMonth // +1 for 5 weeks
        const total = durationFns.total(d, { unit: 'months', relativeTo })
        assert.equal(total.toPrecision(15), totalMonths.toPrecision(15)) // 66.32930780242619
      })
    })
    it("throws on relativeTo that can't be converted to datetime string", () => {
      //@ts-expect-error
      assert.throws(() => durationFns.total(d, { unit: 'months', relativeTo: Symbol('foo') }), TypeError)
    })
    it('throws on relativeTo that converts to an invalid datetime string', () => {
      ;[3.14, true, null, 'hello'].forEach((relativeTo) => {
        //@ts-expect-error
        assert.throws(() => durationFns.total(d, { unit: 'months', relativeTo }), RangeError)
      })
    })
    it('relativeTo object must contain at least the required correctly-spelled properties', () => {
      //@ts-expect-error
      assert.throws(() => durationFns.total(d, { unit: 'months', relativeTo: {} }), TypeError)
      //@ts-expect-error
      assert.throws(() => durationFns.total(d, { unit: 'months', relativeTo: { years: 2020, month: 1, day: 1 } }), TypeError)
    })
    it('incorrectly-spelled properties are ignored in relativeTo', () => {
      const oneMonth = durationFns.from({ months: 1 })
      assert.equal(
        durationFns.total(oneMonth, {
          unit: 'months',
          relativeTo: dateFns.from({ year: 2020, month: 1, day: 1, months: 2 })
        }),
        1
      )
    })
    it('throws RangeError if unit property is missing', () => {
      ;[{}, () => {}, { roundingMode: 'ceil' }].forEach((options) =>
        //@ts-expect-error
        assert.throws(() => durationFns.total(d, options), RangeError)
      )
    })
    it('relativeTo is required for rounding calendar units even in durations without calendar units', () => {
      assert.throws(() => durationFns.total(d2, { unit: 'years' }), RangeError)
      assert.throws(() => durationFns.total(d2, { unit: 'months' }), RangeError)
      assert.throws(() => durationFns.total(d2, { unit: 'weeks' }), RangeError)
    })
    it('relativeTo is required for rounding durations with calendar units', () => {
      assert.throws(() => durationFns.total(d, { unit: 'years' }), RangeError)
      assert.throws(() => durationFns.total(d, { unit: 'months' }), RangeError)
      assert.throws(() => durationFns.total(d, { unit: 'weeks' }), RangeError)
      assert.throws(() => durationFns.total(d, { unit: 'days' }), RangeError)
      assert.throws(() => durationFns.total(d, { unit: 'hours' }), RangeError)
      assert.throws(() => durationFns.total(d, { unit: 'minutes' }), RangeError)
      assert.throws(() => durationFns.total(d, { unit: 'seconds' }), RangeError)
      assert.throws(() => durationFns.total(d, { unit: 'milliseconds' }), RangeError)
    })
    const d2Nanoseconds =
      durationFns.getDays(d2) * 24 * 3.6e12 +
      durationFns.getHours(d2) * 3.6e12 +
      durationFns.getMinutes(d2) * 6e10 +
      durationFns.getSeconds(d2) * 1e9 +
      durationFns.getMilliseconds(d2) * 1e6
    const totalD2 = {
      days: d2Nanoseconds / (24 * 3.6e12),
      hours: d2Nanoseconds / 3.6e12,
      minutes: d2Nanoseconds / 6e10,
      seconds: d2Nanoseconds / 1e9,
      milliseconds: d2Nanoseconds / 1e6
    }
    it('relativeTo not required to round fixed-length units in durations without variable units', () => {
      assert(Math.abs(durationFns.total(d2, { unit: 'days' }) - totalD2.days) < Number.EPSILON)
      assert(Math.abs(durationFns.total(d2, { unit: 'hours' }) - totalD2.hours) < Number.EPSILON)
      assert(Math.abs(durationFns.total(d2, { unit: 'minutes' }) - totalD2.minutes) < Number.EPSILON)
      assert(Math.abs(durationFns.total(d2, { unit: 'seconds' }) - totalD2.seconds) < Number.EPSILON)
      assert(Math.abs(durationFns.total(d2, { unit: 'milliseconds' }) - totalD2.milliseconds) < Number.EPSILON)
    })
    it('relativeTo not required to round fixed-length units in durations without variable units (negative)', () => {
      const negativeD2 = durationFns.negated(d2)
      assert(Math.abs(durationFns.total(negativeD2, { unit: 'days' }) - -totalD2.days) < Number.EPSILON)
      assert(Math.abs(durationFns.total(negativeD2, { unit: 'hours' }) - -totalD2.hours) < Number.EPSILON)
      assert(Math.abs(durationFns.total(negativeD2, { unit: 'minutes' }) - -totalD2.minutes) < Number.EPSILON)
      assert(Math.abs(durationFns.total(negativeD2, { unit: 'seconds' }) - -totalD2.seconds) < Number.EPSILON)
      assert(Math.abs(durationFns.total(negativeD2, { unit: 'milliseconds' }) - -totalD2.milliseconds) < Number.EPSILON)
    })
    const endpoint = dateTimeFns.add(relativeTo, d)
    const fullYears = 5
    const fullDays = durationFns.getDays(
      dateTimeFns.since(endpoint, relativeTo, { largestUnit: 'days', smallestUnit: 'days', roundingMode: 'trunc' })
    )
    const fullMilliseconds = durationFns.getMilliseconds(
      dateTimeFns.since(endpoint, relativeTo, {
        largestUnit: 'milliseconds',
        smallestUnit: 'milliseconds',
        roundingMode: 'trunc'
      })
    )
    const partialDayMilliseconds = fullMilliseconds - fullDays * 24 * 3.6e6 + 0.005
    const fractionalDay = partialDayMilliseconds / (24 * 3.6e6)
    const partialYearDays = fullDays - (fullYears * 365 + 2)
    const fractionalYear = partialYearDays / 365 + fractionalDay / 365 // split to avoid precision loss
    const fractionalMonths = ((dateTimeFns.getDay(endpoint) - 1) * (24 * 3.6e6) + partialDayMilliseconds) / (31 * 24 * 3.6e6)
    const totalResults: [TemporalPluralUnit, Number][] = [
      ['years', fullYears + fractionalYear],
      ['months', 66 + fractionalMonths],
      ['weeks', (fullDays + fractionalDay) / 7],
      ['days', fullDays + fractionalDay],
      ['hours', fullDays * 24 + partialDayMilliseconds / 3.6e6],
      ['minutes', fullDays * 24 * 60 + partialDayMilliseconds / 60000],
      ['seconds', fullDays * 24 * 60 * 60 + partialDayMilliseconds / 1000],
      ['milliseconds', fullMilliseconds + 0.005]
    ]
    // totalResults.forEach(([unit, expected]) => {
    //   it(`total(${unit}) = ${expected}`, () => {
    //     // Computed values above are approximate due to accumulated floating point
    //     // rounding errors, so just comparing the first 15 digits is good enough.
    //     assert.equal(durationFns.total(d, { unit, relativeTo }).toPrecision(15), expected.toPrecision(15))
    //   })
    // })
    it('balances differently depending on relativeTo', () => {
      const fortyDays = durationFns.from({ days: 40 })
      assert.equal(
        durationFns.total(fortyDays, { unit: 'months', relativeTo: '2020-02-01' }).toPrecision(16),
        (1 + 11 / 31).toPrecision(16)
      )
      assert.equal(
        durationFns.total(fortyDays, { unit: 'months', relativeTo: '2020-01-01' }).toPrecision(16),
        (1 + 9 / 29).toPrecision(16)
      )
    })
    it('balances differently depending on relativeTo (negative)', () => {
      const negativeFortyDays = durationFns.from({ days: -40 })
      assert.equal(
        durationFns.total(negativeFortyDays, { unit: 'months', relativeTo: '2020-03-01' }).toPrecision(16),
        (-(1 + 11 / 31)).toPrecision(16)
      )
      assert.equal(
        durationFns.total(negativeFortyDays, { unit: 'months', relativeTo: '2020-04-01' }).toPrecision(16),
        (-(1 + 9 / 29)).toPrecision(16)
      )
    })
    const oneDay = durationFns.fromNumbers(0, 0, 0, 1)
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = dateTimeFns.from('2017-01-01')
      assert.equal(durationFns.total(oneDay, { unit: 'hours', relativeTo }), 24)
    })
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = zonedDateTimeFns.from('2017-01-01T00:00[America/Montevideo]')
      assert.equal(durationFns.total(oneDay, { unit: 'hours', relativeTo }), 24)
    })
    const skippedHourDay = zonedDateTimeFns.from('2019-03-10T00:00[America/Vancouver]')
    const repeatedHourDay = zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
    const inRepeatedHour = zonedDateTimeFns.from('2019-11-03T01:00-07:00[America/Vancouver]')
    const hours12 = durationFns.fromNumbers(0, 0, 0, 0, 12)
    const hours25 = durationFns.fromNumbers(0, 0, 0, 0, 25)
    describe('relativeTo affects days if ZonedDateTime, and duration encompasses DST change', () => {
      it('start inside repeated hour, end after', () => {
        assert.equal(durationFns.total(hours25, { unit: 'days', relativeTo: inRepeatedHour }), 1)
        assert.equal(durationFns.total(oneDay, { unit: 'hours', relativeTo: inRepeatedHour }), 25)
      })
      it('start after repeated hour, end inside (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-04T01:00[America/Vancouver]')
        assert.equal(durationFns.total(durationFns.negated(hours25), { unit: 'days', relativeTo }), -1)
        assert.equal(durationFns.total(durationFns.negated(oneDay), { unit: 'hours', relativeTo }), -25)
      })
      it('start inside repeated hour, end in skipped hour', () => {
        const totalDays = durationFns.total(durationFns.from({ days: 126, hours: 1 }), {
          unit: 'days',
          relativeTo: inRepeatedHour
        })
        assert(Math.abs(totalDays - (126 + 1 / 23)) < Number.EPSILON)
        assert.equal(
          durationFns.total(durationFns.from({ days: 126, hours: 1 }), { unit: 'hours', relativeTo: inRepeatedHour }),
          3026
        )
      })
      it('start in normal hour, end in skipped hour', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-09T02:30[America/Vancouver]')
        const totalDays = durationFns.total(hours25, { unit: 'days', relativeTo })
        assert(Math.abs(totalDays - (1 + 1 / 24)) < Number.EPSILON)
        assert.equal(durationFns.total(oneDay, { unit: 'hours', relativeTo }), 24)
      })
      it('start before skipped hour, end >1 day after', () => {
        const totalDays = durationFns.total(hours25, { unit: 'days', relativeTo: skippedHourDay })
        assert(Math.abs(totalDays - (1 + 2 / 24)) < Number.EPSILON)
        assert.equal(durationFns.total(oneDay, { unit: 'hours', relativeTo: skippedHourDay }), 23)
      })
      it('start after skipped hour, end >1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-11T00:00[America/Vancouver]')
        const totalDays = durationFns.total(durationFns.negated(hours25), { unit: 'days', relativeTo })
        assert(Math.abs(totalDays - (-1 - 2 / 24)) < Number.EPSILON)
        assert.equal(durationFns.total(durationFns.negated(oneDay), { unit: 'hours', relativeTo }), -23)
      })
      it('start before skipped hour, end <1 day after', () => {
        const totalDays = durationFns.total(hours12, { unit: 'days', relativeTo: skippedHourDay })
        assert(Math.abs(totalDays - 12 / 23) < Number.EPSILON)
      })
      it('start after skipped hour, end <1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-03-10T12:00[America/Vancouver]')
        const totalDays = durationFns.total(durationFns.negated(hours12), { unit: 'days', relativeTo })
        assert(Math.abs(totalDays - -12 / 23) < Number.EPSILON)
      })
      it('start before repeated hour, end >1 day after', () => {
        assert.equal(durationFns.total(hours25, { unit: 'days', relativeTo: repeatedHourDay }), 1)
        assert.equal(durationFns.total(oneDay, { unit: 'hours', relativeTo: repeatedHourDay }), 25)
      })
      it('start after repeated hour, end >1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-04T00:00[America/Vancouver]')
        assert.equal(durationFns.total(durationFns.negated(hours25), { unit: 'days', relativeTo }), -1)
        assert.equal(durationFns.total(durationFns.negated(oneDay), { unit: 'hours', relativeTo }), -25)
      })
      it('start before repeated hour, end <1 day after', () => {
        const totalDays = durationFns.total(hours12, { unit: 'days', relativeTo: repeatedHourDay })
        assert(Math.abs(totalDays - 12 / 25) < Number.EPSILON)
      })
      it('start after repeated hour, end <1 day before (negative)', () => {
        const relativeTo = zonedDateTimeFns.from('2019-11-03T12:00[America/Vancouver]')
        const totalDays = durationFns.total(durationFns.negated(hours12), { unit: 'days', relativeTo })
        assert(Math.abs(totalDays - -12 / 25) < Number.EPSILON)
      })
      it('Samoa skipped 24 hours', () => {
        const relativeTo = zonedDateTimeFns.from('2011-12-29T12:00-10:00[Pacific/Apia]')
        const totalDays = durationFns.total(hours25, { unit: 'days', relativeTo })
        assert(Math.abs(totalDays - (2 + 1 / 24)) < Number.EPSILON)
        assert.equal(durationFns.total(durationFns.from({ hours: 48 }), { unit: 'days', relativeTo }), 3)
        assert.equal(durationFns.total(durationFns.from({ days: 2 }), { unit: 'hours', relativeTo }), 24)
        assert.equal(durationFns.total(durationFns.from({ days: 3 }), { unit: 'hours', relativeTo }), 48)
      })
    })
    it('totaling back up to days', () => {
      const relativeTo = zonedDateTimeFns.from('2019-11-02T00:00[America/Vancouver]')
      assert.equal(durationFns.total(durationFns.from({ hours: 48 }), { unit: 'days' }), 2)
      const totalDays = durationFns.total(durationFns.from({ hours: 48 }), { unit: 'days', relativeTo })
      assert(Math.abs(totalDays - (1 + 24 / 25)) < Number.EPSILON)
    })
    it('casts relativeTo to ZonedDateTime if possible', () => {
      assert.equal(
        durationFns.total(oneDay, {
          unit: 'hours',
          relativeTo: zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
        }),
        25
      )
      assert.equal(
        durationFns.total(oneDay, {
          unit: 'hours',
          relativeTo: zonedDateTimeFns.from({ year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' })
        }),
        25
      )
    })
    it('balances up to the next unit after rounding', () => {
      const almostWeek = durationFns.from({ days: 6, hours: 20 })
      const totalWeeks = durationFns.total(almostWeek, { unit: 'weeks', relativeTo: '2020-01-01' })
      assert(Math.abs(totalWeeks - (6 + 20 / 24) / 7) < Number.EPSILON)
    })
    it('balances up to the next unit after rounding (negative)', () => {
      const almostWeek = durationFns.from({ days: -6, hours: -20 })
      const totalWeeks = durationFns.total(almostWeek, { unit: 'weeks', relativeTo: '2020-01-01' })
      assert(Math.abs(totalWeeks - -((6 + 20 / 24) / 7)) < Number.EPSILON)
    })
    it('balances days up to both years and months', () => {
      const twoYears = durationFns.from({ months: 11, days: 396 })
      assert.equal(durationFns.total(twoYears, { unit: 'years', relativeTo: '2017-01-01' }), 2)
    })
    it('balances days up to both years and months (negative)', () => {
      const twoYears = durationFns.from({ months: -11, days: -396 })
      assert.equal(durationFns.total(twoYears, { unit: 'years', relativeTo: '2017-01-01' }), -2)
    })
    it('accepts singular units', () => {
      assert.equal(durationFns.total(d, { unit: 'year', relativeTo }), durationFns.total(d, { unit: 'years', relativeTo }))
      assert.equal(durationFns.total(d, { unit: 'month', relativeTo }), durationFns.total(d, { unit: 'months', relativeTo }))
      assert.equal(durationFns.total(d, { unit: 'day', relativeTo }), durationFns.total(d, { unit: 'days', relativeTo }))
      assert.equal(durationFns.total(d, { unit: 'hour', relativeTo }), durationFns.total(d, { unit: 'hours', relativeTo }))
      assert.equal(
        durationFns.total(d, { unit: 'minute', relativeTo }),
        durationFns.total(d, { unit: 'minutes', relativeTo })
      )
      assert.equal(
        durationFns.total(d, { unit: 'second', relativeTo }),
        durationFns.total(d, { unit: 'seconds', relativeTo })
      )
      assert.equal(
        durationFns.total(d, { unit: 'second', relativeTo }),
        durationFns.total(d, { unit: 'seconds', relativeTo })
      )
      assert.equal(
        durationFns.total(d, { unit: 'millisecond', relativeTo }),
        durationFns.total(d, { unit: 'milliseconds', relativeTo })
      )
    })
  })
  describe('Duration.compare', () => {
    describe('time units only', () => {
      const d1 = durationFns.fromNumbers(0, 0, 0, 0, 5, 5, 5, 5)
      const d2 = durationFns.fromNumbers(0, 0, 0, 0, 5, 4, 5, 5)
      it('equal', () => assert.equal(durationFns.compare(d1, d1), 0))
      it('smaller/larger', () => assert.equal(durationFns.compare(d2, d1), -1))
      it('larger/smaller', () => assert.equal(durationFns.compare(d1, d2), 1))
      it('negative/negative equal', () =>
        assert.equal(durationFns.compare(durationFns.negated(d1), durationFns.negated(d1)), 0))
      it('negative/negative smaller/larger', () =>
        assert.equal(durationFns.compare(durationFns.negated(d2), durationFns.negated(d1)), 1))
      it('negative/negative larger/smaller', () =>
        assert.equal(durationFns.compare(durationFns.negated(d1), durationFns.negated(d2)), -1))
      it('negative/positive', () => assert.equal(durationFns.compare(durationFns.negated(d1), d2), -1))
      it('positive/negative', () => assert.equal(durationFns.compare(d1, durationFns.negated(d2)), 1))
    })
    describe('date units', () => {
      const d1 = durationFns.fromNumbers(5, 5, 5, 5, 5, 5, 5, 5)
      const d2 = durationFns.fromNumbers(5, 5, 5, 5, 5, 4, 5, 5)
      const relativeTo = dateTimeFns.from('2017-01-01')
      it('relativeTo is required', () => assert.throws(() => durationFns.compare(d1, d2), RangeError))
      it('equal', () => assert.equal(durationFns.compare(d1, d1, { relativeTo }), 0))
      it('smaller/larger', () => assert.equal(durationFns.compare(d2, d1, { relativeTo }), -1))
      it('larger/smaller', () => assert.equal(durationFns.compare(d1, d2, { relativeTo }), 1))
      it('negative/negative equal', () =>
        assert.equal(durationFns.compare(durationFns.negated(d1), durationFns.negated(d1), { relativeTo }), 0))
      it('negative/negative smaller/larger', () =>
        assert.equal(durationFns.compare(durationFns.negated(d2), durationFns.negated(d1), { relativeTo }), 1))
      it('negative/negative larger/smaller', () =>
        assert.equal(durationFns.compare(durationFns.negated(d1), durationFns.negated(d2), { relativeTo }), -1))
      it('negative/positive', () => assert.equal(durationFns.compare(durationFns.negated(d1), d2, { relativeTo }), -1))
      it('positive/negative', () => assert.equal(durationFns.compare(d1, durationFns.negated(d2), { relativeTo }), 1))
    })
    it('relativeTo affects year length', () => {
      const oneYear = durationFns.fromNumbers(1)
      const days365 = durationFns.fromNumbers(0, 0, 0, 365)
      assert.equal(durationFns.compare(oneYear, days365, { relativeTo: dateTimeFns.from('2017-01-01') }), 0)
      assert.equal(durationFns.compare(oneYear, days365, { relativeTo: dateTimeFns.from('2016-01-01') }), 1)
    })
    it('relativeTo affects month length', () => {
      const oneMonth = durationFns.fromNumbers(0, 1)
      const days30 = durationFns.fromNumbers(0, 0, 0, 30)
      assert.equal(durationFns.compare(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-04-01') }), 0)
      assert.equal(durationFns.compare(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-03-01') }), 1)
      assert.equal(durationFns.compare(oneMonth, days30, { relativeTo: dateTimeFns.from('2018-02-01') }), -1)
    })
    const oneDay = durationFns.fromNumbers(0, 0, 0, 1)
    const hours24 = durationFns.fromNumbers(0, 0, 0, 0, 24)
    it('relativeTo not required for days', () => {
      assert.equal(durationFns.compare(oneDay, hours24), 0)
    })
    it('relativeTo does not affect days if PlainDateTime', () => {
      const relativeTo = dateTimeFns.from('2017-01-01')
      assert.equal(durationFns.compare(oneDay, hours24, { relativeTo }), 0)
    })
    it('relativeTo does not affect days if ZonedDateTime, and duration encompasses no DST change', () => {
      const relativeTo = zonedDateTimeFns.from('2017-01-01T00:00[America/Montevideo]')
      assert.equal(durationFns.compare(oneDay, hours24, { relativeTo }), 0)
    })
    it('relativeTo does affect days if ZonedDateTime, and duration encompasses DST change', () => {
      const relativeTo = zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]')
      assert.equal(durationFns.compare(oneDay, hours24, { relativeTo }), 1)
    })
    it('casts relativeTo to ZonedDateTime if possible', () => {
      assert.equal(
        durationFns.compare(oneDay, hours24, { relativeTo: zonedDateTimeFns.from('2019-11-03T00:00[America/Vancouver]') }),
        1
      )
      assert.equal(
        durationFns.compare(oneDay, hours24, {
          relativeTo: zonedDateTimeFns.from({ year: 2019, month: 11, day: 3, timeZone: 'America/Vancouver' })
        }),
        1
      )
    })
    it('casts relativeTo to PlainDateTime if possible', () => {
      assert.equal(durationFns.compare(oneDay, hours24, { relativeTo: '2019-11-03T00:00' }), 0)
      assert.equal(durationFns.compare(oneDay, hours24, { relativeTo: dateFns.from({ year: 2019, month: 11, day: 3 }) }), 0)
    })
    it('at least the required properties must be present in relativeTo', () => {
      assert.throws(
        () => durationFns.compare(oneDay, hours24, { relativeTo: dateFns.from({ month: 11, day: 3 }) }),
        TypeError
      )
      assert.throws(
        () => durationFns.compare(oneDay, hours24, { relativeTo: dateFns.from({ year: 2019, month: 11 }) }),
        TypeError
      )
      assert.throws(
        () => durationFns.compare(oneDay, hours24, { relativeTo: dateFns.from({ year: 2019, day: 3 }) }),
        TypeError
      )
    })
  })
})
