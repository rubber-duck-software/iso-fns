import { describe, it } from 'beartest-js'
import { dateTimeFns, durationFns, timeFns } from './fns'
import { strict as assert } from 'assert'
import { TemporalOverflow, TemporalPluralUnit } from 'ecmascript'

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
      assert.ok(!timeFns.isValid('00:00:01.1111'))
      assert.ok(!timeFns.isValid('test'))
    })
  })
})

describe('Time', () => {
  describe('time.until() works', () => {
    const time = timeFns.fromNumbers(15, 23, 30, 123)
    const one = timeFns.fromNumbers(16, 23, 30, 123)
    it(`(${time}).until(${one}) => PT1H`, () => {
      const duration = timeFns.until(time, one)
      assert.equal(duration, 'PT1H')
    })
    const two = timeFns.fromNumbers(17, 0, 30, 123)
    it(`(${time}).until(${two}) => PT1H37M`, () => {
      const duration = timeFns.until(time, two)
      assert.equal(duration, 'PT1H37M')
    })
    it(`(${two}).until(${time}) => -PT1H37M`, () => assert.equal(timeFns.until(two, time), '-PT1H37M'))
    // it(`(${time}).until(${two}) === (${two}).since(${time})`, () =>
    //   assert.equal(timeFns.until(time, two), timeFns.since(two, time)))
    it('object must contain at least one correctly-spelled property', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.until(time, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => timeFns.until(time, { minutes: 30 }), TypeError)
    })
    const time1 = timeFns.from('10:23:15')
    const time2 = timeFns.from('17:15:57')
    it('the default largest unit is at least hours', () => {
      assert.equal(timeFns.until(time1, time2), 'PT6H52M42S')
      assert.equal(timeFns.until(time1, time2, { largestUnit: 'auto' }), 'PT6H52M42S')
      assert.equal(timeFns.until(time1, time2, { largestUnit: 'hours' }), 'PT6H52M42S')
    })
    it('higher units are not allowed', () => {
      assert.throws(() => timeFns.until(time1, time2, { largestUnit: 'days' }), RangeError)
      assert.throws(() => timeFns.until(time1, time2, { largestUnit: 'weeks' }), RangeError)
      assert.throws(() => timeFns.until(time1, time2, { largestUnit: 'months' }), RangeError)
      assert.throws(() => timeFns.until(time1, time2, { largestUnit: 'years' }), RangeError)
    })
    // it('can return lower units', () => {
    //   assert.equal(timeFns.until(time1, time2, { largestUnit: 'minutes' }), 'PT412M42S')
    //   assert.equal(timeFns.until(time1, time2, { largestUnit: 'seconds' }), 'PT24762S')
    // })
    it('can return subseconds', () => {
      const time3 = timeFns.add(time2, { milliseconds: 250 })
      const msDiff = timeFns.until(time1, time3, { largestUnit: 'seconds' })
      assert.equal(durationFns.getSeconds(msDiff), 24762)
      assert.equal(durationFns.getMilliseconds(msDiff), 250)
    })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => timeFns.until(time, one, badOptions), TypeError)
      )
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(timeFns.until(time, one, options), 'PT1H'))
    })
    const earlier = timeFns.from('08:22:36.123')
    const later = timeFns.from('12:39:40.987654321')
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'years', 'months', 'weeks', 'days', 'year', 'month', 'week', 'day', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => timeFns.until(earlier, later, { smallestUnit }), RangeError)
      })
    })
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = ['hours', 'minutes', 'seconds', 'milliseconds']
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx]
          const smallestUnit = units[smallestIdx]
          //@ts-expect-error
          assert.throws(() => timeFns.until(earlier, later, { largestUnit, smallestUnit }), RangeError)
        }
      }
    })
    it('throws on invalid roundingMode', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.until(earlier, later, { roundingMode: 'cile' }), RangeError)
    })
    const incrementOneNearest: [TemporalPluralUnit, string][] = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      // it(`rounds to nearest ${smallestUnit, () => {
      //   assert.equal(timeFns.until(earlier, later, { smallestUnit, roundingMode }), expected)
      //   assert.equal(timeFns.until(later, earlier, { smallestUnit, roundingMode }), `-${expected)
      // })
    })
    const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
      ['hours', 'PT5H', '-PT4H'],
      ['minutes', 'PT4H18M', '-PT4H17M'],
      ['seconds', 'PT4H17M5S', '-PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.864S', '-PT4H17M4.864S']
    ]
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      // it(`rounds up to ${smallestUnit, () => {
      //   assert.equal(timeFns.until(earlier, later, { smallestUnit, roundingMode }), expectedPositive)
      //   assert.equal(timeFns.until(later, earlier, { smallestUnit, roundingMode }), expectedNegative)
      // })
    })
    const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
      ['hours', 'PT4H', '-PT5H'],
      ['minutes', 'PT4H17M', '-PT4H18M'],
      ['seconds', 'PT4H17M4S', '-PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S', '-PT4H17M4.864S']
    ]
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      // it(`rounds down to ${smallestUnit, () => {
      //   assert.equal(timeFns.until(earlier, later, { smallestUnit, roundingMode }), expectedPositive)
      //   assert.equal(timeFns.until(later, earlier, { smallestUnit, roundingMode }), expectedNegative)
      // })
    })
    const incrementOneTrunc: [TemporalPluralUnit, string][] = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.864S']
    ]
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      it(`truncates to ${smallestUnit}`, () => {
        assert.equal(timeFns.until(earlier, later, { smallestUnit, roundingMode }), expected)
        assert.equal(timeFns.until(later, earlier, { smallestUnit, roundingMode }), `-${expected}`)
      })
    })
    it('trunc is the default', () => {
      assert.equal(timeFns.until(earlier, later, { smallestUnit: 'minutes' }), 'PT4H17M')
      assert.equal(timeFns.until(earlier, later, { smallestUnit: 'seconds' }), 'PT4H17M4S')
    })
    it('rounds to an increment of hours', () => {
      assert.equal(
        timeFns.until(earlier, later, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' }),
        'PT3H'
      )
    })
    it('rounds to an increment of minutes', () => {
      assert.equal(
        timeFns.until(earlier, later, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' }),
        'PT4H30M'
      )
    })
    it('rounds to an increment of seconds', () => {
      assert.equal(
        timeFns.until(earlier, later, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' }),
        'PT4H17M'
      )
    })
    it('rounds to an increment of milliseconds', () => {
      assert.equal(
        timeFns.until(earlier, later, {
          smallestUnit: 'milliseconds',
          roundingIncrement: 10,
          roundingMode: 'halfExpand'
        }),
        'PT4H17M4.86S'
      )
    })
    it('valid hour increments divide into 24', () => {
      ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hours', roundingIncrement }
        //@ts-expect-error
        assert(durationFns.isValid(timeFns.until(earlier, later, options)))
      })
    })
    ;['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement }
          //@ts-expect-error
          assert(durationFns.isValid(timeFns.until(earlier, later, options)))
        })
      })
    })
    ;['milliseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement }
          //@ts-expect-error
          assert(durationFns.isValid(timeFns.until(earlier, later, options)))
        })
      })
    })
    it('throws on increments that do not divide evenly into the next highest', () => {
      assert.throws(() => timeFns.until(earlier, later, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError)
      assert.throws(() => timeFns.until(earlier, later, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError)
      assert.throws(() => timeFns.until(earlier, later, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError)
      assert.throws(() => timeFns.until(earlier, later, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError)
    })
    it('throws on increments that are equal to the next highest', () => {
      assert.throws(() => timeFns.until(earlier, later, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError)
      assert.throws(() => timeFns.until(earlier, later, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError)
      assert.throws(() => timeFns.until(earlier, later, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError)
      assert.throws(
        () => timeFns.until(earlier, later, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
        RangeError
      )
    })
    it('accepts singular units', () => {
      assert.equal(
        timeFns.until(earlier, later, { largestUnit: 'hour' }),
        timeFns.until(earlier, later, { largestUnit: 'hours' })
      )
      assert.equal(
        timeFns.until(earlier, later, { smallestUnit: 'hour' }),
        timeFns.until(earlier, later, { smallestUnit: 'hours' })
      )
      assert.equal(
        timeFns.until(earlier, later, { largestUnit: 'minute' }),
        timeFns.until(earlier, later, { largestUnit: 'minutes' })
      )
      assert.equal(
        timeFns.until(earlier, later, { smallestUnit: 'minute' }),
        timeFns.until(earlier, later, { smallestUnit: 'minutes' })
      )
      assert.equal(
        timeFns.until(earlier, later, { largestUnit: 'second' }),
        timeFns.until(earlier, later, { largestUnit: 'seconds' })
      )
      assert.equal(
        timeFns.until(earlier, later, { smallestUnit: 'second' }),
        timeFns.until(earlier, later, { smallestUnit: 'seconds' })
      )
      assert.equal(
        timeFns.until(earlier, later, { largestUnit: 'millisecond' }),
        timeFns.until(earlier, later, { largestUnit: 'milliseconds' })
      )
      assert.equal(
        timeFns.until(earlier, later, { smallestUnit: 'millisecond' }),
        timeFns.until(earlier, later, { smallestUnit: 'milliseconds' })
      )
    })
  })
  describe('time.since() works', () => {
    const time = timeFns.fromNumbers(15, 23, 30, 123)
    const one = timeFns.fromNumbers(14, 23, 30, 123)
    // it(`(${time}).since(${one}) => PT1H`, () => {
    //   const duration = timeFns.since(time, one)
    //   assert.equal(duration, 'PT1H')
    // })
    const two = timeFns.fromNumbers(13, 30, 30, 123)
    // it(`(${time}).since(${two}) => PT1H53M`, () => {
    //   const duration = timeFns.since(time, two)
    //   assert.equal(duration, 'PT1H53M')
    // })
    // it(`(${two}).since(${time}) => -PT1H53M`, () => assert.equal(timeFns.since(two, time), '-PT1H53M'))
    // it(`(${two}).since(${time}) === (${time}).until(${two})`, () =>
    //   assert.equal(timeFns.since(two, time), timeFns.until(time, two)))
    it('object must contain at least one correctly-spelled property', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.since(time, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => timeFns.since(time, { minutes: 30 }), TypeError)
    })
    const time1 = timeFns.from('10:23:15')
    const time2 = timeFns.from('17:15:57')
    // it('the default largest unit is at least hours', () => {
    //   assert.equal(timeFns.since(time2, time1), 'PT6H52M42S')
    //   assert.equal(timeFns.since(time2, time1, { largestUnit: 'auto' }), 'PT6H52M42S')
    //   assert.equal(timeFns.since(time2, time1, { largestUnit: 'hours' }), 'PT6H52M42S')
    // })
    it('higher units are not allowed', () => {
      assert.throws(() => timeFns.since(time2, time1, { largestUnit: 'days' }), RangeError)
      assert.throws(() => timeFns.since(time2, time1, { largestUnit: 'weeks' }), RangeError)
      assert.throws(() => timeFns.since(time2, time1, { largestUnit: 'months' }), RangeError)
      assert.throws(() => timeFns.since(time2, time1, { largestUnit: 'years' }), RangeError)
    })
    // it('can return lower units', () => {
    //   assert.equal(timeFns.since(time2, time1, { largestUnit: 'minutes' }), 'PT412M42S')
    //   assert.equal(timeFns.since(time2, time1, { largestUnit: 'seconds' }), 'PT24762S')
    // })
    // it('can return subseconds', () => {
    //   const time3 = timeFns.add(time2, { milliseconds: 250 })
    //   const msDiff = timeFns.since(time3, time1, { largestUnit: 'milliseconds' })
    //   assert.equal(durationFns.getSeconds(msDiff), 0)
    //   assert.equal(durationFns.getMilliseconds(msDiff), 24762250)
    // })
    it('options may only be an object or undefined', () => {
      ;[null, 1, 'hello', true, Symbol('foo')].forEach((badOptions) =>
        //@ts-expect-error
        assert.throws(() => timeFns.since(time, one, badOptions), TypeError)
      )
      // ;[{}, () => {}, undefined].forEach((options) => assert.equal(timeFns.since(time, one, options), 'PT1H'))
    })
    const earlier = timeFns.from('08:22:36.123')
    const later = timeFns.from('12:39:40.987654321')
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'years', 'months', 'weeks', 'days', 'year', 'month', 'week', 'day', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => timeFns.since(later, earlier, { smallestUnit }), RangeError)
      })
    })
    it('throws if smallestUnit is larger than largestUnit', () => {
      const units = ['hours', 'minutes', 'seconds', 'milliseconds']
      for (let largestIdx = 1; largestIdx < units.length; largestIdx++) {
        for (let smallestIdx = 0; smallestIdx < largestIdx; smallestIdx++) {
          const largestUnit = units[largestIdx]
          const smallestUnit = units[smallestIdx]
          //@ts-expect-error
          assert.throws(() => timeFns.since(later, earlier, { largestUnit, smallestUnit }), RangeError)
        }
      }
    })
    it('throws on invalid roundingMode', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.since(later, earlier, { roundingMode: 'cile' }), RangeError)
    })
    const incrementOneNearest: [TemporalPluralUnit, string][] = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'halfExpand'
      // it(`rounds to nearest ${smallestUnit, () => {
      //   assert.equal(timeFns.since(later, earlier, { smallestUnit, roundingMode }), expected)
      //   assert.equal(timeFns.since(earlier, later, { smallestUnit, roundingMode }), `-${expected)
      // })
    })
    const incrementOneCeil: [TemporalPluralUnit, string, string][] = [
      ['hours', 'PT5H', '-PT4H'],
      ['minutes', 'PT4H18M', '-PT4H17M'],
      ['seconds', 'PT4H17M5S', '-PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.865S', '-PT4H17M4.864S']
    ]
    incrementOneCeil.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'ceil'
      // it(`rounds up to ${smallestUnit, () => {
      //   assert.equal(timeFns.since(later, earlier, { smallestUnit, roundingMode }), expectedPositive)
      //   assert.equal(timeFns.since(earlier, later, { smallestUnit, roundingMode }), expectedNegative)
      // })
    })
    const incrementOneFloor: [TemporalPluralUnit, string, string][] = [
      ['hours', 'PT4H', '-PT5H'],
      ['minutes', 'PT4H17M', '-PT4H18M'],
      ['seconds', 'PT4H17M4S', '-PT4H17M5S'],
      ['milliseconds', 'PT4H17M4.864S', '-PT4H17M4.865S']
    ]
    incrementOneFloor.forEach(([smallestUnit, expectedPositive, expectedNegative]) => {
      const roundingMode = 'floor'
      // it(`rounds down to ${smallestUnit, () => {
      //   assert.equal(timeFns.since(later, earlier, { smallestUnit, roundingMode }), expectedPositive)
      //   assert.equal(timeFns.since(earlier, later, { smallestUnit, roundingMode }), expectedNegative)
      // })
    })
    const incrementOneTrunc: [TemporalPluralUnit, string][] = [
      ['hours', 'PT4H'],
      ['minutes', 'PT4H17M'],
      ['seconds', 'PT4H17M4S'],
      ['milliseconds', 'PT4H17M4.864S']
    ]
    incrementOneTrunc.forEach(([smallestUnit, expected]) => {
      const roundingMode = 'trunc'
      // it(`truncates to ${smallestUnit, () => {
      //   assert.equal(timeFns.since(later, earlier, { smallestUnit, roundingMode }), expected)
      //   assert.equal(timeFns.since(earlier, later, { smallestUnit, roundingMode }), `-${expected)
      // })
    })
    // it('trunc is the default', () => {
    //   assert.equal(timeFns.since(later, earlier, { smallestUnit: 'minutes' }), 'PT4H17M')
    //   assert.equal(timeFns.since(later, earlier, { smallestUnit: 'seconds' }), 'PT4H17M4S')
    // })
    // it('rounds to an increment of hours', () => {
    //   assert.equal(
    //     timeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 3, roundingMode: 'halfExpand' }),
    //     'PT3H'
    //   )
    // })
    // it('rounds to an increment of minutes', () => {
    //   assert.equal(
    //     timeFns.since(later, earlier, { smallestUnit: 'minutes', roundingIncrement: 30, roundingMode: 'halfExpand' }),
    //     'PT4H30M'
    //   )
    // })
    // it('rounds to an increment of seconds', () => {
    //   assert.equal(
    //     timeFns.since(later, earlier, { smallestUnit: 'seconds', roundingIncrement: 15, roundingMode: 'halfExpand' }),
    //     'PT4H17M'
    //   )
    // })
    // it('rounds to an increment of milliseconds', () => {
    //   assert.equal(
    //     timeFns.since(later, earlier, {
    //       smallestUnit: 'milliseconds',
    //       roundingIncrement: 10,
    //       roundingMode: 'halfExpand'
    //     }),
    //     'PT4H17M4.86S'
    //   )
    // })
    it('valid hour increments divide into 24', () => {
      ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        const options = { smallestUnit: 'hours', roundingIncrement }
        //@ts-expect-error
        assert(durationFns.isValid(timeFns.since(later, earlier, options)))
      })
    })
    ;['minutes', 'seconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement }
          //@ts-expect-error
          assert(durationFns.isValid(timeFns.since(later, earlier, options)))
        })
      })
    })
    ;['milliseconds'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          const options = { smallestUnit, roundingIncrement }
          //@ts-expect-error
          assert(durationFns.isValid(timeFns.since(later, earlier, options)))
        })
      })
    })
    it('throws on increments that do not divide evenly into the next highest', () => {
      assert.throws(() => timeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 11 }), RangeError)
      assert.throws(() => timeFns.since(later, earlier, { smallestUnit: 'minutes', roundingIncrement: 29 }), RangeError)
      assert.throws(() => timeFns.since(later, earlier, { smallestUnit: 'seconds', roundingIncrement: 29 }), RangeError)
      assert.throws(() => timeFns.since(later, earlier, { smallestUnit: 'milliseconds', roundingIncrement: 29 }), RangeError)
    })
    it('throws on increments that are equal to the next highest', () => {
      assert.throws(() => timeFns.since(later, earlier, { smallestUnit: 'hours', roundingIncrement: 24 }), RangeError)
      assert.throws(() => timeFns.since(later, earlier, { smallestUnit: 'minutes', roundingIncrement: 60 }), RangeError)
      assert.throws(() => timeFns.since(later, earlier, { smallestUnit: 'seconds', roundingIncrement: 60 }), RangeError)
      assert.throws(
        () => timeFns.since(later, earlier, { smallestUnit: 'milliseconds', roundingIncrement: 1000 }),
        RangeError
      )
    })
    // it('accepts singular units', () => {
    //   assert.equal(
    //     timeFns.since(later, earlier, { largestUnit: 'hour' }),
    //     timeFns.since(later, earlier, { largestUnit: 'hours' })
    //   )
    //   assert.equal(
    //     timeFns.since(later, earlier, { smallestUnit: 'hour' }),
    //     timeFns.since(later, earlier, { smallestUnit: 'hours' })
    //   )
    //   assert.equal(
    //     timeFns.since(later, earlier, { largestUnit: 'minute' }),
    //     timeFns.since(later, earlier, { largestUnit: 'minutes' })
    //   )
    //   assert.equal(
    //     timeFns.since(later, earlier, { smallestUnit: 'minute' }),
    //     timeFns.since(later, earlier, { smallestUnit: 'minutes' })
    //   )
    //   assert.equal(
    //     timeFns.since(later, earlier, { largestUnit: 'second' }),
    //     timeFns.since(later, earlier, { largestUnit: 'seconds' })
    //   )
    //   assert.equal(
    //     timeFns.since(later, earlier, { smallestUnit: 'second' }),
    //     timeFns.since(later, earlier, { smallestUnit: 'seconds' })
    //   )
    //   assert.equal(
    //     timeFns.since(later, earlier, { largestUnit: 'millisecond' }),
    //     timeFns.since(later, earlier, { largestUnit: 'milliseconds' })
    //   )
    //   assert.equal(
    //     timeFns.since(later, earlier, { smallestUnit: 'millisecond' }),
    //     timeFns.since(later, earlier, { smallestUnit: 'milliseconds' })
    //   )
    // })
  })
  describe('Time.round works', () => {
    const time = timeFns.from('13:46:23.123')
    it('throws without parameter', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.round(time), TypeError)
    })
    it('throws without required smallestUnit parameter', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.round(time, {}), RangeError)
      //@ts-expect-error
      assert.throws(() => timeFns.round(time, { roundingIncrement: 1, roundingMode: 'ceil' }), RangeError)
    })
    it('throws on disallowed or invalid smallestUnit', () => {
      ;['era', 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days', 'nonsense'].forEach((smallestUnit) => {
        //@ts-expect-error
        assert.throws(() => timeFns.round(time, { smallestUnit }), RangeError)
      })
    })
    it('throws on invalid roundingMode', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.round(time, { smallestUnit: 'second', roundingMode: 'cile' }), RangeError)
    })
    const incrementOneNearest: ['hour' | 'minute' | 'second' | 'millisecond', string][] = [
      ['hour', '14:00'],
      ['minute', '13:46'],
      ['second', '13:46:23'],
      ['millisecond', '13:46:23.123']
    ]
    incrementOneNearest.forEach(([smallestUnit, expected]) => {
      it(`rounds to nearest ${smallestUnit}`, () =>
        assert.equal(timeFns.round(time, { smallestUnit, roundingMode: 'halfExpand' }), expected))
    })
    const incrementOneCeil: ['hour' | 'minute' | 'second' | 'millisecond', string][] = [
      ['hour', '14:00'],
      ['minute', '13:47'],
      ['second', '13:46:24'],
      ['millisecond', '13:46:23.123']
    ]
    incrementOneCeil.forEach(([smallestUnit, expected]) => {
      it(`rounds up to ${smallestUnit}`, () =>
        assert.equal(timeFns.round(time, { smallestUnit, roundingMode: 'ceil' }), expected))
    })
    const incrementOneFloor: ['hour' | 'minute' | 'second' | 'millisecond', string][] = [
      ['hour', '13:00'],
      ['minute', '13:46'],
      ['second', '13:46:23'],
      ['millisecond', '13:46:23.123']
    ]
    incrementOneFloor.forEach(([smallestUnit, expected]) => {
      it(`rounds down to ${smallestUnit}`, () =>
        assert.equal(timeFns.round(time, { smallestUnit, roundingMode: 'floor' }), expected))
      it(`truncates to ${smallestUnit}`, () =>
        assert.equal(timeFns.round(time, { smallestUnit, roundingMode: 'trunc' }), expected))
    })
    it('halfExpand is the default', () => {
      assert.equal(timeFns.round(time, { smallestUnit: 'hour' }), '14:00')
      assert.equal(timeFns.round(time, { smallestUnit: 'minute' }), '13:46')
    })
    it('rounds to an increment of hours', () => {
      assert.equal(timeFns.round(time, { smallestUnit: 'hour', roundingIncrement: 3 }), '15:00')
    })
    it('rounds to an increment of minutes', () => {
      assert.equal(timeFns.round(time, { smallestUnit: 'minute', roundingIncrement: 15 }), '13:45')
    })
    it('rounds to an increment of seconds', () => {
      assert.equal(timeFns.round(time, { smallestUnit: 'second', roundingIncrement: 30 }), '13:46:30')
    })
    it('rounds to an increment of milliseconds', () => {
      assert.equal(timeFns.round(time, { smallestUnit: 'millisecond', roundingIncrement: 10 }), '13:46:23.12')
    })
    it('valid hour increments divide into 24', () => {
      const smallestUnit = 'hour'
      ;[1, 2, 3, 4, 6, 8, 12].forEach((roundingIncrement) => {
        assert(timeFns.isValid(timeFns.round(time, { smallestUnit, roundingIncrement })))
      })
    })
    ;['minute', 'second'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 60`, () => {
        ;[1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30].forEach((roundingIncrement) => {
          //@ts-expect-error
          assert(timeFns.isValid(timeFns.round(time, { smallestUnit, roundingIncrement })))
        })
      })
    })
    ;['millisecond'].forEach((smallestUnit) => {
      it(`valid ${smallestUnit} increments divide into 1000`, () => {
        ;[1, 2, 4, 5, 8, 10, 20, 25, 40, 50, 100, 125, 200, 250, 500].forEach((roundingIncrement) => {
          //@ts-expect-error
          assert(timeFns.isValid(timeFns.round(time, { smallestUnit, roundingIncrement })))
        })
      })
    })
    it('throws on increments that do not divide evenly into the next highest', () => {
      assert.throws(() => timeFns.round(time, { smallestUnit: 'hour', roundingIncrement: 29 }), RangeError)
      assert.throws(() => timeFns.round(time, { smallestUnit: 'minute', roundingIncrement: 29 }), RangeError)
      assert.throws(() => timeFns.round(time, { smallestUnit: 'second', roundingIncrement: 29 }), RangeError)
      assert.throws(() => timeFns.round(time, { smallestUnit: 'millisecond', roundingIncrement: 29 }), RangeError)
    })
    it('throws on increments that are equal to the next highest', () => {
      assert.throws(() => timeFns.round(time, { smallestUnit: 'hour', roundingIncrement: 24 }), RangeError)
      assert.throws(() => timeFns.round(time, { smallestUnit: 'minute', roundingIncrement: 60 }), RangeError)
      assert.throws(() => timeFns.round(time, { smallestUnit: 'second', roundingIncrement: 60 }), RangeError)
      assert.throws(() => timeFns.round(time, { smallestUnit: 'millisecond', roundingIncrement: 1000 }), RangeError)
    })
    const bal = timeFns.from('23:59:59.999')
    const units: ('hour' | 'minute' | 'second' | 'millisecond' | 'day')[] = [
      'hour',
      'minute',
      'second'
      // 'millisecond'
    ]
    units.forEach((smallestUnit) => {
      it(`balances to next ${smallestUnit}`, () => {
        assert.equal(timeFns.round(bal, { smallestUnit }), '00:00')
      })
    })
    it('accepts plural units', () => {
      assert(timeFns.equals(timeFns.round(time, { smallestUnit: 'hour' }), timeFns.round(time, { smallestUnit: 'hour' })))
      assert(
        timeFns.equals(timeFns.round(time, { smallestUnit: 'minute' }), timeFns.round(time, { smallestUnit: 'minute' }))
      )
      assert(
        timeFns.equals(timeFns.round(time, { smallestUnit: 'second' }), timeFns.round(time, { smallestUnit: 'second' }))
      )
      assert(
        timeFns.equals(
          timeFns.round(time, { smallestUnit: 'millisecond' }),
          timeFns.round(time, { smallestUnit: 'millisecond' })
        )
      )
    })
  })
  describe('Time.compare() works', () => {
    const t1 = timeFns.from('08:44:15.321')
    const t2 = timeFns.from('14:23:30.123')
    it('equal', () => assert.equal(timeFns.compare(t1, t1), 0))
    it('smaller/larger', () => assert.equal(timeFns.compare(t1, t2), -1))
    it('larger/smaller', () => assert.equal(timeFns.compare(t2, t1), 1))
    it('object must contain at least one correctly-spelled property', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.compare({ hours: 16 }, t2), TypeError)
      //@ts-expect-error
      assert.throws(() => timeFns.compare(t1, { hours: 16 }), TypeError)
    })
  })
  describe('time.equals() works', () => {
    const t1 = timeFns.from('08:44:15.321')
    const t2 = timeFns.from('14:23:30.123')
    it('equal', () => assert(timeFns.equals(t1, t1)))
    it('unequal', () => assert(!timeFns.equals(t1, t2)))
    it('object must contain at least one correctly-spelled property', () => {
      //@ts-expect-error
      assert.throws(() => timeFns.equals(t1, { hours: 8 }), TypeError)
    })
  })
  describe('timeFns.add(time, ) works', () => {
    const time = timeFns.fromNumbers(15, 23, 30, 123)
    it(`(${time}).add({ hours: 16 })`, () => {
      assert.equal(timeFns.add(time, { hours: 16 }), '07:23:30.123')
    })
    it(`(${time}).add({ minutes: 45 })`, () => {
      assert.equal(timeFns.add(time, { minutes: 45 }), '16:08:30.123')
    })
    it('symmetric with regard to negative durations', () => {
      assert.equal(timeFns.add(timeFns.from('07:23:30.123'), { hours: -16 }), '15:23:30.123')
      assert.equal(timeFns.add(timeFns.from('16:08:30.123'), { minutes: -45 }), '15:23:30.123')
    })
    it('timeFns.add(time, durationObj)', () => {
      assert.equal(timeFns.add(time, durationFns.from('PT16H')), '07:23:30.123')
    })
    it('casts argument', () => assert.equal(timeFns.add(time, 'PT16H'), '07:23:30.123'))
    it('ignores higher units', () => {
      assert.equal(timeFns.add(time, { days: 1 }), '15:23:30.123')
      assert.equal(timeFns.add(time, { months: 1 }), '15:23:30.123')
      assert.equal(timeFns.add(time, { years: 1 }), '15:23:30.123')
    })
    it('mixed positive and negative values always throw', () => {
      const overflows: TemporalOverflow[] = ['constrain', 'reject']
      overflows.forEach((overflow) =>
        assert.throws(() => timeFns.add(time, { hours: 1, minutes: -30 }, { overflow }), RangeError)
      )
    })
    it('options is ignored', () => {
      const options = [1, 'hello', true, Symbol('foo'), {}, () => {}, undefined]
      options.forEach((options) => assert.equal(timeFns.add(time, { hours: 1 }, options), '16:23:30.123'))
      const overflows = ['', 'CONSTRAIN', 'balance', 3]
      //@ts-expect-error
      overflows.forEach((overflow) => assert.equal(timeFns.add(time, { hours: 1 }, { overflow }), '16:23:30.123'))
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => timeFns.add(time, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => timeFns.add(time, { minute: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(timeFns.add(time, { minute: 1, hours: 1 }), '16:23:30.123')
    })
  })
  describe('timeFns.subtract() works', () => {
    const time = timeFns.from('15:23:30.123')
    it(`(${time}).subtract({ hours: 16 })`, () => assert.equal(timeFns.subtract(time, { hours: 16 }), '23:23:30.123'))
    it(`(${time}).subtract({ minutes: 45 })`, () => assert.equal(timeFns.subtract(time, { minutes: 45 }), '14:38:30.123'))
    it(`(${time}).subtract({ seconds: 45 })`, () => assert.equal(timeFns.subtract(time, { seconds: 45 }), '15:22:45.123'))
    it(`(${time}).subtract({ milliseconds: 200 })`, () =>
      assert.equal(timeFns.subtract(time, { milliseconds: 800 }), '15:23:29.323'))
    it('symmetric with regard to negative durations', () => {
      assert.equal(timeFns.subtract(timeFns.from('23:23:30.123'), { hours: -16 }), '15:23:30.123')
      assert.equal(timeFns.subtract(timeFns.from('14:38:30.123'), { minutes: -45 }), '15:23:30.123')
      assert.equal(timeFns.subtract(timeFns.from('15:22:45.123'), { seconds: -45 }), '15:23:30.123')
      assert.equal(timeFns.subtract(timeFns.from('15:23:29.323'), { milliseconds: -800 }), '15:23:30.123')
    })
    it('timeFns.subtract(time, durationObj)', () => {
      assert.equal(timeFns.subtract(time, durationFns.from('PT16H')), '23:23:30.123')
    })
    it('casts argument', () => assert.equal(timeFns.subtract(time, 'PT16H'), '23:23:30.123'))
    it('ignores higher units', () => {
      assert.equal(timeFns.subtract(time, { days: 1 }), '15:23:30.123')
      assert.equal(timeFns.subtract(time, { months: 1 }), '15:23:30.123')
      assert.equal(timeFns.subtract(time, { years: 1 }), '15:23:30.123')
    })
    it('mixed positive and negative values always throw', () => {
      ;['constrain', 'reject'].forEach((overflow) =>
        //@ts-expect-error
        assert.throws(() => timeFns.subtract(time, { hours: 1, minutes: -30 }, { overflow }), RangeError)
      )
    })
    it('options is ignored', () => {
      ;[null, 1, 'hello', true, Symbol('foo'), {}, () => {}, undefined].forEach((options) =>
        //@ts-expect-error
        assert.equal(timeFns.subtract(time, { hours: 1 }, options), '14:23:30.123')
      )
      ;['', 'CONSTRAIN', 'balance', 3, null].forEach((overflow) =>
        //@ts-expect-error
        assert.equal(timeFns.subtract(time, { hours: 1 }, { overflow }), '14:23:30.123')
      )
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => timeFns.subtract(time, {}), TypeError)
      //@ts-expect-error
      assert.throws(() => timeFns.subtract(time, { minute: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      //@ts-expect-error
      assert.equal(timeFns.subtract(time, { minute: 1, hours: 1 }), '14:23:30.123')
    })
  })
  describe('Time.from() works', () => {
    it('Time.from("15:23")', () => {
      assert.equal(timeFns.from('15:23'), '15:23')
    })
    it('Time.from("15:23:30")', () => {
      assert.equal(timeFns.from('15:23:30'), '15:23:30')
    })
    it('Time.from("15:23:30.123")', () => {
      assert.equal(timeFns.from('15:23:30.123'), '15:23:30.123')
    })
    it('Time.from({ hour: 15, minute: 23 })', () => assert.equal(timeFns.from({ hour: 15, minute: 23 }), '15:23'))
    it('Time.from(ISO string leap second) is constrained', () => {
      assert.equal(timeFns.from('23:59:60'), '23:59:59')
      assert.equal(timeFns.from('23:59:60', { overflow: 'reject' }), '23:59:59')
    })
    it('Time.from(number) is converted to string', () => assert.equal(timeFns.from(1523), timeFns.from('1523')))
    it('Time.from(time) returns the same properties', () => {
      const t = timeFns.from('2020-02-12T11:42:00+01:00[Europe/Amsterdam]')
      assert.equal(timeFns.from(t), t)
    })
    it('Time.from(dateTime) returns the same time properties', () => {
      const dt = dateTimeFns.from('2020-02-12T11:42:00+01:00[Europe/Amsterdam]')
      assert.equal(timeFns.from(dt), dateTimeFns.toTime(dt))
    })
    it('any number of decimal places', () => {
      assert.equal(timeFns.from('1976-11-18T15:23:30.1Z'), '15:23:30.1')
      assert.equal(timeFns.from('1976-11-18T15:23:30.12Z'), '15:23:30.12')
      assert.equal(timeFns.from('1976-11-18T15:23:30.123Z'), '15:23:30.123')
    })
    it('variant decimal separator', () => {
      assert.equal(timeFns.from('1976-11-18T15:23:30,12Z'), '15:23:30.12')
    })
    it('variant minus sign', () => {
      assert.equal(timeFns.from('1976-11-18T15:23:30.12\u221202:00'), '15:23:30.12')
    })
    it('basic format', () => {
      assert.equal(timeFns.from('152330'), '15:23:30')
      assert.equal(timeFns.from('152330.1'), '15:23:30.1')
      assert.equal(timeFns.from('152330-08'), '15:23:30')
      assert.equal(timeFns.from('152330.1-08'), '15:23:30.1')
      assert.equal(timeFns.from('152330-0800'), '15:23:30')
      assert.equal(timeFns.from('152330.1-0800'), '15:23:30.1')
    })
    it('mixture of basic and extended format', () => {
      assert.equal(timeFns.from('1976-11-18T152330.1+00:00'), '15:23:30.1')
      assert.equal(timeFns.from('19761118T15:23:30.1+00:00'), '15:23:30.1')
      assert.equal(timeFns.from('1976-11-18T15:23:30.1+0000'), '15:23:30.1')
      assert.equal(timeFns.from('1976-11-18T152330.1+0000'), '15:23:30.1')
      assert.equal(timeFns.from('19761118T15:23:30.1+0000'), '15:23:30.1')
      assert.equal(timeFns.from('19761118T152330.1+00:00'), '15:23:30.1')
      assert.equal(timeFns.from('19761118T152330.1+0000'), '15:23:30.1')
      assert.equal(timeFns.from('+001976-11-18T152330.1+00:00'), '15:23:30.1')
      assert.equal(timeFns.from('+0019761118T15:23:30.1+00:00'), '15:23:30.1')
      assert.equal(timeFns.from('+001976-11-18T15:23:30.1+0000'), '15:23:30.1')
      assert.equal(timeFns.from('+001976-11-18T152330.1+0000'), '15:23:30.1')
      assert.equal(timeFns.from('+0019761118T15:23:30.1+0000'), '15:23:30.1')
      assert.equal(timeFns.from('+0019761118T152330.1+00:00'), '15:23:30.1')
      assert.equal(timeFns.from('+0019761118T152330.1+0000'), '15:23:30.1')
    })
    it('optional parts', () => {
      assert.equal(timeFns.from('15'), '15:00')
    })
    it('no junk at end of string', () => assert.throws(() => timeFns.from('15:23:30.100junk'), RangeError))
    it('options may only be an object or undefined', () => {
      const badOptions = [null, 1, 'hello', true, Symbol('foo')]
      //@ts-expect-error
      badOptions.forEach((badOption) => assert.throws(() => timeFns.from({ hour: 12 }, badOption), TypeError))
      //@ts-expect-error
      ;[{}, () => {}, undefined].forEach((options) => assert.equal(timeFns.from({ hour: 12 }, options), '12:00'))
    })
    describe('Overflow', () => {
      const bad = { milliseconds: 999 }
      it('reject', () => assert.throws(() => timeFns.from(bad, { overflow: 'reject' }), TypeError))
      it('throw on bad overflow', () => {
        ;[timeFns.fromNumbers(15), { hour: 15 }, '15:00'].forEach((input) => {
          const overflows = ['', 'CONSTRAIN', 'balance', 3, null]
          //@ts-expect-error
          overflows.forEach((overflow) => assert.throws(() => timeFns.from(input, { overflow }), RangeError))
        })
      })
      const leap = { hour: 23, minute: 59, second: 60 }
      it('reject leap second', () => assert.throws(() => timeFns.from(leap, { overflow: 'reject' }), RangeError))
      it('constrain leap second', () => assert.equal(timeFns.from(leap), '23:59:59'))
      it('constrain has no effect on invalid ISO string', () => {
        assert.throws(() => timeFns.from('24:60', { overflow: 'constrain' }), RangeError)
      })
    })
    it('object must contain at least one correctly-spelled property', () => {
      assert.throws(() => timeFns.from({}), TypeError)
      assert.throws(() => timeFns.from({ minutes: 12 }), TypeError)
    })
    it('incorrectly-spelled properties are ignored', () => {
      assert.equal(timeFns.from({ minutes: 1, hour: 1 }), '01:00')
    })
  })
  describe('time operations', () => {
    const iso = '20:18:32'
    it(`Temporal.timeFns.from("${iso}") === (${iso})`, () => assert.equal(timeFns.from(iso), iso))
  })
  describe('time.getISOFields() works', () => {
    const t1 = timeFns.from('15:23:30.123')
    const fields = timeFns.getFields(t1)
    it('fields', () => {
      assert.equal(fields.hour, 15)
      assert.equal(fields.minute, 23)
      assert.equal(fields.second, 30)
      assert.equal(fields.millisecond, 123)
    })
    it('enumerable', () => {
      const fields2 = { ...fields }
      assert.equal(fields2.hour, 15)
      assert.equal(fields2.minute, 23)
      assert.equal(fields2.second, 30)
      assert.equal(fields2.millisecond, 123)
    })
    it('as input to constructor', () => {
      const t2 = timeFns.fromNumbers(fields.hour, fields.minute, fields.second, fields.millisecond)
      assert(timeFns.equals(t1, t2))
    })
  })
})
