import { describe, it } from 'beartest-js'
import { dateFns, durationFns, yearMonthFns } from './fns'
import { strict as assert } from 'assert'
import { TemporalOverflow, TemporalPluralUnit } from 'ecmascript'

describe('YearMonth', () => {
  describe('Construction', () => {
    let ym = yearMonthFns.fromNumbers(1976, 11)
    it('YearMonth can be constructed', () => {
      assert(ym)
      assert.equal(typeof ym, 'string')
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
        assert.equal(`${yearMonthFns.from('\u2212009999-11')}`, '-9999-11')
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
      it('with(2020)', () => assert.equal(`${yearMonthFns.with(ym, { year: 2020 })}`, '2020-10'))
      it('with(09)', () => assert.equal(`${yearMonthFns.with(ym, { month: 9 })}`, '2019-09'))
    })
  })
  describe('YearMonth.with() works', () => {
    const ym = yearMonthFns.from('2019-10')
    it('throws with calendar property', () => {
      //@ts-expect-error
      assert.throws(() => yearMonthFns.with(ym, { year: 2021, calendar: 'iso8601' }), TypeError)
    })
    it('throws with timeZone property', () => {
      //@ts-expect-error
      assert.throws(() => yearMonthFns.with(ym, { year: 2021, timeZone: 'UTC' }), TypeError)
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => yearMonthFns.with(ym, { year: 2020 }, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) =>
        //@ts-expect-error
        assert.equal(`${yearMonthFns.with(ym, { year: 2020 }, options)}`, '2020-10')
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => yearMonthFns.with(ym, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => yearMonthFns.with(ym, { months: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${yearMonthFns.with(ym, { month: 1, years: 2020 })}`, '2019-01')
    })
  })
  //   describe('YearMonth.compare() works', () => {
  //     const nov94 = yearMonthFns.from('1994-11')
  //     const jun13 = yearMonthFns.from('2013-06')
  //     it('equal', () => assert.equal(yearMonthFns.compare(nov94, nov94), 0))
  //     it('smaller/larger', () => assert.equal(yearMonthFns.compare(nov94, jun13), -1))
  //     it('larger/smaller', () => assert.equal(yearMonthFns.compare(jun13, nov94), 1))
  //     it('object must contain at least the required properties', () => {
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.compare({ year: 1994 }, jun13), TypeError)
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.compare(nov94, { year: 2013 }), TypeError)
  //     })
  //   })
  //   describe('YearMonth.equals() works', () => {
  //     const nov94 = yearMonthFns.from('1994-11')
  //     const jun13 = yearMonthFns.from('2013-06')
  //     it('equal', () => assert(yearMonthFns.equals(nov94, nov94)))
  //     it('unequal', () => assert(!yearMonthFns.equals(nov94, jun13)))
  //     it('object must contain at least the required properties', () => {
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.equals(nov94, { year: 1994 }), TypeError)
  //     })
  //   })
  //   describe('YearMonth.until() works', () => {
  //     const nov94 = yearMonthFns.from('1994-11')
  //     const jun13 = yearMonthFns.from('2013-06')
  //     const diff = yearMonthFns.until(nov94, jun13)
  //     it(`${jun13}.until(${nov94}) == ${nov94}.until(${jun13}).negated()`, () =>
  //       assert.equal(yearMonthFns.until(jun13, nov94), durationFns.negated(diff)))
  //     it(`${nov94}.add(${diff}) == ${jun13}`, () => {
  //       assert.equal(yearMonthFns.add(nov94, diff), jun13)
  //     })
  //     it(`${jun13}.subtract(${diff}) == ${nov94}`, () => assert.equal(yearMonthFns.subtract(jun13, diff), nov94))
  //     it(`${nov94}.until(${jun13}) == ${jun13}.since(${nov94})`, () => assert.equal(diff, yearMonthFns.since(jun13, nov94)))
  //     it('object must contain at least the required properties', () => {
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.until(nov94, { year: 2013 }), TypeError)
  //     })
  //     const feb20 = yearMonthFns.from('2020-02')
  //     const feb21 = yearMonthFns.from('2021-02')
  //     it('defaults to returning years', () => {
  //       assert.equal(`${yearMonthFns.until(feb20, feb21)}`, 'P1Y')
  //       assert.equal(`${yearMonthFns.until(feb20, feb21, { largestUnit: 'auto' })}`, 'P1Y')
  //       assert.equal(`${yearMonthFns.until(feb20, feb21, { largestUnit: 'years' })}`, 'P1Y')
  //     })
  //     it('can return months', () => {
  //       assert.equal(`${yearMonthFns.until(feb20, feb21, { largestUnit: 'months' })}`, 'P12M')
  //     })
  //     it('cannot return lower units', () => {
  //       assert.throws(() => yearMonthFns.until(feb20, feb21, { largestUnit: 'weeks' }), RangeError)
  //       assert.throws(() => yearMonthFns.until(feb20, feb21, { largestUnit: 'days' }), RangeError)
  //       assert.throws(() => yearMonthFns.until(feb20, feb21, { largestUnit: 'hours' }), RangeError)
  //       assert.throws(() => yearMonthFns.until(feb20, feb21, { largestUnit: 'minutes' }), RangeError)
  //       assert.throws(() => yearMonthFns.until(feb20, feb21, { largestUnit: 'seconds' }), RangeError)
  //       assert.throws(() => yearMonthFns.until(feb20, feb21, { largestUnit: 'milliseconds' }), RangeError)
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.until(feb20, feb21, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${yearMonthFns.until(feb20, feb21, options)}`, 'P1Y'))
  //     })
  //     const earlier = yearMonthFns.from('2019-01')
  //     const later = yearMonthFns.from('2021-09')
  //     it('throws on disallowed or invalid smallestUnit', () => {
  //       ;['era', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach((smallestUnit) => {
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.until(earlier, later, { smallestUnit }), RangeError)
  //       })
  //     })
  //     it('throws if smallestUnit is larger than largestUnit', () => {
  //       assert.throws(() => yearMonthFns.until(earlier, later, { largestUnit: 'months', smallestUnit: 'years' }), RangeError)
  //     })
  //     it('throws on invalid roundingMode', () => {
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.until(earlier, later, { roundingMode: 'cile' }), RangeError)
  //     })
  //     const incrementOneNearest: [TemporalPluralUnit, string][] = [
  //       ['years', 'P3Y'],
  //       ['months', 'P2Y8M']
  //     ]
  //     incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'halfExpand'
  //       it(`rounds to nearest ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.until(earlier, later, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${yearMonthFns.until(later, earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P3Y', '-P2Y'],
  //       ['months', 'P2Y8M', '-P2Y8M']
  //     ]
  //     incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'ceil'
  //       it(`rounds up to ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.until(earlier, later, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${yearMonthFns.until(later, earlier, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P2Y', '-P3Y'],
  //       ['months', 'P2Y8M', '-P2Y8M']
  //     ]
  //     incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'floor'
  //       it(`rounds down to ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.until(earlier, later, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${yearMonthFns.until(later, earlier, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneTrunc: [TemporalPluralUnit, string][] = [
  //       ['years', 'P2Y'],
  //       ['months', 'P2Y8M']
  //     ]
  //     incrementOneTrunc.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'trunc'
  //       it(`truncates to ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.until(earlier, later, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${yearMonthFns.until(later, earlier, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     it('trunc is the default', () => {
  //       assert.equal(`${yearMonthFns.until(earlier, later, { smallestUnit: 'years' })}`, 'P2Y')
  //       assert.equal(`${yearMonthFns.until(later, earlier, { smallestUnit: 'years' })}`, '-P2Y')
  //     })
  //     it('rounds to an increment of years', () => {
  //       assert.equal(
  //         `${yearMonthFns.until(earlier, later, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
  //         'P4Y'
  //       )
  //     })
  //     it('rounds to an increment of months', () => {
  //       assert.equal(`${yearMonthFns.until(earlier, later, { smallestUnit: 'months', roundingIncrement: 5 })}`, 'P2Y5M')
  //       assert.equal(
  //         `${yearMonthFns.until(earlier, later, { largestUnit: 'months', smallestUnit: 'months', roundingIncrement: 10 })}`,
  //         'P30M'
  //       )
  //     })
  //     it('accepts singular units', () => {
  //       assert.equal(
  //         `${yearMonthFns.until(earlier, later, { largestUnit: 'year' })}`,
  //         `${yearMonthFns.until(earlier, later, { largestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${yearMonthFns.until(earlier, later, { smallestUnit: 'year' })}`,
  //         `${yearMonthFns.until(earlier, later, { smallestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${yearMonthFns.until(earlier, later, { largestUnit: 'month' })}`,
  //         `${yearMonthFns.until(earlier, later, { largestUnit: 'months' })}`
  //       )
  //       assert.equal(
  //         `${yearMonthFns.until(earlier, later, { smallestUnit: 'month' })}`,
  //         `${yearMonthFns.until(earlier, later, { smallestUnit: 'months' })}`
  //       )
  //     })
  //   })
  //   describe('YearMonth.since() works', () => {
  //     const nov94 = yearMonthFns.from('1994-11')
  //     const jun13 = yearMonthFns.from('2013-06')
  //     const diff = yearMonthFns.since(jun13, nov94)
  //     it(`${nov94}.since(${jun13}) == ${jun13}.since(${nov94}).negated()`, () =>
  //       assert.equal(yearMonthFns.since(nov94, jun13), durationFns.negated(diff)))
  //     it(`${nov94}.add(${diff}) == ${jun13}`, () => assert.equal(yearMonthFns.add(nov94, diff), jun13))
  //     it(`${jun13}.subtract(${diff}) == ${nov94}`, () => assert.equal(yearMonthFns.subtract(jun13, diff), nov94))
  //     it(`${jun13}.since(${nov94}) == ${nov94}.until(${jun13})`, () => assert.equal(diff, yearMonthFns.until(nov94, jun13)))
  //     it('object must contain at least the required properties', () => {
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.since(jun13, { year: 1994 }), TypeError)
  //     })
  //     const feb20 = yearMonthFns.from('2020-02')
  //     const feb21 = yearMonthFns.from('2021-02')
  //     it('defaults to returning years', () => {
  //       assert.equal(`${yearMonthFns.since(feb21, feb20)}`, 'P1Y')
  //       assert.equal(`${yearMonthFns.since(feb21, feb20, { largestUnit: 'auto' })}`, 'P1Y')
  //       assert.equal(`${yearMonthFns.since(feb21, feb20, { largestUnit: 'years' })}`, 'P1Y')
  //     })
  //     it('can return months', () => {
  //       assert.equal(`${yearMonthFns.since(feb21, feb20, { largestUnit: 'months' })}`, 'P12M')
  //     })
  //     it('cannot return lower units', () => {
  //       assert.throws(() => yearMonthFns.since(feb21, feb20, { largestUnit: 'weeks' }), RangeError)
  //       assert.throws(() => yearMonthFns.since(feb21, feb20, { largestUnit: 'days' }), RangeError)
  //       assert.throws(() => yearMonthFns.since(feb21, feb20, { largestUnit: 'hours' }), RangeError)
  //       assert.throws(() => yearMonthFns.since(feb21, feb20, { largestUnit: 'minutes' }), RangeError)
  //       assert.throws(() => yearMonthFns.since(feb21, feb20, { largestUnit: 'seconds' }), RangeError)
  //       assert.throws(() => yearMonthFns.since(feb21, feb20, { largestUnit: 'milliseconds' }), RangeError)
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.since(feb21, feb20, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) => assert.equal(`${yearMonthFns.since(feb21, feb20, options)}`, 'P1Y'))
  //     })
  //     const earlier = yearMonthFns.from('2019-01')
  //     const later = yearMonthFns.from('2021-09')
  //     it('throws on disallowed or invalid smallestUnit', () => {
  //       ;['era', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach((smallestUnit) => {
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.since(later, earlier, { smallestUnit }), RangeError)
  //       })
  //     })
  //     it('throws if smallestUnit is larger than largestUnit', () => {
  //       assert.throws(() => yearMonthFns.since(later, earlier, { largestUnit: 'months', smallestUnit: 'years' }), RangeError)
  //     })
  //     it('throws on invalid roundingMode', () => {
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.since(later, earlier, { roundingMode: 'cile' }), RangeError)
  //     })
  //     const incrementOneNearest: [TemporalPluralUnit, string][] = [
  //       ['years', 'P3Y'],
  //       ['months', 'P2Y8M']
  //     ]
  //     incrementOneNearest.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'halfExpand'
  //       it(`rounds to nearest ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.since(later, earlier, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${yearMonthFns.since(earlier, later, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P3Y', '-P2Y'],
  //       ['months', 'P2Y8M', '-P2Y8M']
  //     ]
  //     incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'ceil'
  //       it(`rounds up to ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.since(later, earlier, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${yearMonthFns.since(earlier, later, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
  //       ['years', 'P2Y', '-P3Y'],
  //       ['months', 'P2Y8M', '-P2Y8M']
  //     ]
  //     incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
  //       const roundingMode = 'floor'
  //       it(`rounds down to ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.since(later, earlier, { smallestUnit, roundingMode })}`, expectedPositive)
  //         assert.equal(`${yearMonthFns.since(earlier, later, { smallestUnit, roundingMode })}`, expectedNegative)
  //       })
  //     })
  //     const incrementOneTrunc: [TemporalPluralUnit, string][] = [
  //       ['years', 'P2Y'],
  //       ['months', 'P2Y8M']
  //     ]
  //     incrementOneTrunc.forEach(([smallestUnit, expected]) => {
  //       const roundingMode = 'trunc'
  //       it(`truncates to ${smallestUnit}`, () => {
  //         assert.equal(`${yearMonthFns.since(later, earlier, { smallestUnit, roundingMode })}`, expected)
  //         assert.equal(`${yearMonthFns.since(earlier, later, { smallestUnit, roundingMode })}`, `-${expected}`)
  //       })
  //     })
  //     it('trunc is the default', () => {
  //       assert.equal(`${yearMonthFns.since(later, earlier, { smallestUnit: 'years' })}`, 'P2Y')
  //       assert.equal(`${yearMonthFns.since(earlier, later, { smallestUnit: 'years' })}`, '-P2Y')
  //     })
  //     it('rounds to an increment of years', () => {
  //       assert.equal(
  //         `${yearMonthFns.since(later, earlier, { smallestUnit: 'years', roundingIncrement: 4, roundingMode: 'halfExpand' })}`,
  //         'P4Y'
  //       )
  //     })
  //     it('rounds to an increment of months', () => {
  //       assert.equal(`${yearMonthFns.since(later, earlier, { smallestUnit: 'months', roundingIncrement: 5 })}`, 'P2Y5M')
  //       assert.equal(
  //         `${yearMonthFns.since(later, earlier, { largestUnit: 'months', smallestUnit: 'months', roundingIncrement: 10 })}`,
  //         'P30M'
  //       )
  //     })
  //     it('accepts singular units', () => {
  //       assert.equal(
  //         `${yearMonthFns.since(later, earlier, { largestUnit: 'year' })}`,
  //         `${yearMonthFns.since(later, earlier, { largestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${yearMonthFns.since(later, earlier, { smallestUnit: 'year' })}`,
  //         `${yearMonthFns.since(later, earlier, { smallestUnit: 'years' })}`
  //       )
  //       assert.equal(
  //         `${yearMonthFns.since(later, earlier, { largestUnit: 'month' })}`,
  //         `${yearMonthFns.since(later, earlier, { largestUnit: 'months' })}`
  //       )
  //       assert.equal(
  //         `${yearMonthFns.since(later, earlier, { smallestUnit: 'month' })}`,
  //         `${yearMonthFns.since(later, earlier, { smallestUnit: 'months' })}`
  //       )
  //     })
  //   })
  //   describe('YearMonth.add() works', () => {
  //     const ym = yearMonthFns.from('2019-11')
  //     it('(2019-11) plus 2 months === 2020-01', () => {
  //       assert.equal(`${yearMonthFns.add(ym, { months: 2 })}`, '2020-01')
  //       assert.equal(`${yearMonthFns.add(ym, { months: 2 }, { overflow: 'constrain' })}`, '2020-01')
  //       assert.equal(`${yearMonthFns.add(ym, { months: 2 }, { overflow: 'reject' })}`, '2020-01')
  //     })
  //     it('(2019-11) plus 1 year === 2020-11', () => {
  //       assert.equal(`${yearMonthFns.add(ym, { years: 1 })}`, '2020-11')
  //       assert.equal(`${yearMonthFns.add(ym, { years: 1 }, { overflow: 'constrain' })}`, '2020-11')
  //       assert.equal(`${yearMonthFns.add(ym, { years: 1 }, { overflow: 'reject' })}`, '2020-11')
  //     })
  //     it('symmetrical with regard to negative durations', () => {
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2020-01'), { months: -2 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2020-11'), { years: -1 })}`, '2019-11')
  //     })
  //     it('yearMonth.add(durationObj)', () => {
  //       assert.equal(`${yearMonthFns.add(ym, durationFns.from('P2M'))}`, '2020-01')
  //     })
  //     it("ignores lower units that don't balance up to the length of the month", () => {
  //       assert.equal(`${yearMonthFns.add(ym, { days: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.add(ym, { days: 29 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.add(ym, { hours: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.add(ym, { minutes: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.add(ym, { seconds: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.add(ym, { milliseconds: 1 })}`, '2019-11')
  //     })
  //     it('adds lower units that balance up to a month or more', () => {
  //       assert.equal(`${yearMonthFns.add(ym, { days: 30 })}`, '2019-12')
  //       assert.equal(`${yearMonthFns.add(ym, { days: 31 })}`, '2019-12')
  //       assert.equal(`${yearMonthFns.add(ym, { days: 60 })}`, '2019-12')
  //       assert.equal(`${yearMonthFns.add(ym, { days: 61 })}`, '2020-01')
  //       assert.equal(`${yearMonthFns.add(ym, { hours: 720 })}`, '2019-12')
  //       assert.equal(`${yearMonthFns.add(ym, { minutes: 43200 })}`, '2019-12')
  //       assert.equal(`${yearMonthFns.add(ym, { seconds: 2592000 })}`, '2019-12')
  //       assert.equal(`${yearMonthFns.add(ym, { milliseconds: 2592000_000 })}`, '2019-12')
  //     })
  //     it('balances days to months based on the number of days in the ISO month', () => {
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2019-02'), { days: 27 })}`, '2019-02')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2019-02'), { days: 28 })}`, '2019-03')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2020-02'), { days: 28 })}`, '2020-02')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2020-02'), { days: 29 })}`, '2020-03')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2019-11'), { days: 29 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2019-11'), { days: 30 })}`, '2019-12')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2020-01'), { days: 30 })}`, '2020-01')
  //       assert.equal(`${yearMonthFns.add(yearMonthFns.from('2020-01'), { days: 31 })}`, '2020-02')
  //     })
  //     it('invalid overflow', () => {
  //       ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.add(ym, { months: 1 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('mixed positive and negative values always throw', () => {
  //       ;['constrain', 'reject'].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.add(ym, { years: 1, months: -6 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.add(ym, { months: 1 }, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) =>
  //         assert.equal(`${yearMonthFns.add(ym, { months: 1 }, options)}`, '2019-12')
  //       )
  //     })
  //     it('object must contain at least one correctly-spelled property', () => {
  //       assert.throws(() => yearMonthFns.add(ym, {}), TypeError)
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.add(ym, { month: 12 }), TypeError)
  //     })
  //     it('incorrectly-spelled properties are ignored', () => {
  //       //@ts-expect-error
  //       assert.equal(`${yearMonthFns.add(ym, { month: 1, years: 1 })}`, '2020-11')
  //     })
  //   })
  //   describe('YearMonth.subtract() works', () => {
  //     const ym = yearMonthFns.from('2019-11')
  //     it('(2019-11) minus 11 months === 2018-12', () => {
  //       assert.equal(`${yearMonthFns.subtract(ym, { months: 11 })}`, '2018-12')
  //       assert.equal(`${yearMonthFns.subtract(ym, { months: 11 }, { overflow: 'constrain' })}`, '2018-12')
  //       assert.equal(`${yearMonthFns.subtract(ym, { months: 11 }, { overflow: 'reject' })}`, '2018-12')
  //     })
  //     it('(2019-11) minus 12 years === 2007-11', () => {
  //       assert.equal(`${yearMonthFns.subtract(ym, { years: 12 })}`, '2007-11')
  //       assert.equal(`${yearMonthFns.subtract(ym, { years: 12 }, { overflow: 'constrain' })}`, '2007-11')
  //       assert.equal(`${yearMonthFns.subtract(ym, { years: 12 }, { overflow: 'reject' })}`, '2007-11')
  //     })
  //     it('symmetrical with regard to negative durations', () => {
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2018-12'), { months: -11 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2007-11'), { years: -12 })}`, '2019-11')
  //     })
  //     it('yearMonth.subtract(durationObj)', () => {
  //       assert.equal(`${yearMonthFns.subtract(ym, durationFns.from('P11M'))}`, '2018-12')
  //     })
  //     it("ignores lower units that don't balance up to the length of the month", () => {
  //       assert.equal(`${yearMonthFns.subtract(ym, { days: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.subtract(ym, { hours: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.subtract(ym, { minutes: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.subtract(ym, { seconds: 1 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.subtract(ym, { milliseconds: 1 })}`, '2019-11')
  //     })
  //     it('subtracts lower units that balance up to a day or more', () => {
  //       assert.equal(`${yearMonthFns.subtract(ym, { days: 29 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.subtract(ym, { days: 30 })}`, '2019-10')
  //       assert.equal(`${yearMonthFns.subtract(ym, { days: 60 })}`, '2019-10')
  //       assert.equal(`${yearMonthFns.subtract(ym, { days: 61 })}`, '2019-09')
  //       assert.equal(`${yearMonthFns.subtract(ym, { hours: 720 })}`, '2019-10')
  //       assert.equal(`${yearMonthFns.subtract(ym, { minutes: 43200 })}`, '2019-10')
  //       assert.equal(`${yearMonthFns.subtract(ym, { seconds: 2592000 })}`, '2019-10')
  //       assert.equal(`${yearMonthFns.subtract(ym, { milliseconds: 2592000_000 })}`, '2019-10')
  //     })
  //     it('balances days to months based on the number of days in the ISO month', () => {
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2019-02'), { days: 27 })}`, '2019-02')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2019-02'), { days: 28 })}`, '2019-01')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2020-02'), { days: 28 })}`, '2020-02')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2020-02'), { days: 29 })}`, '2020-01')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2019-11'), { days: 29 })}`, '2019-11')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2019-11'), { days: 30 })}`, '2019-10')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2020-01'), { days: 30 })}`, '2020-01')
  //       assert.equal(`${yearMonthFns.subtract(yearMonthFns.from('2020-01'), { days: 31 })}`, '2019-12')
  //     })
  //     it('invalid overflow', () => {
  //       ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.subtract(ym, { months: 1 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('mixed positive and negative values always throw', () => {
  //       ;['constrain', 'reject'].forEach((overflow) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.subtract(ym, { years: 1, months: -6 }, { overflow }), RangeError)
  //       )
  //     })
  //     it('options may only be an object or undefined', () => {
  //       ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.subtract(ym, { months: 1 }, badOptions), TypeError)
  //       )
  //       ;[{}, () => {}, undefined].forEach((options) =>
  //         assert.equal(`${yearMonthFns.subtract(ym, { months: 1 }, options)}`, '2019-10')
  //       )
  //     })
  //     it('object must contain at least one correctly-spelled property', () => {
  //       assert.throws(() => yearMonthFns.subtract(ym, {}), TypeError)
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.subtract(ym, { month: 12 }), TypeError)
  //     })
  //     it('incorrectly-spelled properties are ignored', () => {
  //       //@ts-expect-error
  //       assert.equal(`${yearMonthFns.subtract(ym, { month: 1, years: 1 })}`, '2018-11')
  //     })
  //   })
  //   describe('Min/max range', () => {
  //     it('constructing from numbers', () => {
  //       assert.throws(() => yearMonthFns.fromNumbers(-271821, 3), RangeError)
  //       assert.throws(() => yearMonthFns.fromNumbers(275760, 10), RangeError)
  //       assert.equal(`${yearMonthFns.fromNumbers(-271821, 4)}`, '-271821-04')
  //       assert.equal(`${yearMonthFns.fromNumbers(275760, 9)}`, '+275760-09')
  //     })
  //     it('constructing from property bag', () => {
  //       const tooEarly = { year: -271821, month: 3 }
  //       const tooLate = { year: 275760, month: 10 }
  //       ;['reject', 'constrain'].forEach((overflow) => {
  //         ;[tooEarly, tooLate].forEach((props) => {
  //           //@ts-expect-error
  //           assert.throws(() => yearMonthFns.from(props, { overflow }), RangeError)
  //         })
  //       })
  //       assert.equal(`${yearMonthFns.from({ year: -271821, month: 4 })}`, '-271821-04')
  //       assert.equal(`${yearMonthFns.from({ year: 275760, month: 9 })}`, '+275760-09')
  //     })
  //     it('constructing from ISO string', () => {
  //       ;['reject', 'constrain'].forEach((overflow) => {
  //         ;['-271821-03', '+275760-10'].forEach((str) => {
  //           //@ts-expect-error
  //           assert.throws(() => yearMonthFns.from(str, { overflow }), RangeError)
  //         })
  //       })
  //       assert.equal(`${yearMonthFns.from('-271821-04')}`, '-271821-04')
  //       assert.equal(`${yearMonthFns.from('+275760-09')}`, '+275760-09')
  //     })
  //     it('converting from Date', () => {
  //       const min = dateFns.from('-271821-04-19')
  //       const max = dateFns.from('+275760-09-13')
  //       assert.equal(`${dateFns.toYearMonth(min)}`, '-271821-04')
  //       assert.equal(`${dateFns.toYearMonth(max)}`, '+275760-09')
  //     })
  //     it('adding and subtracting beyond limit', () => {
  //       const min = yearMonthFns.from('-271821-04')
  //       const max = yearMonthFns.from('+275760-09')
  //       ;['reject', 'constrain'].forEach((overflow) => {
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.subtract(min, { months: 1 }, { overflow }), RangeError)
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.add(min, { months: 1 }, { overflow }), RangeError)
  //       })
  //     })
  //   })
  //   describe('YearMonth.with()', () => {
  //     it('throws on bad overflow', () => {
  //       ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
  //         assert.throws(
  //           //@ts-expect-error
  //           () => yearMonthFns.with(yearMonthFns.from({ year: 2019, month: 1 }), { month: 2 }, { overflow }),
  //           RangeError
  //         )
  //       )
  //     })
  //   })
  //   describe('YearMonth.toPlainDate()', () => {
  //     const ym = yearMonthFns.from('2002-01')
  //     it("doesn't take a primitive argument", () => {
  //       ;[22, '22', false, Symbol('22'), null].forEach((bad) => {
  //         //@ts-expect-error
  //         assert.throws(() => yearMonthFns.toDate(ym, bad), TypeError)
  //       })
  //     })
  //     it('takes an object argument with day property', () => {
  //       //@ts-expect-error
  //       assert.equal(`${yearMonthFns.toDate(ym, { day: 22 })}`, '2002-01-22')
  //     })
  //     it('needs at least a day property on the object in the ISO calendar', () => {
  //       //@ts-expect-error
  //       assert.throws(() => yearMonthFns.toDate(ym, { something: 'nothing' }), TypeError)
  //     })
  //   })
  //   describe('yearMonth.getISOFields() works', () => {
  //     const ym1 = yearMonthFns.from('1976-11')
  //     const fields = yearMonthFns.getFields(ym1)
  //     it('fields', () => {
  //       assert.equal(fields.year, 1976)
  //       assert.equal(fields.month, 11)
  //     })
  //     it('enumerable', () => {
  //       const fields2 = { ...fields }
  //       assert.equal(fields2.year, 1976)
  //       assert.equal(fields2.month, 11)
  //     })
  //     it('as input to constructor', () => {
  //       const ym2 = yearMonthFns.fromNumbers(fields.year, fields.month)
  //       assert.equal(ym2, ym1)
  //     })
  // })
})
