import { describe, it } from 'beartest-js'
import { dateTimeFns, durationFns, instantFns, zonedDateTimeFns } from './fns'
import { strict as assert } from 'assert'
import { IsObject, TemporalPluralUnit, TemporalSingularUnit } from 'ecmascript'

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
      assert.ok(!instantFns.isValid('2020-01-01T00:00:01.1111Z'))
      assert.ok(!instantFns.isValid('test'))
    })
  })
  describe('instantFns.from() works', () => {
    it('1976-11-18T15:23Z', () => {
      assert.equal(instantFns.getEpochMilliseconds(instantFns.from('1976-11-18T15:23Z')), Date.UTC(1976, 10, 18, 15, 23))
    })
    it('1976-11-18T15:23:30Z', () => {
      assert.equal(
        instantFns.getEpochMilliseconds(instantFns.from('1976-11-18T15:23:30Z')),
        Date.UTC(1976, 10, 18, 15, 23, 30)
      )
    })
    it('1976-11-18T15:23:30.123Z', () => {
      assert.equal(
        instantFns.getEpochMilliseconds(instantFns.from('1976-11-18T15:23:30.123Z')),
        Date.UTC(1976, 10, 18, 15, 23, 30, 123)
      )
    })
    it('2020-02-12T11:42-08:00', () => {
      assert.equal(instantFns.getEpochMilliseconds(instantFns.from('2020-02-12T11:42-08:00')), Date.UTC(2020, 1, 12, 19, 42))
    })
    it('2020-02-12T11:42-08:00[America/Vancouver]', () => {
      assert.equal(
        instantFns.getEpochMilliseconds(instantFns.from('2020-02-12T11:42-08:00[America/Vancouver]')),
        Date.UTC(2020, 1, 12, 19, 42)
      )
    })
    it('2020-02-12T11:42+01:00', () => {
      assert.equal(instantFns.getEpochMilliseconds(instantFns.from('2020-02-12T11:42+01:00')), Date.UTC(2020, 1, 12, 10, 42))
    })
    it('2020-02-12T11:42+01:00[Europe/Amsterdam]', () => {
      assert.equal(
        instantFns.getEpochMilliseconds(instantFns.from('2020-02-12T11:42+01:00[Europe/Amsterdam]')),
        Date.UTC(2020, 1, 12, 10, 42)
      )
    })
    it('2019-02-16T23:45-02:00[America/Sao_Paulo]', () => {
      assert.equal(
        instantFns.getEpochMilliseconds(instantFns.from('2019-02-16T23:45-02:00[America/Sao_Paulo]')),
        Date.UTC(2019, 1, 17, 1, 45)
      )
    })
    it('2019-02-16T23:45-03:00[America/Sao_Paulo]', () => {
      assert.equal(
        instantFns.getEpochMilliseconds(instantFns.from('2019-02-16T23:45-03:00[America/Sao_Paulo]')),
        Date.UTC(2019, 1, 17, 2, 45)
      )
    })
    it('sub-minute offset', () => {
      assert.equal(
        instantFns.getEpochMilliseconds(instantFns.from('1900-01-01T12:19:32+00:19:32[Europe/Amsterdam]')),
        Date.UTC(1900, 0, 1, 12)
      )
    })
    it('instantFns.from(string-convertible) converts to string', () => {
      const obj = {
        toString() {
          return '2020-02-12T11:42+01:00[Europe/Amsterdam]'
        }
      }
      assert.equal(`${instantFns.from(obj)}`, '2020-02-12T10:42:00.000Z')
    })
    it('instantFns.from(1) throws', () => assert.throws(() => instantFns.from(1), RangeError))
    it('instantFns.from(-1) throws', () => assert.throws(() => instantFns.from(-1), RangeError))
    it('instantFns.from({}) throws', () => assert.throws(() => instantFns.from({}), RangeError))
    it('instantFns.from(ISO string leap second) is constrained', () => {
      assert.equal(`${instantFns.from('2016-12-31T23:59:60Z')}`, '2016-12-31T23:59:59.000Z')
    })
    it('variant time separators', () => {
      assert.equal(`${instantFns.from('1976-11-18t15:23Z')}`, '1976-11-18T15:23:00.000Z')
      assert.equal(`${instantFns.from('1976-11-18 15:23Z')}`, '1976-11-18T15:23:00.000Z')
    })
    it('variant UTC designator', () => {
      assert.equal(`${instantFns.from('1976-11-18T15:23z')}`, '1976-11-18T15:23:00.000Z')
    })
    it('any number of decimal places', () => {
      assert.equal(`${instantFns.from('1976-11-18T15:23:30.1Z')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('1976-11-18T15:23:30.12Z')}`, '1976-11-18T15:23:30.120Z')
      assert.equal(`${instantFns.from('1976-11-18T15:23:30.123Z')}`, '1976-11-18T15:23:30.123Z')
    })
    it('variant decimal separator', () => {
      assert.equal(`${instantFns.from('1976-11-18T15:23:30,12Z')}`, '1976-11-18T15:23:30.120Z')
    })
    it('variant minus sign', () => {
      assert.equal(`${instantFns.from('1976-11-18T15:23:30.12\u221202:00')}`, '1976-11-18T17:23:30.120Z')
      assert.equal(`${instantFns.from('\u2212009999-11-18T15:23:30.12Z')}`, '-009999-11-18T15:23:30.120Z')
    })
    it('mixture of basic and extended format', () => {
      assert.equal(`${instantFns.from('19761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('1976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('1976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('1976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('19761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('19761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('+0019761118T15:23:30.1+00:00')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('+001976-11-18T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('+001976-11-18T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('+001976-11-18T152330.1+0000')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('+0019761118T15:23:30.1+0000')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('+0019761118T152330.1+00:00')}`, '1976-11-18T15:23:30.100Z')
      assert.equal(`${instantFns.from('+0019761118T152330.1+0000')}`, '1976-11-18T15:23:30.100Z')
    })
    it('optional parts', () => {
      assert.equal(`${instantFns.from('1976-11-18T15:23:30+00')}`, '1976-11-18T15:23:30.000Z')
      assert.equal(`${instantFns.from('1976-11-18T15Z')}`, '1976-11-18T15:00:00.000Z')
    })
    it('no junk at end of string', () => assert.throws(() => instantFns.from('1976-11-18T15:23:30.123Zjunk'), RangeError))
  })
  describe('Instant.add works', () => {
    const inst = instantFns.from('1969-12-25T12:23:45.678Z')
    // #83
    // describe('cross epoch in seconds', () => {
    //   const one = instantFns.subtract(inst, { hours: 240, seconds: 1 })
    //   const two = instantFns.add(inst, { hours: 240, seconds: 1 })
    //   const three = instantFns.subtract(two, { hours: 480, seconds: 1 })
    //   const four = instantFns.add(one, { hours: 480, seconds: 1 })

    //   it(`instantFns.subtract(${inst}), { hours: 240, seconds: 1 }) = ${one}`, () =>
    //     assert.equal(one, '1969-12-15T12:23:44.678Z'))
    //   it(`instantFns.add(${inst}, { hours: 240, seconds: 1 }) = ${two}`, () => assert.equal(two, '1970-01-04T12:23:46.678Z'))
    //   it(`instantFns.subtract(${two}, { hours: 480, seconds: 1 }) = ${one}`, () => assert(instantFns.equals(three, one)))
    //   it(`instantFns.add(${one}, { hours: 480, seconds: 1 }) = ${two}`, () => assert(instantFns.equals(four, two)))
    // })
    it('inst.add(durationObj)', () => {
      const later = instantFns.add(inst, durationFns.from('PT240H0.000S'))
      assert.equal(`${later}`, '1970-01-04T12:23:45.678Z')
    })
    it('invalid to add years, months, weeks, or days', () => {
      assert.throws(() => instantFns.add(inst, { years: 1 }), RangeError)
      assert.throws(() => instantFns.add(inst, { months: 1 }), RangeError)
      assert.throws(() => instantFns.add(inst, { weeks: 1 }), RangeError)
      assert.throws(() => instantFns.add(inst, { days: 1 }), RangeError)
    })
    it('mixed positive and negative values always throw', () => {
      assert.throws(() => instantFns.add(inst, { hours: 1, minutes: -30 }), RangeError)
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => instantFns.add(inst, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => instantFns.add(inst, { hour: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${instantFns.add(inst, { hour: 1, minutes: 1 })}`, '1969-12-25T12:24:45.678Z')
    })
  })
  describe('Instant.subtract works', () => {
    const inst = instantFns.from('1969-12-25T12:23:45.678901234Z')
    it('instantFns.subtract(inst, durationObj)', () => {
      const earlier = instantFns.subtract(inst, durationFns.from('PT240H0.000S'))
      assert.equal(`${earlier}`, '1969-12-15T12:23:45.678Z')
    })
    it('invalid to subtract years, months, weeks, or days', () => {
      assert.throws(() => instantFns.subtract(inst, { years: 1 }), RangeError)
      assert.throws(() => instantFns.subtract(inst, { months: 1 }), RangeError)
      assert.throws(() => instantFns.subtract(inst, { weeks: 1 }), RangeError)
      assert.throws(() => instantFns.subtract(inst, { days: 1 }), RangeError)
    })
    it('mixed positive and negative values always throw', () => {
      assert.throws(() => instantFns.subtract(inst, { hours: 1, minutes: -30 }), RangeError)
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => instantFns.subtract(inst, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => instantFns.subtract(inst, { hour: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(`${instantFns.subtract(inst, { hour: 1, minutes: 1 })}`, '1969-12-25T12:22:45.678Z')
    })
  })
  describe('Instant.compare works', () => {
    const i1 = instantFns.from('1963-02-13T09:36:29.123Z')
    const i2 = instantFns.from('1976-11-18T15:23:30.123Z')
    const i3 = instantFns.from('1981-12-15T14:34:31.987654321Z')
    it('pre epoch equal', () => assert.equal(instantFns.compare(i1, instantFns.from(i1)), 0))
    it('epoch equal', () => assert.equal(instantFns.compare(i2, instantFns.from(i2)), 0))
    it('cross epoch smaller/larger', () => assert.equal(instantFns.compare(i1, i2), -1))
    it('cross epoch larger/smaller', () => assert.equal(instantFns.compare(i2, i1), 1))
    it('epoch smaller/larger', () => assert.equal(instantFns.compare(i2, i3), -1))
    it('epoch larger/smaller', () => assert.equal(instantFns.compare(i3, i2), 1))
  })
  describe('Instant.equals works', () => {
    const i1 = instantFns.from('1963-02-13T09:36:29.123Z')
    const i2 = instantFns.from('1976-11-18T15:23:30.123Z')
    const i3 = instantFns.from('1981-12-15T14:34:31.987654321Z')
    it('pre epoch equal', () => assert(instantFns.equals(i1, i1)))
    it('epoch equal', () => assert(instantFns.equals(i2, i2)))
    it('cross epoch unequal', () => assert(!instantFns.equals(i1, i2)))
    it('epoch unequal', () => assert(!instantFns.equals(i2, i3)))
  })
  describe('Instant.since() works', () => {
    const earlier = instantFns.from('1976-11-18T15:23:30.123Z')
    const later = instantFns.from('2019-10-29T10:46:38.271Z')
    const diff = instantFns.since(later, earlier)

    it(`instantFns.since(${earlier}, ${later}) = durationFns.negated(${diff})`, () =>
      assert.equal(instantFns.since(earlier, later), durationFns.negated(diff)))
    it(`instantFns.since(${later}, ${earlier}) = ${diff}`, () => assert.equal(instantFns.since(later, earlier), diff))

    // #81
    // it(`instantFns.add(${earlier}, ${diff}) == ${later}`, () => assert.equal(instantFns.add(earlier, diff), later))
    // it(`instantFns.subtract(${later}, ${diff}) == ${earlier}`, () =>
    //   assert(instantFns.equals(instantFns.subtract(later, diff), earlier)))
    // const feb20 = instantFns.from('2020-02-01T00:00Z')
    // const feb21 = instantFns.from('2021-02-01T00:00Z')
    // it('can return minutes and hours', () => {
    //   assert.equal(`${instantFns.since(feb21, feb20, { largestUnit: 'hours' })}`, 'PT8784H')
    //   assert.equal(`${instantFns.since(feb21, feb20, { largestUnit: 'minutes' })}`, 'PT527040M')
    // })
    // it('can return seconds', () => {
    //   const later = instantFns.add(feb20, { hours: 24, milliseconds: 250 })
    //   const msDiff = instantFns.since(later, feb20)
    //   assert.equal(durationFns.getMilliseconds(msDiff), 86400250)
    // })
    //   it('cannot return days, weeks, months, and years', () => {
    //     assert.throws(() => instantFns.since(feb21, feb20, { largestUnit: 'days' }), RangeError)
    //     assert.throws(() => instantFns.since(feb21, feb20, { largestUnit: 'weeks' }), RangeError)
    //     assert.throws(() => instantFns.since(feb21, feb20, { largestUnit: 'months' }), RangeError)
    //     assert.throws(() => instantFns.since(feb21, feb20, { largestUnit: 'years' }), RangeError)
    //   })
    //   it('options may only be an object or undefined', () => {
    //     ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
    //       //@ts-expect-error
    //       assert.throws(() => instantFns.since(feb21, feb20, badOptions), TypeError)
    //     )
    //     ;[{}, () => {}, undefined].forEach((options) =>
    //       assert.equal(`${instantFns.since(feb21, feb20, options)}`, 'PT31622400S')
    //     )
    //   })
    //   it('throws on disallowed or invalid smallestUnit', () => {
    //     ;['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach((smallestUnit) => {
    //       //@ts-expect-error
    //       assert.throws(() => instantFns.since(later, earlier, { smallestUnit }), RangeError)
    //     })
    //   })
    //   it('throws if smallestUnit is larger than largestUnit', () => {
    //     const units: TemporalPluralUnit[] = ['hours', 'minutes', 'seconds', 'milliseconds']
    //     for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
    //       for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
    //         const largestUnit = units[largestIdx]
    //         const smallestUnit = units[smallestIdx]
    //         assert.throws(() => instantFns.since(later, earlier, { largestUnit, smallestUnit }), RangeError)
    //       }
    //     }
    //   })
    //   it('assumes a different default for largestUnit if smallestUnit is larger than seconds', () => {
    //     assert.equal(`${instantFns.since(later, earlier, { smallestUnit: 'hours', roundingMode: 'halfExpand' })}`, 'PT376435H')
    //     assert.equal(
    //       `${instantFns.since(later, earlier, { smallestUnit: 'minutes', roundingMode: 'halfExpand' })}`,
    //       'PT22586123M'
    //     )
    //   })
    //   const largestUnit = 'hours'
    //   const incrementOneNearest: [TemporalPluralUnit, string][] = [
    //     ['hours', 'PT376435H'],
    //     ['minutes', 'PT376435H23M'],
    //     ['seconds', 'PT376435H23M8S'],
    //     ['milliseconds', 'PT376435H23M8.149S']
    //   ]
    //   incrementOneNearest.forEach(([smallestUnit, expected]) => {
    //     const roundingMode = 'halfExpand'
    //     it(`rounds to nearest ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.since(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, expected)
    //       assert.equal(`${instantFns.since(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`)
    //     })
    //   })
    //   const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
    //     ['hours', 'PT376436H', '-PT376435H'],
    //     ['minutes', 'PT376435H24M', '-PT376435H23M'],
    //     ['seconds', 'PT376435H23M9S', '-PT376435H23M8S'],
    //     ['milliseconds', 'PT376435H23M8.149S', '-PT376435H23M8.148S']
    //   ]
    //   incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
    //     const roundingMode = 'ceil'
    //     it(`rounds up to ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.since(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive)
    //       assert.equal(`${instantFns.since(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative)
    //     })
    //   })
    //   const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
    //     ['hours', 'PT376435H', '-PT376436H'],
    //     ['minutes', 'PT376435H23M', '-PT376435H24M'],
    //     ['seconds', 'PT376435H23M8S', '-PT376435H23M9S'],
    //     ['milliseconds', 'PT376435H23M8.148S', '-PT376435H23M8.149S']
    //   ]
    //   incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
    //     const roundingMode = 'floor'
    //     it(`rounds down to ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.since(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive)
    //       assert.equal(`${instantFns.since(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative)
    //     })
    //   })
    //   const incrementOneTrunc: [TemporalPluralUnit, string][] = [
    //     ['hours', 'PT376435H'],
    //     ['minutes', 'PT376435H23M'],
    //     ['seconds', 'PT376435H23M8S'],
    //     ['milliseconds', 'PT376435H23M8.148S']
    //   ]
    //   incrementOneTrunc.forEach(([smallestUnit, expected]) => {
    //     const roundingMode = 'trunc'
    //     it(`truncates to ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.since(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, expected)
    //       assert.equal(`${instantFns.since(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`)
    //     })
    //   })
    //   it('rounds to an increment of hours', () => {
    //     assert.equal(
    //       `${instantFns.since(later, earlier, {
    //         largestUnit,
    //         smallestUnit: 'hours',
    //         roundingIncrement: 3,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT376434H'
    //     )
    //   })
    //   it('rounds to an increment of minutes', () => {
    //     assert.equal(
    //       `${instantFns.since(later, earlier, {
    //         largestUnit,
    //         smallestUnit: 'minutes',
    //         roundingIncrement: 30,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT376435H30M'
    //     )
    //   })
    //   it('rounds to an increment of seconds', () => {
    //     assert.equal(
    //       `${instantFns.since(later, earlier, {
    //         largestUnit,
    //         smallestUnit: 'seconds',
    //         roundingIncrement: 15,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT376435H23M15S'
    //     )
    //   })
    //   it('rounds to an increment of milliseconds', () => {
    //     assert.equal(
    //       `${instantFns.since(later, earlier, {
    //         largestUnit,
    //         smallestUnit: 'milliseconds',
    //         roundingIncrement: 10,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT376435H23M8.15S'
    //     )
    //   })
    //   // it('valid hour increments divide into 24', () => {
    //   //   ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
    //   //     const options = { largestUnit, smallestUnit: 'hours', roundingIncrement }
    //   //     assert(instantFns.since(later, earlier, options) instanceof Temporal.Duration)
    //   //   })
    //   // })
    //   // ;['minutes', 'seconds'].forEach((smallestUnit) => {
    //   //   it(`valid ${smallestUnit} increments divide into 60`, () => {
    //   //     ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
    //   //       const options = { largestUnit, smallestUnit, roundingIncrement }
    //   //       assert(instantFns.since(later, earlier, options) instanceof Temporal.Duration)
    //   //     })
    //   //   })
    //   // })
    //   // ;['milliseconds'].forEach((smallestUnit) => {
    //   //   it(`valid ${smallestUnit} increments divide into 1000`, () => {
    //   //     ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
    //   //       const options = { largestUnit, smallestUnit, roundingIncrement }
    //   //       assert(instantFns.since(later, earlier, options) instanceof Temporal.Duration)
    //   //     })
    //   //   })
    //   // })
    //   it('throws on increments that do not divide evenly into the next highest', () => {
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 11 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 29 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 29 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 29 }),
    //       RangeError
    //     )
    //   })
    //   it('throws on increments that are equal to the next highest', () => {
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'hours', roundingIncrement: 24 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 60 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 60 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.since(later, earlier, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
    //       RangeError
    //     )
    //   })
  })
  describe('Instant.until() works', () => {
    const earlier = instantFns.from('1969-07-24T16:50:35.123Z')
    const later = instantFns.from('2019-10-29T10:46:38.271986102Z')
    const diff = instantFns.until(earlier, later)

    it(`instantFns.until(${later}, ${earlier}) == durationFns.negated(instantFns.until(${earlier}, ${later}))`, () =>
      assert.equal(instantFns.until(later, earlier), durationFns.negated(diff)))
    it(`instantFns.until(${earlier}, ${later}) == instantFns.since(${later}, ${earlier})`, () =>
      assert.equal(instantFns.until(earlier, later), instantFns.since(later, earlier)))

    // #82
    // it(`instantFns.add(${earlier}, ${diff}) == ${later}`, () => assert.equal(instantFns.add(earlier, diff), later))
    // it(`instantFns.subtract(${later}, ${diff}) == ${earlier}`, () => assert.equal(instantFns.subtract(later, diff), earlier))

    // const feb20 = instantFns.from('2020-02-01T00:00Z')
    // const feb21 = instantFns.from('2021-02-01T00:00Z')
    // it('can return minutes and hours', () => {
    //   assert.equal(instantFns.until(feb20, feb21, { largestUnit: 'hours' }), 'PT8784H')
    //   assert.equal(instantFns.until(feb20, feb21, { largestUnit: 'minutes' }), 'PT527040M')
    // })
    //   it('can return subseconds', () => {
    //     const later = instantFns.add(feb20, { hours: 24, milliseconds: 250 })
    //     const msDiff = instantFns.until(feb20, later, { largestUnit: 'milliseconds' })
    //     assert.equal(durationFns.getSeconds(msDiff), 0)
    //     assert.equal(durationFns.getMilliseconds(msDiff), 86400250)
    //   })
    //   it('cannot return days, weeks, months, and years', () => {
    //     assert.throws(() => instantFns.until(feb20, feb21, { largestUnit: 'days' }), RangeError)
    //     assert.throws(() => instantFns.until(feb20, feb21, { largestUnit: 'weeks' }), RangeError)
    //     assert.throws(() => instantFns.until(feb20, feb21, { largestUnit: 'months' }), RangeError)
    //     assert.throws(() => instantFns.until(feb20, feb21, { largestUnit: 'years' }), RangeError)
    //   })
    //   it('options may only be an object or undefined', () => {
    //     ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
    //       //@ts-expect-error
    //       assert.throws(() => instantFns.until(feb20, feb21, badOptions), TypeError)
    //     )
    //     ;[{}, () => {}, undefined].forEach((options) =>
    //       assert.equal(`${instantFns.until(feb20, feb21, options)}`, 'PT31622400S')
    //     )
    //   })
    //   it('throws on disallowed or invalid smallestUnit', () => {
    //     ;['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach((smallestUnit) => {
    //       //@ts-expect-error
    //       assert.throws(() => instantFns.until(earlier, later, { smallestUnit }), RangeError)
    //     })
    //   })
    //   it('throws if smallestUnit is larger than largestUnit', () => {
    //     const units: TemporalPluralUnit[] = ['hours', 'minutes', 'seconds', 'milliseconds']
    //     for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
    //       for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
    //         const largestUnit = units[largestIdx]
    //         const smallestUnit = units[smallestIdx]
    //         assert.throws(() => instantFns.until(earlier, later, { largestUnit, smallestUnit }), RangeError)
    //       }
    //     }
    //   })
    //   it('assumes a different default for largestUnit if smallestUnit is larger than seconds', () => {
    //     assert.equal(`${instantFns.until(earlier, later, { smallestUnit: 'hours', roundingMode: 'halfExpand' })}`, 'PT440610H')
    //     assert.equal(
    //       `${instantFns.until(earlier, later, { smallestUnit: 'minutes', roundingMode: 'halfExpand' })}`,
    //       'PT26436596M'
    //     )
    //   })
    //   const largestUnit = 'hours'
    //   const incrementOneNearest: [TemporalPluralUnit, string][] = [
    //     ['hours', 'PT440610H'],
    //     ['minutes', 'PT440609H56M'],
    //     ['seconds', 'PT440609H56M3S'],
    //     ['milliseconds', 'PT440609H56M3.149S']
    //   ]
    //   incrementOneNearest.forEach(([smallestUnit, expected]) => {
    //     const roundingMode = 'halfExpand'
    //     it(`rounds to nearest ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.until(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, expected)
    //       assert.equal(`${instantFns.until(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`)
    //     })
    //   })
    //   const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
    //     ['hours', 'PT440610H', '-PT440609H'],
    //     ['minutes', 'PT440609H57M', '-PT440609H56M'],
    //     ['seconds', 'PT440609H56M4S', '-PT440609H56M3S'],
    //     ['milliseconds', 'PT440609H56M3.149S', '-PT440609H56M3.148S']
    //   ]
    //   incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
    //     const roundingMode = 'ceil'
    //     it(`rounds up to ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.until(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive)
    //       assert.equal(`${instantFns.until(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative)
    //     })
    //   })
    //   const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
    //     ['hours', 'PT440609H', '-PT440610H'],
    //     ['minutes', 'PT440609H56M', '-PT440609H57M'],
    //     ['seconds', 'PT440609H56M3S', '-PT440609H56M4S'],
    //     ['milliseconds', 'PT440609H56M3.148S', '-PT440609H56M3.149S']
    //   ]
    //   incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
    //     const roundingMode = 'floor'
    //     it(`rounds down to ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.until(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, expectedPositive)
    //       assert.equal(`${instantFns.until(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, expectedNegative)
    //     })
    //   })
    //   const incrementOneTrunc: [TemporalPluralUnit, string][] = [
    //     ['hours', 'PT440609H'],
    //     ['minutes', 'PT440609H56M'],
    //     ['seconds', 'PT440609H56M3S'],
    //     ['milliseconds', 'PT440609H56M3.148S']
    //   ]
    //   incrementOneTrunc.forEach(([smallestUnit, expected]) => {
    //     const roundingMode = 'trunc'
    //     it(`truncates to ${smallestUnit}`, () => {
    //       assert.equal(`${instantFns.until(earlier, later, { largestUnit, smallestUnit, roundingMode })}`, expected)
    //       assert.equal(`${instantFns.until(later, earlier, { largestUnit, smallestUnit, roundingMode })}`, `-${expected}`)
    //     })
    //   })
    //   it('rounds to an increment of hours', () => {
    //     assert.equal(
    //       `${instantFns.until(earlier, later, {
    //         largestUnit,
    //         smallestUnit: 'hours',
    //         roundingIncrement: 4,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT440608H'
    //     )
    //   })
    //   it('rounds to an increment of minutes', () => {
    //     assert.equal(
    //       `${instantFns.until(earlier, later, {
    //         largestUnit,
    //         smallestUnit: 'minutes',
    //         roundingIncrement: 30,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT440610H'
    //     )
    //   })
    //   it('rounds to an increment of seconds', () => {
    //     assert.equal(
    //       `${instantFns.until(earlier, later, {
    //         largestUnit,
    //         smallestUnit: 'seconds',
    //         roundingIncrement: 15,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT440609H56M'
    //     )
    //   })
    //   it('rounds to an increment of milliseconds', () => {
    //     assert.equal(
    //       `${instantFns.until(earlier, later, {
    //         largestUnit,
    //         smallestUnit: 'milliseconds',
    //         roundingIncrement: 10,
    //         roundingMode: 'halfExpand'
    //       })}`,
    //       'PT440609H56M3.15S'
    //     )
    //   })
    //   // it('valid hour increments divide into 24', () => {
    //   //   ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
    //   //     const options = { largestUnit, smallestUnit: 'hours', roundingIncrement }
    //   //     assert(instantFns.until(earlier, later, options) instanceof Temporal.Duration)
    //   //   })
    //   // })
    //   // ;['minutes', 'seconds'].forEach((smallestUnit) => {
    //   //   it(`valid ${smallestUnit} increments divide into 60`, () => {
    //   //     ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
    //   //       const options = { largestUnit, smallestUnit, roundingIncrement }
    //   //       assert(instantFns.until(earlier, later, options) instanceof Temporal.Duration)
    //   //     })
    //   //   })
    //   // })
    //   // ;['milliseconds'].forEach((smallestUnit) => {
    //   //   it(`valid ${smallestUnit} increments divide into 1000`, () => {
    //   //     ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
    //   //       const options = { largestUnit, smallestUnit, roundingIncrement }
    //   //       assert(instantFns.until(earlier, later, options) instanceof Temporal.Duration)
    //   //     })
    //   //   })
    //   // })
    //   it('throws on increments that do not divide evenly into the next highest', () => {
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'hours', roundingIncrement: 11 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 29 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 29 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 29 }),
    //       RangeError
    //     )
    //   })
    //   it('throws on increments that are equal to the next highest', () => {
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'hours', roundingIncrement: 24 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'minutes', roundingIncrement: 60 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'seconds', roundingIncrement: 60 }),
    //       RangeError
    //     )
    //     assert.throws(
    //       () => instantFns.until(earlier, later, { largestUnit, smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
    //       RangeError
    //     )
    //   })
  })
  describe('Instant.round works', () => {
    const inst = instantFns.from('1976-11-18T14:23:30.123Z')
    it('throws without required smallestUnit parameter', () => {
      assert.throws(() => instantFns.round(inst, {}), RangeError)
      assert.throws(() => instantFns.round(inst, { roundingIncrement: 1, roundingMode: 'ceil' }), RangeError)
    })
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => instantFns.round(inst, { smallestUnit }), RangeError)
      })
    })
    const incrementOneNearest: [TemporalSingularUnit, string][] = [
      ['hour', '1976-11-18T14:00:00.000Z'],
      ['minute', '1976-11-18T14:24:00.000Z'],
      ['second', '1976-11-18T14:23:30.000Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      it(`rounds to nearest ${smallestUnit}`, () =>
        assert.equal(`${instantFns.round(inst, { smallestUnit, roundingMode: 'halfExpand' })}`, expected))
    })
    const incrementOneCeil: [TemporalSingularUnit, string][] = [
      ['hour', '1976-11-18T15:00:00.000Z'],
      ['minute', '1976-11-18T14:24:00.000Z'],
      ['second', '1976-11-18T14:23:31.000Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z']
    ]
    incrementOneCeil.forEach(([smallestUnit, expected]) => {
      it(`rounds up to ${smallestUnit}`, () =>
        assert.equal(`${instantFns.round(inst, { smallestUnit, roundingMode: 'ceil' })}`, expected))
    })
    const incrementOneFloor: [TemporalSingularUnit, string][] = [
      ['hour', '1976-11-18T14:00:00.000Z'],
      ['minute', '1976-11-18T14:23:00.000Z'],
      ['second', '1976-11-18T14:23:30.000Z'],
      ['millisecond', '1976-11-18T14:23:30.123Z']
    ]
    incrementOneFloor.forEach(([smallestUnit, expected]) => {
      it(`rounds down to ${smallestUnit}`, () =>
        assert.equal(`${instantFns.round(inst, { smallestUnit, roundingMode: 'floor' })}`, expected))
      it(`truncates to ${smallestUnit}`, () =>
        assert.equal(`${instantFns.round(inst, { smallestUnit, roundingMode: 'trunc' })}`, expected))
    })
    it('rounding down is towards the Big Bang, not towards the epoch', () => {
      const inst2 = instantFns.from('1969-12-15T12:00:00.5Z')
      const smallestUnit = 'second'
      assert.equal(`${instantFns.round(inst2, { smallestUnit, roundingMode: 'ceil' })}`, '1969-12-15T12:00:01.000Z')
      assert.equal(`${instantFns.round(inst2, { smallestUnit, roundingMode: 'floor' })}`, '1969-12-15T12:00:00.000Z')
      assert.equal(`${instantFns.round(inst2, { smallestUnit, roundingMode: 'trunc' })}`, '1969-12-15T12:00:00.000Z')
      assert.equal(`${instantFns.round(inst2, { smallestUnit, roundingMode: 'halfExpand' })}`, '1969-12-15T12:00:01.000Z')
    })
    it('rounds to an increment of hours', () => {
      assert.equal(`${instantFns.round(inst, { smallestUnit: 'hour', roundingIncrement: 4 })}`, '1976-11-18T16:00:00.000Z')
    })
    it('rounds to an increment of minutes', () => {
      assert.equal(
        `${instantFns.round(inst, { smallestUnit: 'minute', roundingIncrement: 15 })}`,
        '1976-11-18T14:30:00.000Z'
      )
    })
    it('rounds to an increment of seconds', () => {
      assert.equal(
        `${instantFns.round(inst, { smallestUnit: 'second', roundingIncrement: 30 })}`,
        '1976-11-18T14:23:30.000Z'
      )
    })
    it('rounds to an increment of milliseconds', () => {
      assert.equal(
        `${instantFns.round(inst, { smallestUnit: 'millisecond', roundingIncrement: 10 })}`,
        '1976-11-18T14:23:30.120Z'
      )
    })
    it('rounds to days by specifying increment of 86400 seconds in various units', () => {
      const expected = '1976-11-19T00:00:00.000Z'
      assert.equal(`${instantFns.round(inst, { smallestUnit: 'hour', roundingIncrement: 24 })}`, expected)
      assert.equal(`${instantFns.round(inst, { smallestUnit: 'minute', roundingIncrement: 1440 })}`, expected)
      assert.equal(`${instantFns.round(inst, { smallestUnit: 'second', roundingIncrement: 86400 })}`, expected)
      assert.equal(`${instantFns.round(inst, { smallestUnit: 'millisecond', roundingIncrement: 86400e3 })}`, expected)
    })
    it('allows increments that divide evenly into solar days', () => {
      instantFns.isValid(instantFns.round(inst, { smallestUnit: 'second', roundingIncrement: 864 }))
    })
    it('throws on increments that do not divide evenly into solar days', () => {
      assert.throws(() => instantFns.round(inst, { smallestUnit: 'hour', roundingIncrement: 7 }), RangeError)
      assert.throws(() => instantFns.round(inst, { smallestUnit: 'minute', roundingIncrement: 29 }), RangeError)
      assert.throws(() => instantFns.round(inst, { smallestUnit: 'second', roundingIncrement: 29 }), RangeError)
      assert.throws(() => instantFns.round(inst, { smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError)
    })
  })
  describe('Min/max range', () => {
    it('constructing from ms', () => {
      const limit = 86400e11
      assert.throws(() => instantFns.fromEpochMilliseconds(-limit - 1), RangeError)
      assert.throws(() => instantFns.fromEpochMilliseconds(limit + 1), RangeError)
      assert.equal(`${instantFns.fromEpochMilliseconds(-limit)}`, '-271821-04-20T00:00:00.000Z')
      assert.equal(`${instantFns.fromEpochMilliseconds(limit)}`, '+275760-09-13T00:00:00.000Z')
    })
    it('constructing from ISO string', () => {
      assert.throws(() => instantFns.from('-271821-04-19T23:59:59.999Z'), RangeError)
      assert.throws(() => instantFns.from('+275760-09-13T00:00:00.001Z'), RangeError)
      assert.equal(`${instantFns.from('-271821-04-20T00:00Z')}`, '-271821-04-20T00:00:00.000Z')
      assert.equal(`${instantFns.from('+275760-09-13T00:00Z')}`, '+275760-09-13T00:00:00.000Z')
    })
    it('converting from DateTime', () => {
      const min = dateTimeFns.from('-271821-04-19T00:00:00.001')
      const max = dateTimeFns.from('+275760-09-13T23:59:59.999')
      assert.throws(() => instantFns.from(min), RangeError)
      assert.throws(() => instantFns.from(max), RangeError)
    })
  })
  describe('Instant.toZonedDateTime() works', () => {
    const inst = instantFns.from('1976-11-18T14:23:30.123Z')
    it('throws without parameter', () => {
      //@ts-expect-error
      assert.throws(() => instantFns.toZonedDateTime(inst), RangeError)
    })
    it('time zone parameter UTC', () => {
      const zdt = instantFns.toZonedDateTime(inst, 'UTC')
      assert.equal(`${zdt}`, '1976-11-18T14:23:30.123+00:00[UTC]')
    })
    it('time zone parameter non-UTC', () => {
      const zdt = instantFns.toZonedDateTime(inst, 'America/New_York')
      assert.equal(`${zdt}`, '1976-11-18T09:23:30.123-05:00[America/New_York]')
    })
    it('correctly converts', () => {
      assert.equal(
        instantFns.toZonedDateTime(inst, 'Asia/Singapore'),
        zonedDateTimeFns.from('1976-11-18T21:53:30.123[Asia/Singapore]')
      )
    })
  })
})
