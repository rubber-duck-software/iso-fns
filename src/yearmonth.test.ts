import { describe, it } from 'beartest-js'
import { dateFns, yearMonthFns } from './fns'
import { strict as assert } from 'assert'
import { TemporalOverflow, TemporalPluralUnit } from 'ecmascript'

describe('YearMonth', () => {
  describe('Construction', () => {
    let ym = yearMonthFns.fromNumbers(1976, 11)
    it('YearMonth can be constructed', () => {
      assert(ym)
      assert.equal(typeof ym, 'object')
    })
    it('ym.year is 1976', () => assert.equal(yearMonthFns.getYear(ym), 1976))
    it('ym.month is 11', () => assert.equal(yearMonthFns.getMonth(ym), 11))
    it('ym.daysInMonth is 30', () => assert.equal(yearMonthFns.getDaysInMonth(ym), 30))
    it('ym.daysInYear is 366', () => assert.equal(yearMonthFns.getDaysInYear(ym), 366))
    describe('.from()', () => {
      it('YearMonth.from(2019-10) == 2019-10', () => assert.equal(`${yearMonthFns.from('2019-10')}`, '2019-10'))
      it('YearMonth.from(2019-10-01T09:00:00Z) == 2019-10', () =>
        assert.equal(`${yearMonthFns.from('2019-10-01T09:00:00Z')}`, '2019-10'))
      it("YearMonth.from('1976-11') == (1976-11)", () => assert.equal(`${yearMonthFns.from('1976-11')}`, '1976-11'))
      it("YearMonth.from('1976-11-18') == (1976-11)", () => assert.equal(`${yearMonthFns.from('1976-11-18')}`, '1976-11'))
      it('YearMonth.from(2019-11) is not the same object', () => {
        const orig = yearMonthFns.fromNumbers(2019, 11)
        const actu = yearMonthFns.from(orig)
        assert.notEqual(actu, orig)
      })
      it('YearMonth.from({ year: 2019 }) throws', () => assert.throws(() => yearMonthFns.from({ year: 2019 }), TypeError))
      it('YearMonth.from({ month: 6 }) throws', () => assert.throws(() => yearMonthFns.from({ month: 6 }), TypeError))
      it('YearMonth.from({}) throws', () => assert.throws(() => yearMonthFns.from({}), TypeError))
      it('YearMonth.from(required prop undefined) throws', () =>
        assert.throws(() => yearMonthFns.from({ year: undefined, month: 6 }), TypeError))
      it('YearMonth.from(number) is converted to string', () =>
        assert.equal(yearMonthFns.from(201906), yearMonthFns.from('201906')))
      it('basic format', () => {
        assert.equal(`${yearMonthFns.from('197611')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+00197611')}`, '1976-11')
      })
      it('variant minus sign', () => {
        assert.equal(`${yearMonthFns.from('\u2212009999-11')}`, '-009999-11')
        assert.equal(`${yearMonthFns.from('1976-11-18T15:23:30.1\u221202:00')}`, '1976-11')
      })
      it('mixture of basic and extended format', () => {
        assert.equal(`${yearMonthFns.from('1976-11-18T152330.1+00:00')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('19761118T15:23:30.1+00:00')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('1976-11-18T15:23:30.1+0000')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('1976-11-18T152330.1+0000')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('19761118T15:23:30.1+0000')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('19761118T152330.1+00:00')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('19761118T152330.1+0000')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+001976-11-18T152330.1+00:00')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+0019761118T15:23:30.1+00:00')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+001976-11-18T152330.1+0000')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+0019761118T15:23:30.1+0000')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+0019761118T152330.1+00:00')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('+0019761118T152330.1+0000')}`, '1976-11')
      })
      it('optional components', () => {
        assert.equal(`${yearMonthFns.from('1976-11-18T15:23')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('1976-11-18T15')}`, '1976-11')
        assert.equal(`${yearMonthFns.from('1976-11-18')}`, '1976-11')
      })
      it('no junk at end of string', () => assert.throws(() => yearMonthFns.from('1976-11junk'), RangeError))
      it('options may only be an object or undefined', () => {
        ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
          assert.throws(() => yearMonthFns.from({ year: 1976, month: 11 }, badOptions), TypeError)
        )
        ;[{}, () => {}, undefined].forEach((options) =>
        //@ts-expect-error
          assert.equal(`${yearMonthFns.from({ year: 1976, month: 11 }, options)}`, '1976-11')
        )
      })
      describe('Overflow', () => {
        const bad = { year: 2019, month: 13 }
        it('reject', () => assert.throws(() => yearMonthFns.from(bad, { overflow: 'reject' }), RangeError))
        it('constrain', () => {
          assert.equal(`${yearMonthFns.from(bad)}`, '2019-12')
          assert.equal(`${yearMonthFns.from(bad, { overflow: 'constrain' })}`, '2019-12')
        })
        it('throw on bad overflow', () => {
          ;[yearMonthFns.fromNumbers(2019, 1), { year: 2019, month: 1 }, '2019-01'].forEach((input) => {
            ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
            //@ts-expect-error
              assert.throws(() => yearMonthFns.from(input, { overflow }), RangeError)
            )
          })
        })
        it('constrain has no effect on invalid ISO string', () => {
          assert.throws(() => yearMonthFns.from('2020-13', { overflow: 'constrain' }), RangeError)
        })
      })
      it('object must contain at least the required correctly-spelled properties', () => {
        assert.throws(() => yearMonthFns.from({}), TypeError)
        assert.throws(() => yearMonthFns.from({ year: 1976, months: 11 }), TypeError)
      })
      it('incorrectly-spelled properties are ignored', () => {
        assert.equal(`${yearMonthFns.from({ year: 1976, month: 11, months: 12 })}`, '1976-11')
      })
    })
    describe('.with()', () => {
      const ym = yearMonthFns.from('2019-10')
      it('with(2020)', () => assert.equal(`${ym.with({ year: 2020 })}`, '2020-10'))
      it('with(09)', () => assert.equal(`${ym.with({ month: 9 })}`, '2019-09'))
    })
  })
  describe('YearMonth.with() works', () => {
    const ym = yearMonthFns.from('2019-10')
    it('throws with calendar property', () => {
      assert.throws(() => ym.with({ year: 2021, calendar: 'iso8601' }), TypeError)
    })
    it('throws with timeZone property', () => {
      assert.throws(() => ym.with({ year: 2021, timeZone: 'UTC' }), TypeError)
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        assert.throws(() => ym.with({ year: 2020 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${ym.with({ year: 2020 }, options)}`, '2020-10'))
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => ym.with({}), TypeError)
      assert.throws(() => ym.with({ months: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(`${ym.with({ month: 1, years: 2020 })}`, '2019-01')
    })
    it('day is ignored when determining ISO reference day', () => {
      assert.equal(ym.with({ year: ym.year, day: 31 }).getISOFields().isoDay, ym.getISOFields().isoDay)
    })
  })
  describe('YearMonth.compare() works', () => {
    const nov94 = yearMonthFns.from('1994-11')
    const jun13 = yearMonthFns.from('2013-06')
    it('equal', () => assert.equal(PlainYearMonth.compare(nov94, nov94), 0))
    it('smaller/larger', () => assert.equal(PlainYearMonth.compare(nov94, jun13), -1))
    it('larger/smaller', () => assert.equal(PlainYearMonth.compare(jun13, nov94), 1))
    it('casts first argument', () => {
      assert.equal(PlainYearMonth.compare({ year: 1994, month: 11 }, jun13), -1)
      assert.equal(PlainYearMonth.compare('1994-11', jun13), -1)
    })
    it('casts second argument', () => {
      assert.equal(PlainYearMonth.compare(nov94, { year: 2013, month: 6 }), -1)
      assert.equal(PlainYearMonth.compare(nov94, '2013-06'), -1)
    })
    it('object must contain at least the required properties', () => {
      assert.throws(() => PlainYearMonth.compare({ year: 1994 }, jun13), TypeError)
      assert.throws(() => PlainYearMonth.compare(nov94, { year: 2013 }), TypeError)
    })
    it('takes [[ISODay]] into account', () => {
      const iso = Temporal.Calendar.from('iso8601')
      const ym1 = yearMonthFns.fromNumbers(2000, 1, iso, 1)
      const ym2 = yearMonthFns.fromNumbers(2000, 1, iso, 2)
      assert.equal(PlainYearMonth.compare(ym1, ym2), -1)
    })
  })
  describe('YearMonth.equals() works', () => {
    const nov94 = yearMonthFns.from('1994-11')
    const jun13 = yearMonthFns.from('2013-06')
    it('equal', () => assert(nov94.equals(nov94)))
    it('unequal', () => assert(!nov94.equals(jun13)))
    it('casts argument', () => {
      assert(nov94.equals({ year: 1994, month: 11 }))
      assert(nov94.equals('1994-11'))
    })
    it('object must contain at least the required properties', () => {
      assert.throws(() => nov94.equals({ year: 1994 }), TypeError)
    })
    it('takes [[ISODay]] into account', () => {
      const iso = Temporal.Calendar.from('iso8601')
      const ym1 = yearMonthFns.fromNumbers(2000, 1, iso, 1)
      const ym2 = yearMonthFns.fromNumbers(2000, 1, iso, 2)
      assert(!ym1.equals(ym2))
    })
  })
  describe("Comparison operators don't work", () => {
    const ym1 = yearMonthFns.from('1963-02')
    const ym1again = yearMonthFns.from('1963-02')
    const ym2 = yearMonthFns.from('1976-11')
    it('=== is object equality', () => assert.equal(ym1, ym1))
    it('!== is object equality', () => assert.notEqual((ym1, ym1again))
    it('<', () => assert.throws(() => ym1 < ym2))
    it('>', () => assert.throws(() => ym1 > ym2))
    it('<=', () => assert.throws(() => ym1 <= ym2))
    it('>=', () => assert.throws(() => ym1 >= ym2))
  })
  describe('YearMonth.until() works', () => {
    const nov94 = yearMonthFns.from('1994-11')
    const jun13 = yearMonthFns.from('2013-06')
    const diff = nov94.until(jun13)
    it(`${jun13}.until(${nov94}) == ${nov94}.until(${jun13}).negated()`, () =>
      assert.equal(`${jun13.until(nov94)}`, `${diff.negated()}`))
    it(`${nov94}.add(${diff}) == ${jun13}`, () => nov94.add(diff).equals(jun13))
    it(`${jun13}.subtract(${diff}) == ${nov94}`, () => jun13.subtract(diff).equals(nov94))
    it(`${nov94}.until(${jun13}) == ${jun13}.since(${nov94})`, () => assert.equal(`${diff}`, `${jun13.since(nov94)}`))
    it('casts argument', () => {
      assert.equal(`${nov94.until({ year: 2013, month: 6 })}`, `${diff}`)
      assert.equal(`${nov94.until('2013-06')}`, `${diff}`)
    })
    it('object must contain at least the required properties', () => {
      assert.throws(() => nov94.until({ year: 2013 }), TypeError)
    })
    const feb20 = yearMonthFns.from('2020-02')
    const feb21 = yearMonthFns.from('2021-02')
    it('defaults to returning years', () => {
      assert.equal(`${feb20.until(feb21)}`, 'P1Y')
      assert.equal(`${feb20.until(feb21, { largestUnit: 'auto' })}`, 'P1Y')
      assert.equal(`${feb20.until(feb21, { largestUnit: 'years' })}`, 'P1Y')
    })
    it('can return months', () => {
      assert.equal(`${feb20.until(feb21, { largestUnit: 'months' })}`, 'P12M')
    })
    it('cannot return lower units', () => {
      assert.throws(() => feb20.until(feb21, { largestUnit: 'weeks' }), RangeError)
      assert.throws(() => feb20.until(feb21, { largestUnit: 'days' }), RangeError)
      assert.throws(() => feb20.until(feb21, { largestUnit: 'hours' }), RangeError)
      assert.throws(() => feb20.until(feb21, { largestUnit: 'minutes' }), RangeError)
      assert.throws(() => feb20.until(feb21, { largestUnit: 'seconds' }), RangeError)
      assert.throws(() => feb20.until(feb21, { largestUnit: 'milliseconds' }), RangeError)
    })
    it('no two different calendars', () => {
      const ym1 = yearMonthFns.fromNumbers(2000, 1)
      const ym2 = yearMonthFns.fromNumbers(2000, 1, Temporal.Calendar.from('japanese'))
      assert.throws(() => ym1.until(ym2), RangeError)
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        assert.throws(() => feb20.until(feb21, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${feb20.until(feb21, options)}`, 'P1Y'))
    })
    const earlier = yearMonthFns.from('2019-01')
    const later = yearMonthFns.from('2021-09')
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach((smallestUnit) => {
        assert.throws(() => earlier.until(later, { smallestUnit }), RangeError)
      })
    })
    it('throws if smallestUnit is larger than largestUnit', () => {
      assert.throws(() => earlier.until(later, { largestUnit: 'months', smallestUnit: 'years' }), RangeError)
    })
    it('throws on invalid roundingMode', () => {
      assert.throws(() => earlier.until(later, { roundingMode: 'cile' }), RangeError)
    })
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P2Y8M']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      it(`rounds to nearest ${smallestUnit}`, () => {
        assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ]
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      it(`rounds up to ${smallestUnit}`, () => {
        assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ]
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      it(`rounds down to ${smallestUnit}`, () => {
        assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P2Y8M']
    ]
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      it(`truncates to ${smallestUnit}`, () => {
        assert.equal(`${earlier.until(later, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${later.until(earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    it('trunc is the default', () => {
      assert.equal(`${earlier.until(later, { smallestUnit: 'years' })}`, 'P2Y')
      assert.equal(`${later.until(earlier, { smallestUnit: 'years' })}`, '-P2Y')
    })
    it('rounds to an increment of years', () => {
      assert.equal(
        `${earlier.until(later, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
        'P4Y'
      )
    })
    it('rounds to an increment of months', () => {
      assert.equal(`${earlier.until(later, { smallestUnit: 'months', roundingIncrement: 5 })}`, 'P2Y5M')
      assert.equal(
        `${earlier.until(later, { largestUnit: 'months', smallestUnit: 'months', roundingIncrement: 10 })}`,
        'P30M'
      )
    })
    it('accepts singular units', () => {
      assert.equal(`${earlier.until(later, { largestUnit: 'year' })}`, `${earlier.until(later, { largestUnit: 'years' })}`)
      assert.equal(`${earlier.until(later, { smallestUnit: 'year' })}`, `${earlier.until(later, { smallestUnit: 'years' })}`)
      assert.equal(`${earlier.until(later, { largestUnit: 'month' })}`, `${earlier.until(later, { largestUnit: 'months' })}`)
      assert.equal(
        `${earlier.until(later, { smallestUnit: 'month' })}`,
        `${earlier.until(later, { smallestUnit: 'months' })}`
      )
    })
  })
  describe('YearMonth.since() works', () => {
    const nov94 = yearMonthFns.from('1994-11')
    const jun13 = yearMonthFns.from('2013-06')
    const diff = jun13.since(nov94)
    it(`${nov94}.since(${jun13}) == ${jun13}.since(${nov94}).negated()`, () =>
      assert.equal(`${nov94.since(jun13)}`, `${diff.negated()}`))
    it(`${nov94}.add(${diff}) == ${jun13}`, () => nov94.add(diff).equals(jun13))
    it(`${jun13}.subtract(${diff}) == ${nov94}`, () => jun13.subtract(diff).equals(nov94))
    it(`${jun13}.since(${nov94}) == ${nov94}.until(${jun13})`, () => assert.equal(`${diff}`, `${nov94.until(jun13)}`))
    it('casts argument', () => {
      assert.equal(`${jun13.since({ year: 1994, month: 11 })}`, `${diff}`)
      assert.equal(`${jun13.since('1994-11')}`, `${diff}`)
    })
    it('object must contain at least the required properties', () => {
      assert.throws(() => jun13.since({ year: 1994 }), TypeError)
    })
    const feb20 = yearMonthFns.from('2020-02')
    const feb21 = yearMonthFns.from('2021-02')
    it('defaults to returning years', () => {
      assert.equal(`${feb21.since(feb20)}`, 'P1Y')
      assert.equal(`${feb21.since(feb20, { largestUnit: 'auto' })}`, 'P1Y')
      assert.equal(`${feb21.since(feb20, { largestUnit: 'years' })}`, 'P1Y')
    })
    it('can return months', () => {
      assert.equal(`${feb21.since(feb20, { largestUnit: 'months' })}`, 'P12M')
    })
    it('cannot return lower units', () => {
      assert.throws(() => feb21.since(feb20, { largestUnit: 'weeks' }), RangeError)
      assert.throws(() => feb21.since(feb20, { largestUnit: 'days' }), RangeError)
      assert.throws(() => feb21.since(feb20, { largestUnit: 'hours' }), RangeError)
      assert.throws(() => feb21.since(feb20, { largestUnit: 'minutes' }), RangeError)
      assert.throws(() => feb21.since(feb20, { largestUnit: 'seconds' }), RangeError)
      assert.throws(() => feb21.since(feb20, { largestUnit: 'milliseconds' }), RangeError)
    })
    it('no two different calendars', () => {
      const ym1 = yearMonthFns.fromNumbers(2000, 1)
      const ym2 = yearMonthFns.fromNumbers(2000, 1, Temporal.Calendar.from('japanese'))
      assert.throws(() => ym1.since(ym2), RangeError)
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        assert.throws(() => feb21.since(feb20, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${feb21.since(feb20, options)}`, 'P1Y'))
    })
    const earlier = yearMonthFns.from('2019-01')
    const later = yearMonthFns.from('2021-09')
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach((smallestUnit) => {
        assert.throws(() => later.since(earlier, { smallestUnit }), RangeError)
      })
    })
    it('throws if smallestUnit is larger than largestUnit', () => {
      assert.throws(() => later.since(earlier, { largestUnit: 'months', smallestUnit: 'years' }), RangeError)
    })
    it('throws on invalid roundingMode', () => {
      assert.throws(() => later.since(earlier, { roundingMode: 'cile' }), RangeError)
    })
    const incrementOneNearest = [
      ['years', 'P3Y'],
      ['months', 'P2Y8M']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      it(`rounds to nearest ${smallestUnit}`, () => {
        assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    const incrementOneCeil = [
      ['years', 'P3Y', '-P2Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ]
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      it(`rounds up to ${smallestUnit}`, () => {
        assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneFloor = [
      ['years', 'P2Y', '-P3Y'],
      ['months', 'P2Y8M', '-P2Y8M']
    ]
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      it(`rounds down to ${smallestUnit}`, () => {
        assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expectedPositive)
        assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, expectedNegative)
      })
    })
    const incrementOneTrunc = [
      ['years', 'P2Y'],
      ['months', 'P2Y8M']
    ]
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      it(`truncates to ${smallestUnit}`, () => {
        assert.equal(`${later.since(earlier, { smallestUnit, roundingMode })}`, expected)
        assert.equal(`${earlier.since(later, { smallestUnit, roundingMode })}`, `-${expected}`)
      })
    })
    it('trunc is the default', () => {
      assert.equal(`${later.since(earlier, { smallestUnit: 'years' })}`, 'P2Y')
      assert.equal(`${earlier.since(later, { smallestUnit: 'years' })}`, '-P2Y')
    })
    it('rounds to an increment of years', () => {
      assert.equal(
        `${later.since(earlier, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
        'P4Y'
      )
    })
    it('rounds to an increment of months', () => {
      assert.equal(`${later.since(earlier, { smallestUnit: 'months', roundingIncrement: 5 })}`, 'P2Y5M')
      assert.equal(
        `${later.since(earlier, { largestUnit: 'months', smallestUnit: 'months', roundingIncrement: 10 })}`,
        'P30M'
      )
    })
    it('accepts singular units', () => {
      assert.equal(`${later.since(earlier, { largestUnit: 'year' })}`, `${later.since(earlier, { largestUnit: 'years' })}`)
      assert.equal(`${later.since(earlier, { smallestUnit: 'year' })}`, `${later.since(earlier, { smallestUnit: 'years' })}`)
      assert.equal(`${later.since(earlier, { largestUnit: 'month' })}`, `${later.since(earlier, { largestUnit: 'months' })}`)
      assert.equal(
        `${later.since(earlier, { smallestUnit: 'month' })}`,
        `${later.since(earlier, { smallestUnit: 'months' })}`
      )
    })
  })
  describe('YearMonth.add() works', () => {
    const ym = yearMonthFns.from('2019-11')
    it('(2019-11) plus 2 months === 2020-01', () => {
      assert.equal(`${ym.add({ months: 2 })}`, '2020-01')
      assert.equal(`${ym.add({ months: 2 }, { overflow: 'constrain' })}`, '2020-01')
      assert.equal(`${ym.add({ months: 2 }, { overflow: 'reject' })}`, '2020-01')
    })
    it('(2019-11) plus 1 year === 2020-11', () => {
      assert.equal(`${ym.add({ years: 1 })}`, '2020-11')
      assert.equal(`${ym.add({ years: 1 }, { overflow: 'constrain' })}`, '2020-11')
      assert.equal(`${ym.add({ years: 1 }, { overflow: 'reject' })}`, '2020-11')
    })
    it('symmetrical with regard to negative durations', () => {
      assert.equal(`${yearMonthFns.from('2020-01').add({ months: -2 })}`, '2019-11')
      assert.equal(`${yearMonthFns.from('2020-11').add({ years: -1 })}`, '2019-11')
    })
    it('yearMonth.add(durationObj)', () => {
      assert.equal(`${ym.add(Temporal.Duration.from('P2M'))}`, '2020-01')
    })
    it('casts argument', () => assert.equal(`${ym.add('P2M')}`, '2020-01'))
    it("ignores lower units that don't balance up to the length of the month", () => {
      assert.equal(`${ym.add({ days: 1 })}`, '2019-11')
      assert.equal(`${ym.add({ days: 29 })}`, '2019-11')
      assert.equal(`${ym.add({ hours: 1 })}`, '2019-11')
      assert.equal(`${ym.add({ minutes: 1 })}`, '2019-11')
      assert.equal(`${ym.add({ seconds: 1 })}`, '2019-11')
      assert.equal(`${ym.add({ milliseconds: 1 })}`, '2019-11')
    })
    it('adds lower units that balance up to a month or more', () => {
      assert.equal(`${ym.add({ days: 30 })}`, '2019-12')
      assert.equal(`${ym.add({ days: 31 })}`, '2019-12')
      assert.equal(`${ym.add({ days: 60 })}`, '2019-12')
      assert.equal(`${ym.add({ days: 61 })}`, '2020-01')
      assert.equal(`${ym.add({ hours: 720 })}`, '2019-12')
      assert.equal(`${ym.add({ minutes: 43200 })}`, '2019-12')
      assert.equal(`${ym.add({ seconds: 2592000 })}`, '2019-12')
      assert.equal(`${ym.add({ milliseconds: 2592000_000 })}`, '2019-12')
    })
    it('balances days to months based on the number of days in the ISO month', () => {
      assert.equal(`${yearMonthFns.from('2019-02').add({ days: 27 })}`, '2019-02')
      assert.equal(`${yearMonthFns.from('2019-02').add({ days: 28 })}`, '2019-03')
      assert.equal(`${yearMonthFns.from('2020-02').add({ days: 28 })}`, '2020-02')
      assert.equal(`${yearMonthFns.from('2020-02').add({ days: 29 })}`, '2020-03')
      assert.equal(`${yearMonthFns.from('2019-11').add({ days: 29 })}`, '2019-11')
      assert.equal(`${yearMonthFns.from('2019-11').add({ days: 30 })}`, '2019-12')
      assert.equal(`${yearMonthFns.from('2020-01').add({ days: 30 })}`, '2020-01')
      assert.equal(`${yearMonthFns.from('2020-01').add({ days: 31 })}`, '2020-02')
    })
    it('invalid overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        assert.throws(() => ym.add({ months: 1 }, { overflow }), RangeError)
      )
    })
    it('mixed positive and negative values always throw', () => {
      ;['constrain', 'reject'].forEach((overflow) =>
        assert.throws(() => ym.add({ years: 1, months: -6 }, { overflow }), RangeError)
      )
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        assert.throws(() => ym.add({ months: 1 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${ym.add({ months: 1 }, options)}`, '2019-12'))
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => ym.add({}), TypeError)
      assert.throws(() => ym.add({ month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(`${ym.add({ month: 1, years: 1 })}`, '2020-11')
    })
  })
  describe('YearMonth.subtract() works', () => {
    const ym = yearMonthFns.from('2019-11')
    it('(2019-11) minus 11 months === 2018-12', () => {
      assert.equal(`${ym.subtract({ months: 11 })}`, '2018-12')
      assert.equal(`${ym.subtract({ months: 11 }, { overflow: 'constrain' })}`, '2018-12')
      assert.equal(`${ym.subtract({ months: 11 }, { overflow: 'reject' })}`, '2018-12')
    })
    it('(2019-11) minus 12 years === 2007-11', () => {
      assert.equal(`${ym.subtract({ years: 12 })}`, '2007-11')
      assert.equal(`${ym.subtract({ years: 12 }, { overflow: 'constrain' })}`, '2007-11')
      assert.equal(`${ym.subtract({ years: 12 }, { overflow: 'reject' })}`, '2007-11')
    })
    it('symmetrical with regard to negative durations', () => {
      assert.equal(`${yearMonthFns.from('2018-12').subtract({ months: -11 })}`, '2019-11')
      assert.equal(`${yearMonthFns.from('2007-11').subtract({ years: -12 })}`, '2019-11')
    })
    it('yearMonth.subtract(durationObj)', () => {
      assert.equal(`${ym.subtract(Temporal.Duration.from('P11M'))}`, '2018-12')
    })
    it('casts argument', () => assert.equal(`${ym.subtract('P11M')}`, '2018-12'))
    it("ignores lower units that don't balance up to the length of the month", () => {
      assert.equal(`${ym.subtract({ days: 1 })}`, '2019-11')
      assert.equal(`${ym.subtract({ hours: 1 })}`, '2019-11')
      assert.equal(`${ym.subtract({ minutes: 1 })}`, '2019-11')
      assert.equal(`${ym.subtract({ seconds: 1 })}`, '2019-11')
      assert.equal(`${ym.subtract({ milliseconds: 1 })}`, '2019-11')
    })
    it('subtracts lower units that balance up to a day or more', () => {
      assert.equal(`${ym.subtract({ days: 29 })}`, '2019-11')
      assert.equal(`${ym.subtract({ days: 30 })}`, '2019-10')
      assert.equal(`${ym.subtract({ days: 60 })}`, '2019-10')
      assert.equal(`${ym.subtract({ days: 61 })}`, '2019-09')
      assert.equal(`${ym.subtract({ hours: 720 })}`, '2019-10')
      assert.equal(`${ym.subtract({ minutes: 43200 })}`, '2019-10')
      assert.equal(`${ym.subtract({ seconds: 2592000 })}`, '2019-10')
      assert.equal(`${ym.subtract({ milliseconds: 2592000_000 })}`, '2019-10')
    })
    it('balances days to months based on the number of days in the ISO month', () => {
      assert.equal(`${yearMonthFns.from('2019-02').subtract({ days: 27 })}`, '2019-02')
      assert.equal(`${yearMonthFns.from('2019-02').subtract({ days: 28 })}`, '2019-01')
      assert.equal(`${yearMonthFns.from('2020-02').subtract({ days: 28 })}`, '2020-02')
      assert.equal(`${yearMonthFns.from('2020-02').subtract({ days: 29 })}`, '2020-01')
      assert.equal(`${yearMonthFns.from('2019-11').subtract({ days: 29 })}`, '2019-11')
      assert.equal(`${yearMonthFns.from('2019-11').subtract({ days: 30 })}`, '2019-10')
      assert.equal(`${yearMonthFns.from('2020-01').subtract({ days: 30 })}`, '2020-01')
      assert.equal(`${yearMonthFns.from('2020-01').subtract({ days: 31 })}`, '2019-12')
    })
    it('invalid overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        assert.throws(() => ym.subtract({ months: 1 }, { overflow }), RangeError)
      )
    })
    it('mixed positive and negative values always throw', () => {
      ;['constrain', 'reject'].forEach((overflow) =>
        assert.throws(() => ym.subtract({ years: 1, months: -6 }, { overflow }), RangeError)
      )
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo'), 1n].forEach((badOptions) =>
        assert.throws(() => ym.subtract({ months: 1 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${ym.subtract({ months: 1 }, options)}`, '2019-10'))
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => ym.subtract({}), TypeError)
      assert.throws(() => ym.subtract({ month: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(`${ym.subtract({ month: 1, years: 1 })}`, '2018-11')
    })
  })
  describe('Min/max range', () => {
    it('constructing from numbers', () => {
      assert.throws(() => yearMonthFns.fromNumbers(-271821, 3), RangeError)
      assert.throws(() => yearMonthFns.fromNumbers(275760, 10), RangeError)
      assert.equal(`${yearMonthFns.fromNumbers(-271821, 4)}`, '-271821-04')
      assert.equal(`${yearMonthFns.fromNumbers(275760, 9)}`, '+275760-09')
    })
    it('constructing from property bag', () => {
      const tooEarly = { year: -271821, month: 3 }
      const tooLate = { year: 275760, month: 10 }
      ;['reject', 'constrain'].forEach((overflow) => {
        ;[tooEarly, tooLate].forEach((props) => {
          assert.throws(() => yearMonthFns.from(props, { overflow }), RangeError)
        })
      })
      assert.equal(`${yearMonthFns.from({ year: -271821, month: 4 })}`, '-271821-04')
      assert.equal(`${yearMonthFns.from({ year: 275760, month: 9 })}`, '+275760-09')
    })
    it('constructing from ISO string', () => {
      ;['reject', 'constrain'].forEach((overflow) => {
        ;['-271821-03', '+275760-10'].forEach((str) => {
          assert.throws(() => yearMonthFns.from(str, { overflow }), RangeError)
        })
      })
      assert.equal(`${yearMonthFns.from('-271821-04')}`, '-271821-04')
      assert.equal(`${yearMonthFns.from('+275760-09')}`, '+275760-09')
    })
    it('converting from Date', () => {
      const min = dateFns.from('-271821-04-19')
      const max = dateFns.from('+275760-09-13')
      assert.equal(`${min.toPlainYearMonth()}`, '-271821-04')
      assert.equal(`${max.toPlainYearMonth()}`, '+275760-09')
    })
    it('adding and subtracting beyond limit', () => {
      const min = yearMonthFns.from('-271821-04')
      const max = yearMonthFns.from('+275760-09')
      ;['reject', 'constrain'].forEach((overflow) => {
        assert.throws(() => min.subtract({ months: 1 }, { overflow }), RangeError)
        assert.throws(() => max.add({ months: 1 }, { overflow }), RangeError)
      })
    })
  })
  describe('YearMonth.with()', () => {
    it('throws on bad overflow', () => {
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        assert.throws(() => yearMonthFns.from({ year: 2019, month: 1 }).with({ month: 2 }, { overflow }), RangeError)
      )
    })
  })
  describe('YearMonth.toPlainDate()', () => {
    const ym = yearMonthFns.from('2002-01')
    it("doesn't take a primitive argument", () => {
      ;[22, '22', false, 22n, Symbol('22'), null].forEach((bad) => {
        assert.throws(() => ym.toPlainDate(bad), TypeError)
      })
    })
    it('takes an object argument with day property', () => {
      assert.equal(`${ym.toPlainDate({ day: 22 })}`, '2002-01-22')
    })
    it('needs at least a day property on the object in the ISO calendar', () => {
      assert.throws(() => ym.toPlainDate({ something: 'nothing' }), TypeError)
    })
  })
  describe('YearMonth.toString()', () => {
    const ym1 = yearMonthFns.from('1976-11')
    const ym2 = yearMonthFns.from({ year: 1976, month: 11, calendar: 'gregory' })
    it('shows only non-ISO calendar if calendarName = auto', () => {
      assert.equal(ym1.toString({ calendarName: 'auto' }), '1976-11')
      assert.equal(ym2.toString({ calendarName: 'auto' }), '1976-11-01[u-ca=gregory]')
    })
    it('shows ISO calendar if calendarName = always', () => {
      assert.equal(ym1.toString({ calendarName: 'always' }), '1976-11[u-ca=iso8601]')
    })
    it('omits non-ISO calendar, but not day, if calendarName = never', () => {
      assert.equal(ym1.toString({ calendarName: 'never' }), '1976-11')
      assert.equal(ym2.toString({ calendarName: 'never' }), '1976-11-01')
    })
    it('default is calendar = auto', () => {
      assert.equal(ym1.toString(), '1976-11')
      assert.equal(ym2.toString(), '1976-11-01[u-ca=gregory]')
    })
    it('throws on invalid calendar', () => {
      ;['ALWAYS', 'sometimes', false, 3, null].forEach((calendarName) => {
        assert.throws(() => ym1.toString({ calendarName }), RangeError)
      })
    })
  })
  describe('yearMonth.getISOFields() works', () => {
    const ym1 = yearMonthFns.from('1976-11')
    const fields = ym1.getISOFields()
    it('fields', () => {
      assert.equal(fields.isoYear, 1976)
      assert.equal(fields.isoMonth, 11)
      assert.equal(fields.calendar.id, 'iso8601')
      assert.equal(typeof fields.isoDay, 'number')
    })
    it('enumerable', () => {
      const fields2 = { ...fields }
      assert.equal(fields2.isoYear, 1976)
      assert.equal(fields2.isoMonth, 11)
      assert.equal(fields2.calendar, fields.calendar)
      assert.equal(typeof fields2.isoDay, 'number')
    })
    it('as input to constructor', () => {
      const ym2 = yearMonthFns.fromNumbers(fields.isoYear, fields.isoMonth, fields.calendar, fields.isoDay)
      assert(ym2.equals(ym1))
    })
  })
})
